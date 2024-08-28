const express=require('express')
const Invoice=require('../modals/invoiceModal')
const DeliveryChalan=require('../modals/deliveryChalan')
const Company=require('../modals/companyModal')
router=express.Router();
const {ProductionStore,ProductionStore2}=require('./../modals/store/productionStore')
const SisterStore=require('../modals/sisterStore');
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
    let {type,role}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}
    let parr=[]
    try{
     let body=req.body;
     let invoice=new Invoice(js);
     await invoice.save();   
     req.body.selectDc.map(async(elem)=>{
     
       await DeliveryChalan.findByIdAndDelete(elem)
     })
     if(req.body.selectDc.length==0){
     
      if(role=='master'){
        for (let i = 0; i < item.length; i++) {
          let { id, quantity } = item[i];
        
          const f = await ProductionStore.updateOne(
            { readyStock: { $elemMatch: { id: id } } },
            { $inc: { "readyStock.$[elem].quantity":-quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        
         
        }
        let cgst=req.body.clientDetail.gstNumber
        let isSister=await Company.findOne({gstNumber:cgst})
        console.log('is isister',isSister)
        if(isSister){
          let js={companyname:isSister._id,readyStock:item}
          let sisterstore=new SisterStore(js)
          await sisterstore.save()
        }
       
      }
      else{
        
        console.log('hi i am sister compmany')
       /* 
        for (let i = 0; i < item.length; i++) {
          let { id, quantity } = item[i];
         
          const f = await SisterStore.updateOne(
            { readyStock: { $elemMatch: { id: id } } },
            { $inc: { "readyStock.$[elem].quantity":-quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        console.log('modified array is:',f)
         
        }
        */
        }
      
       
       
      }
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

router.get('/allinvoices/:id',async(req,res)=>{
    try{
        let result=await Invoice.find({companyname:req.params.id})
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