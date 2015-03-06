var request = require('./requester');

function getLimits() {
    var s = request('GET', 'https://api.twitter.com/1.1/application/rate_limit_status.json?resources=followers');
    var data;
    s.on('data', function (chunk) {
        data = chunk;
    });
    s.on('end', function () {
        var limit = JSON.parse(data);
        var remains = limit['resources']['followers']['/followers/ids']['remaining'];
        var reset = Math.round(limit['resources']['followers']['/followers/ids']['reset'] - new Date().getTime() / 1000);
        console.log('remaining:', remains, 'reset in', reset);
    });
}


getLimits();