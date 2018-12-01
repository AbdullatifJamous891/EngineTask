const express=require('express');
const bodyParser =require('body-parser');
const path = require('path');
const pg = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const appRouter = require('./routes/appRoutes');

const app = express();
const port = 3000;

//connects the server with client side


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret:'this is secret'}));

app.use(express.static('react-engine/build'));

app.use('/', appRouter);


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'react-engine', 'build', 'index.html'));
});


app.listen(process.env.PORT || port, ()=> {
    console.log(`your server is runing on port ${port}`);
});