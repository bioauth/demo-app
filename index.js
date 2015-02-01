// Import necessary components
var app = require('express')();
var session = require('express-session');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bioauth = require('./bioware')({
    client: 'foo',
    redirect: 'http://localhost:4000/chat',
    bioauthUrl: 'http://localhost:3000/'
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());





/********************************************************************/





// Show the login page on the index
app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html');
});


// When people submit their emails, send them off to bioauth.
app.post('/', function(req, res){
    bioauth.attempt(req.body.email, function (err, redirectTo) {
        res.redirect(redirectTo);
    });
});


// Use bioauth middleware to ensure chatters are authed!
app.get('/chat', bioauth.ensure.bind(bioauth), function (req, res) {
    res.sendFile(__dirname + '/chat.html');
});





/********************************************************************/





// Socket.io chat server.
io.on('connection', function(socket){
    socket.on('chat message', function (msg) {
        io.emit('chat message', 'connor@peet.io : ' + msg);
    });
});

http.listen(4000, function(){
    console.log('listening on *:4000');
});
