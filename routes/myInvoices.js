const express=require('express');
const DebitNote=require('../modals/debitNodeModal')
const Porfarma=require('../modals/performaModal')
const Invoice=require('../modals/invoiceModal')
const creditNote=require('../modals/creditNoteModal')
const Deliverynote=require('../modals/deliveryChalan')
const router=express.Router();
const Company=require('../modals/companyModal')
let arr=null
let pagearr=[]
let f;

router.get('/totalinvoice/:name',async(req,res)=>{
  try{
     let result1=await Invoice.aggregate([{$match:{companyname:req.params.name}},{$group:{_id:"$companyname",invoices:{$sum:1}}}])
     let result2=await Porfarma.aggregate([{$match:{companyname:req.params.name}},{$group:{_id:"$companyname",proforma:{$sum:1}}}])
     let result3=await creditNote.aggregate([{$match:{companyname:req.params.name}},{$group:{_id:"$companyname",creditnote:{$sum:1}}}])
     let result4=await DebitNote.aggregate([{$match:{companyname:req.params.name}},{$group:{_id:"$companyname",debitnote:{$sum:1}}}])
     let newarr=[...result1,...result2,...result3,...result4]
     res.send(newarr)
    

  }
  catch(err){
    res.send({
      message:err.message
    })

  }
})



router.get('/myInvoices',async(req,res)=>{
   console.log('fkjdhfjdhfjhfhfgh')
    let {type,page=1,limit=2}=req.query
    page=+page;
    limit=+limit;
    let start=(page-1)*limit
    let end=start+limit
    console.log(`page=${page} and limit=${limit} and type=${type}`)
     switch(type){
        case "proforma":
           arr= await Porfarma.aggregate([
            {$unwind:{path:"$item"}},
            {$match:{companyname:req.query.companyname}},
            { $sort: { createdAt: 1 } },
            {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
            total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])
            break;
            case "invoice":
              console.log('armab')
              arr= await Invoice.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              
              ])
            break;
            case "creditnote":
             arr= await creditNote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
              { $sort: { createdAt: 1 } },
              {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
             // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])
          
            break;

            case "debitnote":
              console.log('hi debit')
             arr= await DebitNote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
              { $sort: { createdAt: 1 } },
              {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])
            console.log(arr)
             break;
            case "deliverynote":
             arr= await Deliverynote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
              { $sort: { createdAt: 1 } },
              {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])   
          
            
            
            break;
            default:
              let arr1= await Porfarma.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
             
            
              let  arr2= await Invoice.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
             
              let  arr3= await creditNote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])

              let  arr4= await DebitNote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                //{$group:{_id:"$_id", client: { $first: "$clientDetail.suplier" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
              
              let  arr5= await Deliverynote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                { $sort: { createdAt: 1 } },
                {$group:{_id:"$_id",client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.suplier" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
             arr=[...arr1,...arr2,...arr3,...arr4,...arr5]

           
    }
    let newarr=[];
    for(let i=start;i<end;i++){
      if(arr[i]==null){

      }
      else{
      newarr.push(arr[i])
      }

    }
    
    
        res.send({
            "message":"data is successfully fetched",
            "success":true,
            "data":newarr,
            "length":newarr.length
           
        })
    
    

})


router.delete('/delete/:type/:id',async(req,res)=>{
 

   let {type,id}=req.params
   if(type=='porforma'){
    try{
      let result = await Porfarma.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='invoice'){
    try{
      let result = await Invoice.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='creditnote'){
    try{
      let result = await creditNote.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
  
  if(type=='debitnote'){
    try{
      let result = await DebitNote.deleteOne({ _id:id })
      if(result.deletedCount){
      res.send({
        message:" data is successfully deleted",
        success:true
      })
    }
    else{
        res.send({
            message:" please provide correct id",
            success:true
          })
    }
     
      
    }
    catch(err){
        res.send({
            message:'please provide correct id',
            success:false
          })


    }
  }
    
  else{
     res.send({
      message:"please fill correct type which we have to delete",
      success:null


     })
  }
 
         
  
})


router.put('/update/:type/:id',async(req,res)=>{
  let {type,id}=req.params
  let {body}=req
  let result;
 

  try{
    switch(type){
    case 'porforma':
     console.log('inporfarma') 
     result =await Porfarma.findByIdAndUpdate(id,body)
     console.log('result')
       break;
      
    case 'invoice':
       console.log('invoice')
      result=await Invoice.findByIdAndUpdate(id,body)
      console.log(result)
    
     break;

     case 'creditnote':
     result= await creditNote.findByIdAndUpdate(id,body)
      break;
     
    case 'debitnote':
      result=await DebitNote.findByIdAndUpdate(id,body)
      break;
    
    }
    if(result){
    res.send({
      message:'data is successfully updated',
      success:true,
      data:body
    })
  }
  else{
    res.send({
      message:'please fill correct id or type',
      success:false,
      data:body
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
  

module.exports=router;



