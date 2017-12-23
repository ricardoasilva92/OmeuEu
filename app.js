var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var index = require('./routes/index');

var users = require('./routes/users');

var session = require('express-session');
var passport = require('passport');  
const config = require('./config/database')
//DATABASE
var mongoose= require('mongoose')

mongoose.connect(config.database,{useMongoClient:true})
mongoose.Promise=global.Promise



//verificar conexao
let db = mongoose.connection;
db.once('open',function(){
  console.log('Ligado ao mongoDb')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

// validator (campos de registo)
var expressValidator = require('express-validator');
app.use(expressValidator())

// messagens de alerta
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
})

app.use('/', index);
app.use('/users', users);
//MIDDLEWARE P TORNAR A CONEXÃO À BD ACESSIVEL AO INDEX.JS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
