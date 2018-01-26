var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
var passport = require('passport');  

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
  /*var flag1 = false;
  var flag2 = false;

  User.find({username:username}).exec((err,doc)=>{
    if(!err){
      if(doc.length!=0){
        flag1 = true;
        console.log('usernameflag: '+flag1)
      }
    }
    else {
      console.log('erro ao checkar username')
    }
  })

  User.find({email:email}).exec((err,doc)=>{
    if(!err){
      if(doc.length!=0){
        var flag2 = true;
        console.log('emailflag: '+flag2)
      }
    }
    else {
      console.log('erro ao checkar email')
    }
  })*/

  req.checkBody('name', 'Nome obrigatório').notEmpty();
  req.checkBody('email', 'Email obrigatório').notEmpty();
  req.checkBody('email', 'Email não válido').isEmail();
  req.checkBody('username', 'Username obrigatório').notEmpty();
  req.checkBody('password', 'Password obrigatória').notEmpty();
  req.checkBody('password2', 'Passwords não coincidem').equals(req.body.password);

  let errors = req.validationErrors();

  //if(errors || flag1 || flag2){
    if(errors){
    console.log('erro ao registar user')
    for (i = 0; i < errors.length; i++) {
      req.flash('error',errors[i].msg)
    } 
    /*if(flag1){
      req.flash('error','Username já existente')
    }
    if(flag2){
      req.flash('error','Email já existente')
    }*/
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
          //console.log('user registado, uflag: '+flag1+' eflag: '+flag2)
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
          .exec((err,pubs)=>{
            res.render('user',{userAux:user, pubs:pubs}) //userAux para distinguir do user logado e do user do perfil
          })       
      }  
      else
      console.log('Erro: ' + err)          
  })
})
