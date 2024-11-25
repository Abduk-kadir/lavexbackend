const express=require('express')
const Porfarma=require('../modals/performaModal')
const {ProductionStore}=require('../modals/store/productionStore')
const Company=require('../modals/companyModal')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
const router = require('./dropdownRoute')
const Logs=require('../modals/logs/logs')
router.delete('/porpharmaUpdate/:id/:companyname',async(req,res)=>{
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


router.delete('/porpharmaDelete/:id/:companyname',async(req,res)=>{
    try{
       let rs=await Porfarma.findByIdAndDelete(req.params.id)
        let itmnamearr=rs.item.map(elem=>elem.name)
        let itmqtyarr=rs.item.map(elem=>elem.quantity)
        let str=`Profarman no ${rs.mov}  and that have item ${itmnamearr.join(',')} and quantity is ${itmqtyarr.join(',')} is deleted `
        let j={companyname:rs.companyname,itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Porfarma"}
        console.log(j)
        let log=new Logs(j) 
        await log.save()
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
     //for log
     let itmnamearr=item.map(elem=>elem.name)
     let itmqtyarr=item.map(elem=>elem.quantity)
     let str=`Profarma for client ${req.body.clientDetail.client} created and item is ${itmnamearr.join(',')} and quantity is ${itmqtyarr.join(',')} `
     let j={companyname:type,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Profarma"}
     console.log(j)
     let log=new Logs(j) 
     await log.save()
    //here ending







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