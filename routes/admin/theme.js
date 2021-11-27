var express = require('express');
var router = express.Router();

// đường dẫn phải khai báo ở app.js

//group
router.get('/group-form', function(req, res, next) {
  res.render('pages/group/form', { title: 'Form Page' });
});
router.get('/group-list', function(req, res, next) {
  res.render('pages/group/list', { title: 'List Page' });
});


// //item
// router.get('/item-form', function(req, res, next) {
//   res.render('pages/items/form');
// });
// router.get('/item-list', function(req, res, next) {
//   res.render('pages/items/list');
// });


//User
router.get('/user-form', function(req, res, next) {
  res.render('pages/user/form');
});
router.get('/user-list', function(req, res, next) {
  res.render('pages/user/list');
});


//Category
router.get('/category-form', function(req, res, next) {
  res.render('pages/category/form');
});
router.get('/category-list', function(req, res, next) {
  res.render('pages/category/list');
});


//Book
router.get('/book-form', function(req, res, next) {
  res.render('pages/book/form');
});
router.get('/book-list', function(req, res, next) {
  res.render('pages/book/list');
});


//login
router.get('/login', function(req, res, next) {
  res.render('pages/login/login', {layout: false});
});



module.exports = router;
