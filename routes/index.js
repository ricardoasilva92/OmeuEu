var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req,res)=>{
  var db = req.db
  db.collection('publicacoes').find().toArray((err,publs)=>{
      if(!err){
          res.render('index.ejs',{pubs: publs})
      }
      else{
          console.log('Erro: ' + err)
          res.send('Erro: ' + err)
      }
  })
})

router.get('/receita',(req,res)=>{
    res.render('receita.ejs')
})

router.get('/reg_desp',(req,res)=>{
    res.render('reg_desp.ejs')
})

router.get('/evento',(req,res)=>{
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
  var db = req.db
  console.log(req.body)
  db.collection('publicacoes').save(req.body,(err,resultado)=>{
      if(!err){
          console.log('Registo gravado: '+resultado)
          res.redirect('/')
      }
      else{
          console.log('Erro: '+err)
          res.send('Erro ao gravar na BD :(')
      }
  })
})


module.exports = router;
