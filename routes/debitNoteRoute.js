const express=require('express')
const DebitNote=require('../modals/debitNodeModal')
router=express.Router()
router.post('/debitNoteCreate',async(req,res)=>{
    try{
        let {type}=req.query;
        let js={...req.body,companyname:type}
    
     let debitnote=new DebitNote(js);
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