const express = require('express')
const CreditNote = require('../modals/creditNoteModal')
const { ProductionStore } = require('./../modals/store/productionStore')
const Company = require('../modals/companyModal')
const SisterStock = require('../modals/sisterStock')
router = express.Router()
router.delete('/creditNoteDelete/:id/:companyname',async(req,res)=>{
  try{
  let f=await CreditNote.findByIdAndDelete(req,params.id)
  res.send({
    message:"data is successfully deleted",
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
router.put('/creditNoteUpdate/:id/:companyname',async(req,res)=>{
  try{
  let f=await CreditNote.findByIdAndUpdate(req,params.id,req.body,{runValidators: true })
  res.send({
    message:"data is successfully updated",
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

router.post('/creditNoteCreate', async (req, res) => {
  try {
    let { type, role } = req.query;
    let js = { ...req.body, companyname: type }
    let data = await CreditNote.find({ companyname: type })
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    js.mov = max;
    let { item, onAccount } = req.body
    let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
    js.total = total
    let creditnote = new CreditNote(js);
    await creditnote.save();
    if (onAccount) {
      //do nothing 
    }
    else{
      for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
        console.log(type)
        const f = await ProductionStore.updateOne(
          { companyname:type,'readyStock.id':id },
          { $inc: { "readyStock.$[elem].quantity": +quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );

      }

    }

    res.send({
      message: "data is successfully added",
      success: true,


    })


  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,



    })

  }
})
module.exports = router