let express=require('express')
let router=express.Router()
const Brand = require('../modals/drop/brandModel');
const Category = require('../modals/drop/category');
const QuantityType=require('../modals/drop/quantityType')
const Hsncode=require('../modals/drop/hsnCode')
const Gst=require('../modals/drop/gstDropdown')
const Lowquantity=require('../modals/drop/lowQuantity')

router.post('/createBrand',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await Brand.findOne({brand:body.brand})
        console.log(data)
        console.log(!data)
        if(!data){
        let brand=new Brand(body);
        await brand.save();
        res.send({
           message:"data is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this name is already exist",
            success:false, 
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
router.post('/createCategory',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await Category.findOne({name:body.name})
        if(!data){
        let category=new Category(body);
        await category.save();
        res.send({
           message:"category is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this category is already exist",
            success:false, 
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
router.post('/createQuantityType',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await QuantityType.findOne({type:body.type})
        console.log(data)
        if(!data){
        let quantityType=new QuantityType(body);
        await quantityType.save();
        res.send({
           message:"quantity type  is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this quantity type is already exist",
            success:false, 
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
router.post('/createHsnCode',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await Hsncode.findOne({code:body.code})
        console.log(data)
        if(!data){
        let hsnCode=new Hsncode(body);
        await hsnCode.save();
        res.send({
           message:"hsn is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this hsn code is already exist",
            success:false, 
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
router.post('/createGst',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await Gst.findOne({gst:body.gst})
        if(!data){
        let gst=new Gst(body);
        await gst.save();
        res.send({
           message:"gst is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this gst is already exist",
            success:false, 
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
router.post('/createLowQuantity',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await Lowquantity.findOne({lowqty:body.lowqty})
        if(!data){
        let lowqty=new Lowquantity(body);
        await lowqty.save();
        res.send({
           message:"gst is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this gst is already exist",
            success:false, 
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
module.exports=router