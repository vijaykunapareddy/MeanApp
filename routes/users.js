const express = require('express');
const routers = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config/database');

routers.post('/register', (req, res, next) => {
    let newUser = new User({
      name : req.body.name,
      email : req.body.email,
      username : req.body.username,
      password : req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({succes : false, msg : 'Failed creation of user'});
        } else {
          console.log('Node-------------------->'+JSON.stringify(newUser, null, 4));
          console.log('Node-------------------->'+JSON.stringify(user, null, 4));
          res.json({success : true, msg : 'Success creation of user'});
        }
    });
});

routers.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});


routers.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


routers.get('/validate', (req, res, next) => {
  res.json({user: req.user});
});

module.exports = routers;
