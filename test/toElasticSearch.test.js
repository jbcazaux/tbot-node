var chai = require('chai');
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var ToElasticSearch = require('../toElasticSearch');

describe("ToElasticSearch Module:", function () {
    var toElasticSearch;

    var noop = function(){};
    var stubPromise = {then: noop};

    beforeEach(function () {


    });

    describe("ElasticSearch client init: ", function () {

        it("should create elastic search client with default connection parameters", function () {
            toElasticSearch = new ToElasticSearch({index: 'index'});

            expect(toElasticSearch.client.transport._config.host).to.be.equal('localhost:9200');
        });


        it("should create elastic search client with custom connection parameters", function () {
            toElasticSearch = new ToElasticSearch({index: 'twitter', host: 'myhost.com', port: 1234, logLevel: 'warning'});

            expect(toElasticSearch.client.transport._config.host).to.be.equal('myhost.com:1234');
        });
    });

    describe("ElasticSearch client call:", function () {

        it("should index object in elasticsearch", function () {
            toElasticSearch = new ToElasticSearch({index: 'indexName', logLevel: 'warning'});
            var stubIndex = sinon.stub(toElasticSearch.client, 'index', function(){
                return stubPromise;
            });
            var obj = {type: 'type', id: 'id'};

            toElasticSearch._write(obj, '', noop);

            expect(stubIndex).to.have.been.calledWith({
                index: 'indexName',
                type: 'type',
                id: 'id',
                body: obj
            })
        });
    });


});
