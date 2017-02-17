'use strict';

var express = require('express');
var parser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mid = require('./middleware');
var api = require('./api');
var routes = require('./routes');
var app = express();
var db = require('./database');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000;


app.use(cookieParser());

app.use(session({
	secret: 'I love my family',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
	mongooseConnection: db
	})
}))


app.use(function(req, res, next) {
	console.log()
	res.locals.id = req.session.userId;
	res.locals.user = req.session.username;
	next();
})

app.use(parser.json());
app.use(parser.urlencoded({
	extended: true
}))


app.use(express.static('public'));
app.use(favicon('./public/images/newspaper.png'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');


app.use('/api', api);

app.use('/', routes);



//Route Not Found
app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
})

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {message : err.message});
})



app.listen(port, function() {
	console.log("The server is now running on port " + port);
}) 




