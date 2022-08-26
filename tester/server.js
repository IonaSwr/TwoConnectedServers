var config = require( '../config.json' );
var testerServer = require('express')();

console.log("start private server = " + config.tester + " on port : "+ config.testerport);
testerServer.use('/data', require('./controllers/data'));
testerServer.get('/',function (req, res) {
    res.writeHead(200);
    res.end('tester server');
});

module.exports = testerServer;