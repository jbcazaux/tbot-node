var request = require('./requester');
var ToMongo = require('./toMongo');
var ToObject = require('./toObject');
var Q = require('q');
var TimeRunner = require('./timeRunner');

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var toMongo = ToMongo(options);
var timeRunner = TimeRunner(15, 15 * 60 * 1000);

function getFollowersRequest(twitterId, cursor) {
    console.log('will request with cursor ', cursor, 'and id', twitterId);
    return request('GET', 'https://api.twitter.com/1.1/followers/ids.json?cursor=' + cursor + '&user_id=' + twitterId + '&count=5000');
}

function getFollowers(followedId, cursor, cb) {

    return function () {
        var ids = [];
        var data;
        var s = getFollowersRequest(followedId, cursor).pipe(ToObject());
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
                ids.length = 0;
                s = null;
                if (data.next_cursor > 0) {
                    timeRunner.run(getFollowers(followedId, data.next_cursor, cb));
                } else {
                    cb();
                }
            });
        });
    }
}

var followersOf = 490126636;
timeRunner.run(getFollowers(followersOf, -1, function () {
    console.log('done getting followings of', followersOf);
}));

//module.exports = getFollowers;