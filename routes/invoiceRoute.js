const express=require('express')
const Invoice=require('../modals/invoiceModal')
const DeliveryChalan=require('../modals/deliveryChalan')
const Company=require('../modals/companyModal')
router=express.Router();
const {ProductionStore,ProductionStore2}=require('./../modals/store/productionStore')
const SisterStore=require('../modals/sisterStore');
const SisterStock=require('../modals/sisterStock')
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
     let total=item.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
     js.total=total;
     js.pendingAmount=total;
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
      
      
        const branch = req.body.clientDetail.Branch.trim().toUpperCase();
        let isSister=await Company.findOne({Branch:branch})
        console.log('is isister',isSister)
        if(isSister){
          let js={total:total,pendingAmount:total,sid:type,dateCreated:req.body.invoiceDetail.invoiceDate,companyname:isSister._id,readyStock:item}
          let sisterstore=new SisterStore(js)
          await sisterstore.save()
        }
       
      }
      else{
        
        console.log('hi i am sister compmany')
        for (let i = 0; i <item.length; i++) {
          let { id, quantity } = item[i];
          const f = await SisterStock.updateOne(
            { companyname:type,'readyStock.id':id },
            { $inc: { "readyStock.$[elem].quantity":-quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
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
         res.send({
          message:"invoice is fetched successfully fetched",
          success:true,
          data:result}
        )
        

       
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
router.get('/getinvoice/:clientid/:name',async(req,res)=>{
  console.log(req.params.number)
   try{
    let result=await Invoice.find({$and:[{ "clientDetail.id":req.params.clientid},{companyname:req.params.name}]})
    if(result.length==0){
      res.send({
          message:"no invoice is generated from this client",
          success:false
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
         

      })
   }

})





module.exports=router