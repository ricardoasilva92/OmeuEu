var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PicSchema = new Schema(
    {
        id_img: {type:String,required:true},
        nome_img: {type:String,required:true},
        img_path: {type:String,required:true}
    }
)


var PubSchema = new Schema(
    {
        titulo: {type:String, required:true},
        local: {type:String, required:false},
        desc: {type:String,required:true},
        hora: {type:String,required:true},
        tipo: {type:String,required:false},
        pic: [PicSchema]

    }
)

module.exports=mongoose.model('PUB',PubSchema,'pubs')