var express = require('express');
var app = express();

var highscores = [20];

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	next();
});

app.post('/hightscore', function (req, res) {
 
console.log(req);
console.log(req.query);
console.log(req.query.score);
  res.send('Hello World!');
});


app.get('/hightscore', function (req, res) {
  res.json(highscores);
});


app.listen(3000, function () {
  console.log('TEST');
});