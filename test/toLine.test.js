var chai = require('chai');
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var ToLine = require('../toLine');

describe("ToLine Module:", function () {
    var toLine;
    var pushStub;


    describe("parsing lines:", function () {

        beforeEach(function () {
            toLine = new ToLine();
            pushStub = sinon.spy(toLine, 'push');
        });

        it("should parse one full line", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(pushStub).to.have.been.calledOnce;
            expect(pushStub).to.have.been.calledWith('{"truc":"machin", "id": "123"}');
        });

        it("should parse 1.5 line", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another"', '', function () {
            });

            expect(toLine.currentLine).to.equal('{"another"');
            expect(pushStub).to.have.been.calledOnce;
            expect(pushStub).to.have.been.calledWith('{"truc":"machin", "id": "123"}');

        });

        it("should parse 2 lines in a row", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another"', '', function () {
            });
            toLine._transform(': "tweet"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(pushStub).to.have.been.calledTwice;
            expect(pushStub).to.have.been.calledWith('{"truc":"machin", "id": "123"}');
            expect(pushStub).to.have.been.calledWith('{"another": "tweet"}');
        });

        it("should parse 2 lines", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another": "tweet"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(pushStub).to.have.been.calledTwice;
            expect(pushStub).to.have.been.calledWith('{"truc":"machin", "id": "123"}');
            expect(pushStub).to.have.been.calledWith('{"another": "tweet"}');
        });

        it("should parse 2.5 lines", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another": "tweet"}\r\n{"third":', '', function () {
            });

            expect(toLine.currentLine).to.equal('{"third":');
            expect(pushStub).to.have.been.calledTwice;
            expect(pushStub).to.have.been.calledWith('{"truc":"machin", "id": "123"}');
            expect(pushStub).to.have.been.calledWith('{"another": "tweet"}');
        });
    });

    describe("parsing lines with custom EOL:", function () {

        beforeEach(function () {
            toLine = new ToLine({EOL: '\n'});
            pushStub = sinon.stub(toLine, 'push');
        });

        it("should parse 2 lines with custom EOL", function () {
            toLine._transform('bonjour\nbyebye\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(pushStub).to.have.been.calledTwice;
            expect(pushStub).to.have.been.calledWith('bonjour');
            expect(pushStub).to.have.been.calledWith('byebye');
        });

    });
});