var request = require('request');
var OAuth = require('oauth-1.0a');
var zlib = require('zlib');
var ToMongo = require('./toMongo');
var ToTweet = require('./toTweet');

var oauth = OAuth({
    consumer: {
        public: '',
        secret: ''
    },
    signature_method: 'HMAC-SHA1'
});

var token = {
    public: '',
    secret: ''
};

var request_data = {
    url: 'https://stream.twitter.com/1.1/statuses/filter.json',
    method: 'POST',
    data: {
        stall_warnings: 'true',
        track: 'twitter'
    }
};

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'tweets'};
var toMongo = ToMongo(options);
var toTweet = ToTweet();


var headers = oauth.toHeader(oauth.authorize(request_data, token));
headers['Accept-Encoding'] = 'deflate, gzip';
request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: headers
})
    .pipe(zlib.createGunzip())
    .pipe(toTweet)
    .pipe(toMongo);