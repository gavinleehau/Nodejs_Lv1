// var ItemsModel = require('./../schemas/items');

// let createFilterStatus = (currentStatus) =>{
//     let statusFillter = [
//         {name: 'All', value:'all', count:1, link: '#', class:'defaut'},
//         {name: 'Actitve', value:'active', count:2,  link: '#', class:'defaut'},
//         {name: 'Inactitve', value:'inactive', count:3, link: '#', class:'defaut'},
//     ];

//     statusFillter.forEach((item, index) =>{
//         let condition ={};
//         if (item.value !== 'all') condition = {status: item.value}; 
//         if (item.value === currentStatus) statusFillter[index].class = 'success'; 
//         ItemsModel.count(condition).then((data) => {
//             statusFillter[index].count = data; 
//         });    
//     })
//     return statusFillter;
// }
// module.exports ={
//     createFilterStatus: createFilterStatus
// }



var ItemsModel = require('./../schemas/items');

let createFilterStatus = async (currentStatus) =>{
    let statusFillter = [
        {name: 'All', value:'all', count:1, link: '#', class:'defaut'},
        {name: 'Actitve', value:'active', count:2,  link: '#', class:'defaut'},
        {name: 'Inactitve', value:'inactive', count:3, link: '#', class:'defaut'},
    ];

    // statusFillter.forEach((item, index) =>{
    for(let index = 0; index < statusFillter.length; index++ ){
        let condition ={};
        let item = statusFillter[index];
        if (item.value !== 'all') condition = {status: item.value}; 
        if (item.value === currentStatus) statusFillter[index].class = 'success'; 
        await ItemsModel.count(condition).then((data) => {
            statusFillter[index].count = data; 
        });    
    }
    return statusFillter;
}
module.exports ={
    createFilterStatus: createFilterStatus
}
