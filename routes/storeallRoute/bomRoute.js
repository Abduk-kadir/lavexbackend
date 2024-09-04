let express=require('express')
let router=express.Router()
const BillOfMaterial = require('../../modals/store/bomModal');
const authMidd=require('..//../middleware/authmiddleware')
router.put('/updatingBom/:id',async(req,res)=>{
    try{
        let js=await BillOfMaterial.findByIdAndUpdate(req.params.id,req.body)
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



router.delete('/delBom/:id',async(req,res)=>{
    try{
        let js= await BillOfMaterial.findByIdAndDelete(req.params.id)
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

router.post('/addBom/:companyId',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyId
        let billOfMaterial=new BillOfMaterial(body);
        await billOfMaterial.save();
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

router.get('/getBom/:id',async(req,res)=>{
    try{
       let result=await BillOfMaterial.findById(req.params.id)
       res.send({
        message:'bill of material successfully fetched',
        success:false,
        data:result


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

router.get('/allbom/:companyId',async(req,res)=>{

    try{
      let allbom=await BillOfMaterial.find({companyname:req.params.companyId})
      res.send({
        message:'bill of material successfully fetched',
        success:true,
        data:allbom
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