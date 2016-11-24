var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user : 'swaaaaaathii',
    database : 'swaaaaaathii',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

/*var articles = {
    'article-one': {
        title : 'Article One|Swathi Nagarajan',
        heading: 'Article One',
        date : '24-Oct-2016',
        content : `<p>
                        This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.
                    </p>
                    <p>
                        This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.
                    </p>
                    <p>
                        This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.This is the content of article one.
                    </p>`
    },
    'article-two': {
        title : 'Article Two|Swathi Nagarajan',
        heading: 'Article Two',
        date : '25-Oct-2016',
        content : `<p>
                        This is the content of article two.
                   </p>`
    },
    'article-three': {
        title : 'Article Three|Swathi Nagarajan',
        heading: 'Article Three',
        date : '25-Oct-2016',
        content : `<p>
                        This is the content of article three.
                   </p>`
    }
};

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width-device-width,initial-scale=1"/>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                <div>
                  ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}*/

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.post('/create-user',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password, salt);
    pool.query('INSERT into "user" (username,password) values ($1,$2)', [username,dbstring], function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send('User successfully created : ' + username);
        }
    });
});

app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * from "user" WHERE username = $1', [username], function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.send(402).send('Invalid username');
            }else{
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword === dbString){
                    res.send('Credentials correct!');  
                }else{
                    res.send(403).send('Invalid username/password');
                }
            }
        }
    });
});



/*app.get('/:articleName',function (req,res){
   var articleName = req.params.articleName;
   res.send(createTemplate(articles[articleName])); 
});
*/
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
