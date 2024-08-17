const express=require('express')
const Invoice=require('../modals/invoiceModal')
router=express.Router();
const {ProductionStore,ProductionStore2}=require('./../modals/store/productionStore')
router.get('/invoicesbyClient/:clientname',async(req,res)=>{
    try{
        let result=await Invoice.aggregate([{$match:{"clientDetail.client":req.params.clientname}},
         {$project:{
            "clientDetail.client":1,
            "invoiceDetail.invoiceNo":1,
            "invoiceDetail.dueDate":1,
            calculatedAmount:{
                "$reduce":{
                    "input":"$item",
                    initialValue:0,
                    in:{$add:["$$value",{$multiply:["$$this.price","$$this.qty",{$add:[1,{$divide:["$$this.gst",100]}]}]}]}
                }
            }
           }},
           {$project:{
             "invoiceAmount":"$calculatedAmount",
             "balanceAmount":"$calculatedAmount"
           }}


        ])
       
        if(result.length==0){
          res.send({
              message:"no invoice found for this client",
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




router.post('/invoiceCreate',async(req,res)=>{
    let {type}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}
    let parr=[]
    try{
     let body=req.body;
     let invoice=new Invoice(js);
     await invoice.save();   
     if(!req.body.selectDc){
       //updating production store
      for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
        const f = await ProductionStore.updateOne(
          { readyStock: { $elemMatch: { id: id } } },
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
      }
      //in future here i want to add these item in sister company

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