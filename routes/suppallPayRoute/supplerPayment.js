let express=require('express')
let router=express.Router()
const SupplierPayment=require('../../modals/supplierPayment/supPayment')
let Inward=require('../../modals/store/inwardModal')
let SisterStore=require('../../modals/sisterStore')
const supPayment = require('../../modals/supplierPayment/supPayment')
const Invoice=require('../../modals/invoiceModal')
const DeliveryChalan=require('../../modals/deliveryChalan')
const Logs=require('../../modals/logs/logs')
const supplierModal = require('../../modals/supplierModal')

router.delete('/deletesupplierPayment/:id',async(req,res)=>{
    try{
        
        let rs= await SupplierPayment.findByIdAndDelete(req.params.id)
       
        let inarr=rs.inwardList.map(elem=>elem.inwardMov)
        let str=`payment for  inward no  ${inarr.join('')} is deleted`
        let js={companyname:rs.company,itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Supplir Payment"}
        console.log(js)
        let log=new Logs(js) 

        await log.save()
        res.send({
        message:'payment is deleted successfully',
        success:false,
       })
         
    }
       catch(err){
           res.send({
               message:err.message,
               success:false,
        
           })
   
       }

})

router.put('/updatesupplierPayment/:companyname/:sid/:role/:id',async(req,res)=>{
    try{
        let body=req.body;
        let {inwardList}=body
        let c=await SupplierPayment.findById(req.params.id) 
        let pInarr=c.inwardList.map(elem=>elem.inwardMov)
        let nInarr=inwardList.map(elem=>elem.inwardMov)
        
        let {
         sid,
         sname,
         paymentDate,
         paymentMethod,
         bankName,
         payCheckorDdNo,
         note,
         payingAmount
         }=c
         let str='';
           if(payingAmount!=body.payingAmount){str+=`paying ammount ${payingAmount} is changed to ${body.payingAmount}  `}
           if(sname!=body.sname){str+=`supplier ${sname} is changed to ${body.sname}  `}
           if(paymentDate!=body.paymentDate){str+=`payment Date ${paymentDate} is changed to ${body.paymentDate}  `}
           if(paymentMethod!=body.paymentMethod){str+=`payment method ${paymentMethod} is changed to ${body.paymentMethod}  `}
           if(bankName!=body.bankName){str+=`${bankName} is changed to ${body.bankName}  `}
           if(payCheckorDdNo!=body.payCheckorDdNo){str+=`${payCheckorDdNo} is changed to ${body.payCheckorDdNo}  `}
           if(note!=body.note){str+=`notes ${note} is changed to ${body.note}  `}
           if(pInarr.join()!=nInarr.join()){
            str+=`inward list ${pInarr.join()} is changed to ${nInarr.join()}`
           }
           console.log('str is:',str)
           if(str!=''){
            let js={companyname:c.companyname,itemId:c.paymentNumber,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Supplier Payment"}
            let log=new Logs(js)
            await log.save()
            }
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
        let {inwardList}=body
        let inarr=inwardList.map(elem=>elem.inwardMov)
        let str=`payment for inward no: ${inarr.join()} is created`
        let js={companyname:req.params.companyname,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Suppler"}
        let log=new Logs(js)
        await log.save()
        
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
