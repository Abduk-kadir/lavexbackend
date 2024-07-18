const express=require('express')
const Porfarma=require('../modals/performaModal')
router=express.Router()
router.post('/porpharmaCreate',async(req,res)=>{
    let {type}=req.query;
    let js={...req.body,companyname:type}
    try{
     let porfarma=new Porfarma(js);
     await porfarma.save();
     res.send({
        message:"data is successfully added",
        success:true,
       
    
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