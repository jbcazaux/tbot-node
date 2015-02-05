var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToTweet, Transform);

function ToTweet(options) {
    if (!(this instanceof ToTweet)) {
        return new ToTweet({objectMode: true});
    }

    Transform.call(this, options);

    this.tweet = '';
}

ToTweet.prototype._transform = function (chunk, encoding, done) {
    var data = chunk.toString();
    var index = data.indexOf('\r\n');

    if (index < 0) {
        this.tweet += data;
    } else {
        var tweetEnd = data.slice(0, index);
        this.tweet += tweetEnd;
        try {
            var obj = JSON.parse(this.tweet);
            this.push(obj);
        } catch (er) {
            console.log('cannot parse ', this.tweet);
        }

        this.tweet = data.slice(index + 1);
    }
    done();
};

module.exports = ToTweet;