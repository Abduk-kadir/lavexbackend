let express=require('express')
let router=express.Router()
//const SupplierPayment= require('../../modals/supplierPayment/supPayment');
const SupplierPayment=require('../../modals/supplierPayment')
let Inward=require('../../modals/store/inwardModal')
let SisterStore=require('../../modals/sisterStore')

router.post('/addsupplerPayment/:companyname/:sid/:role',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyname;
        body.sid=req.params.sid
        let {inwardList}=body
        let availpay=await SupplierPayment.findOne({companyname:req.params.companyname,paymentNumber:body.paymentNumber})
        if(availpay){
          res.send({
            message:'payment number is already exist',
            success:false
          })
        }
       else{
        let supplierPayment=new SupplierPayment(body)
        await supplierPayment.save();
        for(let i=0;i<inwardList.length;i++){
            if(req.params.role=='sister'){
                await SisterStore.updateOne(
                    {sid:req.params.sid,companyname:req.params.companyname,_id:inwardList[i].inwardId},
                    {$set:{pendingAmount:inwardList[i].pendingAmount}}
                
                )

            }
            else{
            await Inward.updateOne(
                {sid:req.params.sid,companyname:req.params.companyname,_id:inwardList[i].inwardId},
                {$set:{pendingAmount:inwardList[i].pendingAmount}}
            
            )
        }
        }
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
