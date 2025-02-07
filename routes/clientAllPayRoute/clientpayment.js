let express=require('express')
let router=express.Router()
const ClientPayment= require('../../modals/clientPayment/clientPayment');
const Invoice=require('../../modals/invoiceModal')
const Logs=require('../../modals/logs/logs')
let Client=require('../../modals/clientModal')

router.get('/clientpayentReport',async(req,res)=>{
    try{
    let {companyname,fromDate,toDate,cid}=req.query
    let query={$expr:{$ne:['$total','$pendingAmount']}}
    if(companyname){query.companyname=companyname}
    let data=await Invoice.find(query);
    if (fromDate && toDate) {
        const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
        const [dayTo, monthTo, yearTo] = toDate.split('-');
        const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
        const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
        data = data.filter(item => {
          const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
          let itemDate = new Date(`${year}-${month}-${day}`);
          return itemDate >= from && itemDate <= to;
        });
  
      }
    if(cid){
        data=data.filter(elem=>elem.clientDetail.id==cid)
    }

    res.send({
        message:'data is successfully fetched',
        success:true,
        data:data
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

router.delete('/deletePayment/:companyname/:id',async(req,res)=>{
    try{
        let rs=await ClientPayment.findByIdAndDelete(req.params.id);
        let {invoiceList}=rs
        for(let i=0;i<invoiceList.length;i++){
            let f= await Invoice.findOne({companyname:req.params.companyname,_id:invoiceList[i].invoiceId})
            console.log()
             await Invoice.updateOne(
                 {companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                 {$set:{pendingAmount:f.pendingAmount+invoiceList[i].paid+invoiceList[i].discount,discountAmount:f.discountAmount-invoiceList[i].discount}}
             )
         }
         /*
        let inarr=rs.invoiceList.map(elem=>elem.invoiceMov)
        let str=`payment for  invoice no  ${inarr.join(',')} is deleted`
        let js={companyname:rs.companyname,itemId:rs.paymentNumber,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"client Payment"}
        console.log(js)
        let log=new Logs(js) 
        await log.save()
        */
        res.send({
           message:"payment is successfully deleted",
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
router.put('/updatePayment/:companyname/:id',async(req,res)=>{
    try{
        let body=req.body;
        let c=await ClientPayment.findById(req.params.id)
        let {invoiceList}=body
       /* let pInarr=c.invoiceList.map(elem=>elem.invoiceMov)
        let nInarr=body.invoiceList.map(elem=>elem.invoiceMov)
        let {
            cid,
            cname,
            paymentDate,
            paymentMethod,
            bankName,
            payCheckorDdNo,
            note,
            payingAmount
            }=c
            let str='';
              if(payingAmount!=body.payingAmount){str+=`paying ammount ${payingAmount} is changed to ${body.payingAmount}  `}
              if(cname!=body.cname){str+=`client ${cname} is changed to ${body.cname}  `}
              if(paymentDate!=body.paymentDate){str+=`payment Date ${paymentDate} is changed to ${body.paymentDate}  `}
              if(paymentMethod!=body.paymentMethod){str+=`payment method ${paymentMethod} is changed to ${body.paymentMethod}  `}
              if(bankName!=body.bankName){str+=`${bankName} is changed to ${body.bankName}  `}
              if(payCheckorDdNo!=body.payCheckorDdNo){str+=`${payCheckorDdNo} is changed to ${body.payCheckorDdNo}  `}
              if(note!=body.note){str+=`notes ${note} is changed to ${body.note}  `}
              if(pInarr.join()!=nInarr.join()){
               str+=`invoice list ${pInarr.join(',')} is changed to ${nInarr.join(',')}`
              }
             
              if(str!=''){
               let js={companyname:c.companyname,itemId:c.paymentNumber,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"client Payment"}
               let log=new Logs(js)
               await log.save()
               }
      
        let {invoiceList}=body*/
       let p=await ClientPayment.findById(req.params.id)
       let preInvoicList=p.invoiceList
       let newInvoceList=invoiceList.map(elem=>{
          let p=preInvoicList.find(elem2=>elem2.invoiceId==elem.invoiceId)
          let el={...elem}
          el.paid=p.paid-el.paid
          el.discount=p.discount-el.discount
          let js={...elem,pendingAmount:p.pendingAmount+el.paid+el.discount}
          return js
       })
       body.invoiceList=newInvoceList
       await ClientPayment.findByIdAndUpdate(req.params.id,body);
        for(let i=0;i<newInvoceList.length;i++){
            await Invoice.updateOne(
                {companyname:req.params.companyname,_id:newInvoceList[i].invoiceId},
                {$set:{pendingAmount:newInvoceList[i].pendingAmount,discountAmount:newInvoceList[i].discount}}
            
            )
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
router.get('/allpayment/:companyname',async(req,res)=>{

    try{
        let data=await ClientPayment.find({companyname:req.params.companyname})
        res.send({
            message:"data is successfully updated",
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


router.post('/addclientPayment/:companyname',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyname;
        let {invoiceList}=body
        let {cid}=body
        let invoiceDate=invoiceList[0].invoiceDate
        let  {paymentDate}=body
        
        //calulating days
        const parseDate = (dateString) => {
            const [day, month, year] = dateString.split('-').map(Number);
            return new Date(year, month - 1, day);
          };
          const calculateDateDifferenceInDays = (date1, date2) => {
            const d1 = parseDate(date1);
            const d2 = parseDate(date2);
          
            // Normalize time and calculate day difference directly
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
          
            const diffInDays = (d2 - d1) / (24 * 60 * 60 * 1000);
            return Math.abs(diffInDays);
          };
           
          let days= calculateDateDifferenceInDays(invoiceDate, paymentDate)
          console.log('difference:',days)
          
         let client= await Client.findById(cid)
         let fcDays=Number(client.fcDays)
         let grade=days<fcDays?"A+":days==fcDays?"A":"C"
         
         console.log('grade is:grade',grade)
         console.log('company name:',req.params.companyname)
         f=await Client.updateOne({_id:cid,company:req.params.companyname},{$set:{grade:grade}})
        // console.log('cid',cid)
        console.log('client is:',f)

        let newinvoiceList=await Promise.all(invoiceList.map(async(elem)=>{
            let p= await Invoice.findOne({companyname:req.params.companyname,_id:elem.invoiceId})
            let js={}
           
            if(p){
               console.log(elem.total-elem.paid-p.pendingAmount-elem.discount-p.discountAmount) 
              js={...elem,pendingAmount:p.pendingAmount-elem.paid-elem.discount}
           
            }
            else{
            
             js={...elem,pendingAmount:elem.total-elem.paid-elem.discount}
           
            }
            return js
        }))
        //console.log('new invoice list:',newinvoiceList)
        body.invoiceList=newinvoiceList
        let clientPayment=new ClientPayment(body);
        await clientPayment.save();
        for(let i=0;i<invoiceList.length;i++){
           let f= await Invoice.findOne({companyname:req.params.companyname,_id:invoiceList[i].invoiceId})
           
            await Invoice.updateOne(
                {companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:f.pendingAmount-invoiceList[i].paid-invoiceList[i].discount,discountAmount:invoiceList[i].discount+f.discountAmount}}
            
            )
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
router.get('/allpayment/:companyname',async(req,res)=>{

    try{

        let data=await ClientPayment.find({companyname:req.params.companyname})
        res.send({
            message:"data is successfully updated",
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

router.get('/allCashPayment/:companyname',async(req,res)=>{

    try{
      
        const { companyname } = req.params;
        const paymentMethod = "CASH";  
        const data = await ClientPayment.find({
          companyname: companyname,
          paymentMethod: { $regex: `^${paymentMethod}$`, $options: 'i' } 
        });
        res.send({
            message:"data is fetched successfully",
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

module.exports=router
