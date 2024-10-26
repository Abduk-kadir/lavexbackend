const express=require('express')
const CreditNote=require('../modals/creditNoteModal')
const {ProductionStore}=require('./../modals/store/productionStore')
const Company=require('../modals/companyModal')
const SisterStock=require('../modals/sisterStock')
router=express.Router()
router.post('/creditNoteCreate',async(req,res)=>{
    try{
    let {type,role}=req.query;
    let js={...req.body,companyname:type}
    let data=await CreditNote.find({companyname:type})
        let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
        max=max+1;
        js.mov=max;
        let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
        js.total=total




    let {item,onAccount}=req.body
    let creditnote=new CreditNote(js);
    await creditnote.save();
     if(onAccount){
        if(role=='master'){
        for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
        const f = await ProductionStore.updateOne(
          { readyStock: { $elemMatch: { id: id } } },
          { $inc: { "readyStock.$[elem].quantity":+quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
    
      }
      const branch = req.body.clientDetail.Branch.trim().toUpperCase();
      let isSister=await Company.findOne({Branch:branch})
        console.log('is isister',isSister)
        if(isSister){
          for (let i = 0; i <item.length; i++) {
            let { id, quantity } = item[i];
            const f = await SisterStock.updateOne(
              { companyname:isSister._id,'readyStock.id':id },
              { $inc: { "readyStock.$[elem].quantity":-quantity } },
              { arrayFilters: [{ "elem.id": id }] }
            );
           
          }
        }

    }
    else{
      //in sister company
      console.log('insister company')
      for (let i = 0; i <item.length; i++) {
        let { id, quantity } = item[i];
        console.log(id)
        console.log(quantity)
        const f = await SisterStock.updateOne(
          { companyname:type,'readyStock.id':id },
          { $inc: { "readyStock.$[elem].quantity":+quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
        console.log(f)
       
      }

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