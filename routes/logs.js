let express=require('express')
let Logs=require('../modals/logs/logs')
let router=express.Router()

router.get('/logs',async(req,res)=>{
    try{
         let data=await Logs.find().sort({timestamp:-1})
         res.send({
          message:'success',
          data:data,
  
         })
  
    }
    catch(err){
      res.send({
        message:err.message,
        data:null,
        
       })
  
  
  
    }
  })
  module.exports=router
  
  