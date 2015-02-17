var request = require('./requester');
var ToMongo = require('./toMongo');
var ToTweet = require('./toTweet');
var ToElasticSearch = require('./toElasticSearch');
var ToLine = require('./toLine');

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'tweets'};
var toMongo = ToMongo(options);
var toTweet = ToTweet();
var toLine = ToLine();
//var toElasticSearch = ToElasticSearch({index: 'twitter'});

request('POST',
    'https://stream.twitter.com/1.1/statuses/filter.json', {
        stall_warnings: 'true',
        track: 'twitter, api'
    })
    .pipe(toLine)
    .pipe(toTweet)
    .pipe(toMongo);
//.pipe(toElasticSearch);