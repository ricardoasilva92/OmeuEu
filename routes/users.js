var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
var passport = require('passport');  

let User = require('../models/users');

//register form
router.get('/register', function(req,res){
  res.render('register.ejs');
});

//register process
router.post('/register', function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Nome obrigatório').notEmpty();
  req.checkBody('email', 'Email obrigatório').notEmpty();
  req.checkBody('email', 'Email não válido').isEmail();
  req.checkBody('username', 'Username obrigatório').notEmpty();
  req.checkBody('password', 'Password obrigatória').notEmpty();
  req.checkBody('password2', 'Passwords não coincidem').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    console.log('erro ao registar user')
    for (i = 0; i < errors.length; i++) {
      req.flash('error',errors[i].msg)
    } 
    res.render('register.ejs')
  } else {
    let newUser = new User({
    name:name,
    email:email,
    username:username,
    password:password
  })

  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newUser.password, salt, function(err,hash){
      if(err){
        console.log(err);
      }
      newUser.password = hash;
      newUser.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success_msg','Está agora registado!')
          res.redirect('/users/login')
        }
      })
    }); 
  })
}
})

//login form
router.get('/login',function(req,res){
  res.render('login.ejs')
})

//login process
router.post('/login',function(req,res,next){
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'users/../login',
    failureFlash: true
  })(req,res,next);
})

//logout
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','Terminou a sessão!')
  res.redirect('/users/login')
})
module.exports = router;
