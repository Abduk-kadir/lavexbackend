let express=require('express')
let router=express.Router()
const ClientPayment= require('../../modals/clientPayment/clientPayment');
router.post('/addclientPayment',async(req,res)=>{
    try{
        let body=req.body;
        let clientPayment=new ClientPayment(body);
        await clientPayment.save();
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
router.put('/updateClientPay/:id',async(req,res)=>{
    try{
     let result= await ClientPayment.findByIdAndUpdate({_id:req.params.id},req.body)
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
router.delete('/deleteClientPay/:id',async(req,res)=>{
    try{
     let result= await ClientPayment.findByIdAndDelete(req.params.id)
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
