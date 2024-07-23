const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
let Production=require('../modals/store/production')
router.post('/debitNoteCreate',async(req,res)=>{
    try{
        let {type}=req.query;
        let {item}=req.body
        let js={...req.body,companyname:type}
         let debitnote=new DebitNote(js);
         await debitnote.save();

     //this code for updating production

     for(let i=0;i<item.length;i++){
        let {name,brand,qty}=item[i]   
        let f=await Production.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": -qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         
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