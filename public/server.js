
var config = require( '../config.json' );
var publicServer =  require('express')();
console.log("start public server = " + config.public + " on port : "+ config.publicport);
publicServer.use('/data', require('./controllers/data'));
publicServer.get('/',function (req, res) {
    res.writeHead(200);
    res.end('public server');
});


module.exports = publicServer;