const mongoose =require('mongoose')
const validator =require('validator')
const bcrypt=require('bcryptjs')
const newsSchema =new mongoose.Schema({ 
    description:{
    type:String,
    required:true,
    trim:true
},
title:{
    type:String,
    required:true,
},
avatar:{
    type:Buffer
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
}
})
const News =mongoose.model('News',newsSchema)
module.exports =News