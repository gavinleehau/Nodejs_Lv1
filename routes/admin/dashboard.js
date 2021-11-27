var express = require('express');
var router = express.Router();

var ItemsModel = require('./../../schemas/items');

// dashboard
router.get('/dashboard', async(req, res, next) => {
   let countItems = 0;
   await ItemsModel.count({}).then((data) => {
        countItems = data;
    });

    res.render('pages/dashboard/dashboard', { 
        title: 'Dashboard Page', 
        countItems,
    });

});



module.exports = router;
