var express = require('express');
var http = require('http');
var fs = require( 'fs' );
const path = require('path');
var config = require( './config.json' );


if(config.private == true){    
    var privateServer = require('./private/server');

    http.createServer(privateServer).listen(config.privateport);
}

if(config.public == true){
    var publicServer = require('./public/server');
    http.createServer(publicServer).listen(config.publicport);
}


if(config.tester == true){
    var testerServer = require('./tester/server');
    http.createServer(testerServer).listen(config.testerport);
}

