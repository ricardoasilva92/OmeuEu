var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PicSchema = new Schema(
    {
        id_img: {type:String,required:true},
        nome_img: {type:String,required:true},
        img_path: {type:String,required:true}
    }
)

var PubCommentsSchema = new Schema({
    autor:{type:String,required:false},
    comentario:{type:String,required:false},   
    hora: {type:String,required:true}    
})


var PubSchema = new Schema(
    {
        titulo: {type:String, required:true},
        local: {type:String, required:false},
        desc: {type:String,required:true},
        hora: {type:String,required:true},
        tipo: {type:String,required:false},
        subtipo: {type:String,required:false},
        username:{type:String,required:false},
        autor:{type:String,required:false},
        duracao:{type:String,required:false},
        creditacao:{type:String,required:false},
        actividade:{type:String,required:false},
        pic: [PicSchema],
        priv:{type:String,required:true},
        comentarios:[PubCommentsSchema],
        likes:[{type:String,required:true}]
    }
)
module.exports=mongoose.model('PUB',PubSchema,'pubs')