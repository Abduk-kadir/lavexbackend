let express=require('express')
let router=express.Router()
let Paymentname=require('../modals/paymentNameModal')

router.post('/addPaymentName',async(req,res)=>{
    try{
        let body=req.body;
        let payment=new Paymentname(body);
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

router.get('/paymenttypedropdown',async(req,res)=>{
    try{

        let arr= await Paymentname.find({},{name:1,_id:0})
        let dropdown=arr.map(elem=>elem.name)
        res.send({
            message:"data is fetched successfully",
            data:dropdown,
            success:true
        })

    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:false
        })
    }
   


})
module.exports=router