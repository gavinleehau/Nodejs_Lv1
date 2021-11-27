
var express = require('express');
var router = express.Router();
var util = require('util');


// var systemConfig = require(__base + 'system');
// var notify = require(__path_config + 'notify');


var ItemsModel = require('./../../schemas/items');
var UtilsHelpers = require('./../../helpers/utils');
var paramsHelpers = require('./../../helpers/params');
var systemConfig = require('./../../config/system');
var notify = require('./../../config/notify');
var validatorItems = require('./../../validates/items');
var linkIndex = '/' + systemConfig.prefixAdmin + '/item-list/';
var folderViews = 'pages/items/'; // duong dan folder views mot chi can sua tren day



/* GET items và phân trang */
router.get('/item-list(/:status)?', async(req, res, next) => {
    let objWhere = {};
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'all' );
    let statusFillter = await UtilsHelpers.createFilterStatus(currentStatus); 
    let keyword = paramsHelpers.getParams(req.query, 'keyword', '' );
    let pagination = {
        totalItems : 1,
        totalItemsPerPage: 3,
        currentPage: parseInt(paramsHelpers.getParams(req.query, 'page', 1 )),
        pageRanges: 3,
    };

    if(currentStatus === 'all') {
        if (keyword !== '') objWhere = {name: new RegExp(keyword, 'i')}; // này là tìm kiếm ko phân biệt thường hay hoa miễn có chữ đó là hiện ra
    } else {
        objWhere = {status: currentStatus, name: new RegExp(keyword, 'i')};
        
    }

    await ItemsModel.count(objWhere).then((data) => {
        pagination.totalItems = data;
    });

    ItemsModel
        .find(objWhere)
        .sort({ordering: 'asc'})  // asc: tang dần,  desc: giảm dần
        .skip((pagination.currentPage-1) * pagination.totalItemsPerPage)
        .limit(pagination.totalItemsPerPage)
        .then( (items) => {
            res.render(`${folderViews}list`, { 
                title: 'Items List' ,
                items: items, //truyền ra views danh sách các phần tử
                statusFillter,
                pagination,
                currentStatus, //truyền ra giống thì ghi 1 cái thôi
                keyword
            });     
        });
});


// thay đổi status (U)
router.get('/item-list/change-status/:id/:status', (req, res, next) => {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active' );
    let id            = paramsHelpers.getParams(req.params, 'id', '' );
    let status        = (currentStatus === 'active') ? 'inactive' : 'active';

    // ItemsModel.findById(id).then((ItemResult) => {
    //     ItemResult.status = status;
    //     ItemResult.save().then((result) =>{
    //         res.redirect('/admin/item/');
    //     });
    // });

    ItemsModel.updateOne({_id: id}, {status: status}, (err, result) =>{ // Lấy id xong change stt
        req.flash('success', notify.change_status_success , false);  //'': trạng thái, '': nội dung, kiểu true or false  (show mess)
        res.redirect(linkIndex);
    });
});

// chang status-multi
router.post('/item-list/change-status/:status', (req, res, next) => {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active' );
    ItemsModel.updateMany({_id: {$in: req.body.cid}}, {status: currentStatus}, (err, result) =>{ // Lấy id xong change stt
        // console.log(result); in ra để xem result.abc để lấy số phaan26 tử đã update
        req.flash('success', util.format(notify.change_multi_status_success, result.modifiedCount), false);
        res.redirect(linkIndex);
    });
});



// change odering-multi
router.post('/item-list/change-ordering', (req, res, next) => {
    let cids            = req.body.cid;
    let orderings       = req.body.ordering;

    // kiểm tra xem có phải là 1 mang ko (chọn nhiều item) thì chạy forEach. Ko thì chỉ thay đổi 1 phần tử
    if(Array.isArray(cids)) {
        cids.forEach((item, index) => {
            ItemsModel.updateOne({_id: item}, {ordering: parseInt(orderings[index])}, (err, result) => {});
        })
    } else {
        ItemsModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}, (err, result) => {
            req.flash('success', util.format(notify.change_ordering_success, result.modifiedCount), false);
        });
    }
    
    res.redirect(linkIndex);
});



// Delete (D)
router.get('/item-list/delete/:id', (req, res, next) => {
    let id            = paramsHelpers.getParams(req.params, 'id', '' );

    ItemsModel.deleteOne({_id: id}, (err, result) =>{ // Lấy id xong change stt
        res.redirect(linkIndex);
    });
    req.flash('success', notify.delete_success, false);
});

// Delete multi
router.post('/item-list/delete', (req, res, next) => {
    ItemsModel.deleteMany({_id: {$in: req.body.cid }},(err, result) =>{
        // console.log(result);
        req.flash('success', util.format(notify.delete_multi_success, result.deletedCount), false);
        res.redirect(linkIndex);
    });
});


// add
router.get('/item-form(/:id)?', (req, res, next) => { // cái link này phải giống bên action.ejs
    let id    = paramsHelpers.getParams(req.params, 'id', '' );
    let item  = {name: '', ordering: 0, status: '' }; // vì if(id = rỗng) nên phải khởi tạo giá trị mặc định cho item 
    let errors = null;
    
    if(id === '') {
        res.render(`${folderViews}form`, {title: 'Add form', item, errors}); 
    } else {
        ItemsModel.findById(id, (err, item) =>{
            // console.log(item);
            res.render('pages/items/form', {title: 'Edit form', item, errors});
        }); 
    }
});

//save
router.post('/item-list/save', (req, res, next) => {
    // console.log(req.body);
    req.body = JSON.parse(JSON.stringify(req.body));
    validatorItems.validator(req);
    let item = Object.assign(req.body); // copy data từ body gắn vào item

    let errors = req.validationErrors();
    if(typeof item !== "undefined" && item.id !== ''){
        if(errors){ //edit
            res.render(`${folderViews}form`, {title: 'Edit form', item, errors});
        }else {
            ItemsModel.updateOne({_id: item.id}, {
                ordering: parseInt(item.ordering),
                name: item.name,
                status: item.status
            }, (err, result) =>{
                req.flash('success', `Cập nhật thành công`, false);
                res.redirect(linkIndex);
            });
        }
    }else { // add
        if(errors){
            res.render(`${folderViews}form`, {title: 'Add form', item, errors});
        }else{
            new ItemsModel(item).save().then(() =>{ //này là viết tắt. Muốn save phải khởi tạo model nên thay vì khởi tạo thì viết new abcModel
                req.flash('success', `Thêm mới thành công`, false);
                res.redirect(linkIndex);
            });
        }
    }   
});


module.exports = router;







