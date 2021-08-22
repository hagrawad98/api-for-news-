const mongoose =require('mongoose')
const validator =require('validator')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const Reports =require('../routers/reports')
const reportsSchema =new mongoose.Schema({ 
    name:{
    type:String,
    required:true,
    trim:true
},
age:{
    type:Number,
    defult:20
},
email:{
    type:String,
    trim:true,
    required:true,
    lowercase:true,
    unique:true
},
password:{
    type:String,
    required:true,
    trim:true,
   minlength:6
},
tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
],
avatar:{
    type:Buffer
}

})
reportsSchema.virtual('reports',{
    ref:'Report',
    localField:'_id',
    foreignField:'owner'
})
reportsSchema.pre('save',async function(next){
const reports=this
if(reports.isModified('password')){
    reports.password=await bcrypt.hash(reports.password,8)
}
next()
})
reportsSchema.statics.findByCredentials=async(email,password)=>{
    const reports=await Report.findOne({email})
    if(!reports){
        throw new Error('unable to login')
    }
    const isMatch =await bcrypt.compare(password,reports.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return reports
}
reportsSchema.methods.generateToken=async function(){
    const reports =this
    const token =jwt.sign({_id:reports._id.toString()},'node-course')
    user.tokens=reports.tokens.concat({token:token})
    await reports.save()
    return token
}
const Report =mongoose.model('Report',reportsSchema)
module.exports =Reports