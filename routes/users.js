var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
var passport = require('passport');  
var fs = require('fs')
var PUB = require('../models/pubs')
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
          if(err.message=="User validation failed: username: username")
              req.flash('danger','Username já registado')
          if(err.message=="User validation failed: email: email")
              req.flash('danger','E-mail já registado')

          res.redirect('/users/register')
        } else {
          req.flash('success_msg','Está agora registado!')
          res.redirect('/users/login')
        }
      })
    }) 
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


router.get('/p/:user',function(req,res){
  User
  .findOne({username:req.params.user})
  .exec((err,user)=>{
      if(!err){
          PUB
          .find({username:req.params.user}) 
          .sort({hora:-1})
          .exec((err,pubs)=>{
            res.render('user',{userAux:user, pubs:pubs}) //userAux para distinguir do user logado e do user do perfil
          })       
      }  
      else
      console.log('Erro: ' + err)          
  })
})


router.get('/download',(req,res,next)=>{
  User
  .find()
  .exec((err,doc)=>{
  if(!err){
      var JSONResult = JSON.stringify(doc)
      fs.writeFile("./public/downloads/users.json", JSONResult, function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
              var file = './public/downloads/users.json';
              res.download(file);
          }
      });
  }
  else
  console.log('Erro: ' + err)
  })
})
