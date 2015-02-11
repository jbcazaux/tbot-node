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
        expect(tweets[0]).to.deep.equal({"id": 123456});
    });

    it("should not create tweet object from limit warning", function () {
        toTweet._transform('{"limit": {"track" : 65}}', '', function () {
        });

        expect(tweets).to.be.empty();
    });
});
