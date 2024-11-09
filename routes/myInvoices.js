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

router.get('/totalinvoice',async(req,res)=>{
  try{
    let {fromDate,toDate,companyname } = req.query;
    console.log(fromDate,toDate,companyname)
    let jsdata={}
    if (fromDate && toDate) {
      let invoicedata = await Invoice.find({companyname:companyname})
      let deliveryData=await Deliverynote.find({companyname:companyname})
      let creditdata=await creditNote.find({companyname:companyname})
      let debitData=await DebitNote.find({companyname:companyname})
      let porData=await Porfarma.find({companyname:companyname})

      const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
      const [dayTo, monthTo, yearTo] = toDate.split('-');
      const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
      const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);

      //invoice filter
      invoicedata = invoicedata.filter(item => {
        const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
        let itemDate = new Date(`${year}-${month}-${day}`);
        return itemDate >= from && itemDate <= to;
      });
     //delivery filter
     deliveryData = deliveryData.filter(item => {
      const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
      let itemDate = new Date(`${year}-${month}-${day}`);
      return itemDate >= from && itemDate <= to;
    });
    //debit filter 
   
     debitData=debitData.filter(item => {
      const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
      let itemDate = new Date(`${year}-${month}-${day}`);
      return itemDate >= from && itemDate <= to;
    });
     //credit filter
    creditdata=creditdata.filter(item => {
      const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
      let itemDate = new Date(`${year}-${month}-${day}`);
      return itemDate >= from && itemDate <= to;
    });

     //porfarma filter
     porData=porData.filter(item => {
      const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
      let itemDate = new Date(`${year}-${month}-${day}`);
      return itemDate >= from && itemDate <= to;
    });
    //invoice chart
     let pm='',py=''
     let count=0
     invoicedata=invoicedata.reduce((acc,curr)=>{
      const [cday,cmonth, cyear] = curr.invoiceDetail.invoiceDate.split('-');
      if(pm==cmonth&&py==cyear){
        console.log('invoice date:',curr.invoiceDetail.invoiceDate)
        let f=acc.find(elem2=>elem2.date[3]==curr.invoiceDetail.invoiceDate[3])
        if(f){f.count+=1,f.total+=curr.total}
        return acc
      } 
      else{
        pm=cmonth
        py=cyear  
        let js={date:curr.invoiceDetail.invoiceDate,count:1,total:curr.total}
        acc.push(js)
        console.log('acc is:',acc)
        return acc

      } 
   
     },[]) 

     //delivery chart
      pm='',py=''
   
     deliveryData=deliveryData.reduce((acc,curr)=>{
      const [cday,cmonth, cyear] = curr.invoiceDetail.invoiceDate.split('-');
      if(pm==cmonth&&py==cyear){
        console.log('invoice date:',curr.invoiceDetail.invoiceDate)
        let f=acc.find(elem2=>elem2.date[3]==curr.invoiceDetail.invoiceDate[3])
        if(f){f.count+=1,f.total+=curr.total}
        return acc
      } 
      else{
        pm=cmonth
        py=cyear  
        let js={date:curr.invoiceDetail.invoiceDate,count:1,total:curr.total}
        acc.push(js)
        console.log('acc is:',acc)
        return acc

      } 
   
     },[]) 
     //debitchart
     pm='',py=''
     debitData=debitData.reduce((acc,curr)=>{
      const [cday,cmonth, cyear] = curr.invoiceDetail.invoiceDate.split('-');
      if(pm==cmonth&&py==cyear){
        console.log('invoice date:',curr.invoiceDetail.invoiceDate)
        let f=acc.find(elem2=>elem2.date[3]==curr.invoiceDetail.invoiceDate[3])
        if(f){f.count+=1,f.total+=curr.total}
        return acc
      } 
      else{
        pm=cmonth
        py=cyear  
        let js={date:curr.invoiceDetail.invoiceDate,count:1,total:curr.total}
        acc.push(js)
        console.log('acc is:',acc)
        return acc

      } 
   
     },[]) 
     //creditchart
     pm='',py=''
     creditdata=creditdata.reduce((acc,curr)=>{
      const [cday,cmonth, cyear] = curr.invoiceDetail.invoiceDate.split('-');
      if(pm==cmonth&&py==cyear){
        console.log('invoice date:',curr.invoiceDetail.invoiceDate)
        let f=acc.find(elem2=>elem2.date[3]==curr.invoiceDetail.invoiceDate[3])
        if(f){f.count+=1,f.total+=curr.total}
        return acc
      } 
      else{
        pm=cmonth
        py=cyear  
        let js={date:curr.invoiceDetail.invoiceDate,count:1,total:curr.total}
        acc.push(js)
        console.log('acc is:',acc)
        return acc

      } 
   
     },[]) 
      //porfarmachart
      pm='',py=''
      porData=porData.reduce((acc,curr)=>{
       const [cday,cmonth, cyear] = curr.invoiceDetail.invoiceDate.split('-');
       if(pm==cmonth&&py==cyear){
         console.log('invoice date:',curr.invoiceDetail.invoiceDate)
         let f=acc.find(elem2=>elem2.date[3]==curr.invoiceDetail.invoiceDate[3])
         if(f){f.count+=1,f.total+=curr.total}
         return acc
       } 
       else{
         pm=cmonth
         py=cyear  
         let js={date:curr.invoiceDetail.invoiceDate,count:1,total:curr.total}
         acc.push(js)
         console.log('acc is:',acc)
         return acc
 
       } 
    
      },[]) 

     

     jsdata.invoice=invoicedata
     jsdata.delivery=deliveryData
     jsdata.debitData=debitData
     jsdata.creditdata=creditdata
     jsdata.porData=porData
      res.send({
        message:'data is fetched successfully',
        success:true,
        data:jsdata

      })

    }
    else{
      res.send({
        message:'please select date',
        success:false,
        data:null
      })

    }
     
    

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
         
            {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
            total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
            { $sort: { mov: 1 } }
            //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])
            break;
            case "invoice":
              console.log('armab')
              arr= await Invoice.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
              
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
                { $sort: { mov: 1 } }
                
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              
              ])
            break;
            case "creditnote":
             arr= await creditNote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
      
              {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
              { $sort: { mov: 1 } }
             // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])
          
            break;

            case "debitnote":
             
            arr= await DebitNote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
            
              {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
              { $sort: { mov: 1 } }
            ])
            console.log('debitarr,',arr)
             break;
            case "deliverynote":
             arr= await Deliverynote.aggregate([
              {$unwind:{path:"$item"}},
              {$match:{companyname:req.query.companyname}},
           
              {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
              total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
              { $sort: { mov: 1 } }
              //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
            ])   
          
            
            
            break;
            default:
              let arr1= await Porfarma.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
              
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
                { $sort: { mov: 1 } }
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
             
            
              let  arr2= await Invoice.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}},
                { $sort: { mov: 1 } }
                //{$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
             
              let  arr3= await creditNote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                ,{ $sort: { mov: 1 } }
               // {$group:{_id:"$_id", client: { $first: "$clientDetail.client" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])

              let  arr4= await DebitNote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                ,{ $sort: { mov: 1 } }
                //{$group:{_id:"$_id", client: { $first: "$clientDetail.suplier" },total:{$sum:{$add:[{ $multiply: [ "$item.price", "$item.quantity" ] },{"$divide":["$item.gst",100]}]} },totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
              ])
              
              let  arr5= await Deliverynote.aggregate([
                {$unwind:{path:"$item"}},
                {$match:{companyname:req.query.companyname}},
                {$group:{_id:"$_id",mov:{$first:"$mov"},client: { $first: "$clientDetail.client" },date: { $first: "$invoiceDetail.invoiceDate" },status:{ $first: "$status" },
                total: {$sum:{$multiply: ["$item.price","$item.quantity",{ $add: [1, { $divide: ["$item.gst", 100] }] }]}},totalwithoutgst:{$sum:{ $multiply: [ "$item.price", "$item.quantity" ] }}}}
                ,{ $sort: { mov: 1 } }
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


router.get('/InvoiceDetail/:companyname/:type/:id',async(req,res)=>{
  console.log('fhfjdnjjkhjhjkh')
  try{
      let result;
      let type=req.params.type
      console.log(type)
       if(type=='invoice'){
         result=await Invoice.findOne({companyname:req.params.companyname,_id:req.params.id})
       }
       else if(type=='proforma'){
         result=await Porfarma.findOne({companyname:req.params.companyname,_id:req.params.id})
       }
       else if(type=='creditnote'){
         result=await creditNote.findOne({companyname:req.params.companyname,_id:req.params.id})
       }
       else if(type=='debitnote'){
         result=await DebitNote.findOne({companyname:req.params.companyname,_id:req.params.id})
       }
       else if(type=='deliverynote'){
        console.log('indelivery note')
        result=await Deliverynote.findOne({companyname:req.params.companyname,_id:req.params.id})
       }
     
     
     
     



       res.send({
        message:"invoice is fetched successfully fetched",
        success:true,
        data:result}
      )
      

     
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



