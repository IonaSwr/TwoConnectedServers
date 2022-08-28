var config = require( '../config.json' );
var privateServer = require('express')();
var request = require('request');

var isActive = false;
var connectionCounter = 0;


console.log("start private server = " + config.private + " on port : "+ config.privateport);
privateServer.use('/data', require('./controllers/data'));
privateServer.get('/',function (req, res) {
    res.writeHead(200);
    res.end('private server');
});

setInterval(() => {
    if(isActive == true && connectionCounter==0)
    {
        BringRequsetsToPrivateServer();
    }
}, 1000);


function BringRequsetsToPrivateServer()
{
    connectionCounter++;
    console.log('start');
    request.get({
        //url:     config.publicport + '/data',
        url:'https://www.google.com/'        
      }, function(error, response, body){
        console.log('arrived ' + connectionCounter);
        
        if(isActive == true && connectionCounter < 100)
            BringRequsetsToPrivateServer();
      });
}

privateServer.get('/start',function (req, res) {
    if(isActive == false)
    {
        connectionCounter = 0 ;
        isActive = true;
        console.log('started')
        res.send('BringRequsetsToPrivateServer');
    }else{           
        res.send('ok');  
    }
});

privateServer.get('/stop',function (req, res) {
    if(isActive == true)
    {
        connectionCounter = 0;
        isActive = false;
        console.log('stoped')
        res.send('stoped');
    }else{           
        res.send('ok');  
    }
});


module.exports = privateServer;