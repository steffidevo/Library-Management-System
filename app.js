const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database);

//On Connection
mongoose.connection.on('connected',()=>{
    console.log('Connected to database '+config.database);
});

mongoose.connection.on('error',(err)=>{
    console.log('Database Error '+config.database);
});

const app = express();

var index = require('./routes/index');
const users = require('./routes/users');
var books = require('./routes/books'); 



//Port Number
const port = 3000;

//CORS Miidleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);



//Index Route
/*app.get('/', (req,res)=>{
    res.send('Invalid Endpoint');
}); 

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});*/

//Start Server
app.listen(port, ()=>{
    console.log('Server started on port'+port);
});

/*-----------------------------------------*/
//View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended:false}));

app.use('/',index);
app.use('/api',books);
app.use('/api',users);
