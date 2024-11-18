const express=require('express')
const Porfarma=require('../modals/performaModal')
const {ProductionStore}=require('../modals/store/productionStore')
const Company=require('../modals/companyModal')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
const router = require('./dropdownRoute')
router.delete('/porpharmaUpdate/:id',async(req,res)=>{
    try{
        await Porfarma.findByIdAndUpdate(req.params.id,{runValidators: true })
        res.send({
            message:"data is successfully updated",
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


router.delete('/porpharmaDelete/:id',async(req,res)=>{
    try{
        await Porfarma.findByIdAndDelete(req.params.id)
        res.send({
            message:"data is successfully deleted",
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







router.post('/porpharmaCreate',async(req,res)=>{
   //here type is company id
    let {type,role}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}

    try{
        let data=await Porfarma.find({companyname:type})
        let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
        max=max+1;
        js.mov=max;
        let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
        js.total=total
    
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