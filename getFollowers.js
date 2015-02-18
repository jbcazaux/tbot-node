var request = require('./requester');
var ToMongo = require('./toMongo');
var ToCursoredList = require('./toCursoredList');

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var toMongo = ToMongo(options);

function getFollowers(twitterId, cursor) {

    return request('GET', 'https://api.twitter.com/1.1/followers/ids.json?cursor=' + cursor + '&user_id=' + twitterId + '&count=1');
}

function generateStream(id, cursor, cb) {
    var data;
    var s = getFollowers(id, cursor).pipe(ToCursoredList());//.pipe(toMongo);

    s.on('data', function(chunk) {
        data = chunk;
    });
    s.on('end', function() {
        //Mongo.insert()...
        if (data.next_cursor > 0) {
            generateStream(id, data.next_cursor, cb);
        }else {
            cb(ids);
        }
    });
}

generateStream(2841080950, -1, function(ids){
    console.log('final: ', ids);
});

module.exports = generateStream;