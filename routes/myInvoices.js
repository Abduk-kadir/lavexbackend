const express=require('express');
const DebitNote=require('../modals/debitNodeModal')
const Porfarma=require('../modals/performaModal')
const Invoice=require('../modals/invoiceModal')
const creditNote=require('../modals/creditNoteModal')
const router=express.Router();
let arr=null
let pagearr=[]
let f;

router.get('/myInvoices',async(req,res)=>{
   
    let {type,page=1,limit=2}=req.query
    page=+page;
    limit=+limit;
    let start=(page-1)*limit
    let end=start+limit
    console.log(`page=${page} and limit=${limit} and type=${type}`)
     switch(type){
        case "proforma":
            arr=await Porfarma.find({},{'clientDetail.client':1,'porfarmaDetail.invoiceDate':1,item:1})
            arr= arr.map(elem=>{
                  
              let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
             let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
             let js={withgstTotal:val2+val,withoutgstTotal:val2,client:elem.clientDetail.client,type:elem.t,date:elem.porfarmaDetail.invoiceDate}
              return js
         
        })
            break;
            case "invoice":
            arr=await Invoice.find({},{'clientDetail.client':1,'invoiceDetail.invoiceDate':1,item:1})
            arr= arr.map(elem=>{
                  
              let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
             let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
             let js={withgstTotal:val2+val,withoutgstTotal:val2,client:elem.clientDetail.client,type:elem.t,date:elem.invoiceDetail.invoiceDate}
              return js
         
         })
            break;
            case "creditnote":
            
            arr=await creditNote.find({},{'clientDetail.client':1,'creditNoteDetail.fromDate':1,item:1})
            arr= arr.map(elem=>{
                  
              let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
             let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
             let js={withgstTotal:val2+val,withoutgstTotal:val2,clientDetail:elem.clientDetail.client,type:elem.t,date:elem.creditNoteDetail.fromDate}
              return js
         
        })
            break;

            case "debitnote":
             console.log('in debit note') 
             arr=await DebitNote.find({},{'suplierDetail.suplier':1,'debitNoteDetail.fromDate':1,item:1})
            
            let agg= await DebitNote.aggregate([{$unwind:{path:"$item"}},{$group:{_id:"$_id",total:{$sum:{$subtract:[{ $multiply: [ "$item.price", "$item.quantity" ] },"$item.gst"]}   },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}])
            console.log(agg)
             arr= arr.map(elem=>{
                  
                  let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
                 let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
                 let js={withgstTotal:val2+val,withoutgstTotal:val2,suplier:elem.suplierDetail.suplier,type:elem.t,date:elem.debitNoteDetail.fromDate}
                  return js
             
            })
            
            
            break;
            default:
               console.log('in nothig field')
                let arr1=await Porfarma.find({},{'clientDetail.client':1,'porfarmaDetail.invoiceDate':1,item:1})
                arr1= arr1.map(elem=>{
                  
                  let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
                 let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
                 let js={withgstTotal:val2+val,withoutgstTotal:val2,client:elem.clientDetail.client,type:elem.t,date:elem.porfarmaDetail.invoiceDate}
                  return js
             
            })

           

                let arr2=await Invoice.find({},{'clientDetail.client':1,'invoiceDetail.invoiceDate':1,item:1})
                arr2= arr2.map(elem=>{
                  
                  let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
                 let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
                 let js={withgstTotal:val2+val,withoutgstTotal:val2,client:elem.clientDetail.client,type:elem.t,date:elem.invoiceDetail.invoiceDate}
                  return js
             
             })


                let arr3=await creditNote.find({},{'clientDetail.client':1,'creditNoteDetail.fromDate':1,item:1})
                arr3= arr3.map(elem=>{
                  
                  let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
                 let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
                 let js={withgstTotal:val2+val,withoutgstTotal:val2,clientDetail:elem.clientDetail.client,type:elem.t,date:elem.creditNoteDetail.fromDate}
                  return js
             
            })
                let arr4=await DebitNote.find({},{'suplierDetail.suplier':1,'debitNoteDetail.fromDate':1,item:1})
                arr4= arr4.map(elem=>{
                  
                  let val= elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity*curr.gst/100,0)
                 let val2=elem.item.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
                 let js={withgstTotal:val2+val,withoutgstTotal:val2,suplier:elem.suplierDetail.suplier,type:elem.t,date:elem.debitNoteDetail.fromDate}
                  return js
             
            })
            
                arr=[...arr1,arr2,arr3,arr4]

           
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



