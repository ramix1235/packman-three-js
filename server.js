const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const app = express();

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 80;

app.engine('ejs', engine);
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');
//app.set('views', path.resolve(__dirname, 'view'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});