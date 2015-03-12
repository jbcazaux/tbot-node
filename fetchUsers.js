var request = require('./requester');
var ToMongo = require('./toMongo');
var options = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var optionsTo = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles2'};

var toMongo = ToMongo(optionsTo);
var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToRequest, Transform);

function ToRequest(options) {
    if (!(this instanceof ToRequest)) {
        return new ToRequest(options);
    }

    options = options || {objectMode: true};
    Transform.call(this, options);
    this.buf = [];
}

ToRequest.prototype._transform = function (chunk, encoding, done) {

    this.buf.push(chunk._id);
    var self = this;

    if (this.buf.length < 10) {
        done();
    }
    else {
        this._fetch(this.buf, function (data) {
            console.log('transform - fetch ok')
            var arr = JSON.parse(data);
            console.log('Push ', arr.length);
            for (var i in arr) {
                self.push(arr[i]);
            }
            self.buf.length = 0;

            done();
        });
    }
};

ToRequest.prototype._flush = function (done) {
    console.log('flush', this.buf.length);
    var self = this;
    this._fetch(this.buf, function (data) {
        console.log('flush - fetch ok');
        var arr = JSON.parse(data);
        console.log('Push ', arr.length);
        for (var i in arr) {
            self.push(arr[i]);
        }
        self.buf.length = 0;
        done();
    });
};

module.exports = ToRequest;


var tr = ToRequest();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(options.db, function (err, db) {

    var collection = db.collection(options.collection);
    var stream = collection.find().limit(31).stream();
    stream.pipe(tr).pipe(toMongo);

});


ToRequest.prototype._fetch = function (ids, cb) {
    console.log("will fetch ", ids.length, "profiles");
    var req = request('GET', 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + ids.join(','));

    var chunks = '';
    req.on('data', function (chunk) {
        chunks += chunk.toString('utf8');
    });
    req.on('end', function (chunk) {
        cb(chunks);
    });
};
