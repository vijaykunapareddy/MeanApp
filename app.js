const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const config = require('./config/database');

const app = express();

mongoose.connect(config.database);

mongoose.connection.on('connected', ()=>{
  console.log('connect--->'+config.database);
});

mongoose.connection.on('error', (err)=>{
  console.log('Error --->'+err);
});

const users = require('./routes/users');

//port configuration
const port = 3000;

//cors configuration
app.use(cors());

//passport security
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users',users);

//Server configuration
app.listen(port, () => {
  console.log("Server started : "+port);
});

app.get('/', (req, res) => {
   res.send('Invalid endpoint');
});
