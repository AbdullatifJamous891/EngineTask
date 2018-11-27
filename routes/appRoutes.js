const express = require('express');
const router = express.Router();
const pg = require('pg');
const session = require('express-session');

const config = {
    user: 'user3',
    database: 'Enginedb',
    password: 'abed12',
    port: 5432
};
const pool = new pg.Pool(config);

router.post('/signup', (req, res, next) => {
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

router.post('/login', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please pass username and password.'})
  }else{
    pool.connect( (err, client, done)=>{
      if(err){
        res.json({success:false, msg:"can not connect to the DB" + err})
      }else{
        client.query('SELECT * FROM users WHERE "username"=$1', [req.body.username], (err, user)=>{
          if(err){
             res.json({success: false, msg: err })
          }else{
            if(user.rows.length === 0){
              res.json({ success: false, msg: 'Inter a valid username..'})
            }else if(user.rows[0].password === req.body.password){
              req.session['username'] = user.rows[0].username;
              req.session['userId'] = user.rows[0].id;
              res.json({success: true, msg: 'Successful created new session.'});
            }else{
              res.json({success: false, msg: 'Inter a correct password..'});
            }
          }
        })
      }
    })
  }
});

router.get('/questions', (req, res, next) => {
  
  pool.connect(function (err, client, done) {
       if (err) {
           res.json({success:false, msg:"can not connect to the DB" + err})
       }
       client.query('SELECT * FROM questions', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.json({success: true, msg: result.rows})
        })
   })
});

router.post('/questions', (req, res, next) => {
   pool.connect((err, client, done)=> {
     if(err) {
      console.log("Can not connect to the DB" + err);
     }
     client.query('INSERT INTO questions("username","question") VALUES($1,$2)',[req.session.username,req.body.question], (err, res)=>{
      if (err) {
       return res.json({success: false, msg: 'can not insert question'})
    } else {
       res.json({success: true, msg: 'Add question successfully..'})
    }
     })
   })
});

module.exports = router;