var config = require( '../config.json' );
var privateServer = require('express')();

console.log("start private server = " + config.private + " on port : "+ config.privateport);
privateServer.use('/data', require('./controllers/data'));
privateServer.get('/',function (req, res) {
    res.writeHead(200);
    res.end('private server');
});

module.exports = privateServer;