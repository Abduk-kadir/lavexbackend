const express=require('express')
const Invoice=require('../modals/invoiceModal')
router=express.Router();
const Production=require('./../modals/store/production')

router.post('/invoiceCreate',async(req,res)=>{
    let {type}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}
    let parr=[]
    try{
     let body=req.body;
     let invoice=new Invoice(js);
     await invoice.save();

     for(let i=0;i<item.length;i++){
        let {name,brand,qty}=item[i]   
        let f=await Production.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": -qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         
        }
        



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

router.get('/allinvoices/:company',async(req,res)=>{
    try{
        let result=await Invoice.find({companyname:req.params.company})
        console.log(result)
        if(result.length==0){
          res.send({
              message:"please fill correct company name ",
              success:false,
              data:null
          })
  
        }
        else{
         res.send({
          message:"invoice is fetched successfully fetched",
          success:true,
          data:result
         })
       }
       
       }
       catch(err){
          res.send({
              message:err.message,
              success:false,
              data:null
  
          })
       }
  

})

router.get('/invoice/:number/:name',async(req,res)=>{
    console.log(req.params.number)
     try{
      let result=await Invoice.findOne({$and:[{ "invoiceDetail.invoiceNo":req.params.number},{companyname:req.params.name}]})
      if(result==null){
        res.send({
            message:"please fill correct company name and invoiceNo"
        })

      }
      else{
       res.send({
        message:"invoice is fetched successfully attached",
        success:true,
        data:result
       })
     }
     
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