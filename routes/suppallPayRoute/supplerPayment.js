let express=require('express')
let router=express.Router()
const SupplierPayment=require('../../modals/supplierPayment/supPayment')
let Inward=require('../../modals/store/inwardModal')
let SisterStore=require('../../modals/sisterStore')
const supPayment = require('../../modals/supplierPayment/supPayment')
const Invoice=require('../../modals/invoiceModal')
const DeliveryChalan=require('../../modals/deliveryChalan')

/*router.get('/updatesupplierPayment/:companyname/:sid/:role/:id',async(req,res)=>{

    res.send('heloo arbaj')
})
*/
router.put('/updatesupplierPayment/:companyname/:sid/:role/:id',async(req,res)=>{
    try{
        let body=req.body;
        let {inwardList}=body
        await SupplierPayment.findByIdAndUpdate(req.params.id,body)
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
        
        res.send({
           message:"data is successfully update",
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
        let data=await SupplierPayment.find({companyname:req.params.companyname})
        let max=data.reduce((acc,curr)=>curr.paymentNumber>acc?curr.paymentNumber:acc,0)
        max=max+1;
        body.paymentNumber=max;
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

router.get('/payentReport',async(req,res)=>{
    try{
    let {fromDate,toDate,sid,companyname}=req.query;
    let query={companyname:companyname}
    
    if(fromDate&&toDate){
        query["paymentDate"]= {
         $gte:fromDate, 
         $lte:toDate
      }
    }
    if(sid){
        query['sid']=sid
    }
    console.log('query is:',query)
    let result =await SupplierPayment.find(query)
    res.send({
        message:'data is successfully fetched',
        success:true,
        data:result
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

/*



router.get('/invoiceByProduct/:companyname',async(req,res)=>{
    try{
        let {fromDate,toDate,type,clientId,prodId}=req.body;
        let model=type=='invoice'?Invoice:DeliveryChalan
         let result=await model.find({
            "invoiceDetail.invoiceDate":{
                $gte: fromDate,
                $lte: toDate
            },
            "clientDetail.id":clientId,
            "item.id":prodId,
            companyname:req.params.companyname,
        })
        res.send({
            message:'data is successfully fetched',
            success:true,
            data:result
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

*/

module.exports=router
