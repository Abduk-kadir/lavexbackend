const express = require('express')
const Invoice = require('../modals/invoiceModal')
const DeliveryChalan = require('../modals/deliveryChalan')
const Company = require('../modals/companyModal')
router = express.Router();
const { ProductionStore, ProductionStore2 } = require('./../modals/store/productionStore')
const SisterStore = require('../modals/sisterStore');
const SisterStock = require('../modals/sisterStock')
const Supplier = require('../modals/supplierModal');
const ClientPayment = require('../modals/clientPayment/clientPayment');
const Logs=require('../modals/logs/logs');


const invoiceDelMidd=require('../middleware/invoiceDelMidd')
const invoiceAddMidd=require('../middleware/invoiceAddMidd')
const invoiceUpMidd=require('../middleware/invoiceUpMidd')

router.get('/topProductSale/:companyname', async (req, res) => {
  const companyName = req.params.companyname;

  try {
    const topFive = await Invoice.aggregate([
      // Match documents by company name
      { $match: { companyname: companyName } },
      
      // Unwind the item array to process individual items
      { $unwind: { path: "$item" } },
      
      // Group by product ID and sum the total quantity
      { 
        $group: { 
          _id: "$item.id", 
          Name: { $first: "$item.name" },
          count: { $sum: "$item.quantity" } 
        }
      },
      
      // Sort by total quantity in descending order
      { $sort: {totalQuantity: -1 } },
      
      // Limit to top 5 products
      { $limit: 5 }
    ]);

    res.send({
      message: "Top five products fetched successfully",
      success: true,
      data: topFive
    });

  } catch (err) {
    res.status(500).send({
      message: "Error fetching top products",
      success: false,
      error: err.message
    });
  }
});



router.get('/topClient/:companyname', async (req, res) => {
  try {
    let companyname = req.params.companyname; // Correctly extract the company name from the URL

    let topfive = await Invoice.aggregate([
      { $match: { companyname: companyname } }, // Corrected match
      {
        $group: {
          _id: "$clientDetail.id", // Corrected grouping
          Name: { $first: "$clientDetail.client" }, // Get the first client name
          total: { $sum: "$total" }, // Sum of total invoice amounts
          count: { $sum: 1 } // Count the number of invoices
        }
      },
      { $sort: { total: -1 } }, // Correct sorting
      { $limit: 5 } // Limit to top 5cu
    ]);

    res.send({
      message: "Top five clients fetched successfully",
      success: true,
      data: topfive
    });
  } 
  catch (err) {
    res.status(500).send({
      message: err.message || "Server error",
      success: false,
      data: null
    });
  }
});

router.delete('/invoice/:id/:companyname/:role',async(req,res)=>{
  try{
    let role=req.params.role
    let f=await ClientPayment.findOne({companyname:req.params.companyname,"invoiceList.invoiceId":req.params.id})
    if(f){
      res.send({
        message:"can not deleted it is ussing in Payment",
        success:false,
      })
    }
    else{
     let inv=await Invoice.findById(req.params.id)
     let suplierInvoiceNo=inv.mov
     console.log('supInvoce:',suplierInvoiceNo)
     let isInSis=await SisterStore.findOne({suplierInvoiceNo:suplierInvoiceNo,status:"confirmed"})
     if(isInSis){
      return(  
        res.send({
        message:'can not deleted item confirmed in sister store',
        success:false,
      })
      )
     }
     
    let rs= await Invoice.findByIdAndDelete(req.params.id)
    let itemsist=await SisterStore.findOneAndDelete({suplierInvoiceNo:rs.mov,status:"pending"})
    //mainting store
    let {item}=rs
    if(role=='master'){
      console.log('in master company')
    for (let i = 0; i <item.length; i++) {
      let { id, quantity } = item[i];
      const f = await ProductionStore.updateOne(
        { companyname: rs.companyname, 'readyStock.id': id },
        { $inc: { "readyStock.$[elem].quantity": quantity } },
        { arrayFilters: [{ "elem.id": id }] }
      );
    }
   
  }
  else{
    console.log('insister company')
     for (let i = 0; i < item.length; i++) {
              let { id, quantity } = item[i];
              console.log(id,quantity)
              const f = await SisterStock.updateOne(
                {companyname:req.params.companyname,'readyStock.id':id},
                { $inc: { "readyStock.$[elem].quantity":-quantity } },
                { arrayFilters: [{ "elem.id": id }] }
              );
             
            }

  }

    
   
   
    res.send({
      message:"deleted successfully",
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

router.put('/invoice/:id/:companyname/:role',async(req,res)=>{
  let body=req.body
  let item=req.body.item
  let role=req.params.role

    let total = item.reduce((acc, curr) =>curr.loosePack?acc + curr.price * curr.quantity*curr.qty * (1 + curr.gst / 100):acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
    let totalwithoutgst = item.reduce((acc, curr) =>curr.loosePack?acc + curr.price * curr.quantity*curr.qty :acc + curr.price * curr.quantity, 0)
    req.body.total = total;
    req.body.pendingAmount = total;
    req.body.totalwithoutgst = totalwithoutgst;
    let parr=[]
  try{
    let f=await ClientPayment.findOne({companyname:req.params.companyname,"invoiceList.invoiceId":req.params.id})
    if(f){
      res.send({
        message:"can not updated it is ussing in Payment",
        success:false,
      })
    }
    else{
      let inv=await Invoice.findById(req.params.id)
      let suplierInvoiceNo=inv.mov
      console.log('supInvoce:',suplierInvoiceNo)
      let isInSis=await SisterStore.findOne({suplierInvoiceNo:suplierInvoiceNo,status:"confirmed"})
      if(isInSis){
       return(  
         res.send({
         message:'can not updated item confirmed in sister store',
         success:false,
       })
       )
      }
     let rs=await Invoice.findById(req.params.id) 
     await Invoice.findByIdAndUpdate(req.params.id,req.body, {runValidators: true })
     if(role=='master'){
      console.log('inmaster')
       const branch = req.body.clientDetail.Branch.trim().toUpperCase();
       let isSister = await Company.findOne({ Branch: branch })
       if (isSister) {
        let mascompany = await Company.findById(req.params.companyname)
        let s = await Supplier.findOne({ companyname: isSister._id, supplier: mascompany.company + ' ' + mascompany.Branch })
        let js ={address:body.clientDetail.address, gstNumber: body.clientDetail.gstNumber, total: total, pendingAmount: total, sid: s._id, dateCreated: req.body.invoiceDetail.invoiceDate, companyname: isSister._id, readyStock: item }
        await SisterStore.findOneAndUpdate({ suplierInvoiceNo: inv.mov }, { $set: js });
      }
    
      for (let i = 0; i <rs.item.length; i++) {
        let { id, quantity } = rs.item[i];
        const f = await ProductionStore.updateOne(
          { companyname: rs.companyname, 'readyStock.id': id },
          { $inc: { "readyStock.$[elem].quantity": quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
      
      }
  
      for (let i = 0; i <body.item.length; i++) {
        let { id, quantity } = body.item[i];
        const f2 = await ProductionStore.updateOne(
          { companyname: rs.companyname, 'readyStock.id': id },
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
      }
      if (parr.length > 0) {
        let product = new ProductionStore({companyname:req.params.companyId,readyStock: parr });
        await product.save();
      }
     }
     else{
      console.log('insister company')
      for (let i = 0; i < rs.item.length; i++) {
        let { id, quantity } = rs.item[i];
        console.log(id,quantity)
        const f = await SisterStock.updateOne(
          {companyname:req.params.companyname,'readyStock.id':id},
          { $inc: { "readyStock.$[elem].quantity":quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
      }
      for (let i = 0; i < body.item.length; i++) {
        let { id, quantity } = body.item[i];
        console.log(id,quantity)
        const f = await SisterStock.updateOne(
          {companyname:req.params.companyname,'readyStock.id':id},
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
      }

     }
      //mainting  delivery chalan
     rs.selectDc.map(async (elem) => {
      await DeliveryChalan.updateOne(
        { _id:elem},
        { $set:
           {
            iscompleted:false
           }
        }
     )
    })
     req.body.selectDc.map(async (elem) => {
      await DeliveryChalan.updateOne(
        { _id:elem},
        { $set:
           {
            iscompleted:true
           }
        }
     )
    })
    res.send({
      message:"updated successfully",
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

router.get('/invoicesbyClient/:clientname', async (req, res) => {
  try {
    let result = await Invoice.aggregate([{ $match: { "clientDetail.client": req.params.clientname } },
    {
      $project: {
        "clientDetail.client": 1,
        "invoiceDetail.invoiceNo": 1,
        "invoiceDetail.dueDate": 1,
        calculatedAmount: {
          "$reduce": {
            "input": "$item",
            initialValue: 0,
            in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.qty", { $add: [1, { $divide: ["$$this.gst", 100] }] }] }] }
          }
        }
      }
    },
    {
      $project: {
        "invoiceAmount": "$calculatedAmount",
        "balanceAmount": "$calculatedAmount"
      }
    }


    ])

    if (result.length == 0) {
      res.send({
        message: "no invoice found for this client",
        success: false,
        data: null
      })

    }
    else {
      res.send({
        message: "invoice is fetched successfully fetched",
        success: true,
        data: result
      })
    }

  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null

    })
  }




})


router.post('/invoiceCreate',async (req, res) => {
  let { type, role } = req.query;
  console.log(type,role)
  let { item } = req.body
  let js = { ...req.body, companyname: type}
  let parr = []
  try {
    let body = req.body;
    let data = await Invoice.find({ companyname:type })
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    js.mov = max;
    let total = item.reduce((acc, curr) =>curr.loosePack?acc + curr.price * curr.quantity*curr.qty * (1 + curr.gst / 100):acc + curr.price * curr.quantity * (1 + curr.gst / 100), 0)
    let totalwithoutgst = item.reduce((acc, curr) =>curr.loosePack?acc + curr.price * curr.quantity*curr.qty :acc + curr.price * curr.quantity, 0)
    js.total = total;
    js.totalwithoutgst=totalwithoutgst
    js.pendingAmount = total;
    let invoice = new Invoice(js);
     await invoice.save();
    let itmnamearr=body.item.map(elem=>elem.name)
    let itmqtyarr=body.item.map(elem=>elem.quantity)
    let str=`ivoice is for client ${body.clientDetail.client} created and item is ${itmnamearr.join(',')} and quantity is ${itmqtyarr.join(',')} `
    let j={companyname:type,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Invoice"}
   
    let log=new Logs(j) 
    await log.save()
   //here ending

    req.body.selectDc.map(async (elem) => {
      await DeliveryChalan.updateOne(
        { _id:elem},
        { $set:
           {
            iscompleted:true
           }
        }
     )
    })
    
    if (req.body.selectDc.length == 0) {

      if (role == 'master') {
       
        for (let i = 0; i < item.length; i++) {
          let { id, quantity } = item[i];

          const f = await ProductionStore.updateOne(
            { companyname: type, 'readyStock.id': id },
            { $inc: { "readyStock.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );


        }


        const branch = req.body.clientDetail.Branch.trim().toUpperCase();
       
        let isSister = await Company.findOne({ Branch: branch })
       
        if (isSister) {
          let mascompany = await Company.findById(type)
          let s = await Supplier.findOne({ companyname: isSister._id, supplier: mascompany.company + ' ' + mascompany.Branch })

          if (!s) {
            let { Branch, company, address, area, email, state, gstNumber, pincode, panNumber, contactPerson, mobile1, mobile2, city, stateCode } = mascompany
            let js2 = { companyname: isSister._id, supplier: company + ' ' + Branch, address: address, email: email, area: area, state: state, gstNumber: gstNumber, pincode: pincode, panNumber: panNumber, contactPerson: company, mobile1: mobile1, mobile2: mobile2, city: city, stateCode: stateCode }
            let sup = new Supplier(js2);
            s = await sup.save()
           
          }
          //here i creating movenent for sister store
          let data2 = await SisterStore.find({ companyname: isSister._id })
          console.log('data2 is',data2)
          let max2 = data2.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
          max2 = max2 + 1;
        
          let js = {suplierInvoiceNo:max,mov:max2,address: body.clientDetail.address, gstNumber: body.clientDetail.gstNumber, total: total, pendingAmount: total, sid: s._id, dateCreated: req.body.invoiceDetail.invoiceDate, companyname: isSister._id, readyStock: item }
          let sisterstore = new SisterStore(js)
          await sisterstore.save()
        }


      }
      else {

        console.log('hi i am sister compmany')
        for (let i = 0; i < item.length; i++) {
          let { id, quantity } = item[i];
          const f = await SisterStock.updateOne(
            { companyname: type, 'readyStock.id': id },
            { $inc: { "readyStock.$[elem].quantity": -quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );

        }
      }



    }
    res.send({
      message: "data is successfully added",
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

router.get('/invoice/:number/:name', async (req, res) => {
  console.log(req.params.number)
  try {
    let result = await Invoice.findOne({ $and: [{ "invoiceDetail.invoiceNo": req.params.number }, { companyname: req.params.name }] })
    if (result == null) {
      res.send({
        message: "please fill correct company name and invoiceNo"
      })

    }
    else {
      res.send({
        message: "invoice is fetched successfully attached",
        success: true,
        data: result
      })
    }

  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null

    })
  }

})
router.get('/getinvoice/:clientid/:name', async (req, res) => {
 
  try {
    let result = await Invoice.find({ $and: [{ "clientDetail.id": req.params.clientid }, { companyname: req.params.name }] })
    if (result.length == 0) {
      res.send({
        message: "no invoice is generated from this client",
        success: false
      })
    }
    else {
      res.send({
        message: "invoice is fetched successfully attached",
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
router.get('/allinvoices/:id', async (req, res) => {
  try {
    let result = await Invoice.find({ companyname: req.params.id })
    res.send({
      message: "invoice is fetched successfully fetched",
      success: true,
      data: result
    }
    )



  }
  catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null

    })
  }


})


router.get('/invoiceByProd', async (req, res) => {
  try {
    let { fromDate, toDate, type, companyname, prodId, id } = req.query;
    let model = type == 'invoice' ? Invoice : DeliveryChalan
    let query = { companyname: companyname }
    let data = await model.find(query)
    if (fromDate && toDate) {
      const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
      const [dayTo, monthTo, yearTo] = toDate.split('-');
      const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
      const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
      console.log(from)
      console.log(to)
      data = data.filter(item => {
        const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
        let itemDate = new Date(`${year}-${month}-${day}`);
        
        return itemDate >= from && itemDate <= to;
      });

    }


    if (id) {
     
     data= data.filter(item => {
        return item.clientDetail.id == id
      })
    }

    if (prodId) {
     
      data=data.filter(elem => {
        /*let f=elem.item.find(elem2=>{
           return elem2.id==prodId
        })
      
        return f*/
        let index=elem.item.findIndex(elem2=>{
          return elem2.id==prodId
        })
        if(index>-1){
         const element = elem.item[index]; 
         elem.item.splice(0, elem.item.length); 
         elem.item.push(element);
         return true
         
        }
        else{
          elem.item.splice(index,1)
          return false

        }
      
      })

    }
    res.send({
      message: 'data is successfully fetched',
      success: true,
      data: data
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

router.get('/salesReport',async(req,res)=>{
  try{

    let { fromDate, toDate, type, companyname } = req.query;
    let model = type == 'invoice' ? Invoice : DeliveryChalan
    let query = { companyname: companyname }
    let data = await model.find(query)
    if (fromDate && toDate) {
      
      const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
      const [dayTo, monthTo, yearTo] = toDate.split('-');
     
      const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
      const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
      console.log(from)
      console.log(to)
      data = data.filter(item => {
        const [day, month, year] = item.invoiceDetail.invoiceDate.split('-');
        let itemDate = new Date(`${year}-${month}-${day}`);
        console.log(itemDate)
        return itemDate >= from && itemDate <= to;
      });

    }

    res.send({
      message: 'data is successfully fetched',
      success: true,
      data: data
    })

  

  }
  catch(err){
    res.send({
      message: err.message,
      success: false,
      data: null
    })

  }


})





module.exports = router