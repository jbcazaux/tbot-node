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
    this._parse(data);
    done();
};

ToLine.prototype._parse = function (data) {
    var index = data.indexOf(this.EOL);
    if (index < 0) {
        this.currentLine += data;
    } else {
        var lineEnd = data.slice(0, index);
        this.currentLine += lineEnd;
        this.push(this.currentLine, "utf8");

        //TODO:refactor this
        var nextLine = data.slice(index + this.EOL.length);
        if (nextLine.indexOf(this.EOL) < 0) {
            this.currentLine = nextLine;
        } else {
            this.currentLine = '';
            this._parse(nextLine);
        }
    }
};

module.exports = ToLine;