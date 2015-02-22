var expect = require('chai').expect;
var TimeRunner = require('../timeRunner');

describe("TimeRunner Module:", function () {
        var timeRunner;
        var result;
        function runner(i, cb) {
            return function () {
                result.push(i);
                if (cb) cb();
            }
        };

        beforeEach(function () {
            timeRunner = TimeRunner(2, 500);
            result = [];
        });

        describe('with no smoothing', function () {

            it("should run both tasks", function () {
                timeRunner.run(runner(0));
                timeRunner.run(runner(1));

                expect(result).to.deep.equal([0, 1]);
            });
        });

        describe('with smoothing', function () {

            it("should run tasks after delay", function (done) {
                timeRunner.run(runner(0));
                timeRunner.run(runner(1));
                timeRunner.run(runner(2));
                timeRunner.run(runner(3));
                timeRunner.run(runner(4));
                timeRunner.run(runner(5, done));
            });

            afterEach(function () {
                expect(result).to.deep.equal([0, 1, 2, 3, 4, 5]);
            });
        });
    }
);