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
        var obj = JSON.parse(line);
        if (obj.id) {
            this.push(obj)
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