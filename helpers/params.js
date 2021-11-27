
//cái helpers này để kiểm tra 1 cái thuộc tính nào đó. Nếu nó tồn tại thì in ra nó. ko thì in ra giá trị mặc định

let getParams = (params, property, defautValue) => {

    // // kiểm tra req.params có thuộc tính là 'status' hay ko  VÀ  khác bằng undefined  thì in ra 'status' không thì in ra mặc định là 'all'
    // if (req.params.hasOwnProperty('status') && req.params.status !== undefined){
    //     currentStatus = req.params.status ; //reg là những gì người dùng gởi lên
    // }
    
    if (params.hasOwnProperty(property) && params[property] !== undefined){
        return params[property] ; 
    }
    return defautValue;
}
module.exports ={
    getParams
}
