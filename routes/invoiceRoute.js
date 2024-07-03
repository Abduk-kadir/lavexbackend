const express=require('express')
const Invoice=require('../modals/invoiceModal')
router=express.Router()

router.post('/invoiceCreate',async(req,res)=>{
    try{
     let body=req.body;
    
     let invoice=new Invoice(body);
     await invoice.save();
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