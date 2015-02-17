var request = require('request');
var OAuth = require('oauth-1.0a');
var zlib = require('zlib');

var oauth = OAuth({
    consumer: {
        public: '',
        secret: ''
    },
    signature_method: 'HMAC-SHA1'
});

var token = {
    public: '',
    secret: ''
};

function createRequest(method, url, data) {
    var headers = oauth.toHeader(oauth.authorize({
        url: url,
        method: method,
        data: data
    }, token));
    headers['Accept-Encoding'] = 'deflate, gzip';
    return request({
        url: url,
        method: method,
        headers: headers
    })
        .pipe(zlib.createGunzip());
};

module.exports = createRequest;
