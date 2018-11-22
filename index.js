const express=require('express');
const bodyParser =require('body-parser');
const path = require('path');
const pg = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret:'this is secret'}));

const config = {
    user: 'user3',
    database: 'Enginedb',
    password: 'abed12',
    port: 5432
};
const pool = new pg.Pool(config);



//app.use('/', appRouter);
app.post('/signup', (req, res, next) => {
	console.log('aaaa',req.body)
	//var uname = req.body.username;
	//var pwd = bcrypt.hash(req.body.password, 5);
	
	if (!req.body.username || !req.body.password) {
	    res.json({success: false, msg: 'Please pass username and password.'})
	}else{
		pool.connect( (err, client, done)=>{
			if(err){
				console.log("can not connect to the DB" + err)
			}else{
				client.query('INSERT INTO users("username", "password") VALUES($1,$2)', [req.body.username,req.body.password], (err, result)=>{
					if(err){
					  return res.json({success: false, msg: 'Username already exists.'})
					}else{
					   res.json({success: true, msg: 'Successful created new user.'})
					}
				})
			}
		})
	}
});

app.post('/login', (req, res, next) => {
	if (!req.body.username || !req.body.password) {
	    res.json({success: false, msg: 'Please pass username and password.'})
	}else{
		pool.connect( (err, client, done)=>{
			if(err){
				console.log("can not connect to the DB" + err)
			}else{
				client.query('SELECT id,username,password FROM users WHERE "username"=$1', [req.body.username], (err, user)=>{
					if(err){
					  return res.json({success: false, msg: 'Username does not exist.'})
					}else{
						console.log('uuuuser',user.rows[0].password)
						if(user.rows[0].password === req.body.password){
							req.session['username'] = user.rows[0].username;
							req.session['userId'] = user.rows[0].id;
							res.json({success: true, msg: 'Successful created new session.'});
						}else{
							res.json({success: false, msg: 'faild created new session.'});
						}
					}
				})
			}
		})
	}
})
app.get('/questions', (req, res, next) => {
	
	pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('SELECT question, answer FROM questions', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.json({success: true, msg: result.rows})
        })
   })
});

app.post('/questions', (req, res, next) => {
   pool.connect((err, client, done)=> {
   	 if(err) {
   	 	console.log("Can not connect to the DB" + err);
   	 }
   	 client.query('INSERT INTO questions(id,"question") VALUES($1,$2)',[req.session.userId,req.body.question], (err, res)=>{
   	 	if (err) {
		   return res.json({success: false, msg: 'can not insert question'})
		} else {
		   done()
		   res.json({success: true, msg: 'Add question successfully..'})
		}
   	 })
   })
});

app.get('*', (req, res) => {
    res.send('hello world');
});

app.listen(process.env.PORT || port, ()=> {
    console.log(`your server is runing on port ${port}`);
});