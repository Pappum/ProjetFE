var express = require('express');
var app = express();
var path = require('path');

var highscores = [800, 600, 550, 450];

app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	next();
});

app.use(express.static(path.resolve(__dirname, "..")));

app.post('/highscore', function (req, res) {

  	var score = +req.query.score;
  	highscores.push(score);

  	highscores.sort(function(a, b) {
    	return b - a;
	});

  res.send('ok');
});


app.get('/highscore', function (req, res) {
  res.json(highscores);
});


app.listen(3000, function () {
  console.log('script');
});