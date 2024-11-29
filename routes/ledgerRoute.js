const express = require('express')
const Invoice = require('../modals/invoiceModal')
const DebitNote = require('../modals/debitNodeModal')
const CreditNote=require('../modals/creditNoteModal')
const ClientPayment=require('../modals/clientPayment/clientPayment')
const Inward=require('../modals/store/inwardModal')
const SuppPayment=require('../modals/supplierPayment/supPayment')
router = express.Router();
/*router.get('/allSuppOutStanding/:companyname',async(req,res)=>{

   try{
     let data=await Inward.aggregate([
       {
         $match:{
         
          'companyname':req.params.companyname
         }
       },
       {
          
          $group:{
             _id:"$clientDetail.id",
             fcAmount: { $first: "$clientDetail.fcAmount" }, // Get the first fcAmount
             fcDays: { $first: "$clientDetail.fcDays" },
             client: { $first: "$clientDetail.client" },
             branch:{ $first: "$clientDetail.Branch" },
             totalpending:{$sum:"$pendingAmount"},
          }
       }
    ])
    res.send({
       message:"data is successfully fetched",
       success:true, 
       data:data
    })

   }
   catch(err){
    res.send({
       message:err.message,
       success:false, 
    })

   }



})
*/


router.get('/allClientOutStanding/:companyname',async(req,res)=>{

     try{
       let data=await Invoice.aggregate([
         {
           $match:{
           
            'companyname':req.params.companyname
           }
         },
         {
            
            $group:{
               _id:"$clientDetail.id",
               fcAmount: { $first: "$clientDetail.fcAmount" }, // Get the first fcAmount
               fcDays: { $first: "$clientDetail.fcDays" },
               client: { $first: "$clientDetail.client" },
               branch:{ $first: "$clientDetail.Branch" },
               totalpending:{$sum:"$pendingAmount"},
            }
         }
      ])
      res.send({
         message:"data is successfully fetched",
         success:true, 
         data:data
      })

     }
     catch(err){
      res.send({
         message:err.message,
         success:false, 
      })

     }



})





router.get('/allTransaction/:companyname/:cid',async(req,res)=>{
  let finalarr=[];
    try{
    let {companyname,cid}=req.params
    
    let invoiceData=await Invoice.find({companyname:companyname,'clientDetail.id':cid})
    let creditData=await CreditNote.find({companyname:companyname,'clientDetail.id':cid})
    let narr=invoiceData.reduce((acc,curr)=>{
         let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
          if(f){
             f.invarr.push({mov:curr.mov,total:curr.total})
             return acc
 
         
          }
          else{
             let js={mov:curr.mov,total:curr.total}
             acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
            
             return acc
 
          }
        },[])
      
     
        let carr=creditData.reduce((acc,curr)=>{
         let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
         if(f){
           
            f.invarr.push({mov:curr.mov,total:curr.total})
            return acc

        
         }
         else{
          
            let js={mov:curr.mov,total:curr.total}
            acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
           
            return acc

         }
       },[])
   
   
  
 

   
   let paymentData=await ClientPayment.find({companyname:companyname,cid:cid})
   let arr= paymentData.reduce((acc,curr)=>{
      let f=acc.find(elem=>elem.date==curr.paymentDate)
         if(f){
            let f=acc.find(elem=>elem.date==curr.paymentDate)
            let js={invoiceList:curr.invoiceList}
            f.parr.push(js)
            return acc

        
         }
         else{
          
            let js={invoiceList:curr.invoiceList}
          
            acc.push({date:curr.paymentDate,parr:[js]})
            return acc

         }
       },[])
    
     
    res.send({invoice:narr,payment:arr,creditarr:carr})
    }
    catch(err){
     res.send(err.message)
    }

    
   

})
router.get('/allCashTransaction/:companyname/:cid',async(req,res)=>{
   let finalarr=[];
     try{
     let {companyname,cid}=req.params
     
     let invoiceData=await Invoice.find({companyname:companyname,'clientDetail.id':cid})
     let creditData=await CreditNote.find({companyname:companyname,'clientDetail.id':cid})
     let narr=invoiceData.reduce((acc,curr)=>{
          let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
           if(f){
              f.invarr.push({mov:curr.mov,total:curr.total})
              return acc
  
          
           }
           else{
              let js={mov:curr.mov,total:curr.total}
              acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
             
              return acc
  
           }
         },[])
       
      
         let carr=creditData.reduce((acc,curr)=>{
          let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
          if(f){
            
             f.invarr.push({mov:curr.mov,total:curr.total})
             return acc
 
         
          }
          else{
           
             let js={mov:curr.mov,total:curr.total}
             acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
            
             return acc
 
          }
        },[])
   
    const paymentMethod = "CASH";  
    
    let paymentData=await ClientPayment.find(
      {
         companyname: companyname,
         paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
     }
    )
    let arr= paymentData.reduce((acc,curr)=>{
       let f=acc.find(elem=>elem.date==curr.paymentDate)
          if(f){
             let f=acc.find(elem=>elem.date==curr.paymentDate)
             let js={invoiceList:curr.invoiceList}
             f.parr.push(js)
             return acc
 
         
          }
          else{
           
             let js={invoiceList:curr.invoiceList}
           
             acc.push({date:curr.paymentDate,parr:[js]})
             return acc
 
          }
        },[])
     
      
     res.send({invoice:narr,payment:arr,creditarr:carr})
     }
     catch(err){
      res.send(err.message)
     }
 
     
    
 
 })
 

router.get('/allTransactionSupp/:companyname/:sid',async(req,res)=>{
     try{
     let {companyname,sid}=req.params
     let debitData=await DebitNote.find({companyname:companyname,'clientDetail.id':sid})
     let carr=debitData.reduce((acc,curr)=>{
      let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
      if(f){
        
         f.invarr.push({mov:curr.mov,total:curr.total})
         return acc

     
      }
      else{
       
         let js={mov:curr.mov,total:curr.total}
         acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
        
         return acc

      }
    },[])



     let inwardData=await Inward.find({companyname:companyname,'sid':sid})
     let narr=inwardData.reduce((acc,curr)=>{
          let f=acc.find(elem=>elem.date==curr.dateCreated)
           if(f){
              f.invarr.push({mov:curr.mov,total:curr.total})
              return acc
           }
           else{
              let js={mov:curr.mov,total:curr.total}
              acc.push({date:curr.dateCreated,invarr:[js]})
              return acc
  
           }
         },[])
 
    
   let paymentData=await SuppPayment.find({companyname:companyname,sid:sid})
    let arr= paymentData.reduce((acc,curr)=>{
          let f=acc.find(elem=>elem.date==curr.paymentDate)
          if(f){
             f.parr.push({'invoiceList':curr.inwardList})
             return acc
          }
          else{
           
             acc.push({date:curr.paymentDate,parr:[{'invoiceList':curr.inwardList}]})
             return acc
 
          }
        },[])
      
     res.send({inward:narr,payment:arr,carr:carr})
     }
     catch(err){
      res.send(err.message)
     }
 
     
    
 
 })

 router.get('/allCashTransactionSupp/:companyname/:sid',async(req,res)=>{
   const paymentMethod = "CASH"; 
   try{
   let {companyname,sid}=req.params
   let debitData=await DebitNote.find({companyname:companyname,'clientDetail.id':sid})
   let carr=debitData.reduce((acc,curr)=>{
    let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
    if(f){
      
       f.invarr.push({mov:curr.mov,total:curr.total})
       return acc

   
    }
    else{
     
       let js={mov:curr.mov,total:curr.total}
       acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
      
       return acc

    }
  },[])

   let inwardData=await Inward.find({
      companyname: companyname,
      sid:sid,
      paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
   })
   let narr=inwardData.reduce((acc,curr)=>{
        let f=acc.find(elem=>elem.date==curr.dateCreated)
         if(f){
            f.invarr.push({mov:curr.mov,total:curr.total})
            return acc
         }
         else{
            let js={mov:curr.mov,total:curr.total}
            acc.push({date:curr.dateCreated,invarr:[js]})
            return acc

         }
       },[])


 let paymentData=await SuppPayment.find({
   companyname: companyname,
   paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
})
  let arr= paymentData.reduce((acc,curr)=>{
        let f=acc.find(elem=>elem.date==curr.paymentDate)
        if(f){
           f.parr.push({'invoiceList':curr.inwardList})
           return acc
        }
        else{
         
           acc.push({date:curr.paymentDate,parr:[{'invoiceList':curr.inwardList}]})
           return acc

        }
      },[])
    
   res.send({inward:narr,payment:arr,carr:carr})
   }
   catch(err){
    res.send(err.message)
   }

})
 





module.exports=router

