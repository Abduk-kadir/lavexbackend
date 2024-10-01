const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
let PurchaseStore=require('../modals/store/purchaseStore')
router.post('/debitNoteCreate',async(req,res)=>{
    try{
        let {type}=req.query;
        let {item,onAccount}=req.body
        let js={...req.body,companyname:type}
        let data=await DebitNote.find({companyname:type})
        let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
        max=max+1;
        js.mov=max;


        let debitnote=new DebitNote(js);
        await debitnote.save();
     //this code for updating purchaseStore
          if(onAccount){
            for (let i = 0; i <item.length; i++) {
                let { id, quantity } = item[i];
                const f = await PurchaseStore.updateOne(
                  { item: { $elemMatch: { id: id } } },
                  { $inc: { "item.$[elem].quantity":-quantity } },
                  { arrayFilters: [{ "elem.id": id }] }
                );
              }

          }
    
     //this is ending here

     



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