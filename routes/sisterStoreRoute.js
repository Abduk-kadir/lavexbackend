const express=require('express');
const router=express.Router()
const SisterStore=require('../modals/sisterStore')
const SisterStock=require('../modals/sisterStock')
router.put("/changestatus/:id/", async (req, res) => {
    let parr = [];
    try { 
      let status = req.body.status;
      let prod = await SisterStore.findOne({_id: req.params.id });
       let result = await SisterStore.updateOne(
        { _id: req.params.id,companyname:prod.companyname},
        { $set: { status: req.body.status } }
      )
      let preStatus = prod.status;
      console.log("previsous status:", preStatus);
      console.log("current status", status);
      if (status == "canceled") {
        if (preStatus == "pending") {
          await SisterStore.deleteOne({ _id: req.params.id,companyname:prod.companyname });
        } else if (preStatus == "confirmed") {
          let {readyStock } = prod;
         
         for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          const f = await SisterStock.updateOne(
            {companyname:prod.companyname,'readyStock.id':id},
            { $inc: { "readyStock.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
        
        await SisterStore.deleteOne({ _id: req.params.id,companyname:prod.companyname });
         
        }
      }
  

      if (status == "pending" && preStatus == "confirmed") {
        let {readyStock } = prod;
        for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          const f = await SisterStock.updateOne(
            {companyname:prod.companyname,'readyStock.id':id},
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
            {companyname:prod.companyname,'readyStock.id':id},
            { $inc: { "readyStock.$[elem].quantity": quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
          if (f.matchedCount == 0) {
            let elem = readyStock[i];
            parr.push(elem);
          }
        }
        if (parr.length > 0) {
          let product = new SisterStock({companyname:prod.companyname, readyStock: parr });
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

module.exports=router  
  