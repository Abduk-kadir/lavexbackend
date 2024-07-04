const express=require('express');
const DebitNote=require('../modals/debitNodeModal')
const Porfarma=require('../modals/performaModal')
const Invoice=require('../modals/invoiceModal')
const creditNote=require('../modals/creditNoteModal')
const router=express.Router();
let arr=null
let newarr=null

router.get('/myInvoices',async(req,res)=>{
   
    let {type}=req.query
    
    console.log('type is:',type)
     switch(type){
        case "proforma":
            arr=await Porfarma.find()
            console.log(arr)
            break;
            case "invoice":
            arr=await Invoice.find()
            break;
            case "creditnote":
            arr=await creditNote.find()
            break;

            case "debitnote":
            arr=await DebitNote.find()
            break;
            default:
                let arr1=await Porfarma.find()
                let arr2=await Invoice.find()
                let arr3=await creditNote.find()
                let arr4=await DebitNote.find()
                 newarr=[{'forfarmadata':arr1,'invoicedata':arr2,'creditnotedata':arr3,'debitnotedata':arr4}]
               
            
           
    }
    if(type){
        res.send({
            "message":"data is successfully attached",
            "success":true,
            "data":arr
        })
    }
    else{
        res.send({
            "message":"data is successfully attached",
            "success":true,
            "data":newarr
        })

    }

})


router.delete('/update/:type/:id',async(req,res)=>{
 

   let {type,id}=req.params
   if(type=='porforma'){
    try{
      let result = await Porfarma.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='invoice'){
    try{
      let result = await Invoice.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='creditnote'){
    try{
      let result = await creditNote.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='debitnote'){
    try{
      let result = await DebitNote.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
    
  else{
     res.send({
      message:"please fill correct type which we have to delete",
      success:null


     })
  }
 
         
  
})

module.exports=router;



