var expect = require('chai').expect;
var ToElasticSearch = require('../toElasticSearch');

describe("ToElasticSearch Module:", function () {
    var toElasticSearch;

    beforeEach(function () {


    });


    it("should create elastic search client with default connection parameters", function () {
        toElasticSearch = new ToElasticSearch();

        expect(toElasticSearch.client.transport._config.host).to.be.equal('localhost:9200');

    });


    it("should create elastic search client with custom connection parameters", function () {
        toElasticSearch = new ToElasticSearch({host:'myhost.com', port: 1234});

        expect(toElasticSearch.client.transport._config.host).to.be.equal('myhost.com:1234');
    });


});
