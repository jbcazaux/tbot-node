var MongoClient = require('mongodb').MongoClient;
var request = require('./requester');
var optionsMongoFrom = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles'};
var optionsMongoTo = {db: 'mongodb://localhost:27017/twitter', collection: 'profiles2'};

var toMongo = require('./toMongo')(optionsMongoTo);
var timeRunner = require('./timeRunner')(5, .1 * 60 * 1000);

var Transform = require('stream').Transform;
var util = require('util');

util.inherits(FetchUsers, Transform);

function FetchUsers(options) {
    if (!(this instanceof FetchUsers)) {
        return new FetchUsers(options);
    }

    options = options || {objectMode: true};
    Transform.call(this, options);
    this.idsToFetch = [];
}


FetchUsers.prototype._fetch = function (cb) {
    console.log("will fetch ", this.idsToFetch.length, "profiles");
    var req = request('GET', 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + this.idsToFetch.join(','));

    var chunks = '';
    req.on('data', function (chunk) {
        chunks += chunk.toString('utf8');
    });
    req.on('end', function (chunk) {
        cb(chunks);
    });
};

FetchUsers.prototype._pushFetchedUsers = function (done, users){
    JSON.parse(users).forEach(this.push.bind(this));
    this.idsToFetch.length = 0;
    done();
};

FetchUsers.prototype._createFetchRequest = function(done){
    this._fetch(this._pushFetchedUsers.bind(this, done));
};

FetchUsers.prototype._dispatchFetchRequestOverTime = function(done){
    timeRunner.run(this._createFetchRequest.bind(this, done));
};

FetchUsers.prototype._transform = function (chunk, encoding, done) {
    this.idsToFetch.push(chunk._id);
    this.idsToFetch.length < 3 ? done() :  this._dispatchFetchRequestOverTime(done);
};

var tr = FetchUsers();
FetchUsers.prototype._flush = FetchUsers.prototype._dispatchFetchRequestOverTime.bind(tr);

module.exports = FetchUsers;

MongoClient.connect(optionsMongoFrom.db, function (err, db) {
    var collection = db.collection(optionsMongoFrom.collection);
    var stream = collection.find().limit(31).stream();
    stream.pipe(tr).pipe(toMongo);
});