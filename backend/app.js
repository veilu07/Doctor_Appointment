var createError = require('http-errors');
var express 		= require('express');
var path 			  = require('path');
var cookieParser= require('cookie-parser');
var logger 			= require('morgan');
var app 			  = express();
const cors 			= require('cors');
const http 			= require('http');
const bodyParser= require('body-parser');
const db 			  = require('./helpers/dbConnect')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(bodyParser.urlencoded({ extended:false,limit:'50mb' }))
app.use(bodyParser.json({limit:'50mb'}))
app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false,limit:'50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/doctor', require('./routes/doctor'));
app.use('/patient', require('./routes/patient'));

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
  res.render('error');
});

/*const server 		= http.createServer(app);

const socketIo 		= require('./helpers/socket').listen(server);
*/


app.use((req,res,next)=>{
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,OPTION,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,authorization');
	res.setHeader('Access-Control-Allow-Credentials',true);
	next();
});

const encryption = require('./helpers/encryption')
/*console.log('encryption',encryption.encryptData('mongodb+srv://veilu:Veil@07@cluster0.x4r9u.mongodb.net/doctor?retryWrites=true&w=majority'))
console.log('decryption',encryption.decryptData('pGA6k3c3YT9YrqhgpeVqV6lkDr6vaEhnHZjvKKJrnrN2k4bBxKPKyPSJy5j2T5TEVa+s44M8/TTeayQJf23NThep/ZNzXWcdTg4WtH4gWrzBdFFiNkrueYruB18Z9x0d'))*/

/*console.log('encryption',encryption.encryptData('veilu'))
console.log('decryption',encryption.decryptData(encryption.encryptData('veilu')))*/


module.exports = app;
