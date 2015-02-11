var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToLine, Transform);

function ToLine(options) {
    if (!(this instanceof ToLine)) {
        return new ToLine(options);
    }

    options = options || {};
    Transform.call(this, options);
    this.EOL = options.EOL || '\r\n';
    this.currentLine = '';
}

ToLine.prototype._transform = function (chunk, encoding, done) {
    var data = chunk.toString("utf8");
    var lines = data.split(this.EOL);

    while (lines.length > 1) {
        this.push(this.currentLine + lines.shift(), "utf8");
        this.currentLine = '';
    }
    this.currentLine = lines[0];
    done();
};

module.exports = ToLine;