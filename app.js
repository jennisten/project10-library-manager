/* REQUIRE DEPENDENCIES */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* DECLARE ROUTE FILES */
const main = require('./routes');
const books = require('./routes/books');

const app = express();

/* VIEW ENGINE */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* USE ROUTES */
app.use('/', main);
app.use('/books', books);

/* CATCH 404 AND FORWARD TO ERROR HANDLER */
app.use(function(req, res, next) {
  next(createError(404));
});

/* ERROR HANDLER */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if (err.status === 404) {
	  res.render('page-not-found');
	  console.log(err.status + ' Page not found');
  } else {
  	res.status(err.status || 500);
  	res.render('error');
	console.log(err.status + ' Error');
	}
});

module.exports = app;
