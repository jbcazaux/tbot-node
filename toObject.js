var Transform = require('stream').Transform;
var util = require('util');

util.inherits(ToObject, Transform);

function ToObject(options) {
    if (!(this instanceof ToObject)) {
        return new ToObject({objectMode:true});
    }

    Transform.call(this, options);
    this.buffer = '';
}

ToObject.prototype._transform = function (chunk, encoding, done) {
    var data = chunk.toString("utf8");
    this.buffer += data;
    done();
};
ToObject.prototype._flush = function (done) {
    var obj = JSON.parse(this.buffer);
    this.push(obj);
    done();
};

module.exports = ToObject;