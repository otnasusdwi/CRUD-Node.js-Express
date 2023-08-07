var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');
/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
	//query
	connection.query('SELECT * FROM posts ORDER BY id desc', function (err, rows) {
		if (err) {
			req.flash('error', err);
			res.render('posts', {
				data: ''
			});
		} else {
			//render ke view posts index
			res.render('posts/index', {
				data: rows // <-- data posts
			});
		}
	});
});

router.get('/create', function (req, res, next) {
	res.render('posts/create', {
		title: '',
		content: ''
	})
})

router.post('/store', function (req, res, next) {
	let title = req.body.title;
	let content = req.body.content;
	let errors = false;

	if (title.length === 0) {
		errors = true;

		req.flash('error', "Silahkan Masukkan Title");

		res.render('posts/create', {
			title: title,
			content: content
		})
	}

	if (content.length === 0) {
		errors = true;

		req.flash('error', "Silahkan Masukkan Konten");

		res.render('posts/create', {
			title: title,
			content: content
		})
	}

	if (!errors) {
		let formData = {
			title: title,
			content: content
		}

		connection.query('INSERT INTO posts SET ?', formData, function (err, result) {
			if (err) {
				req.flash('error', err)

				res.render('posts/create', {
					title: formData.title,
					content: formData.content
				})
			} else {
				req.flash('success', 'Data Berhasil Disimpan');
				res.redirect('/posts');
			}
		})
	}
})

router.get('/edit/(:id)', function (req, res, next) {
	let id = req.params.id;

	connection.query('SELECT * FROM posts WHERE id = ' + id, function (err, rows, fields) {
		if (err) throw err

		if (rows.length <= 0) {
			req.flash('error', 'Data Post Dengan ID' + id + "Tidak Ditemukan")
			req.redirect('/posts')
		} else {
			res.render('posts/edit', {
				id: rows[0].id,
				title: rows[0].title,
				content: rows[0].content
			})
		}
	})
});

router.post('/update/:id', function (req, res, next) {
	let id = req.params.id;
	let title = req.body.title;
	let content = req.body.content;
	let errors = false;

	if (title.length === 0) {
		errors = true;

		req.flash('error', "Silahkan Masukkan Title");

		res.render('posts/edit', {
			id: req.params.id,
			title: title,
			content: content
		})
	}

	if (content.length === 0) {
		errors = true;

		req.flash('error', "Silahkan Masukkan Konten");

		res.render('posts/edit', {
			id: req.params.id,
			title: title,
			content: content
		})
	}

	if (!errors) {
		let formData = {
			title: title,
			content: content
		}

		connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, function (err, result) {
			if (err) {
				req.flash('error', err)
				res.render('posts/edit', {
					id: req.params.id,
					name: formData.name,
					author: formData.author
				})
			} else {
				req.flash('success', 'Data Berhasil Diupdate');
				res.redirect('/posts');
			}
		})
	}
});

router.get('/delete/(:id)', (req, res, next) => {
	let id = req.params.id;

	connection.query('DELETE FROM posts WHERE id =' + id, (err, result) => {
		if (err) {
			req.flash('error', err)
			res.redirect('/posts')
		} else {
			req.flash('success', 'Data Berhasil Dihapus')
			res.redirect('/posts')
		}
	})
})

module.exports = router;