var express = require('express');
var router = express.Router();
var PUB = require('../models/pubs')
/* GET home page. */

router.get('/',(req,res,next)=>{
    PUB
    .find()
    .sort({data:-1})
    .exec((err,doc)=>{
      if(!err){
        res.render('index.ejs',{pubs: doc})
      }
      else
      console.log('Erro: ' + err)
      res.send('Erro: ' + err)
    })
});


router.get('/receita',(req,res,next)=>{
    
    res.render('receita.ejs',{})
})

router.get('/reg_desp',(req,res)=>{
    res.render('reg_desp.ejs')
})

router.get('/evento',(req,res)=>{
    console.log('get de evento')
    res.render('evento.ejs')
})

router.get('/reg_form',(req,res)=>{
    res.render('reg_form.ejs')
})

router.get('/ideia',(req,res)=>{
    res.render('ideia.ejs')
})

router.get('/album',(req,res)=>{
    res.render('album.ejs')
})

router.get('/ev_cient',(req,res)=>{
    res.render('ev_cient.ejs')
})

router.get('/outro',(req,res)=>{
    res.render('outro.ejs')
})



router.post('/pub',(req,res)=>{
    var nova = new PUB({
        titulo: req.body.titulo,
        local: req.body.local,
        desc: req.body.desc,
        hora: req.body.hora,
        tipo: req.body.tipo
    })
    nova.save((err,resultado)=>{
        if(!err){
            console.log("Publicacao adicionada:"+req.body.titulo)
          }
          else{console.log("erro" + err)}
    })
    res.redirect('/')
})

module.exports = router;
