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
    var noMatch
    if(req.query.search){ 
        const regex = new RegExp(escapeRegex(req.query.search))
        
        PUB
        .find({desc: regex})
        .exec((err,doc)=>{
            console.log(regex)
            if(!err){
                PUB
                .find()
                .sort({hora:-1})
                .exec((err,totaldoc)=>{
                if(!err){
                    res.render('index.ejs',{pubs: doc,noMatch : noMatch, ind: totaldoc})
                }
                else
                console.log('Erro: ' + err)
                })
                
                if(doc.length==0){ // nao encontrou resultados
                    noMatch = "Não foram encontrados resultados. Por favor tente outra vez."
                }
            //res.render('index.ejs',{pubs: doc,noMatch : noMatch, ind: doc}) //noMatch como flag
        }
        else
        console.log('Erro: ' + err)
        })
    }
    else{ 
        PUB
        .find()
        .sort({hora:-1})
        .exec((err,doc)=>{
        if(!err){
            res.render('index.ejs',{pubs: doc,noMatch : noMatch, ind: doc})
        }
        else
        console.log('Erro: ' + err)
        })
    }   
});



//download de todas as publicações
//[LUIS] -> só o admin é que pode fazer isto
router.get('/download/pubs',(req,res,next)=>{
        if(req.user.name === 'admin'){        
        PUB
        .find()
        .sort({hora:-1})
        .exec((err,doc)=>{
        if(!err){
            var JSONResult = JSON.stringify(doc)
            fs.writeFile("./public/downloads/pubs.json", JSONResult, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                    var file = './public/downloads/pubs.json';
                    res.download(file);
                }
            });
    }
    else
    console.log('Erro: ' + err)
    })
    }
    else{
        console.log('ERRO: download não permitido')
        req.flash('danger','Não tem permissão')
        res.redirect('/')
    }
})

//download de todas as publicações de um utilizador em especifico
//[LUIS] -> só o user em questão é que pode fazer isto
router.get('/download/pubs/:user',(req,res,next)=>{
    if(req.user.username === req.params.user){
        PUB
        .find({username:req.params.user})
        .sort({hora:-1})
        .exec((err,doc)=>{
        if(!err){
            var JSONResult = JSON.stringify(doc)
            fs.writeFile("./public/downloads/pubs_" + req.params.user + ".json", JSONResult, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                    var file = './public/downloads/pubs_' + req.params.user +'.json';
                    res.download(file);
                }
            });
        }
        else
        console.log('Erro: ' + err)
        })
    }
    else{
    console.log('ERRO: download não permitido')
    req.flash('danger','Não tem permissão')
    res.redirect('/')
    }
})



//nova publicação
router.get('/newpub/:tipo', ensureAuthenticated, (req,res)=>{    
    var xtipo
    if(req.params.tipo==='evento')
        xtipo = 'Evento'
    if(req.params.tipo==='ideia')
        xtipo = 'Ideia'
    if(req.params.tipo==='viagem')
        xtipo = 'Viagem'
    if(req.params.tipo==='reg_desp')
        xtipo = 'Registo Desportivo'
    if(req.params.tipo==='reg_form')
        xtipo = 'Registo de Formação'
    if(req.params.tipo==='album')
        xtipo = 'Álbum Fotográfico'
    if(req.params.tipo==='receita')
        xtipo = 'Receita Culinária'
    if(req.params.tipo==='festividade')
        xtipo = 'Festividade'
    if(req.params.tipo==='outro')
        xtipo = 'Outro'

    res.render('newpub.ejs',{tipo:xtipo})
})

//editar publicacao
router.get('/pub/edit/:id',function(req,res){
    PUB
    .findOne({_id:req.params.id})
    .exec((err,pub)=>{
        if(!err){
        res.render('edit_event',{pub:pub})
        }
        else{
        res.render('error',{error:err})
        }
    })
    })

//mostrar publicação de um tipo
router.get('/pub/t/:tipo',function(req,res){
    var noMatch
    var xtipo

    if(req.params.tipo==='eventos')
        xtipo = 'Evento'
    if(req.params.tipo==='ideias')
        xtipo = 'Ideia'
    if(req.params.tipo==='regs_desp')
        xtipo = 'Registo Desportivo'
    if(req.params.tipo==='regs_form')
        xtipo = 'Registo de Formação'
    if(req.params.tipo==='albuns')
        xtipo = 'Álbum Fotográfico'
    if(req.params.tipo==='receitas')
        xtipo = 'Receita Culinária'
    if(req.params.tipo==='viagens')
        xtipo = 'Viagem'
    if(req.params.tipo==='evts_cient')
        xtipo = 'Participação em Evento Científico'
    if(req.params.tipo==='outro')
        xtipo = 'Outro'


    PUB
    .find({tipo:xtipo})
    .exec((err,pub)=>{
        if(!err){
            PUB
            .find()
            .sort({hora:-1})
            .exec((err,tdoc)=>{
            if(!err){
                res.render('index.ejs',{pubs: pub,noMatch : noMatch, ind: tdoc})
            }
            else
            console.log('Erro: ' + err)
            })
        }
        else{
        res.render('error',{error:err})
        }
    })
})

    

//mostrar uma publicação
router.get('/pub/show/:id',function(req,res){
var noMatch
    PUB
    .find({_id:req.params.id})
    .exec((err,pub)=>{
        
        if(!err){
            PUB
            .find()
            .sort({hora:-1})
            .exec((err,tdoc)=>{
            if(!err){
                res.render('index.ejs',{pubs: pub,noMatch : noMatch, ind:tdoc})
            }
            else
            console.log('Erro: ' + err)
            })
        }
        else{
        res.render('error',{error:err})
        }
    })
    })

    router.get('/pub/showChrono/:year',(req,res,next)=>{
        var noMatch
        var year = parseInt(req.params.year)
        var low = year+"-01-01T00:00:00.000Z"
        var high = (year+1)+"-01-01T00:00:00.000Z"
        
        PUB
        .find({
            hora: {
                "$gte": low,
                "$lt": high
            }
            })
        .exec((err,pub)=>{
            
            if(!err){
                PUB
                .find()
                .sort({hora:-1})
                .exec((err,tdoc)=>{
                if(!err){
                    res.render('index.ejs',{pubs: pub,noMatch : noMatch, ind:tdoc})
                }
                else
                console.log('Erro: ' + err)
                })
            }
            else{
            res.render('error',{error:err})
            }
        })
        })

        router.get('/pub/showChrono/:year/:month',(req,res,next)=>{
            var noMatch
            var year = parseInt(req.params.year)
            var month = parseInt(req.params.month)
            if(month<10)
                var low = year+"-0"+month+"-01T00:00:00.000Z"
            else
                var low = year+"-"+month+"-01T00:00:00.000Z"        
            var high = year+"-"+(month+1)+"-01T00:00:00.000Z"
            
            PUB
            .find({
                hora: {
                    "$gte": low,
                    "$lt": high
                }
                })
            .exec((err,pub)=>{
                
                if(!err){
                    PUB
                    .find()
                    .sort({hora:-1})
                    .exec((err,tdoc)=>{
                    if(!err){
                        res.render('index.ejs',{pubs: pub,noMatch : noMatch, ind:tdoc})
                    }
                    else
                    console.log('Erro: ' + err)
                    })
                }
                else{
                res.render('error',{error:err})
                }
            })
            })

//fazer UPDATE de publicacao
router.post('/pub/edit/:id', function(req,res){
    let pub={}
    if(req.body.titulo)
        pub.titulo=req.body.titulo
    if(req.body.local)
        pub.local=req.body.local
    if(req.body.desc)
        pub.desc=req.body.desc
    if(req.body.duracao)
        pub.duracao=req.body.duracao
    if(req.body.actividade)
        pub.actividade=req.body.actividade
    if(req.body.creditacao)
        pub.creditacao=req.body.creditacao
    if(req.body.priv)
        pub.priv=req.body.priv

    let query = {_id:req.params.id}

    PUB.update(query,pub,function(err){
        if(err){
            console.log(err)
            return
        }
        else {
            res.redirect('/')
        }
    })
})

router.post('/like/:id', function(req,res){  
    let query = {_id:req.params.id}
    let xpub = {}
    var flag = false
    PUB
    .findOne(query)
    .exec((err,pub)=>{
        pub.likes
        for(var i=0; i<pub.likes.length; i++){
            if(pub.likes[i]===req.user.username){
                flag = true
            }
        }
        if(!flag){
            pub.likes[pub.likes.length] = req.user.username
            PUB.update(query,pub,function(err){
                if(err){
                    console.log(err)
                    return
                } else {
                    res.redirect('/')
                }
            })
        } else {
            console.log('erro: like já registado')            
        }     
    })
})

//apagar publicacoes
router.delete('/pub/:id', function(req,res){
    let query = {_id:req.params.id}
    
    PUB.remove(query,function(err){
        if(err){
            console.log(err)
        }
        //responder ao request feito no main.js
        res.send('Success')
    })
})


//apagar todas as publicações
router.delete('/pub/', function(req,res){
    let query = {}
    if(req.user.name === 'admin'){
        PUB.remove(query,function(err){
            if(err){
                console.log(err)
            }
            //responder ao request feito no main.js
            res.send('Success')
        })
    }
})

//insercao de dados a partir de ficheiro
router.post('/insdb',(req,res,next)=>{
    var form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files){
        if(!err) {
            var oldpath = files.fichdados.path;
            var newpath = './public/downloads/' + files.fichdados.name;
            
            fs.rename(oldpath, newpath, function (err) {
                if(!err) {
                    fields.status = "Ficheiro recebido e guardado com sucesso."
                }
                else {
                    fields.status = "Ocorreram erros na gravação do ficheiro enviado"
                }
            })

                console.log("ANTES DE LER")
            //var obj = JSON.parse(fs.readFileSync(newpath, 'utf8'));
            fs.readFile(newpath, 'utf8', function (err,data) {
                if(err) throw err
                var obj = JSON.parse(data); 
                for(var i = 0; i < obj.length; i++) {
                    var nova = new PUB()
                        nova.titulo= obj[i].titulo
                        nova.local= obj[i].local
                        nova.desc= obj[i].desc
                        nova.hora= obj[i].hora
                        nova.tipo= obj[i].tipo
                        nova.username= obj[i].username
                        nova.autor= obj[i].autor
                        nova.duracao= obj[i].duracao
                        nova.creditacao= obj[i].creditacao
                        nova.actividade= obj[i].actividade
                        nova.likes = obj[i].likes
                        
                        nova.pic=[]
                        for(var j = 0; j<obj[i].pic.length; j++)
                            nova.pic[j]= obj[i].pic[j]
                        
                        nova.priv= obj[i].priv

                        nova.comentarios = []
                        for(var j = 0; j<obj[i].comentarios.length; j++)
                            nova.comentarios[j]= obj[i].comentarios[j]
                        
                    
                    nova.save((err,resultado)=>{
                        if(!err){
                            console.log("Publicacao adicionada:")
                          }
                          else{console.log("erro" + err)}
                    }) 
                }
            })
        }    
    res.redirect('/')
    })
})

//post de comentarios
router.post('/comment/:id',(req,res,next)=>{
    let query = {_id:req.params.id}
    PUB.findOne(query,function(err,pub){
        if(err){
            console.log(err,pub)
        }
        else {
            var d = new Date()
            var hora = d.toISOString()
            var comment = {
                autor: req.user.name,
                comentario: req.body.comment,
                hora: hora
            }
            pub.comentarios[pub.comentarios.length] = comment

            PUB.update(query,pub,function(err){
                if(err){
                    console.log(err)
                    return
                }
                else {
                    res.redirect('/')
                }
            })
        }
    })
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
        subtipo: req.body.subtipo,
        username: req.user.username,
        autor: req.user.name,
        duracao: req.body.duracao,
        creditacao: req.body.creditacao,
        actividade: req.body.actividade,
        pic: [],
        priv: req.body.priv,
        comentarios: [],
        likes: []
    })
    if(req.files){
        for(var i=0;i<req.files.length;i++){
            var novo = {
                id_img: req.files[i].filename,
                nome_img: req.files[i].originalname,
                img_path: req.files[i].path
            }   
            nova.pic[i] = novo 
        }
    }
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

//função que vai receber a query
function escapeRegex(text){
    return text.replace(/[-\]{}()*+?.,\\^$|#\s]/g,"\\$&")
}

module.exports = router;
