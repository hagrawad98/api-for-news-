const express =require('express')
const router=new express.Router()
const Reports =require('../routers/reports')
const auth = require('../middleware/auth')
const multer = require('multer')
router.post('/reports', async(req,res)=>{
    const reports =new Reports(req.body)
    try{
   await reports.save()
   const token=await reports.generateToken()
   res.status(200).send({reports,token})
    }
    catch(e){
        res.status(400).send('error ' + e)
    }})
router.get('/reports',auth,(req,res)=>
{
    Reports.find({}).then((reports)=>{
        res.status(200).send(reports)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
router.get('/reports/:id',auth,(req,res)=>{
    console.log(req.params.id)
    const __id=req.params.id
    Reports.findById(__id).then((reports)=>
    {
if(!reports){
    return res.status(400).send('reports not find')
}
res.status(200).send(reports)
    }).catch((e)=>{
        res.status(500).send('unable to connect database'+e)
    })
})
router.patch('/reports/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const __id=req.params.id
    try{
        const reports=await Reports.findById(__id)
        updates.forEach((update)=>
        reports[update]=req.body[update])
        await reports.save()
        if(!reports){
            return res.send('no reports is found')
        }
        res.status(200).send(reports)
    }
    catch(e){
        res.status(400).send('error')
    }
})

router.delete('/reports/:id',async(req,res)=>{
    const __id=req.params.id
    try{
        const reports=await Reports.findByIdAndDelete(__id)
        if(!reports){
            return res.send('no reports is found')
        }
        res.send(reports)
    }
    catch(e){
        res.send('error')
    }
})
router.post('/reports/login',auth,async(req,res)=>{
    try{
        const reports =await Reports.findByCredentials(req.body.email,req.body.password)
        const token=await reports.generateToken()
        res.send({reports,token})
    }
    catch(e){
        res.send('try again'+e)
    }
})
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reports.tokens=req.reports.tokens.filter((el)=>{
            return el.token !==req.token
        })
    await req.reports.save()
    res.send('success')}
    catch(e){
res.send(e)
    }
})
router.delete('/logoutall',auth,async(req,res)=>{
    try{
        req.reports.tokens=[]
        await req.reports.save()
        res.send('success')
    }
    catch(e){
        res.send(e)
            }
        })
        const uplpoad =multer({
            limits:{
                fileSize:1000000
            },
            fileFilter(req,file,cb){
                if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
                    return cb(new Error('please upload an image'))
                }
                cb(null,true)
            }
            }
        )
        router.post('/profile/avatar',auth,uplpoad.single('image'),async(req,res)=>{
            try{
                req.reports.avatar=req.file.buffer
                await req.reports.save()
                res.send('image uploaded')
            }
            catch(e){
                res.send(e)
            }
        })
module.exports=router