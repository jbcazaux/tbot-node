var request = require('./requester');
var ToMongo = require('./toMongo');

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var toMongo = ToMongo(options);

function getFollowers(twitterId, cursor, cb) {

    var req = request('GET', 'https://api.twitter.com/1.1/followers/ids.json?cursor=' + cursor + '&user_id=' + twitterId + '&count=5000');

    var chunks = '';
    req.on('data', function (chunk) {
        chunks += chunk.toString('utf8');
    });
    req.on('end', function (chunk) {
        cb(chunks);
    });
}

function getAllFollowers(id, cb) {
    var ids = [];
    getFollowers(id, -1, function lambda(data) {
        var obj = JSON.parse(data);
        ids = ids.concat(obj.ids);
        if (obj.next_cursor > 0) {
            getFollowers(id, obj.next_cursor, lambda);
        } else {
            cb(ids);
        }
    });
}

getAllFollowers(95687779, function (data) {
    console.log(data.length);
});