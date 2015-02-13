var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToTweet, Transform);

function ToTweet(options) {
    if (!(this instanceof ToTweet)) {
        return new ToTweet({objectMode:true});
    }

    Transform.call(this, options);

}

ToTweet.prototype._transform = function (chunk, encoding, done) {
    var line = chunk.toString();
    try {
        var tweet = JSON.parse(line);
        if (tweet.id) {
            var type = 'tweet';
            if (tweet.in_reply_to_status_id) {type = 'reply'}
            else if (tweet.retweeted_status && tweet.retweeted_status.id) {type = 'retweet'}
            tweet.type = type;
            this.push(tweet)
        }
        else {
            return done("not a tweet: " + line);
        }
    } catch (er) {
        return done(er);
    }
    done();
};

module.exports = ToTweet;