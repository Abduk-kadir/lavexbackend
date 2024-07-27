const express=require('express')
const Payment=require('../modals/paymentModel')
router=express.Router()

router.post('/addPaymentName',async(req,res)=>{
    try{
     let body=req.body;
     let payment=new Payment(body);
     await payment.save();
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