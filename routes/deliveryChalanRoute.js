const express=require('express')
const DeliveryChalan=require('../modals/deliveryChalan')
router=express.Router()
router.post('/deliveryChalanCreate',async(req,res)=>{
    try{
     let body=req.body;
    
     let delivery=new DeliveryChalan(body);
     await delivery.save();
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