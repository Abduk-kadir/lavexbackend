const express = require('express')
const Invoice = require('../../modals/cashmodals/cashInvoiceModal')
const DebitNote = require('../../modals/cashmodals/cashDebitNodeModal')
const CreditNote=require('../../modals/cashmodals/cashCreditNoteModal')
const ClientPayment=require('../../modals/cashmodals/cashClientPayment')
router = express.Router();
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
   
   
    
    let paymentData=await ClientPayment.find(
      {
         companyname: companyname,
        
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
 
module.exports=router

