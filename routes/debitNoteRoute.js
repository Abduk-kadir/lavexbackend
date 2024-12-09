const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
let PurchaseStore=require('../modals/store/purchaseStore')
let SisterStock=require('../modals/sisterStock')
let Company=require('../modals/companyModal')
let Logs=require('../modals/logs/logs')
const invoiceDelMidd=require('../middleware/invoiceDelMidd')
const invoiceAddMidd=require('../middleware/invoiceAddMidd')
const invoiceUpMidd=require('../middleware/invoiceUpMidd')
router.delete('/debitNoteDelete/:id/:companyname',async(req,res)=>{
  try{
  let f=await DebitNote.findByIdAndDelete(req.params.id)
  let itmnamearr=f.onAccount==false? f.item.map(elem=>elem.name).join():f.invoiceDetail.invoiceNo;
  let itmqtyarr=f.onAccount==false?`and quantity ${f.item.map(elem=>elem.quantity).join()}`:"";
  let deciedInvoice=f.onAccount?'invoice related to this debit':'item'
  let str=`Debit note is for client ${f.clientDetail.client}  and ${deciedInvoice} ${itmnamearr}  ${itmqtyarr} is deleted `
  let j={companyname:f.companyname,itemId:f.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"DebitNote"}
  
  let log=new Logs(j) 
  await log.save()
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
router.put('/debitNoteUpdate/:id/:companyname',async(req,res)=>{
  try{
  let f=await DebitNote.findByIdAndUpdate(req.params.id,req.body,{runValidators: true })
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


router.post('/debitNoteCreate',async(req,res)=>{
    try{
        let {type,role}=req.query;
        let {item,onAccount}=req.body
        let js={...req.body,companyname:type}
        let data=await DebitNote.find({companyname:type})
        let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
        max=max+1;
        js.mov=max;
        let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
        js.total=total
        let debitnote=new DebitNote(js);
        await debitnote.save();
        let itmnamearr=onAccount==false? req.body.item.map(elem=>elem.name).join():"0"
        let itmqtyarr=onAccount==false?req.body.item.map(elem=>elem.quantity).join():"0"
        let str=`Debit note is for client ${req.body.clientDetail.client} created and item is ${itmnamearr} and quantity is ${itmqtyarr} goes to client `
        let j={companyname:type,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"DebitNote"}
        console.log(j)
        let log=new Logs(j) 
        await log.save()


         if(onAccount){
           //do nothinng 
          }
          else{
            console.log('onaccount is false')
            for (let i = 0; i <item.length; i++) {
              let { id, quantity } = item[i];
              console.log(id)
              console.log(type)
              console.log(quantity)
              const f = await PurchaseStore.updateOne(
                { companyname:type,'item.id':id },
                { $inc: { "item.$[elem].quantity":-quantity } },
                { arrayFilters: [{ "elem.id": id }] }
              );
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
module.exports=router