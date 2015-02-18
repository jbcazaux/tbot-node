var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToCursoredList, Transform);

function ToCursoredList(options) {
    if (!(this instanceof ToCursoredList)) {
        return new ToCursoredList({objectMode:true});
    }

    Transform.call(this, options);
    this.buffer = '';
}

ToCursoredList.prototype._transform = function (chunk, encoding, done) {
    var data = chunk.toString("utf8");
    this.buffer += data;
    done();
};
ToCursoredList.prototype._flush = function (done) {
    var obj = JSON.parse(this.buffer);
    this.push(obj);
    done();
};

module.exports = ToCursoredList;