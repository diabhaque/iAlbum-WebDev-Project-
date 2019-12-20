var express  = require('express');
var albumsRouter= require("./routes/albums");
const bodyParser= require('body-parser');


var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment2');



app.use(function(req,res,next){
    req.db = db;
    next();
})


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/', albumsRouter);



var server=app.listen(3002, function(){
  console.log("App is running...");
})






