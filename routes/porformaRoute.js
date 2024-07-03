const express=require('express')
const Porfarma=require('../modals/performaModal')
router=express.Router()
router.post('/porpharmaCreate',async(req,res)=>{
    try{
     let body=req.body;
    
     let porfarma=new Porfarma(body);
     await porfarma.save();
     res.send({
        message:"data is successfully added",
        success:true,
        data:body
    
     })
          

    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null


        })

    }
})
module.exports=router