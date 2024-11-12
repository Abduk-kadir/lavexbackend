let express=require('express')
let router=express.Router()
const ClientPayment= require('../../modals/cashmodals/cashClientPayment');
const Invoice=require('../../modals/cashmodals/cashInvoiceModal')
router.put('/updatePayment/:companyname/:cid/:id',async(req,res)=>{
    try{
        let body=req.body;
        await ClientPayment.findByIdAndUpdate(req.params.id,body);
        let {invoiceList}=body
        for(let i=0;i<invoiceList.length;i++){
            await Invoice.updateOne(
                {"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:invoiceList[i].pendingAmount,total:invoiceList[i].total}}
            
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
        let data=await ClientPayment.find({companyname:req.params.companyname})
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


router.post('/addclientPayment/:companyname/:cid',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyname;
        body.cid=req.params.cid
        let data=await ClientPayment.find({companyname:req.params.companyname})
        let max=data.reduce((acc,curr)=>curr.paymentNumber>acc?curr.paymentNumber:acc,0)
        max=max+1;
        body.paymentNumber=max;
        let clientPayment=new ClientPayment(body);
        let {invoiceList}=body
        console.log(invoiceList)
        await clientPayment.save();
        for(let i=0;i<invoiceList.length;i++){
            await Invoice.updateOne(
                {"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:invoiceList[i].pendingAmount,total:invoiceList[i].total}}
            
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

        let data=await ClientPayment.find({companyname:req.params.companyname})
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

router.get('/allCashPayment/:companyname',async(req,res)=>{

    try{
      
        const { companyname } = req.params;
        const paymentMethod = "CASH";  
        const data = await ClientPayment.find({
          companyname: companyname,
          paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
        });
        res.send({
            message:"data is fetched successfully",
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

module.exports=router
