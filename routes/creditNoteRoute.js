const express=require('express')
const creditNote=require('../modals/creditNoteModal')
const Production=require('../modals/store/production')
router=express.Router()
router.post('/creditNoteCreate',async(req,res)=>{
    try{
    let {type}=req.query;
    let js={...req.body,companyname:type}
    let {item}=req.body
    
     let debitnote=new creditNote(js);
     await debitnote.save();
     //this is used for updting production

     for(let i=0;i<item.length;i++){
        let {name,brand,qty}=item[i]   
        let f=await Production.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         
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