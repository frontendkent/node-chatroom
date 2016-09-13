
/* ****** Modules ****** */

var express = require('express');
var consolidate = require('consolidate'); 
var sass = require('node-sass');
var minify = require('node-minify');
var fs = require('fs');
var bodyParser = require('body-parser');
var moment = require('moment');


/* ****** Variables ****** */

var app = express();
var messages = [];



/* ****** Middleware ****** */

app.use(bodyParser.urlencoded( { extended: true } ));
app.use(bodyParser.json());

app.engine('shtml', consolidate.swig);
app.set('view engine', 'shtml');
app.set('views', __dirname + '/ui/views');

app.use( express.static('./ui/public') );




/* ****** Routes ****** */

app.get('/css/styleguide.css', function( req, res ) {
	var filename = __dirname + '/ui/scss/styleguide.scss';
	sass.render({
	  file: filename,
	}, function(err, result) { 
		res.setHeader("content-type", "text/css");
		res.send( result.css );
	});
});

fs.existsSync(__dirname + '/ui/public/app.js') && fs.unlinkSync(__dirname + '/ui/public/app.js');
app.get('/js/app.js', function( req, res, next ) {
	fs.readFile('./ui/js/app.json', function(err,data) {
			if(err) return next();
			var json = JSON.parse( data.toString() );
			for(i in json) json[i] = './ui/js/' + json[i];
				new minify.minify({
				  type: 'yui-js',
				  fileIn: json,
				  fileOut:'./ui/public/js/app.js',
				  callback: function(err, min){
				  	res.setHeader("content-type", "text/javascript");
				  	res.send(min);
				  }
				});	
		});
});

app.post('/api/messages', function( req, res ) {
	if(req.body.message) {
		messages.unshift( {
			user: req.ip, 
			message: req.body.message,
			datetime: moment()
		} );
		if(req.xhr || req.body.ajax) res.send( messages );
		else res.redirect('/');
	} else {
		if(req.xhr || req.body.ajax) res.status(500).send("Invalid body");
		else res.redirect('/');
	}
});

app.get('/api/messages', function( req, res ) {
	res.send( messages );
});


app.get('/', function( req, res ) {
	var json = {
		me: req.ip,
		messages : messages
	};

	res.render( 'page' , {
		page: req.params.page,
		datetime: new Date().toString(),
		json: JSON.stringify(json)
	});
});





/* ****** Server ****** */

app.listen(8080);

