let express=require('express')
let router=express.Router()
const SupplierPayment= require('../../modals/supplierPayment/supPayment');
router.post('/addsupplerPayment',async(req,res)=>{
    try{
        let body=req.body;
        let supplerPayment=new SupplierPayment(body);
        await supplerPayment.save();
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
router.put('/updateSuppPay/:id',async(req,res)=>{
    try{
     let result= await findByIdAndUpdate({_id:req.params.id},req.body)
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
router.delete('/deleteSuppPay/:id',async(req,res)=>{
    try{
     let result= await findByIdAndDelete(req.params.id)
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

module.exports=router
