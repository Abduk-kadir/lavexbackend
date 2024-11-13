let express=require('express')
let Logs=require('../modals/logs/logs')
let router=express.Router()

router.get('/logs/:companyname',async(req,res)=>{
    try{
         let data=await Logs.find({companyname:req.params.companyname}).sort({timestamp:-1})
         res.send({
          message:'success',
          success:true,
          data:data,
  
         })
  
    }
    catch(err){
      res.send({
        message:err.message,
        success:false,
        data:null,
        
       })
  
  
  
    }
  })
  module.exports=router
  
  