var express = require('express');
var path = require('path');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var cors = require('cors');

var users = require('./routes/users');
var pets = require('./routes/pets');
var vets = require('./routes/vets');


var app = express();
app.use(cors());
let dbMongo;
mongodb.connect("mongodb://localhost:27017/mascotas",(err,db)=>{
    if(err){
        console.log("Error al conectarse a mongo")
    }
    dbMongo=db;
});
//TODOS ESTOS SON MIDDLEWARES
app.use((req,res,next)=>{
    req.db=dbMongo;
    next(); 
});

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/pets', pets);
app.use('/api/users', users);
app.use('/api/vets',vets);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handlers
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
  

module.exports = app;
