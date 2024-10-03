let express=require('express')
let router=express.Router()
const Inward = require('../../modals/store/inwardModal');
const PurchaseStore = require('../../modals/store/purchaseStore');
const authMidd=require('..//../middleware/authmiddleware')
let SupplierPayment=require('../../modals/supplierPayment/supPayment')

router.put('/changestatus/:companyId/:id',async(req,res)=>{
    let parr=[]
    try{
      let status=req.body.status
      let prod=await   Inward.findOne({_id:req.params.id,companyname:req.params.companyId})
      let result=await Inward.updateOne({_id:req.params.id,companyname:req.params.companyId},{$set:{status:req.body.status}})
      let preStatus=prod.status
      console.log('previsous status:',preStatus)
      console.log('current status',status)
      if(status=='canceled'){
        if(preStatus=='pending'){
           // await Inward.deleteOne({companyname:req.params.companyId,_id:req.params.id})
            console.log('in pending')
        }
        else if(preStatus=='confirmed'){
            let {item}=prod;
            console.log('i am here');
            //here updating purchase store
            for(let i=0;i<item.length;i++){
                let {id,quantity}=item[i]  
                console.log(id)
                console.log(quantity)
                const f = await PurchaseStore.updateOne(
                    {companyname:req.params.companyId,'item.id':id},
                    { $inc: { "item.$[elem].quantity":-quantity } },
                    { arrayFilters: [{ "elem.id": id }] }
                  );
              
               
                }
           //await Inward.deleteOne({companyname:req.params.companyId,_id:req.params.id}) 
           

        }
      }
 
     

      if(status=='pending'&&preStatus=='confirmed'){
        let {item}=prod;
        console.log('i am here');
        //here updating purchase store
        for(let i=0;i<item.length;i++){
            let {id,quantity}=item[i]  
            console.log(id)
            console.log(quantity)
            const f = await PurchaseStore.updateOne(
                {companyname:req.params.companyId,'item.id':id},
                { $inc: { "item.$[elem].quantity":-quantity } },
                { arrayFilters: [{ "elem.id": id }] }
              );
          
           
            }
       
         //ending

       
        
          
        
        

      }

      if(status=='confirmed'&&preStatus!='confirmed'){
       let {item}=prod;
       console.log(req.params.companyId)
       console.log(req.params.id)
      //here updating purchase store
      for(let i=0;i<item.length;i++){
        let {id,quantity}=item[i]  
       
        const f = await PurchaseStore.updateOne(
            {companyname:req.params.companyId,'item.id':id},
            { $inc: { "item.$[elem].quantity": quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        console.log(f)
        if(f.matchedCount==0){
            let elem=item[i]
            parr.push(elem)
        }
        }
        if(parr.length>0){
          
            let purchaseStore=new PurchaseStore({companyname:req.params.companyId,item:parr})
            await purchaseStore.save()
           
        }
       //ending
    
      }
      res.send({
         message:'status is successfully update',
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

router.get('/allInward/:companyname',async(req,res)=>{
 
    try{
        let result=await Inward.find({companyname:req.params.companyname})
        res.send({
          message:"data is fetched successfully",
          success:true,
          data:result
  
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


router.post('/addinward3/:companyname',async(req,res)=>{

    try{
       
        let body=req.body;
        body.companyname=req.params.companyname
        let {item}=body
        let data=await Inward.find({companyname:req.params.companyname})
        let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
        max=max+1;
        body.mov=max;
       
         let total=item.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
         let baseAmount=item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
         
        body.pendingAmount=total
        body.total=total
        body.baseAmount=baseAmount
        
        let ind=await Inward.find({companyname:req.params.companyname,sid:body.sid})
       // console.log('invoice no:',ind.suplierInvoiceNo)
       // console.log('invoice no:',body.suplierInvoiceNo)
        if(ind[ind.length-1]?.suplierInvoiceNo==body?.suplierInvoiceNo){
           res.send({
            message:"invoice number can not be same",
            success:false
           })
        }
        else{
          let inward=new Inward(body);
          await inward.save();
         
          res.send({
              message:"data is successfully added",
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



router.put('/updateInward/:id',async(req,res)=>{
    let body=req.body
    let {item}=body
    try{
    let p=await SupplierPayment.findOne({inwardList: { $elemMatch: {inwardId:req.params.id} }})
    if(p){
      res.send({
        message:'this inward is using other places you you can not updae',
        success:false, 
     })  
    }
    else{
      let total=item.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
      let baseAmount=item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
      body.total=total
      body.baseAmount=baseAmount
      body.pendingAmount=total
      console.log(body.baseAmount)
      const updatedDocument = await Inward.findByIdAndUpdate(req.params.id,body , {
        runValidators: true // Ensure validation rules are applied
      })
      res.send({
        message:'inward is successfully updated',
        success:true, 
     })  


    }
    }
    catch(err){
      res.send(
        {
          message:err.message,
          success:false
        }
      )
    }
    

})


router.delete('/deleteInward/:id',async(req,res)=>{

  try{
  let p=await SupplierPayment.findOne({inwardList: { $elemMatch: {inwardId:req.params.id} }})
  if(p){
    res.send({
      message:'this inward is using other places you you can not delete',
      success:false, 
   })  
  }
  else{
    const updatedDocument = await Inward.findByIdAndDelete(req.params.id)
    res.send({
      message:'inward is successfully deleted',
      success:true, 
   })  


  }
  }
  catch(err){
    res.send(
      {
        message:err.message,
        success:false
      }
    )
  }
  

})







module.exports=router
