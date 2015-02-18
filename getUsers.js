var request = require('./requester');

var MAX_IDS_BY_REQUEST = 100;

function getUsers(userIds, cb) {
    var req = request('GET', 'https://api.twitter.com/1.1/users/lookup.json?user_id=' + userIds.join(','));

    var chunks = '';
    req.on('data', function (chunk) {
        chunks += chunk.toString('utf8');
    });
    req.on('end', function (chunk) {
        cb(chunks);
    });
}

function getAllUsers(ids, cb) {
    var users = [];

    getUsers(ids.splice(0, MAX_IDS_BY_REQUEST), function lambda(data) {
        var obj = JSON.parse(data);
        users = users.concat(obj);
        if (ids.length > 0){
            getUsers(ids.splice(0, MAX_IDS_BY_REQUEST), lambda);
        }else {
            cb(users);
        }
    });
}


module.exports = getAllUsers;