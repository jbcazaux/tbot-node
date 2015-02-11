var elasticsearch = require('elasticsearch');

var Writable = require('stream').Writable;
var util = require('util');


util.inherits(ToElasticSearch, Writable);

module.exports = ToElasticSearch;

function ToElasticSearch(options) {
    if (!(this instanceof ToElasticSearch)) {
        return new ToElasticSearch(options);
    }
    Writable.call(this, {objectMode: true});
    this.options = options;

    this.client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'info'
    });
}


ToElasticSearch.prototype._write = function (obj, encoding, done) {

    var type = 'tweet';
    if (obj.in_reply_to_status_id) {type = 'reply'}
    else if (obj.retweeted_status && obj.retweeted_status.id) {type = 'retweet'}

    this.client.index({
        index: 'twitter',
        type: type,
        id: obj.id,
        body: obj
    }).then(function(body){
        //done();
    }, function (error){
        console.log('error indexing !!')
        //done();
    });
    done();
};




