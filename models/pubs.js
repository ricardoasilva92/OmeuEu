var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PubSchema = new Schema(
    {
        titulo: {type:String, required:true},
        local: {type:String, required:false},
        desc: {type:String,required:true},
        hora: {type:String,required:true},
        tipo: {type:String,required:false},
        pic1: {id_img:String,nome_img:String,img_path:String}

    }
)

module.exports=mongoose.model('PUB',PubSchema,'pubs')