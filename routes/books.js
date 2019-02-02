var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET all books */
router.get('/', function(req, res, next) {
	Book.findAll({order:[ ["title", "ASC"]]}).then(function(books) {
		res.render('index', {title: "Books", books: books});
	}).catch(function(err){
		res.send(500);
	});
});

/* GET new book form */
router.get('/new', function(req, res, next) {
	res.render('new-book', {title: "New Book", book: Book.build()});
});

/* POST new book */
router.post('/', function(req, res, next) {
	Book.create(req.body).then(function(book) {
		res.redirect('/books');
	}).catch(function(err){
		if(err.name === "SequelizeValidationError") {
			res.render("new-book", {
				book: Book.build(req.body),
				title: req.body.title,
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
			res.render('update-book', {title: book.title , book: book});
		} else {
			res.send(404);
		}
	}).catch(function(err) {
		res.send(500);
	});
});

/* PUT update book details */
router.post('/:id', function(req, res, next) {
	Book.findById(req.params.id).then(function(book) {
		if(book) {
			return book.update(req.body);
		} else {
			res.send(404)
		}
	}).then(function() {
		res.redirect('/books');
	}).catch(function(err){
		if(err.name === "SequelizeValidationError") {
			const book = Book.build(req.body);
			book.id = req.params.id;
			res.render("update-book", {
				book: book,
				title: book.title,
				errors: err.errors
			});
		} else {
			throw err;
		}
	}).catch(function(err) {
		res.send(500);
	});
});


/* DELETE  book */
router.post('/:id/delete', function(req, res, next) {
	Book.findById(req.params.id).then(function(book) {
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
