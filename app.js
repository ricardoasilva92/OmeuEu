var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var index = require('./routes/index');
//DATABASE
var mongoose= require('mongoose')

mongoose.connect('mongodb://localhost:27017/omeueu',{useMongoClient:true})
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
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

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
