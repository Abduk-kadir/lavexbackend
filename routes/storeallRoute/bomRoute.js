let express=require('express')
let router=express.Router()
const BillOfMaterial = require('../../modals/store/bomModal');
const authMidd=require('..//../middleware/authmiddleware')
const Production=require('../../modals/store/production')
const {ProductionStore}=require('../../modals/store/productionStore')
router.put('/updatingBom/:id',async(req,res)=>{

    try{
        console.log(req.body)
        let js=await BillOfMaterial.findByIdAndUpdate(req.params.id,req.body)
        console.log(js)
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



router.delete('/delBom/:id/:companyname',async(req,res)=>{
    try{
        let bom=await BillOfMaterial.findById(req.params.id)
        let {readyStock}=bom
        let {id}=readyStock
        let f=await Production.findOne({'readyStock.id':id,companyname:req.params.companyname})
        if(f){
            res.send({
                message:"can not deleted beacuse it is using in Production",
                success:false, 
             })

        }
        else{  
        let js= await BillOfMaterial.findByIdAndDelete(req.params.id)
        res.send({
            message:"data is successfully deleted",
            success:true, 
         })

        }
      

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
        
        let id=body.readyStock.id
        let b=await BillOfMaterial.findOne({companyname:req.params.companyname,"readyStock.id":id})

       if(b){
        res.send({
            message:"this bom is already exist",
            success:false, 
         })

       }
       else{
        let billOfMaterial=new BillOfMaterial(body);
        await billOfMaterial.save();
        //mainting Store
        let readyStock=body.readyStock
        let js={...readyStock,quantity:0,price:0}
        let prod= new ProductionStore({readyStock:[js],companyname:req.params.companyId})
        await prod.save()
        //ending
        res.send({
            message:"data is successfully added",
            success:true, 
         })
       }
       
       }
       catch(err){
           res.send({
               message:err.message,
               success:false,
        
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