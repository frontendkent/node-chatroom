
/* ****** Modules ****** */

var express = require('express');
var consolidate = require('consolidate'); 
var sass = require('node-sass');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');
var session = require('express-session')

/* ****** Variables ****** */

var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);



/* ****** Middleware ****** */

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: '1nt3rn3t3xpl0r3r%',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

app.engine('shtml', consolidate.swig);
app.set('view engine', 'shtml');
app.set('views', './ui/views');

app.use( express.static('./ui/public') );




/* ****** Routes ****** */

app.get('/css/styleguide.css', function( req, res ) {
	var filename = './ui/scss/styleguide.scss';
	sass.render({
	  file: filename,
	}, function(err, result) { 
		res.setHeader("content-type", "text/css");
		res.send( result.css );
	});
});


app.get('/', function( req, res ) {
	res.render( 'page' , {
		ip: req.sessionID,
		messages : JSON.stringify(messages)
	});
});



/* ****** Sockets ****** */

var messages = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('join', function(data) {
  	socket.emit('welcome',messages);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(msg);
    var json = {
    	message: msg.message,
    	user: msg.user,
    	datetime: moment()
    }
    messages.push(json);
    io.emit('chat message', json);
  });
});




/* ****** Server ****** */

var port = process.argv[2] || 8080;
server.listen(port);

