var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('pages/theme/home', { title: 'Home' });
});

module.exports = router;
