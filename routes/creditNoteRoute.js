const express=require('express')
const creditNote=require('../modals/creditNoteModal')
router=express.Router()
router.post('/creditNoteCreate',async(req,res)=>{
    try{
     let body=req.body;
    
     let debitnote=new creditNote(body);
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