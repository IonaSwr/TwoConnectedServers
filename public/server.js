
var config = require( '../config.json' );
var publicServer =  require('express')();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var requestsList = [];

console.log("start public server = " + config.public + " on port : "+ config.publicport);


publicServer.use('/data', require('./controllers/data'));

// setInterval(()=>{
//     console.log("response arrived " + requestsList.length );

//     for(var i = 0 ; i < requestsList.length ; i++ )
//         requestsList[i].reqStep = 2;
// },3000);


publicServer.post('/bringallrequests',(req,res)=>{
    //console.log("bringallrequests" );
    var reqs = [];
    for(var i = 0 ; i < requestsList.length ; i++ )
        if(requestsList[i].reqStep == 0)
        {
            requestsList[i].reqStep = 1;
            reqs.push(requestsList[i]);
        }
    res.send(JSON.stringify( reqs));
});

publicServer.post('/resolverequest',jsonParser,(req,res)=>{
    //console.log("resolverequest" );
    // for(var i = 0 ; i < requestsList.length ; i++ )
    //     requestsList[i].reqStep = 2;
    for(var i = 0 ; i < requestsList.length ; i++)
    {
        if(requestsList[i].reqCounter == req.body.serversCounter)
        {
            requestsList[i].finalResult = req.body.resbody;
            requestsList[i].resheaders = req.body.resheaders;            
            requestsList[i].reqStep = 3;
        }
    }
    res.send('OK');
});


publicServer.get('*',function (req, res) {
    if(requestsList.length>0)
    console.log("req started " + requestsList.length + " " +  requestsList[requestsList.length -1].reqStep );
    

    if(req.url.indexOf("resolverequest")>-1)
        return res.end('public  ' + req.url);
    var currentReq = requestsList.length;
    var reqData = {}
    reqData.url = req.url;
    reqData.method  = req.method;
    reqData.headers  = req.headers;
    requestsList.push({ reqData, reqStep : 0,reqCounter:currentReq});


    console.log('outside Req ' + requestsList.length);
    var interval = setInterval(()=>{
        if(requestsList[currentReq].reqStep == 3)
        {
            clearInterval(interval);
            for(var key in requestsList[currentReq].resheaders)
            {
                res.header(key,requestsList[currentReq].resheaders[key]);
            }
            res.send(requestsList[currentReq].finalResult);
            //res.end('public server ' + currentReq);
        }
    },1);
});



module.exports = publicServer;