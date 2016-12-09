var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'swaaaaaathii',
    database: 'swaaaaaathii',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'teddy-boo',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
    var name = data.name;
    var date = data.date;
    var phno = data.phno;
    var email = data.email;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${name}
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
              <div align = "center">
                <a href="/review">Write a review</a>
                <a href="/logout">Log Out</a>
                <div><br/><br/>
                    <input type="text" id="bname" placeholder="Search for..."/>
                    <input type="button" id="search_btn" value="Search"/>
                    <script type="text/javascript" src="/ui/search.js"></script>
                </div>
              </div>
              <br/><br/>
              <br/><br/>
              <hr style="width: 600px"/>
              <div class="udetails">
                  <br/><br/>
                  Name : 
                  ${name}
                  <br/><br/><br/>
                  Birthday : 
                  ${date.toDateString()}
                  <br/><br/><br/>
                  Contact Number : 
                  ${phno}
                  <br/><br/><br/>
                  Email ID : 
                  ${email}
                  <br/><br/><br/>
              </div>
              <hr style="width: 600px"/>
        </script>
      </body>
    </html>
    `;
    return htmlTemplate;
}

function createViewTemplate (data) {
    var book_name = data.book_name;
    book_name = book_name.split('-').join(' ');
    var book_genre = data.book_genre;
    var review = data.book_review;
    
    var htmlTemplate = `
    <html>
      <head>
          <title>
              Review
          </title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/ui/style.css" rel="stylesheet" />
      </head> 
      <body>
          <div class="review">
            <div>
              <button onclick="goBack()">Go Back</button>
                <script>
                function goBack() {
                    window.history.back();
                }
                </script>
                <input type="button" value="Next" id="next"/>
                <script type="text/javascript" src="/ui/viewresult.js"></script>
            </div>
              <hr/>
              <h3>
                  ${book_name}
              </h3>
              <div>
                 Book Genre : ${book_genre}
              <br/><br/>
                 Review : ${review}
              </div>
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/review',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'review.html'));
});

function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/sign-up',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'sign-up.html')); 
});

app.post('/create-review', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
   var book_name = req.body.book_name;
   book_name = book_name.split(' ').join('-');
   var book_genre = req.body.book_genre;
   var review = req.body.review;
   var uid = req.session.auth.userId;
   pool.query('INSERT INTO review (uid,book_name,book_genre,book_review) VALUES ($1, $2, $3, $4)', [uid, book_name, book_genre, review], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      }else{
         res.send('Review posted');
      }
   });
    } else {
       res.status(400).send('You are not logged in');
   }
});

app.post('/create-user', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   var name = req.body.name;
   var date = req.body.date;
   var phno = req.body.phno;
   var email = req.body.email;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   var id;
   pool.query('INSERT INTO "user" (username,password,name,date,phno,email) VALUES ($1, $2, $3, $4, $5, $6)', [username, dbString, name, date, phno, email], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      }else{
         res.send('User details successfully created: ' + username);
      }
   });
});
   


app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('Username does not exist');
          } else {
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); 
              if (hashedPassword === dbString) {
                req.session.auth = {userId: result.rows[0].id};
                res.send('credentials correct!');  
              } else {
                res.status(402).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

app.get('/user/:username', function(req, res){
   if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query('SELECT * FROM "user" WHERE username = $1',[req.params.username], function (err, result){
           if (err) {
              res.status(500).send(err.toString());
           } else {
              var userdata = result.rows[0];
              res.send(createTemplate(userdata));  
           }
       });
   } else {
       res.status(400).send('<html><body>You are not logged in<br/><br/><a href="/">Login</a></body></html>');
   } 
});

app.get('/view-reviews/:bookname',function (req,res){
    if (req.session && req.session.auth && req.session.auth.userId) {
       pool.query('SELECT * FROM review WHERE lower(book_name) = $1',[req.params.bookname], function (err, result){
           if (err) {
              res.status(500).send(err.toString());
           } else {
               if(result.rows.length === 0){
                    res.send(`<html><body>No results found<br/><br/><button onclick = "goBack()">Go Back</button><script>function goBack() {
                            window.history.back();
                        }</script></body></html>`)
               } else {
              var no_of_reviews = result.rows.length-1;
              var bname = req.params.bookname;
              var htmllink = '/view-reviews/' + bname + '/'+ no_of_reviews;
              var htmlstring = `<html><body><a href=${htmllink}>View reviews</a><br/><br/><button onclick = "goBack()">Go Back</button><script>function goBack() {
                            window.history.back();
                        }</script></body></html>`;
              res.send(htmlstring);  
           }
         }
       });
   } else {
       res.status(400).send('<html><body>You are not logged in<br/><br/><a href="/">Login</a></body></html>');
   } 
});


app.get('/view-reviews/:bookname/:rno',function(req,res){
       if (req.session && req.session.auth && req.session.auth.userId) {
       var rno=req.params.rno;
       pool.query('SELECT * FROM review WHERE lower(book_name) = $1',[req.params.bookname], function (err, result){
           if (err) {
              res.status(500).send(err.toString());
           } else { 
              var userdata = result.rows[rno];
              res.send(createViewTemplate(userdata));  
           }
       });
   } else {
       res.status(400).send('<html><body>You are not logged in<br/><br/><a href="/">Login</a></body></html>');
   } 
});

app.get('/get-comments/:bookname', function (req, res) {
   pool.query('SELECT comment.*, "user".username FROM review, comment, "user" WHERE lower(review.book_name) = $1 AND review.id = comment.review_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.bookname], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:bookname/:rno', function (req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        var rno = req.params.rno;
        pool.query('SELECT * from review where lower(book_name) = $1', [req.params.bookname], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(401).send('Review not found');
                } else {
                    var r_no = result.rows.length - rno - 1;
                    var reviewId = result.rows[r_no].id;
                    pool.query(
                        "INSERT INTO comment (comment, review_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, reviewId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

var pool = new Pool(config);

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
