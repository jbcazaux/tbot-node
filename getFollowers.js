var request = require('./requester');
var ToMongo = require('./toMongo');
var ToCursoredList = require('./toCursoredList');
var Q = require('q');
var TimeRunner = require('./timeRunner');


var options = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var toMongo = ToMongo(options);
var timeRunner = TimeRunner(15, 15 * 60 * 1000);

function getFollowersRequest(twitterId, cursor) {
    console.log('will request with cursor ', cursor, 'and id', twitterId);
    return request('GET', 'https://api.twitter.com/1.1/followers/ids.json?cursor=' + cursor + '&user_id=' + twitterId + '&count=5000');
}

var ids = [];

function getFollowers(followedId, cursor, cb) {
    return function () {
        var data;
        var s = getFollowersRequest(followedId, cursor).pipe(ToCursoredList());

        s.on('data', function (chunk) {
            data = chunk;
            ids = ids.concat(data.ids);
        });
        s.on('end', function () {
            var promises = [];
            data.ids.forEach(function (followerId) {
                promises.push(toMongo.addFollowed(followerId, followedId));
            });
            Q.allSettled(promises).then(function () {
                if (data.next_cursor > 0) {
                    timeRunner.run(getFollowers(followedId, data.next_cursor, cb));
                } else {
                    cb(ids);
                }
            });
        });
    }
}

timeRunner.run(getFollowers(52667847, -1, function (ids) {
    console.log('final: ', ids.length);
}));

//module.exports = getFollowers;