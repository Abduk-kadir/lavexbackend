let express = require('express')
let router = express.Router()
const Inward = require('../../modals/store/inwardModal');
const PurchaseStore = require('../../modals/store/purchaseStore');
const authMidd = require('..//../middleware/authmiddleware')
let SupplierPayment = require('../../modals/supplierPayment/supPayment')
let Logs=require('../../modals/logs/logs')

router.put('/changestatus/:companyId/:id', async (req, res) => {
  let parr = []
  try {
    let status = req.body.status
    let prod = await Inward.findOne({ _id: req.params.id, companyname: req.params.companyId })
    let result = await Inward.updateOne({ _id: req.params.id, companyname: req.params.companyId }, { $set: { status: req.body.status } })
    let preStatus = prod.status
    console.log('previsous status:', preStatus)
    console.log('current status', status)
    //this code for mainting log
     let itmnamearr=prod.item.map(elem=>elem.name)
     let itmqtyarr=prod.item.map(elem=>elem.quantity)
     let str=`inward come from supplier ${prod.name} and item are ${itmnamearr.join(',')} and quantity are ${itmqtyarr.join(',')}`
     //ending
    if (status == 'canceled') {
      if (preStatus == 'pending') {
        // await Inward.deleteOne({companyname:req.params.companyId,_id:req.params.id})
        console.log('in pending')
      }
      else if (preStatus == 'confirmed') {
        let { item } = prod;
        console.log('i am here');
        //here updating purchase store
        for (let i = 0; i < item.length; i++) {
          let { id, quantity } = item[i]
          console.log(id)
          console.log(quantity)
          const f = await PurchaseStore.updateOne(
            { companyname: req.params.companyId, 'item.id': id },
            { $inc: { "item.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );


        }
        //await Inward.deleteOne({companyname:req.params.companyId,_id:req.params.id}) 


      }
      //mainting log
      str+=' are canceled'
      let j={companyname:req.params.companyId,itemId:prod.max,actionType:'CANCEL',changedBy:"ABDUL",changeDetails:str,model:"Inward"}
      console.log(j)
      let log=new Logs(j) 
      await log.save()
      //endig
    }



    if (status == 'pending' && preStatus == 'confirmed') {
      let { item } = prod;
      console.log('i am here');
      //here updating purchase store
      for (let i = 0; i < item.length; i++) {
        let { id, quantity } = item[i]
        console.log(id)
        console.log(quantity)
        const f = await PurchaseStore.updateOne(
          { companyname: req.params.companyId, 'item.id': id },
          { $inc: { "item.$[elem].quantity": -quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );


      }

      //ending
      str+=' are pending'
      let j={companyname:req.params.companyId,itemId:prod.max,actionType:'PENDING',changedBy:"ABDUL",changeDetails:str,model:"Inward"}
      console.log(j)
      let log=new Logs(j) 
      await log.save()







    }

    if (status == 'confirmed' && preStatus != 'confirmed') {
      let { item } = prod;
      console.log(req.params.companyId)
      console.log(req.params.id)
      //here updating purchase store
      for (let i = 0; i < item.length; i++) {
        let { id, quantity ,price} = item[i]

        const f = await PurchaseStore.updateOne(
          { companyname: req.params.companyId, 'item.id': id },
          {
          $inc: { "item.$[elem].quantity": quantity },
          $set: { "item.$[elem].price": price }
         },
          { arrayFilters: [{ "elem.id": id }] }
        );
        console.log(f)
        if (f.matchedCount == 0) {
          let elem = item[i]
          parr.push(elem)
        }
      }
      if (parr.length > 0) {

        let purchaseStore = new PurchaseStore({ companyname: req.params.companyId, item: parr })
        await purchaseStore.save()

      }
      //ending

       //mainting log
      str+=' are confrimed'
     let j={companyname:req.params.companyId,itemId:prod.max,actionType:'CONFIRM',changedBy:"ABDUL",changeDetails:str,model:"Inward"}
     console.log(j)
     let log=new Logs(j) 
     await log.save()
    //here ending

    }
    res.send({
      message: 'status is successfully update',
      success: true,

    })

  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,

    })

  }


})

router.get('/allInward/:companyname', async (req, res) => {

  try {
    let result = await Inward.find({ companyname: req.params.companyname })
    res.send({
      message: "data is fetched successfully",
      success: true,
      data: result

    })
  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null

    })

  }


})


router.post('/addinward3/:companyname', async (req, res) => {

  try {

    let body = req.body;
    body.companyname = req.params.companyname
    let { item } = body
    let data = await Inward.find({ companyname: req.params.companyname })
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    body.mov = max;

    let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
    let baseAmount = item.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)

    body.pendingAmount = total
    body.total = total
    body.baseAmount = baseAmount

    let ind = await Inward.find({ companyname: req.params.companyname, sid: body.sid })
    if (ind[ind.length - 1]?.suplierInvoiceNo == body?.suplierInvoiceNo) {
      res.send({
        message: "invoice number can not be same",
        success: false
      })
    }
    else {
      let inward = new Inward(body);
      await inward.save();
     //mainting log
     let itmnamearr=item.map(elem=>elem.name)
     let itmqtyarr=item.map(elem=>elem.quantity)
     let str=`inward come from supplier ${body.name} and item is ${itmnamearr.join(',')} and quantity is ${itmqtyarr.join(',')} `
     let j={companyname:req.params.companyname,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Inward"}
     console.log(j)
     let log=new Logs(j) 
     await log.save()
    //here ending






      res.send({
        message: "data is successfully added",
        success: true,
      })
    }

  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,
    })


  }

})



router.put('/updateInward/:id/:status', async (req, res) => {
  let body = req.body
  let { item } = body
  try {
    let p = await SupplierPayment.findOne({ inwardList: { $elemMatch: { inwardId: req.params.id } } })
    if (p) {
      res.send({
        message: 'this inward is using other places you you can not updae',
        success: false,
      })
    }
    else {
      let total = item.reduce((acc, curr) => acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
      let baseAmount = item.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
      body.total = total
      body.baseAmount = baseAmount
      body.pendingAmount = total
      console.log(body.baseAmount)
      let status = req.params.status

      if (status == 'confirmed') {
        res.send({
          message: 'can not update confirm inward please make first pending then update',
          success: false,
        })
   
      }
      else {
        const updatedDocument = await Inward.findByIdAndUpdate(req.params.id, body, {
          runValidators: true // Ensure validation rules are applied
        })
        res.send({
          message: 'inward is successfully updated',
          success: true,
        })
      }


    }
  }
  catch (err) {
    res.send(
      {
        message: err.message,
        success: false
      }
    )
  }


})
router.get('/getinward/:sid/:name', async (req, res) => {
  try {
    let result = await Inward.find({ $and: [{ "sid": req.params.sid }, { companyname: req.params.name }] })
    if (result.length == 0) {
      res.send({
        message: "no inward is generated from this supplier",
        success: false
      })
    }
    else {
      res.send({
        message: "inward is fetched successfully attached",
        success: true,
        data: result
      })
    }

  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,


    })
  }

})

router.get('/inwardReportbydateandCompany',async(req,res)=>{
  try{
  let { fromDate, toDate,companyname,sid } = req.query;
    let query = { companyname: companyname }
    let data = await Inward.find(query)
    if (fromDate && toDate) {
      const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
      const [dayTo, monthTo, yearTo] = toDate.split('-');
      const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
      const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
      console.log(from)
      console.log(to)
      data = data.filter(item => {
        const [day, month, year] = item.dateCreated.split('-');
        let itemDate = new Date(`${year}-${month}-${day}`);
        
        return itemDate >= from && itemDate <= to;
      });

    }
    if(sid){
      data=data.filter(elem=>elem.sid==sid)
    }
  console.log(data.length)  
  res.send({
    message:"data is successfully fetched",
    success:true,
    data:data
  })
  }
  catch(err){

    res.send({
      message:err.message,
      success:false
    })

  }



})

router.get('/purchaseReport',async(req,res)=>{
  try{
    let {fromDate,toDate,companyname,sid}=req.query
    let query = {companyname:companyname}
    if(fromDate&&toDate){
      query["dateCreated"]= {
       $gte:fromDate, 
       $lte:toDate
    }

    }
    
    if(sid){
      query.sid=sid
    }
    console.log('query is:',query)
    let result=await Inward.find(query);
    res.send({
      message:'data is successfully fetched',
      success:false,
      data:result
    })
    }
    catch(err){
     res.send({
       message: err.message,
       success: false,
       data:null
     });
      
    }


})










module.exports = router
