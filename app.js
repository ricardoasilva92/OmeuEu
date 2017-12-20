var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


//DATABASE
var dbglobal
var MongoClient = require('mongodb').MongoClient
var dburl = 'mongodb://localhost:27017/omeueu'
MongoClient.connect(dburl,(err,d)=>{ 
  if(!err){
    dbglobal = d
  }
  else{
    console.log('Erro: '+err)
  }
})

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var index = require('./routes/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARE P TORNAR A CONEXÃO À BD ACESSIVEL AO INDEX.JS
app.use((req,res,next)=>{
  req.db = dbglobal
  next()
})

app.use('/', index);

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
