var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET all books */
router.get('/', function(req, res, next) {
	Book.findAll({order:[ ["title", "ASC"]]}).then(function(books) {
		res.render('index', {books: books});
	}).catch(function(err){
		res.send(500);
	});
});

/* GET new book form */
router.get('/new', function(req, res, next) {
	res.render('new-book');
});

/* POST new book */
router.post('/', function(req, res, next) {
	Book.create(req.body).then(function(book) {
		res.redirect('/books');
	}).catch(function(err){
		if(err.name === "SequelizeValidationError") {
			res.render("new-book", {
				book: Book.build(req.body),
				errors: err.errors
			});
		} else {
			throw err;
		}
	}).catch(function(err) {
		res.send(500);
	});
});

/* GET individual book */
router.get('/:id', function(req, res, next) {
	Book.findById(req.params.id).then(function(book) {
		if(book) {
			res.render('update-book', {book: book});
		} else {
			res.send(404);
		}
	}).catch(function(err) {
		res.send(500);
	});
});

/* POST update book details */
router.post('/:id', function(req, res, next) {
	Book.findById(req.params.id).then(function(book) {
		if(book) {
			return book.update(req.body);
		} else {
			res.send(404)
		}
	}).then(function() {
		res.redirect('/books');
	}).catch(function(err) {
		res.send(500);
	});
});


/* GET book confirm delete */
router.get('/:id/delete', function(req, res, next ){
	Book.findById(req.params.id).then(function(book) {
		if(book) {
			res.render('delete-book', {book: book});
		} else {
			res.send(404);
		}
	}).catch(function(err) {
		res.send(500);
	});
});


/* DELETE  book */
router.delete('/:id', function(req, res, next) {
	Book.findByPk(req.params.id).then(function(book) {
		if(book) {
			return book.destroy();
		} else {
			res.send(404);
		}
	}).then(function() {
		res.redirect('/books');
	}).catch(function(err){
		res.send(500);
	});
});

module.exports = router;
