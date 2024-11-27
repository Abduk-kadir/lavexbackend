const express = require('express')
const CreditNote = require('../modals/creditNoteModal')
const { ProductionStore } = require('./../modals/store/productionStore')
const Company = require('../modals/companyModal')
const SisterStock = require('../modals/sisterStock')
const Logs=require('../modals/logs/logs')
router = express.Router()
router.delete('/creditNoteDelete/:id/:companyname',async(req,res)=>{
  try{
  let f=await CreditNote.findByIdAndDelete(req.params.id)
  let itmnamearr=f.onAccount==false? f.item.map(elem=>elem.name).join():f.invoiceDetail.invoiceNo;
  let itmqtyarr=f.onAccount==false?`and quantity ${f.item.map(elem=>elem.quantity).join()}`:"";
  let deciedInvoice=f.onAccount?'invoice related to this credit':'item'
  let str=`Credit note is for client ${f.clientDetail.client}  and ${deciedInvoice} ${itmnamearr}  ${itmqtyarr} is deleted `
  let j={companyname:f.companyname,itemId:f.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"CreditNote"}
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
router.put('/creditNoteUpdate/:id/:companyname',async(req,res)=>{
  try{
  let body=req.body  
     let rs=await CreditNote.findById(req.params.id)
     await CreditNote.findByIdAndUpdate(req.params.id,req.body,{runValidators: true })
      //mainting store
   if(rs.onAccount==false){
    for (let i = 0; i <rs.item.length; i++) {
      let { id, quantity } = rs.item[i];
      const f = await ProductionStore.updateOne(
        { companyname: rs.companyname, 'readyStock.id': id },
        { $inc: { "readyStock.$[elem].quantity": quantity } },
        { arrayFilters: [{ "elem.id": id }] }
      );
    
    }
  }

  if(body.onAccount==false){
    for (let i = 0; i <body.item.length; i++) {
      let { id, quantity } = body.item[i];
      const f2 = await ProductionStore.updateOne(
        { companyname: rs.companyname, 'readyStock.id': id },
        { $inc: { "readyStock.$[elem].quantity":-quantity } },
        { arrayFilters: [{ "elem.id": id }] }
      );
     
    }
  }
       //mainting log
       let {
        clientDetail,
        invoiceDetail,
        selectDc,
        item, 
    }=rs
       let str='';
       if(clientDetail.client!=body.clientDetail.client){str+=`client ${clientDetail.client} is changed to ${body.clientDetail.client}  `}
       if(clientDetail.grade!=body.clientDetail.grade){str+=`${clientDetail.grade} is changed to ${body.clientDetail.grade}  `}
       if(clientDetail.gstNumber!=body.clientDetail.gstNumber){str+=`${clientDetail.gstNumber} is changed to ${body.clientDetail.gstNumber}  `}
       if(clientDetail.address!=body.clientDetail.address){str+=`${clientDetail.address} is changed to ${body.clientDetail.address}  `}
       if(body.onAccount==false){
       let pitmarr=rs.onAccount==true?'':rs.item.map(elem=>elem.name).join('')
       let nitmarr=rs.onAccount==true?'':body.item.map(elem=>elem.name).join('')
       let pqitmarr=rs.item.map(elem=>elem.quantity)
       let nqitmarr=body.item.map(elem=>elem.quantity)
       str+=pitmarr.join(',')==nitmarr.join(',')?'':` items  ${pitmarr.join(',')} are changed to ${nitmarr.join(',')}`
       str+=pqitmarr.join(',')==nqitmarr.join(',')?'':` quantity ${pqitmarr.join(',')} are changed to ${nqitmarr.join(',')}`
       }
       if(str!=''){
       let js={companyname:rs.companyname,itemId:rs.mov,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Credit Note"}
       let log=new Logs(js)
       await log.save()
       }





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

router.post('/creditNoteCreate', async (req, res) => {
  try {
    let { type, role } = req.query;
    let js = { ...req.body, companyname: type }
    let data = await CreditNote.find({ companyname: type })
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    js.mov = max;
    let { item, onAccount } = req.body
    let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
    js.total = total
    let creditnote = new CreditNote(js);
    await creditnote.save();
    //for log
    let itmnamearr=onAccount==false? req.body.item.map(elem=>elem.name).join():"0"
    let itmqtyarr=onAccount==false?req.body.item.map(elem=>elem.quantity).join():"0"
    let str=`Credit note is for client ${req.body.clientDetail.client} created and item is ${itmnamearr} and quantity is ${itmqtyarr} recieved `
    let j={companyname:type,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"CreditNote"}
    console.log(j)
    let log=new Logs(j) 
    await log.save()
   //here ending


    if (onAccount) {
      //do nothing 
    }
    else{
      for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
        console.log(type)
        const f = await ProductionStore.updateOne(
          { companyname:type,'readyStock.id':id },
          { $inc: { "readyStock.$[elem].quantity": +quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );

      }

    }

    res.send({
      message: "data is successfully added",
      success: true,


    })


  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,



    })

  }
})
module.exports = router