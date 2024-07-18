const express=require('express')
const creditNote=require('../modals/creditNoteModal')
router=express.Router()
router.post('/creditNoteCreate',async(req,res)=>{
    try{
    let {type}=req.query;
    let js={...req.body,companyname:type}
    
     let debitnote=new creditNote(js);
     await debitnote.save();
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