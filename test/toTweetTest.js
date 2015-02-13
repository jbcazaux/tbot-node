var expect = require('chai').expect;
var ToTweet = require('../toTweet');

describe("ToTweet Module:", function () {
    var toTweet;
    var tweets;

    beforeEach(function () {
        tweets = new Array();
        toTweet = new ToTweet();
        toTweet.push = function(t){
            tweets.push(t);
        }
    });

    it("should create tweet object from minimal string", function () {
        toTweet._transform('{"id": 123456}', '', function () {
        });

        expect(tweets).to.have.length(1);
        expect(tweets[0].id).to.equal(123456);
    });

    it("should not create tweet object from limit warning", function () {
        toTweet._transform('{"limit": {"track" : 65}}', '', function () {
        });

        expect(tweets).to.be.empty();
    });

    it("should create add type 'tweet' to tweet object", function () {
        toTweet._transform('{"id": 123456}', '', function () {
        });

        expect(tweets).to.have.length(1);
        expect(tweets[0].type).to.equal('tweet');
    });

    it("should create add type 'retweet' to tweet object", function () {
        toTweet._transform('{"id": 123456, "retweeted_status" : {"id": 321}}', '', function () {
        });

        expect(tweets).to.have.length(1);
        expect(tweets[0].type).to.equal('retweet');
    });

    it("should create add type 'reply' to tweet object", function () {
        toTweet._transform('{"id": 123456, "in_reply_to_status_id" : 321}', '', function () {
        });

        expect(tweets).to.have.length(1);
        expect(tweets[0].type).to.equal('reply');
    });
});
