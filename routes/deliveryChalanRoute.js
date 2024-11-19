const express=require('express')
const DeliveryChalan=require('../modals/deliveryChalan')
const {ProductionStore}=require('../modals/store/productionStore')
const SisterStock=require('../modals/sisterStock')
const SisterStore=require('../modals/sisterStore')
const Company=require('../modals/companyModal')
const Supplier=require('../modals/supplierModal')
const invoice=require('../modals/invoiceModal')

router=express.Router()
router.put('/changeStatus',async(req,res)=>{

  try{
    let body=req.body
    let dc=body;
    for(let i=0;i<dc.length;i++){
      db.products.updateOne(
        { _id: dc.id },
        { $set:
           {
            iscomplete:true
           }
        }
     )
    
    }
    res.send({
      message:'status is changed',
      success:true
    })
  }
  catch(err){
    res.send({
      message:err.message,
      sussess:false
    })

  }

})

router.put('/deliveryUpdate/:id/:companyname',async(req,res)=>{
  try{
     let f=await invoice.findOne({companyname:req.params.companyname,selectDc:req.params.id})
     if(f){
      res.send({
        message:"can not update it is used in invoices",
        success:true,
     })

     }
     else{
       await DeliveryChalan.findByIdAndUpdate(req.params.id,req.body, {runValidators: true })
       res.send({
        message:"data is successfully updated",
        success:true,
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


router.delete('/deliveryDelete/:id/:companyname',async(req,res)=>{
  try{
    let f=await invoice.findOne({companyname:req.params.companyname,selectDc:req.params.id})
     if(f){
      res.send({
        message:"can not delete it is used in invoices",
        success:true,
     })

     }
     else{
       await DeliveryChalan.findByIdAndDelete(req.params.id)
       res.send({
        message:"data is successfully updated",
        success:true,
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




router.post('/deliveryChalanCreate',async(req,res)=>{
    let {type,role}=req.query
    let {item}=req.body
    let {body}=req
    try{
     let js={...req.body,companyname:type}
     let data=await DeliveryChalan.find({companyname:type})
     let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
     max=max+1;
     js.mov=max;
     let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
     js.total=total
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
       
        if(isSister){
          let total=item.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
          let mascompany =await Company.findById(type)
          let s=await Supplier.findOne({companyname:isSister._id,supplier:mascompany.company+' '+mascompany.Branch}) 
          if(!s){
            let {Branch,company,address,area,email,state,gstNumber,pincode,panNumber,contactPerson,mobile1,mobile2,city,stateCode}=mascompany
            let js2={companyname:isSister._id,supplier:company+' '+Branch,address:address,email:email,area:area,state:state,gstNumber:gstNumber,pincode:pincode,panNumber:panNumber,contactPerson:company,mobile1:mobile1,mobile2:mobile2,city:city,stateCode:stateCode}
            let sup=new Supplier(js2);
            s= await  sup.save()
            }
            let js={address:body.clientDetail.address,gstNumber:body.clientDetail.gstNumber,total:total,pendingAmount:total,sid:s._id,dateCreated:req.body.invoiceDetail.invoiceDate,companyname:isSister._id,readyStock:item}
            js.total=total;
            js.pendingAmount=total;
            let sisterstore=new SisterStore(js)
            await sisterstore.save()




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