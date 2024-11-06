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
                console.log('insister')
                console.log(inwardList[i].inwardId)
                console.log(req.params.sid)
                console.log(req.params.companyname)
                await SisterStore.updateOne(
                    {sid:req.params.sid,companyname:req.params.companyname,_id:inwardList[i].inwardId},
                    {$set:{pendingAmount:inwardList[i].pendingAmount}}
                
                )

            }
            else{
             console.log('in master')   
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
router.get('/allCashPayment/:companyname',async(req,res)=>{

    try{
        const { companyname } = req.params;
        const paymentMethod = "CASH";  

        let data=await SupplierPayment.find(
            {
                companyname: companyname,
                paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
            }
        )
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
    let {companyname,fromDate,toDate}=req.query
    let query={$expr:{$ne:['$total','$pendingAmount']}}
    if(companyname){query.companyname=companyname}
    let data=await Inward.find(query);

    if (fromDate && toDate) {
        const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
        const [dayTo, monthTo, yearTo] = toDate.split('-');
        const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
        const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
        data = data.filter(item => {
          const [day, month, year] = item.dateCreated.split('-');
          let itemDate = new Date(`${year}-${month}-${day}`);
          return itemDate >= from && itemDate <= to;
        });
  
      }
  



    res.send({
        message:'data is successfully fetched',
        success:true,
        data:data
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
