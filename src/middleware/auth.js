const jwt =require('jsonwebtoken')
const Reports =require('../models/reports')
const auth =async(req,res,next)=>{
    try{
        const token =req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,'node-course')
        const reports = await Reports.findOne({_id:decode._id,'tokens.token':token})
        if(!reports)
        {
            throw new Error('error')
        }
        req.reports = reports
        req.token=token
    }
    catch(e){
        res.status(401).send({error:'please authenticate'})
    }
    next()
}

module.exports=auth