const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
let ProductionStore=require('../modals/store/productionStore')
router.post('/debitNoteCreate',async(req,res)=>{
    try{
        let {type}=req.query;
        let {item}=req.body
        let js={...req.body,companyname:type}
         let debitnote=new DebitNote(js);
         await debitnote.save();

     //this code for updating production

     for(let i=0;i<item.length;i++){
        let {name,brand,quantity}=item[i]   
        console.log(name,brand,quantity)
        let f=await ProductionStore.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": -quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         
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