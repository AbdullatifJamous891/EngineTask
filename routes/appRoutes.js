const express = require('express');
const router = express.Router();
const pg = require('pg');

const config = {
    user: 'user3',
    database: 'Engindb',
    password: 'abed12',
    port: 5432
};
const pool = new pg.Pool(config);

router.post('/Login', (req, res, next) => {
   console.log('login post');
});

router.post('/Questions', (req, res, next) => {
   console.log('add post');
});

router.get('/Questions', (req, res, next) => {
   pool.connect(function (err, client, done) {
       if (err) {
           console.log("Can not connect to the DB" + err);
       }
       client.query('SELECT * FROM users', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('index', {users: result.rows});
            console.log('index', {users: result.rows});
       })
   })
});

module.exports = router;