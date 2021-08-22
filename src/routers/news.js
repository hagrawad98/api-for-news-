const express =require('express')
const router=new express.Router()
const News =require('../routers/news')
const auth =require('../middleware/auth')
router.post('/news',auth,async(req,res)=>{
    const news =new News({...req.body,owner:req.news._id})
    try{
       await news.save()
       res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.get('/news/:id',auth,async(req,res)=>{
const _id =req.params._id
try
{
    const news =await News.findOne({_id,owner:req.news._id})
   if(!news)
   {
       return res.status(404).send('news not found')
   }
        res.status(200).send(news)
}
    catch(e){
        res.status(400).send(e)
    }
})
router.get('/news',auth,async(req,res)=>{
    try{
        await req.news.populate('news').execPopulate()
        res.send(req.reports.news)
    }
    catch(e){
        res.status(500).send(e)
    }
})
 router.patch('/news/:id',auth,async(req,res)=>{
    const _id =req.params._id 
    const updates=Object.keys(req.body)
    try
{
    const news =await News.findOne({_id,owner:req.news._id})
   if(!news)
   {
       return res.status(404).send('news not found')
   }
           updates.forEach((update)=>news[update]=req.body[update])
           await news.save()
            res.send(news)
}
    catch(e){
        res.status(400).send(e)
    }
})
router.delete('/news/:id',auth,async(req,res)=>{
    const __id=req.params.id
    try{
        const news=await News.findOneAndDelete(__id)
        if(!news){
            return res.send('news is not  found')
        }
        res.send(task)
    }
    catch(e){
        res.send('error')
    }
})
module.exports=router