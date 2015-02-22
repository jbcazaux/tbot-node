var Writable = require('stream').Writable;
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var Q = require('q');

util.inherits(ToMongo, Writable);

function ToMongo(options) {
    if (!(this instanceof ToMongo)) {
        return new ToMongo(options);
    }
    Writable.call(this, {objectMode: true});
    this.options = options;

    var self = this;
    MongoClient.connect(options.db, function (err, db) {
        if (err) throw err;
        self.db = db;
        self.on('finish', function () {
            self.db.close();
        });
        self.collection = db.collection(options.collection);
    });
}

ToMongo.prototype._write = function (obj, encoding, done) {
    this.collection.insert(obj, done);
};

ToMongo.prototype.addFollowed = function(userId, followedId){
    console.log('create promise');
    var deferred = Q.defer();
    this.collection.findAndModify({_id: userId}, null, {$push : {follows: followedId}}, {upsert: true}, deferred.makeNodeResolver());
    return deferred.promise;
};

module.exports = ToMongo;