const express=require('express')
const Porfarma=require('../modals/performaModal')
const {ProductionStore}=require('../modals/store/productionStore')
const Company=require('../modals/companyModal')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
router=express.Router()
router.post('/porpharmaCreate',async(req,res)=>{
   //here type is company id
    let {type,role}=req.query;
    let {item}=req.body
    let js={...req.body,companyname:type}
    try{
     let porfarma=new Porfarma(js);
     await porfarma.save();
     if(role=='master'){
      
       for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i];
        console.log(quantity, id);
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
      
      for (let i = 0; i <item.length; i++) {
        let { id, quantity } = item[i];
        const f = await SisterStock.updateOne(
          { companyname:type,'readyStock.id':id },
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
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


module.exports=router