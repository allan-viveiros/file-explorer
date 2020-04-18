//Require nodeJS modules
const http = require('http');

//Files imports
const respond = require('./lib/respond.js')

//Connection settings
//Look a port in the environment variable or use 3000
const port = process.env.PORT||'3000'; // || 3000; //maybe 58634

//Create server
const server = http.createServer(respond);

//Listen to client requests on the specific port.
server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});


////////// Second attempt
// File modified 
/*
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;

const res = require('./lib/respond.js')

const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/lib/respond.js'));
});

app.listen(port, () => console.log(`url-shortener listening port ${port}`));

//app.listen(process.env.PORT||'58634'||'8080', function(){
//    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//  });


////////// Third attempt
/*
const static = require('node-static');
const file = new static.Server();
const response = require('./lib/respond.js')
const port = process.env.PORT||'3000';

require('http').createServer(function(request, response) {
    request.addListener('end', function() {


        file.serve(request, response);
    }).resume();
}).listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
*/

