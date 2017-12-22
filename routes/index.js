var express = require('express');
var router = express.Router();
var fs = require('fs')
var PUB = require('../models/pubs')
var formidable = require('formidable')
var multer  = require('multer')



//filtro das imagens upload
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  }
})

 
  var upload = multer({ dest: './public/images' ,fileFilter: imageFilter, storage: storage})

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
    })
});



router.get('/receita',(req,res,next)=>{
    
    res.render('receita.ejs')
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



router.post('/pub',upload.single('pic1'),(req,res,next)=>{
    console.log('FIELDNAME  ' + req.file.fieldname)
    console.log('ORIGINAL NAME  ' + req.file.originalname)
    console.log('path do ficheiro' + req.file.path)
    var nova = new PUB({
        titulo: req.body.titulo,
        local: req.body.local,
        desc: req.body.desc,
        hora: req.body.hora,
        tipo: req.body.tipo,
        pic1: {id_img:req.file.filename , nome_img:req.file.originalname, img_path:req.file.path}
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
