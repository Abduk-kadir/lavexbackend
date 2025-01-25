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
router.delete('/deletesupplierPayment/:companyname/:role/:id',async(req,res)=>{
    try{
        let role=req.params.role
        let rs= await SupplierPayment.findByIdAndDelete(req.params.id)
        let {inwardList}=rs
        if(role=='master'){
        for(let i=0;i<inwardList.length;i++){
            let f= await Inward.findOne({companyname:req.params.companyname,_id:inwardList[i].inwardId})
             await Inward.updateOne(
                 {companyname:req.params.companyname,_id:inwardList[i].inwardId},
                 {$set:{pendingAmount:f.pendingAmount+inwardList[i].paid+inwardList[i].discount,discountAmount:f.discountAmount-inwardList[i].discount}}
             )
         }
        }
        else{
            for(let i=0;i<inwardList.length;i++){
                let f= await SisterStore.findOne({companyname:req.params.companyname,_id:inwardList[i].inwardId})
                 await SisterStore.updateOne(
                     {companyname:req.params.companyname,_id:inwardList[i].inwardId},
                     {$set:{pendingAmount:f.pendingAmount+inwardList[i].paid+inwardList[i].discount,discountAmount:f.discountAmount-inwardList[i].discount}}
                 )
             }
            

        }

        let inarr=rs.inwardList.map(elem=>elem.inwardMov)
        let str=`payment for  inward no  ${inarr.join(',')} is deleted`
        let js={companyname:rs.companyname,itemId:rs.paymentNumber,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Supplir Payment"}
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

router.put('/updatesupplierPayment/:companyname/:role/:id',async(req,res)=>{
    try{
        let body=req.body;
        let {inwardList}=body
        let p=await SupplierPayment.findById(req.params.id)
       let role=req.params.role
        let preInwardList=p.inwardList
        let newInwardList=inwardList.map(elem=>{
                  let p=preInwardList.find(elem2=>elem2.inwardId==elem.inwardId)
                  let el={...elem}
                  el.paid=p.paid-el.paid
                  el.discount=p.discount-el.discount
                  let js={...elem,pendingAmount:p.pendingAmount+el.paid+el.discount}
                  return js
               })
        body.inwardList=newInwardList
        console.log(newInwardList)
       
        await SupplierPayment.findByIdAndUpdate(req.params.id,body);  
        if(role=='master'){
                    for(let i=0;i<newInwardList.length;i++){
                        console.log(req.params.companyname)
                        console.log(newInwardList[i].inwardId)
                          await Inward.updateOne(
                            {companyname:req.params.companyname,_id:newInwardList[i].inwardId},
                            {$set:{pendingAmount:newInwardList[i].pendingAmount,discountAmount:newInwardList[i].discount}}
                        
                        )
                      
                    }

        }
        else{
            for(let i=0;i<newInwardList.length;i++){
                await SisterStore.updateOne(
                    {companyname:req.params.companyname,_id:newInwardList[i].inwardId},
                    {$set:{pendingAmount:newInwardList[i].pendingAmount,discountAmount:newInwardList[i].discount}}
                
                )
            }

        }


       /* let pInarr=c.inwardList.map(elem=>elem.inwardMov)
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
            str+=`inward list ${pInarr.join(',')} is changed to ${nInarr.join(',')}`
           }
           console.log('str is:',str)
           if(str!=''){
            let js={companyname:c.companyname,itemId:c.paymentNumber,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Supplier Payment"}
            let log=new Logs(js)
            await log.save()
            }*/
        res.send({
           message:"payment is successfully update",
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
router.post('/addsupplerPayment/:companyname/:role',async(req,res)=>{
    try{
        let body=req.body;
        let role=req.params.role

        body.companyname=req.params.companyname;
        let {inwardList}=body
        if(role=='master'){
        let newInwardList=await Promise.all(inwardList.map(async(elem)=>{
                    let p= await Inward.findOne({companyname:req.params.companyname,_id:elem.inwardId})
                    let js={}
                    if(p){
                      js={...elem,pendingAmount:p.pendingAmount-elem.paid-elem.discount}
                    }
                    else{
                     js={...elem,pendingAmount:elem.total-elem.paid-elem.discount}
                    }
                    return js
                }))
                body.inwardList=newInwardList
                let supplierPayment=new SupplierPayment(body);
                await supplierPayment.save();
                console.log('in master secttion')
                for(let i=0;i<inwardList.length;i++){
                    let f= await Inward.findOne({companyname:req.params.companyname,_id:inwardList[i].inwardId})
                  
                     await Inward.updateOne(
                         {companyname:req.params.companyname,_id:inwardList[i].inwardId},
                         {$set:{pendingAmount:f.pendingAmount-inwardList[i].paid-inwardList[i].discount,discountAmount:inwardList[i].discount+f.discountAmount}}
                     
                     )
                 }

        } 
        else{
            let newInwardList=await Promise.all(inwardList.map(async(elem)=>{
                let p= await SisterStore.findOne({companyname:req.params.companyname,_id:elem.inwardId})
                let js={}
                if(p){
                  js={...elem,pendingAmount:p.pendingAmount-elem.paid-elem.discount}
                }
                else{
                 js={...elem,pendingAmount:elem.total-elem.paid-elem.discount}
                }
                return js
            }))
            body.inwardList=newInwardList
            let supplierPayment=new SupplierPayment(body);
            await supplierPayment.save();

            for(let i=0;i<inwardList.length;i++){
                let f= await SisterStore.findOne({companyname:req.params.companyname,_id:inwardList[i].inwardId})
                 await SisterStore.updateOne(
                     {companyname:req.params.companyname,_id:inwardList[i].inwardId},
                     {$set:{pendingAmount:f.pendingAmount-inwardList[i].paid-inwardList[i].discount,discountAmount:inwardList[i].discount+f.discountAmount}}
                 
                 )
             }

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
