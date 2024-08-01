let express=require('express')
let router=express.Router()
const Brand = require('../modals/brand/brandModel');
router.post('/create',async(req,res)=>{
    try{
        
        let body=req.body;
      
        let brand=new Brand(body);
        await brand.save();
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