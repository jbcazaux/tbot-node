var request = require('./requester');

var s = request('GET', 'https://api.twitter.com/1.1/application/rate_limit_status.json?resources=followers,users');

var data = '';
s.on('data', function (chunk) {
    data += chunk.toString();
});
s.on('end', function () {
    var result = JSON.parse(data);
    for (r in result.resources){
        for (i in result.resources[r]) {
            var resource = result.resources[r][i];
            var remaining = resource['remaining'];
            var limit = resource['limit'];
            console.log(i, '->', limit - remaining, '/', limit, 'reset:', Math.round(resource['reset'] - new Date().getTime() / 1000));
        }
    }
});