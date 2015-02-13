var elasticsearch = require('elasticsearch');

var Writable = require('stream').Writable;
var util = require('util');
var extend = util._extend;


util.inherits(ToElasticSearch, Writable);


function ToElasticSearch(options) {
    if (!(this instanceof ToElasticSearch)) {
        return new ToElasticSearch(options);
    }

    if (!options || !options.index || options.index.length === 0){
       throw new Error('An index name must be set in options!')
    }

    var defaultOptions = {
        host: 'localhost',
        port: 9200,
        logLevel: 'info'
    };

    this.options = extend(defaultOptions, options || {});
    Writable.call(this, {objectMode: true});

    this.client = new elasticsearch.Client({
        host: this.options.host + ':' + this.options.port,
        log: this.options.logLevel
    });
}


ToElasticSearch.prototype._write = function (obj, encoding, done) {
    this.client.index({
        index: this.options.index,
        type: obj.type,
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

module.exports = ToElasticSearch;


