var elasticsearch = require('elasticsearch');

var Writable = require('stream').Writable;
var util = require('util');
var extend = util._extend;


util.inherits(ToElasticSearch, Writable);

module.exports = ToElasticSearch;

function ToElasticSearch(options) {
    if (!(this instanceof ToElasticSearch)) {
        return new ToElasticSearch(options);
    }

    var defaultOptions = {
        host: 'localhost',
        port: 9200,
        logLevel: 'info'
    };

    options = extend(defaultOptions, options || {});
    Writable.call(this, {objectMode: true});

    this.client = new elasticsearch.Client({
        host: options.host + ':' + options.port,//'localhost:9200',
        log: options.logLevel//'info'
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




