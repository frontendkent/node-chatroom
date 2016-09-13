
/* ****** Modules ****** */

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');

var chatroom = require('./example4/chatroom');

/* ****** Globals ****** */

var app = express();
var messages = require('./example4/messages.json');



/* ****** Data Functions ****** */

function SaveData() {
	fs.writeFile('./example4/messages.json', JSON.stringify(messages), function(err) {
		if(err) return console.log(err);
	} );
}



/* ****** Middleware ****** */

app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());



/* ****** API ****** */

app.post('/message', function (req, res) {
	if(req.body.message) {
		messages.unshift( {
			user: req.ip, 
			message: req.body.message,
			datetime: moment()
		} );
		if(req.xhr || req.body.ajax) res.send( messages );
		else res.redirect('/');
		SaveData();
	} else {
		if(req.xhr || req.body.ajax) res.send(500);
		else res.redirect('/');
	}
});



/* ****** Routes ****** */

app.get('/', function (req, res) {
	fs.readFile('./example4/index.html', 'utf8', function (err, string) {
		if (err) {
			res.status(404);
			res.send('File not found: ' + req.url);
	  	} else {
	  		res.set('Content-Type', 'text/html');
	  		var json = {
				me: req.ip,
				messages : messages
			};
	  		var data = JSON.stringify(json);
	  		string = string.replace(/@@data/g, data);
	  		res.send(string);
	  	}
	});	
});

app.use( express.static('./example4') );



/* ****** Server ****** */

app.listen(8080);


