let express=require('express')
let router=express.Router()
const ClientPayment= require('../../modals/cashmodals/cashClientPayment');
const Invoice=require('../../modals/cashmodals/cashInvoiceModal')

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


router.delete('/DeletebyDateAndCompany',async(req,res)=>{

    let { companyname, paymentDate } = req.body;
    console.log(companyname, paymentDate);
    try {
      // Aggregation pipeline to unwind and group invoiceList into one array
      const data = await ClientPayment.aggregate([
        {
          // Match documents based on companyname and paymentDate
          $match: {
            companyname: companyname,
            paymentDate: paymentDate
          }
        },
        {
          // Unwind the invoiceList array to flatten the documents
          $unwind: "$invoiceList"
        },
        {
          // Group the results and combine all invoiceList items into one array
          $group: {
            _id: null, // We're combining everything into one result
            invoiceList: { $push: "$invoiceList" } // Push each invoiceList item into a new array
          }
        }
      ]);
      if (data.length === 0) {
        return res.status(404).send({
          message: "No matching data found to delete",
          success: false
        });
      }
    
     
      for(let i=0;i<data[0].invoiceList.length;i++){
        let inNo=data[0].invoiceList[i].invoiceId
        await Invoice.findOneAndDelete({_id:inNo,pendingAmount:0})

      }

      await ClientPayment.findOneAndDelete({companyname:companyname,paymentDate:paymentDate})


  
      // Return the combined invoiceList
      res.send({
        message: "data is successfully deleted",
        success: true
      });
  
    } catch (err) {
      res.status(500).send({
        message: err.message,
        success: false
      });
    }



})




router.put('/paymentStatusChange',async(req,res)=>{
    let {companyname,paymentDate}=req.body;

    try{
        await ClientPayment.updateMany(
            { companyname: companyname, paymentDate: paymentDate }, // Correct filter object
            { $set: { status: "ok" } } // Correct update operation
          );
      res.send({
        message:"data is successfully updated",
        success:true
      })


    }
    catch(err){
        res.send({
            message:err.message,
            success:false
          })


    }
})

router.get('/allPaymentRecieved',async(req,res)=>{
    try{
          let data=await ClientPayment.aggregate([
             {
                // Unwind the invoiceList to flatten the array
                $unwind: "$invoiceList",
              },
              {
                $match:{
                    status: { $eq: 'ok' }
                }

              },
            {$group:{
              _id:{companyname:"$companyname",paymentDate:"$paymentDate"},
              company:{$first:"$company"},
              total: { $sum: "$payingAmount" },
              invoiceAmount: { $sum: "$invoiceList.total" },
              invoiceList: { $push: "$invoiceList" },
              clientName:{$push:"$cname"},
              paymentDate: { $first: "$paymentDate" }

            }},

          ])

          res.send({
            message:"data is successfully added",
            data:data,
            success:true
          })

    }
    catch(err){
        res.send({
            message:err.message,
            success:false
          })



    }


})




router.get('/allPaymentDatewise',async(req,res)=>{
    try{
          let data=await ClientPayment.aggregate([
             {
                // Unwind the invoiceList to flatten the array
                $unwind: "$invoiceList",
              },
              {
                $match:{
                    status: { $ne: 'ok' }
                }

              },
            {$group:{
              _id:{companyname:"$companyname",paymentDate:"$paymentDate"},
              company:{$first:"$company"},
              total: { $sum: "$payingAmount" },
              invoiceAmount: { $sum: "$invoiceList.total" },
              invoiceList: { $push: "$invoiceList" },
              clientName:{$push:"$cname"},
              paymentDate: { $first: "$paymentDate" }

            }},

          ])

          res.send({
            message:"data is successfully added",
            data:data,
            success:true
          })

    }
    catch(err){
        res.send({
            message:err.message,
            success:false
          })



    }


})


router.delete('/deletePayment/:id',async(req,res)=>{
    try{
        let rs=await ClientPayment.findByIdAndDelete(req.params.id);
        let {invoiceList}=rs
        /*let inarr=rs.invoiceList.map(elem=>elem.invoiceMov)
        let str=`payment for  invoice no  ${inarr.join(',')} is deleted`
        let js={companyname:rs.companyname,itemId:rs.paymentNumber,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"client Payment"}
        console.log(js)
        let log=new Logs(js) 
        await log.save()*/
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

router.put('/updatePayment/:companyname/:cid/:id',async(req,res)=>{
    try{
        let body=req.body;
        await ClientPayment.findByIdAndUpdate(req.params.id,body);
        let {invoiceList}=body
        for(let i=0;i<invoiceList.length;i++){
            await Invoice.updateOne(
                {"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:invoiceList[i].pendingAmount,total:invoiceList[i].total}}
            
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



router.post('/addclientPayment/:companyname/:cid/:company',async(req,res)=>{
    try{
        let body=req.body;
        body.companyname=req.params.companyname;
        body.cid=req.params.cid
        body.company=req.params.company
        let data=await ClientPayment.find({companyname:req.params.companyname})
        let max=data.reduce((acc,curr)=>curr.paymentNumber>acc?curr.paymentNumber:acc,0)
        max=max+1;
        body.paymentNumber=max;
        let clientPayment=new ClientPayment(body);
        let {invoiceList}=body
        console.log(invoiceList)
        await clientPayment.save();
        for(let i=0;i<invoiceList.length;i++){
            await Invoice.updateOne(
                {"clientDetail.id":req.params.cid,companyname:req.params.companyname,_id:invoiceList[i].invoiceId},
                {$set:{pendingAmount:invoiceList[i].pendingAmount,total:invoiceList[i].total}}
            
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



module.exports=router
