require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config.json');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api

app.use('/api', function ( req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://streamforce.herokuapp.com');
   //res.header('Access-Control-Allow-Origin', 'http://streamforce.herokuapp.com);
   res.header('Access-Control-Allow-Methods', 'GET');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', true);
  return next();
});

// routes
app.use('/database', require('./controllers/database.controller'));
app.use('/api/players', require('./controllers/api/players.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/database');
});

// start server
var server = app.listen(process.env.PORT || 3000, function () {
	var port = server.address().port;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log('Example app listening at http://%s:%s', add, port);
    })
});
