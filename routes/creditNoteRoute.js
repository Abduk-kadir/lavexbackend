const express=require('express')
const CreditNote=require('../modals/creditNoteModal')
const {ProductionStore}=require('./../modals/store/productionStore')
router=express.Router()
router.post('/creditNoteCreate',async(req,res)=>{
    try{
    let {type}=req.query;
    let js={...req.body,companyname:type}
    let {item,onAccount}=req.body
    
    let creditnote=new CreditNote(js);
     await creditnote.save();
     //this is used for updting productio

     if(onAccount){
         //updating production store
      for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
        const f = await ProductionStore.updateOne(
          { readyStock: { $elemMatch: { id: id } } },
          { $inc: { "readyStock.$[elem].quantity":+quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
    
      }
     }


     //here this is ending

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