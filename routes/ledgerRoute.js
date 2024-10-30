const express = require('express')
const Invoice = require('../modals/invoiceModal')
const DebitNote = require('../modals/debitNodeModal')
const CreditNote=require('../modals/creditNoteModal')
const ClientPayment=require('../modals/clientPayment/clientPayment')
const Inward=require('../modals/store/inwardModal')
const SuppPayment=require('../modals/supplierPayment/supPayment')
router = express.Router();
router.get('/allTransaction/:companyname/:cid',async(req,res)=>{
  let finalarr=[];
    try{
    let {companyname,cid}=req.params
   
  
    let prd=''
    let invoiceData=await Invoice.find({companyname:companyname,'clientDetail.id':cid})
    let creditData=await CreditNote.find({companyname:companyname,'clientDetail.id':cid})
    let narr=invoiceData.reduce((acc,curr)=>{
          if(curr.invoiceDetail.invoiceDate==prd){
             let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
             f.invarr.push({mov:curr.mov,total:curr.total})
             return acc
 
         
          }
          else{
             prd=curr.invoiceDetail.invoiceDate
             let js={mov:curr.mov,total:curr.total}
             acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
            
             return acc
 
          }
        },[])
      
       prd='';
       console.log('arman')
        let carr=creditData.reduce((acc,curr)=>{
         if(curr.invoiceDetail.invoiceDate==prd){
            let f=acc.find(elem=>elem.date==curr.invoiceDetail.invoiceDate)
            f.invarr.push({mov:curr.mov,total:curr.total})
            return acc

        
         }
         else{
            prd=curr.invoiceDetail.invoiceDate
            let js={mov:curr.mov,total:curr.total}
            acc.push({date:curr.invoiceDetail.invoiceDate,invarr:[js]})
           
            return acc

         }
       },[])
   
    console.log('kadir')
  
 

    prd=''
   let paymentData=await ClientPayment.find({companyname:companyname,cid:cid})
   let arr= paymentData.reduce((acc,curr)=>{
         if(curr.paymentDate==prd){
            let f=acc.find(elem=>elem.date==curr.paymentDate)
            let js={invoiceList:curr.invoiceList}
            f.parr.push(js)
            return acc

        
         }
         else{
            prd=curr.paymentDate
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
     let prd=''
     let inwardData=await Inward.find({companyname:companyname,'sid':sid})
     let narr=inwardData.reduce((acc,curr)=>{
           if(curr.inwardCreated==prd){
              let f=acc.find(elem=>elem.date==curr.inwardCreated)
              f.invarr.push({mov:curr.mov,total:curr.total})
              return acc
           }
           else{
              prd=curr.inwardCreated
              let js={mov:curr.mov,total:curr.total}
              acc.push({date:curr.inwardCreated,invarr:[js]})
              return acc
  
           }
         },[])
 
     pr=''
   let paymentData=await SuppPayment.find({companyname:companyname,sid:sid})
    let arr= paymentData.reduce((acc,curr)=>{
          if(curr.paymentDate==prd){
             let f=acc.find(elem=>elem.date==curr.paymentDate)
             let js={inwardList:curr.inwardList}
             f.parr.push(js)
             return acc
          }
          else{
             prd=curr.paymentDate
             let js={inwardList:curr.inwardList}
           
             acc.push({date:curr.paymentDate,parr:[js]})
             return acc
 
          }
        },[])
      
     res.send(narr)
     }
     catch(err){
      res.send(err.message)
     }
 
     
    
 
 })
 





module.exports=router

