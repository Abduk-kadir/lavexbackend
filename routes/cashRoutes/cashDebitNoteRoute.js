const express=require('express')
const DebitNote=require('../../modals/cashmodals/cashDebitNodeModal')
router=express.Router()
let PurchaseStore=require('../../modals/store/purchaseStore')
let Company=require('../../modals/companyModal')
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
       if(onAccount){
         //do nothinng 
         console.log('in on account')
        }
        else{
          console.log('onaccount is false')
          for (let i = 0; i <item.length; i++) {
            let { id, quantity } = item[i];
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