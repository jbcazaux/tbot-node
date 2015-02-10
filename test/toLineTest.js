var expect = require('chai').expect;
var ToLine = require('../toLine');

describe("ToLine Module:", function () {
    var toLine;
    var lines;

    beforeEach(function () {
        lines = new Array();
    });


    describe("parsing lines:", function () {

        beforeEach(function () {
            toLine = new ToLine();
            toLine.push = function (l) {
                lines.push(l);
            };
        });

        it("should parse one full line", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');
        });

        it("should parse 1.5 line", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another"', '', function () {
            });

            expect(toLine.currentLine).to.equal('{"another"');
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');

        });

        it("should parse 2 lines in a row", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another"', '', function () {
            });
            toLine._transform(': "tweet"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(lines).to.have.length(2);
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');
            expect(lines[1]).to.equal('{"another": "tweet"}');
        });

        it("should parse 2 lines", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another": "tweet"}\r\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(lines).to.have.length(2);
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');
            expect(lines[1]).to.equal('{"another": "tweet"}');
        });

        it("should parse 2.5 lines", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\r\n{"another": "tweet"}\r\n{"third":', '', function () {
            });

            expect(toLine.currentLine).to.equal('{"third":');
            expect(lines).to.have.length(2);
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');
            expect(lines[1]).to.equal('{"another": "tweet"}');
        });
    });

    describe("parsing lines with custom EOL:", function () {

        beforeEach(function () {
            toLine = new ToLine({EOL: '\n'});
            toLine.push = function (l) {
                lines.push(l);
            };
        });

        it("should parse one full line with custom EOL", function () {
            toLine._transform('{"truc":"machin", "id": "123"}\n', '', function () {
            });

            expect(toLine.currentLine).to.equal('');
            expect(lines[0]).to.equal('{"truc":"machin", "id": "123"}');
        });

    });
});