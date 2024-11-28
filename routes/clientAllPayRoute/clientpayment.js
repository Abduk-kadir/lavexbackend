let express=require('express')
let router=express.Router()
const ClientPayment= require('../../modals/clientPayment/clientPayment');
const Invoice=require('../../modals/invoiceModal')
const Logs=require('../../modals/logs/logs')
router.delete('/deletePayment/:id',async(req,res)=>{
    try{
        let rs=await ClientPayment.findByIdAndDelete(req.params.id);
        let {invoiceList}=rs
        let inarr=rs.invoiceList.map(elem=>elem.invoiceMov)
        let str=`payment for  invoice no  ${inarr.join(',')} is deleted`
        let js={companyname:rs.companyname,itemId:rs.paymentNumber,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"client Payment"}
        console.log(js)
        let log=new Logs(js) 
        await log.save()
        res.send({
           message:"payment is successfully deleted",
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
router.put('/updatePayment/:companyname/:cid/:id',async(req,res)=>{
    try{
        let body=req.body;
        let c=await ClientPayment.findById(req.params.id)
        let pInarr=c.invoiceList.map(elem=>elem.invoiceMov)
        let nInarr=body.invoiceList.map(elem=>elem.invoiceMov)
        let {
            cid,
            cname,
            paymentDate,
            paymentMethod,
            bankName,
            payCheckorDdNo,
            note,
            payingAmount
            }=c
            let str='';
              if(payingAmount!=body.payingAmount){str+=`paying ammount ${payingAmount} is changed to ${body.payingAmount}  `}
              if(cname!=body.cname){str+=`client ${cname} is changed to ${body.cname}  `}
              if(paymentDate!=body.paymentDate){str+=`payment Date ${paymentDate} is changed to ${body.paymentDate}  `}
              if(paymentMethod!=body.paymentMethod){str+=`payment method ${paymentMethod} is changed to ${body.paymentMethod}  `}
              if(bankName!=body.bankName){str+=`${bankName} is changed to ${body.bankName}  `}
              if(payCheckorDdNo!=body.payCheckorDdNo){str+=`${payCheckorDdNo} is changed to ${body.payCheckorDdNo}  `}
              if(note!=body.note){str+=`notes ${note} is changed to ${body.note}  `}
              if(pInarr.join()!=nInarr.join()){
               str+=`invoice list ${pInarr.join(',')} is changed to ${nInarr.join(',')}`
              }
              console.log('str is:',str)
              if(str!=''){
               let js={companyname:c.companyname,itemId:c.paymentNumber,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"client Payment"}
               let log=new Logs(js)
               await log.save()
               }

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
        await clientPayment.save();
        let inarr=invoiceList.map(elem=>elem.invoiceMov)
        let str=`payment for invoice no: ${inarr.join()} is created`
        let js={companyname:req.params.companyname,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
        let log=new Logs(js)
        await log.save()
        for(let i=0;i<invoiceList.length;i++){
            //for requesting arbaj to maintin front end
           let f= await Invoice.findOne({"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId})
            //end

            await Invoice.updateOne(
                {"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:f.pendingAmount-invoiceList[i].paid-invoiceList[i].discount,discountAmount:invoiceList[i].discount+f.discountAmount}}
            
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
