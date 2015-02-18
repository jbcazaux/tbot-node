var MongoClient = require('mongodb').MongoClient;
var getFollowers = require('./getFollowers');


function ToMongo(options) {
    if (!(this instanceof ToMongo)) {
        return new ToMongo(options);
    }
    this.options = options;

    var self = this;
    MongoClient.connect(options.db, function (err, db) {
        if (err) throw err;
        self.db = db;
        self.collection = db.collection(options.collection);
    });
}


ToMongo.prototype.saveOrUpdate= function (userId, followId) {
    console.log('will update', userId);
    this.collection.findAndModify({_id: userId}, null, {$push : {follows: followId}}, {upsert: true}, function(err, info) {
        console.log(userId, ' -> ', err, info);
    });
};

ToMongo.prototype.closeDb = function() {
    this.db.close();
};

var options = {db: 'mongodb://localhost:27017/twitter', collection: 'users'};
var toMongo = ToMongo(options);

var followId = 95687779;

getFollowers(followId, function(ids) {
    console.log('will save ', ids.length, ' ids.');
    ids.forEach(function(id) {
        toMongo.saveOrUpdate(id, followId);
    });
    //toMongo.closeDb();
});






module.exports = ToMongo;