let express=require('express')
let router=express.Router()
const SupplierPayment= require('../../modals/supplierPayment/supPayment');
Inward=require('../../modals/store/inwardModal')
router.post('/addsupplerPayment/:companyname/:sid',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyname;
        body.sid=req.params.sid
        let supplerPayment=new SupplierPayment(body);
        let {inwardList}=body
        await supplerPayment.save();
        for(let i=0;i<inwardList.length;i++){
            await Inward.updateOne(
                {sid:req.params.sid,companyname:req.params.companyname,_id:inwardList[i].inwardId},
                {$set:{pendingAmount:inwardList[i].pendingAmount}}
            
            )
        }
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
router.get('/allpayment/:companyname',async(req,res)=>{

    try{

        let data=await SupplierPayment.find({companyname:req.params.companyname})
        res.send({
            message:"data is successfully updated",
            success:true, 
            data:data
         })

    }
    catch(err){
       
            res.send({
                message:err.message,
                success:false, 
             })
    
    }

})
/*router.put('/updateSuppPay/:id',async(req,res)=>{
    try{
     let result= await SupplierPayment.findByIdAndUpdate({_id:req.params.id},req.body)
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
*/
module.exports=router
