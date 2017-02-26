var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(express.static(__dirname + '/'));

/*app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});*/

app.listen(80, function () {
    console.log('Example app listening on port 80!');
});