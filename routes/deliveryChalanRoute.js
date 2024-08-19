const express=require('express')
const DeliveryChalan=require('../modals/deliveryChalan')
const {ProductionStore}=require('../modals/store/productionStore')
router=express.Router()
router.post('/deliveryChalanCreate',async(req,res)=>{
    let {type}=req.query
    let {item}=req.body
    try{
     let js={...req.body,companyname:type}
     let delivery=new DeliveryChalan(js);
     await delivery.save();
     
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
      //ending

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

router.get('/chalan/:number/:name',async(req,res)=>{
    console.log(req.params.number)
    console.log(req.params.name)
   
     try{
      let result=await DeliveryChalan.findOne({$and:[{companyname:req.params.name},{'deliveryDetail.deliveryChNo':req.params.number}]})
      if(result==null){
        res.send({
            message:"please fill correct company name and invoiceNo",
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
            data:null

        })
     }
  
})

module.exports=router