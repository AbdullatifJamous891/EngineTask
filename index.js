const express=require('express');
const bodyParser =require('body-parser');
const path = require('path');
const pg = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const appRouter = require('./routes/appRoutes');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret:'this is secret'}));

app.use('/', appRouter);


app.get('*', (req, res) => {
    res.send('hello world');
});

app.listen(process.env.PORT || port, ()=> {
    console.log(`your server is runing on port ${port}`);
});