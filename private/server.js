var config = require( '../config.json' );
var privateServer = require('express')();
var request = require('request');

var isActive = false;
var waiting = false;
var calcPingTime = null;
var connectionCounter = 0;
var calculationCounter = 0;
var  allRequestsListOnPrivate = [];
var started = false;


console.log("start private server = " + config.private + " on port : "+ config.privateport);
privateServer.use('/data', require('./controllers/data'));
privateServer.get('/',function (req, res) {
    res.writeHead(200);
    res.end('private server');
});

setInterval(() => {
    if(isActive == true && waiting == false)
    {
        BringRequsetsToPrivateServer();
    }
    //if(started == false && allRequestsListOnPrivate.length > 0 )
    //{
     //   started = true;
        ResolveRequsetsToPublicServer()
   // }
}, 10);




function BringRequsetsToPrivateServer()
{
    connectionCounter++;
    //console.log('start');
    calcPingTime = new Date();
    waiting = true;

    request.post({
        headers: {'content-type' : 'application/json'},
        url:     config.publicuri + '/bringallrequests'       
        //url:'https://www.google.com/'        
      }, function(error, response, body){
        waiting = false;
       // var ressss = response.toJSON();
        calcPingTime = calcPingTime - new Date();
        //console.log(body);
        var arr = JSON.parse(body);
        for(var i = 0 ; i < arr.length;i++)
            allRequestsListOnPrivate.push(arr[i]);
            
        //console.log(JSON.stringify(allRequestsListOnPrivate));
        //console.log('arrived ' + calcPingTime + " " + calculationCounter);        
      });
}


function ResolveRequsetsToPublicServer()
{
    for(var i = 0 ; i < allRequestsListOnPrivate.length ; i++)
    {
        if(allRequestsListOnPrivate[i].reqStep == 1)
        {
            allRequestsListOnPrivate[i].reqStep = 2
            //allRequestsListOnPrivate[i].reqData.headers.serversCounter=allRequestsListOnPrivate[i].reqCounter;
            
            request({
                method:allRequestsListOnPrivate[i].reqData.method,
                //headers: {'content-type' : 'application/json','serversCounter':allRequestsListOnPrivate[i].reqCounter},
                headers: allRequestsListOnPrivate[i].reqData.headers,
                url:     config.insideApplication + allRequestsListOnPrivate[i].reqData.url,
                //json: {reqCounter: allRequestsListOnPrivate[i].reqCounter}
                //url:'https://www.google.com/'        
            }, function(error, response, body){
              
                request({
                    method:"POST",
                    headers: {'content-type' : 'application/json'},
                    url:     config.publicuri + '/resolverequest',
                    json: {serversCounter:response.req.getHeader('serversCounter'), resbody:body,resheaders:response.headers} 
                    //url:'https://www.google.com/'        
                }, function(error, response, body){
                  
                    console.log('solved');
                  
                });
              
            });
        }
    }
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