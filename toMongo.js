var Writable = require('stream').Writable;
var util = require('util');
var MongoClient = require('mongodb').MongoClient;

util.inherits(ToMongo, Writable);

module.exports = ToMongo;

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

module.exports = ToMongo;