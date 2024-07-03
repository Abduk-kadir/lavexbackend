const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
router.post('/debitNoteCreate',async(req,res)=>{
    try{
     let body=req.body;
    
     let debitnote=new DebitNote(body);
     await debitnote.save();
     res.send({
        message:"data is successfully added",
        success:true,
        data:body
    
     })
          

    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null


        })

    }
})
module.exports=router