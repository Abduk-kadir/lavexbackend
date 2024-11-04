const express=require('express');
const router=express.Router()
const SisterStore=require('../modals/sisterStore')
const SisterStock=require('../modals/sisterStock')
router.put("/changestatus/:id/:companyId", async (req, res) => {
    let parr = [];
    try { 
      let status = req.body.status;
      let prod = await SisterStore.findOne({_id: req.params.id,companyname:req.params.companyId});
       let result = await SisterStore.updateOne(
        { _id: req.params.id,companyname:req.params.companyId},
        { $set: { status: req.body.status } }
      )
      let preStatus = prod.status;
      console.log("previsous status:", preStatus);
      console.log("current status", status);
      if (status == "canceled") {
        if (preStatus == "pending") {
         // await SisterStore.deleteOne({ _id: req.params.id,companyname:req.params.companyId });
        } else if (preStatus == "confirmed") {
          let {readyStock } = prod;
         
         for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          const f = await SisterStock.updateOne(
            {companyname:req.params.companyId,'readyStock.id':id},
            { $inc: { "readyStock.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
       // await SisterStore.deleteOne({ _id: req.params.id,companyname:req.params.companyId });
         
        }
      }
  

      if (status == "pending" && preStatus == "confirmed") {
        let {readyStock } = prod;
        for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          const f = await SisterStock.updateOne(
            {companyname:req.params.companyId,'readyStock.id':id},
            { $inc: { "readyStock.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
        
      }
  






      
    
      if (status == "confirmed" && preStatus != "confirmed") {
        let {readyStock } = prod;
        for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          const f = await SisterStock.updateOne(
            {companyname:req.params.companyId,'readyStock.id':id},
            { $inc: { "readyStock.$[elem].quantity": quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
          if (f.matchedCount == 0) {
            let elem = readyStock[i];
            parr.push(elem);
          }
        }
        if (parr.length > 0) {
          let product = new SisterStock({companyname:req.params.companyId, readyStock: parr });
          await product.save();
        }
    
      }
      res.send({
        message: "status is successfully update",
        success: true,
      });
    } catch (err) {
      res.send({
        message: err.message,
        success: false,
      });
    }
  });

router.get('/cancelListSis/:companyname',async(req,res)=>{
   try{
   let data=await SisterStore.find({companyname:req.params.companyname,status:'canceled'})
   res.send({
    message:'data is successfully fetched',
    success:true,
    data:data
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



router.get('/allSisterStock/:id',async(req,res)=>{
  try{
  let data=await SisterStock.find({companyname:req.params.id})
  res.send({
    message:'data is fetched successfully',
    success: true,
    data:data
  });
  }
  catch(err){
    res.send({
      message:err.message,
      success:false,
      data:null
    });

  }
  
})  
router.get('/allSisterStorePending/:id',async(req,res)=>{
  try{
  let data=await SisterStore.find({companyname:req.params.id})
  res.send({
    message:'data is fetched successfully',
    success: true,
    data:data
  });
  }
  catch(err){
    res.send({
      message:err.message,
      success:false,
      data:null
    });

  }
  
})  
router.post('/addSisterInward/:companyname',async(req,res)=>{
  try{   
    let body=req.body;
    body.companyname=req.params.companyname
    let {readyStock}=body
   
    let total=readyStock.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
    console.log(total)
    body.pendingAmount=total
    body.total=total
    let inward=new SisterStore(body);
    await inward.save();
   
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
  