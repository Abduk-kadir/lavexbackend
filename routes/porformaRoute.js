const express=require('express')
const Porfarma=require('../modals/performaModal')
const {ProductionStore}=require('../modals/store/productionStore')
const Company=require('../modals/companyModal')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
router=express.Router()
router.post('/porpharmaCreate',async(req,res)=>{
   //here type is company id
    let {type,role}=req.query;
    let {item}=req.body
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
        })

    }
})


module.exports=router