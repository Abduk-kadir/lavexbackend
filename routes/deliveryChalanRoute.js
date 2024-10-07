const express=require('express')
const DeliveryChalan=require('../modals/deliveryChalan')
const {ProductionStore}=require('../modals/store/productionStore')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
const Company=require('../modals/companyModal')
const Suppler=require('../modals/supplierModal')
router=express.Router()
router.post('/deliveryChalanCreate',async(req,res)=>{
    let {type,role}=req.query
    let {item}=req.body
    try{
     let js={...req.body,companyname:type}
     let data=await DeliveryChalan.find({companyname:type})
     let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
     max=max+1;
     js.mov=max;



     let delivery=new DeliveryChalan(js);
     await delivery.save();
     
     if(role=='master'){
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
      const branch = req.body.clientDetail.Branch.trim().toUpperCase();
      let isSister=await Company.findOne({Branch:branch})
        console.log('is isister',isSister)
        if(isSister){
          //let js={address:body.clientDetail.address,gstNumber:body.clientDetail.gstNumber,total:total,pendingAmount:total,sid:type,dateCreated:req.body.invoiceDetail.invoiceDate,companyname:isSister._id,readyStock:item}
          let js={sid:type,dateCreated:req.body.invoiceDetail.invoiceDate,companyname:isSister._id,readyStock:item}
          let sisterstore=new SisterStore(js)
          await sisterstore.save()
          let mascompany =await Company.findById(type)
          let s=await Supplier.findById(mascompany._id)
          if(!s){
        
          let {Branch,company,address,area,email,state,gstNumber,pincode,panNumber,contactPerson,mobile1,mobile2,city,stateCode}=mascompany
          let js2={_id:mascompany._id,companyname:isSister._id,supplier:company+' '+Branch,address:address,email:email,area:area,state:state,gstNumber:gstNumber,pincode:pincode,panNumber:panNumber,contactPerson:company,mobile1:mobile1,mobile2:mobile2,city:city,stateCode:stateCode}
          let sup=new Supplier(js2);
          await  sup.save()
          }




        }

     }
     else{
     //in sister company

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

router.get('/chalan/:id/:name',async(req,res)=>{
    console.log(req.params.id)
    console.log(req.params.name)
    console.log('hi arman')
   
     try{
      let result=await DeliveryChalan.find({$and:[{companyname:req.params.name},{'clientDetail.id':req.params.id}]})
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