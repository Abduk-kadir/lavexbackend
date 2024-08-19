const express=require('express')
const Porfarma=require('../modals/performaModal')
const {ProductionStore}=require('../modals/store/productionStore')
router=express.Router()
router.post('/porpharmaCreate',async(req,res)=>{
    let {type}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}
    try{
     let porfarma=new Porfarma(js);
     await porfarma.save();

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


module.exports=router