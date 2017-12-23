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
    .sort({hora:-1})
    .exec((err,doc)=>{
      if(!err){
        res.render('index.ejs',{pubs: doc})
      }
      else
      console.log('Erro: ' + err)
    })
});



router.get('/receita', ensureAuthenticated, (req,res)=>{
    res.render('receita.ejs')
})

router.get('/reg_desp', ensureAuthenticated, (req,res)=>{
    res.render('reg_desp.ejs')
})

router.get('/evento', ensureAuthenticated,(req,res)=>{
    res.render('evento.ejs')
})

router.get('/reg_form', ensureAuthenticated,(req,res)=>{
    res.render('reg_form.ejs')
})

router.get('/ideia', ensureAuthenticated,(req,res)=>{
    res.render('ideia.ejs')
})

router.get('/album', ensureAuthenticated,(req,res)=>{
    res.render('album.ejs')
})

router.get('/ev_cient', ensureAuthenticated,(req,res)=>{
    res.render('ev_cient.ejs')
})

router.get('/outro', ensureAuthenticated,(req,res)=>{
    res.render('outro.ejs')
})


router.post('/pub',upload.any(),(req,res,next)=>{
   // console.log(req.body)
    //console.log(req.files)
    //console.log(req.files.length)
    

    
  
    var nova = new PUB({
        titulo: req.body.titulo,
        local: req.body.local,
        desc: req.body.desc,
        hora: req.body.hora,
        tipo: req.body.tipo,
        autor: req.user.username,
        pic: []
    })
    if(req.files){
    for(var i=0;i<req.files.length;i++){
        var novo = {
            id_img: req.files[i].filename,
            nome_img: req.files[i].originalname,
            img_path: req.files[i].path
            
        }   
        nova.pic[i] = novo 
    }}
    console.log(nova)
        
    
    nova.save((err,resultado)=>{
        if(!err){
            console.log("Publicacao adicionada:"+req.body.titulo)
          }
          else{console.log("erro" + err)}
    }) 
    res.redirect('/')
})

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger','Não está autenticado. Por favor, faça login')
        res.redirect('/users/login')
    }
}

module.exports = router;
