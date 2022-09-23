const express = require("express");
const app = express();

const crypto = require('crypto');

const fs = require('fs');
const path = require("path")

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}


console.log("--------------start debugging------------")
//print all stuff on root directory
// fs.readdir("/", (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// });
// console.log(getAllFiles("/app"))
console.log(getAllFiles("/secrets"))
console.log("--------end debugging-----------")


const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var http = require('http');
var https = require('https');
// var privateKey = process.env.PRIVATE_KEY;
// var certificate = process.env.CERT;
var privateKey  = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
var certificate = fs.readFileSync(process.env.CERT, 'utf8');
var credentials = {key: privateKey, cert: certificate};

var helmet = require('helmet')
app.use(helmet())

const cors = require('cors');
app.use(cors({
    origin: "*"
}));

app.use(bodyParser.json())//support json body
app.use(bodyParser.urlencoded({extended: true}))//support

app.set('view engine', 'ejs');

const csp = require(`helmet-csp`)

app.use((req,res,next) => {
  res.locals.URL = process.env.url

  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  // res.set('Content-Security-Policy', "script-src 'nonce-" + nonce + "'")
  next()
})

app.use(csp({
  directives: {
    defaultSrc: [`'self'`,'fonts.googleapis.com',
              "*.google-analytics.com"],
    scriptSrc: [`'self'`, "*.googletagmanager.com",(req, res) => `'nonce-${ res.locals.nonce }'`],
    fontSrc:["'self'",'fonts.gstatic.com', "fonts.cdnfonts.com", "cdnjs.cloudflare.com"],
    styleSrc: ["'self'", "fonts.cdnfonts.com", "cdnjs.cloudflare.com"]
  }
}))

//this is gonna be for the landing page and stuff
app.use(express.static("public/interface"));
app.use(express.static("public/resume"));//yeaaa

var trollSchema = mongoose.Schema({
  _id: String,
  image: String,
  video: String,
  title: String,
  redirect: String,
  url: String,
  desc: String,
  siteName: String
});

var TrollModel = mongoose.model('Troll', trollSchema)

app.get('/troll/:id', (req,res) =>{
  var id = req.params.id

  TrollModel.findById(id, (err, data) => {
    console.log("fetching data: error + " + err +", data: " + data)
    if(data == null){
      res.render("test")
    }else{
      res.render('troll', {redirect:data.redirect,
        title:data.title,
        url:data.url, 
        image:data.image, 
        desc:data.desc, 
        // color:data.color, 
        video:data.video,
        siteName:data.siteName});
    }
  });

})

app.post('/api/troll/addConfig',(req, res) =>{
  console.log("dababy")
  //setup vars
  var title = req.body.title;
  var redirect = req.body.redirect;
  var url = req.body.url;
  var image = req.body.image;
  var desc = req.body.desc;
  // var color = req.body.color;
  var video = req.body.video;
  var siteName = req.body.siteName;

  var id = uuid.v4();

  var data = {}

  data.image = image;
  data.video = video;
  data.title = title;
  data.redirect = redirect;
  data.url = url;
  data.desc = desc;
  // data.color = color;
  data.siteName = siteName;

  var pissBabyTrollDatabase = new TrollModel({
    _id: id,
    image : image,
    video : video,
    title : title,
    redirect : redirect,
    url : url,
    desc : desc,
    // data.color = color;
    siteName : siteName
  })
  console.log("before save")
  pissBabyTrollDatabase.save((err) => {
    console.log("error: " + err)
  })
  console.log("saved to databse supposdely")
  //res.render('trollInterface', {result:process.env.HOSTNAME+'troll/'+id})
  var resultThing = {result:process.env.HOSTNAME+'troll/'+id}
  console.log(resultThing)
  res.json(resultThing)
})

app.get('/troll', (req,res) =>{
  res.render('trollInterface')
})

app.get('/freeram', (req,res) =>{
  res.render('freeRam');
})


// set up plain http server
var http = express();
// set up a route to redirect http to https
http.get('*', function(req, res) {  
    // res.redirect('https://' + req.headers.host + req.url);
    // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
    res.redirect('https://davidpineiro.xyz' + req.url);
})
// have it listen on 8080
http.listen(80);

var httpsServer = https.createServer(credentials, app).listen(443);

console.log("v1.0.2")
console.log("Your app is listening on port " + httpsServer.address().port)
let DB_USERNAME = process.env.DB_USERNAME;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_DATABASE = process.env.DB_DATABASE;
let mongoString = 'mongodb://' + DB_USERNAME + ':' +DB_PASSWORD + '@davidpineiro.xyz/' + DB_DATABASE;
// console.log(DB_USERNAME, DB_PASSWORD, DB_DATABASE, mongoString);
var client = mongoose.connect(mongoString,
    (errMaybe) =>{
      console.log("mongodb error:" + errMaybe)
    }).then(() => {
      console.log("mongodb connection status: " + client.readyState)
    });