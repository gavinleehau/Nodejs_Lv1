//nay cua he thong
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const flash = require('express-flash-notification');
const validator = require('express-validator');
const session = require('express-session');


const mongoose = require('mongoose');

// nay packet
var expressLayouts = require('express-ejs-layouts');

// nay tu import
var themeRouter = require('./routes/admin/theme');
var itemsRouter = require('./routes/admin/items');
var systemConfig = require('./config/system');
var ItemsModel = require('./schemas/items');


// path
global.__base = __dirname + '/';
// console.log(__base);
global.__path_config = __base + 'config/';
// console.log(__path_config);

mongoose.connect('mongodb+srv://haule:Irelia210301@cluster0.1o14o.mongodb.net/myFirstDatabase?retryWrites=false&w=majority');
var db = mongoose.connection;
    db.on('error', () => {
		console.log("Error");
	});
    db.once('open', ()=> {
      console.log("Connected")
    });

// const mongoose = require('mongoose');
// main().catch(err => console.log(err));
// async function main() {
//     await mongoose.connect('mongodb+srv://haule:Irelia210301@cluster0.1o14o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// };


var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(flash(app, {
	viewName: 'flash', //Phần này để đổi tên 'flash.ejs' thành tên mong muốn
}));

app.use(validator({
  	customValidators: {
		isNotEqual: (value1, value2) =>{
			return value1 !== value2;
		}
	}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'admin');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//local variable
app.locals.systemConfig = systemConfig;



//setup router
app.use('/', require('./routes/frontend/home'));
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/admin/theme'));
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/admin/items'));
app.use(`/${systemConfig.prefixAdmin}`, require('./routes/admin/dashboard'));






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', {title: 'Error Page'});
});

module.exports = app;
