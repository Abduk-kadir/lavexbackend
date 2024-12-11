let express = require('express')
let router = express.Router()
const Brand = require('../modals/drop/brandModel');
const Category = require('../modals/drop/category');
const QuantityType = require('../modals/drop/quantityType')
const Hsncode = require('../modals/drop/hsnCode')
const Gst = require('../modals/drop/gstDropdown')
const Lowquantity = require('../modals/drop/lowQuantity');
const gstDropdown = require('../modals/drop/gstDropdown');
const StatusDropdown = require('../modals/drop/stockStatus');
const Bank = require('../modals/drop/bankName')
const PaymentMethod = require('../modals/drop/payMethod')
const SalesMan = require('../modals/drop/salesMan')
const Term=require('../modals/drop/term')

router.delete('/hi',async(req,res)=>{
  res.send('arman')
})

router.delete('/deleteDropdown/:id/:m', async (req, res) => {
  let { id, m } = req.params
  try {
    switch (m) {
      case 'Term':
        await Term.findByIdAndDelete(req.params.id)
        break;
      case 'Brand':
        await Brand.findByIdAndDelete(req.params.id)
        break;
      case 'Category':
        await Category.findByIdAndDelete(req.params.id)
        break;
      case 'SalesMan':
        await SalesMan.findByIdAndDelete(req.params.id)
        break;
      case 'PaymentMethod':
        await PaymentMethod.findByIdAndDelete(req.params.id)
        break;
      case 'Gst':
        await Gst.findByIdAndDelete(req.params.id)
        break;
      case 'Hsncode':
        await Hsncode.findByIdAndDelete(req.params.id)
        break;
      case 'Lowquantity':
        await Lowquantity.findByIdAndDelete(req.params.id)
        break;
      case 'QuantityType':
        await QuantityType.findByIdAndDelete(req.params.id)
        break;
      case 'StatusDropdown':
        await StatusDropdown.findByIdAndDelete(req.params.id)
        break;
      case 'Bank':
        await Bank.findByIdAndDelete(req.params.id)
        break;
    }
    res.send({
      message:'deleted succesfully',
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





router.get('/allDropdown', async (req, res) => {
  try {
    let brandDrop = await Brand.find()
    let categDrop = await Category.find()
    let qtyDrop = await QuantityType.find()
    let hsnDrop = await Hsncode.find()
    let gstDrop = await Gst.find()
    let lowDrop = await Lowquantity.find()
    let statusDropdown = await StatusDropdown.find()
    let bank = await Bank.find()
    let paymentmethod = await PaymentMethod.find()
    let salesman = await SalesMan.find()
    let term=await Term.find()
    let js = { termandcondtion:term,salesMan: salesman, bank: bank, paymentmethod: paymentmethod, statusDropdown: statusDropdown, brandDrop: brandDrop, categDrop: categDrop, qtyDrop: qtyDrop, hsnDrop: hsnDrop, gstDrop: gstDrop }
    res.send({
      message: "data is successfully added",
      success: true,
      data: js
    })
  }
  catch (err) {
    res.send({
      message: "data is successfully added",
      success: true,
      data: null
    })

  }

})
router.put('/term/:id', async (req, res) => {
  try {
    await Term.findByIdAndUpdate(req.params.id, req.body, {})
    res.send({
      message: "term and condition updated successfully",
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
router.put('/updateSalesMan/:id', async (req, res) => {
  try {
    await SalesMan.findByIdAndUpdate(req.params.id, req.body, {})
    res.send({
      message: "Sales Man updated successfully",
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

router.post('/createTermAndCondition', async (req, res) => {
  try {

    let term = new Term(req.body);
    await term.save();
    res.send({
      message: "term and condtion is  added successfully",
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




router.post('/createSalesMan', async (req, res) => {
  try {

    let salesMan = new SalesMan(req.body);
    await salesMan.save();
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

router.post('/createPayMethod', async (req, res) => {
  try {

    let status = new PaymentMethod(req.body);
    await status.save();
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
router.put('/updatePayMethod/:id', async (req, res) => {
  try {
    await PaymentMethod.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "payment method updated successfully",
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

router.post('/createBank', async (req, res) => {
  try {

    let status = new Bank(req.body);
    await status.save();
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
router.put('/updateBank/:id', async (req, res) => {
  try {
    await Bank.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "Bank updated successfully",
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

router.post('/createStockStatus', async (req, res) => {
  try {
    let body = req.body;
    let data = await StatusDropdown.findOne({ status: body.status })
    console.log(data)
    console.log(!data)
    if (!data) {
      let status = new StatusDropdown(body);
      await status.save();
      res.send({
        message: "data is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "status of stock is already exist",
        success: false,
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
router.put('/updateStockStatus/:id', async (req, res) => {
  try {
    await StatusDropdown.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "stock status updated successfully",
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






router.post('/createBrand', async (req, res) => {
  try {

    let body = req.body;
    let data = await Brand.findOne({ brand: body.brand })
    console.log(data)
    console.log(!data)
    if (!data) {
      let brand = new Brand(body);
      await brand.save();
      res.send({
        message: "data is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this name is already exist",
        success: false,
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

router.put('/updateBrand/:id', async (req, res) => {
  try {
    await Brand.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "Brand updated successfully",
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

router.post('/createCategory', async (req, res) => {
  try {

    let body = req.body;
    let data = await Category.findOne({ name: body.name })
    if (!data) {
      let category = new Category(body);
      await category.save();
      res.send({
        message: "category is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this category is already exist",
        success: false,
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
router.put('/updateCategory/:id', async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "category updated successfully",
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
router.post('/createQuantityType', async (req, res) => {
  try {

    let body = req.body;
    let data = await QuantityType.findOne({ type: body.type })
    console.log(data)
    if (!data) {
      let quantityType = new QuantityType(body);
      await quantityType.save();
      res.send({
        message: "quantity type  is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this quantity type is already exist",
        success: false,
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
router.put('/updateQuantityType/:id', async (req, res) => {
  try {
    await QuantityType.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "quantity type is updated successfully",
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
router.post('/createHsnCode', async (req, res) => {
  try {

    let body = req.body;
    let data = await Hsncode.findOne({ code: body.code })
    console.log(data)
    if (!data) {
      let hsnCode = new Hsncode(body);
      await hsnCode.save();
      res.send({
        message: "hsn is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this hsn code is already exist",
        success: false,
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
router.put('/updateHsnCode/:id', async (req, res) => {
  try {
    await Hsncode.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "hsn code updated successfully",
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
router.post('/createGst', async (req, res) => {
  try {

    let body = req.body;
    let data = await Gst.findOne({ gst: body.gst })
    if (!data) {
      let gst = new Gst(body);
      await gst.save();
      res.send({
        message: "gst is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this gst is already exist",
        success: false,
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
router.put('/updateGst/:id', async (req, res) => {
  try {
    await Gst.findByIdAndUpdate(req.params.id, req.body)
    res.send({
      message: "gst updated successfully",
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

router.post('/createLowQuantity', async (req, res) => {
  try {

    let body = req.body;
    let data = await Lowquantity.findOne({ lowqty: body.lowqty })
    if (!data) {
      let lowqty = new Lowquantity(body);
      await lowqty.save();
      res.send({
        message: "low is successfully added",
        success: true,
      })
    }
    else {
      res.send({
        message: "this gst is already exist",
        success: false,
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
router.put('/updatelowQuantity/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    console.log(req.body)
    f = await Lowquantity.findByIdAndUpdate(req.params.id, req.body)
    console.log(f)
    res.send({
      message: "low quanttity updated successfully",
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
module.exports = router