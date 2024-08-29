let express = require("express");
let router = express.Router();
const Production = require("../../modals/store/production");
const PurchaseStore = require("../../modals/store/purchaseStore");
const {ProductionStore} = require("../../modals/store/productionStore");
const production = require("../../modals/store/production");
const authMidd=require('../../middleware/authmiddleware')

router.get('/allMomvement',async(req,res)=>{
 try{
   let result= await production.find({status:'confirmed'},{raw:1})
   res.send({
    message: "data is successfully attached",
    success: true,
    data:result
  });
 }
 catch(err){
  res.send({
    message: err.message,
    success: false,
    data:null
  });
   
 }
})

router.put("/changestatus/:id/", async (req, res) => {
  let parr = [];
  try {
    let status = req.body.status;
    let prod = await Production.findOne({ _id: req.params.id });
    let result = await Production.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } }
    );
    let preStatus = prod.status;
    console.log("previsous status:", preStatus);
    console.log("current status", status);
    if (status == "canceled") {
      if (preStatus == "pending") {
        await Production.deleteOne({ _id: req.params.id });
      } else if (preStatus == "confirmed") {
        let { raw, readyStock } = prod;
        //here updating purchase store
        for (let i = 0; i < raw.length; i++) {
          let { id, quantity } = raw[i];
          const f = await PurchaseStore.updateOne(
            { item: { $elemMatch: { id: id } } },
            { $inc: { "item.$[elem].quantity":quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        }
        //ending
  
        //updating production store
        for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          console.log("updating production store");
          console.log(quantity, id);
          const f = await ProductionStore.updateOne(
            { readyStock: { $elemMatch: { id: id } } },
            { $inc: { "readyStock.$[elem].quantity":-quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
  
        await Production.deleteOne({ _id: req.params.id });
       
      }
    }

    if (status == "pending" && preStatus == "confirmed") {
      let { raw, readyStock } = prod;
      //here updating purchase store
      for (let i = 0; i < raw.length; i++) {
        let { id, quantity } = raw[i];
        const f = await PurchaseStore.updateOne(
          { item: { $elemMatch: { id: id } } },
          { $inc: { "item.$[elem].quantity":quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
      }
      //ending

      //updating production store
      for (let i = 0; i < readyStock.length; i++) {
        let { id, quantity } = readyStock[i];
        console.log("updating production store");
        console.log(quantity, id);
        const f = await ProductionStore.updateOne(
          { readyStock: { $elemMatch: { id: id } } },
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
      }

      //let rs= await ProductionStore.updateMany({},{$pull:{readyStock:{qty:0}}}) this may use
      //let rs2= await ProductionStore.deleteMany({ readyStock: { $size: 0 } }); this may use
    }

    if (status == "confirmed" && preStatus != "confirmed") {
      let { raw, readyStock } = prod;
      //here updating purchase store
      for (let i = 0; i < raw.length; i++) {
        let { id, quantity } = raw[i];
        const f = await PurchaseStore.updateOne(
          { item: { $elemMatch: { id: id } } },
          { $inc: { "item.$[elem].quantity": -quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
      }
      //ending

      //updating production store
      for (let i = 0; i < readyStock.length; i++) {
        let { id, quantity } = readyStock[i];
        console.log("updating production store");
        console.log(quantity, id);
        const f = await ProductionStore.updateOne(
          { readyStock: { $elemMatch: { id: id } } },
          { $inc: { "readyStock.$[elem].quantity": quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
        if (f.matchedCount == 0) {
          let elem = readyStock[i];
          parr.push(elem);
        }
      }
      if (parr.length > 0) {
        console.log("hit");
        console.log(parr);
        let product = new ProductionStore({ readyStock: parr });
        await product.save();
      }
      //ending
    }
    res.send({
      message: "status is successfully update",
      success: true,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});

router.post("/production3", async (req, res) => {
  let body = req.body;
  try {
    let production = Production(body);
    await production.save();
    res.send({
      message: "data is added success fully added",
      success: true,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});

router.get('/allProdcution',async(req,res)=>{
    
     try{
         let data=await Production.find()
         res.send({
          message: 'data is succfully fetched',
          success: true,
          data:data
        });
     }
     catch(err){
      res.send({
        message: err.message,
        success: false,
        data:null
      });

     }
})

router.get("/prod/statuswithprev/:id", async (req, res) => {
  let arr = [];
  try {
    let prod = await Production.findOne({ _id: req.params.id });
    let { readyStock } = prod;
    let allProduction = await ProductionStore.find();
    allProduction.map((elem) => {
      elem.readyStock.map((elem) => {
        arr.push(elem);
      });
    });
    let prevarr = arr.filter((elem) =>
      readyStock.find(
        (elem2) => elem2.id == elem.id
      )
    );
    let js3={prev:prevarr,now:readyStock}
    res.send({
      message: "data is successfully fetched",
      success: true,
      data:js3,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});

router.get("/prod/status/:id", async (req, res) => {
  try {
    let prod = await Production.aggregate([
      {
        $project: {
          readyStock: {
            $map: {
              input: "$readyStock",
              as: "item",
              in: {
                name: "$$item.name",
                brand: "$$item.brand",
                quantity: "$$item.quantity",
                gst: "$$item.gst",
                price: "$$item.price",
                total: {
                  $multiply: [
                    "$$item.price",
                    "$$item.quantity",
                    { $add: [1, { $divide: ["$$item.gst", 100] }] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);
    res.send({
      message: "data is successfully",
      success: true,
      data: prod,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
});

router.get("/allStock", async (req, res) => {
  try {
    let porArr = await ProductionStore.find({}, { _id: 0 });
    let purArr = await PurchaseStore.find({}, { _id: 0 });
    console.log("prodcution arr:", porArr);
    let finalarr = [];
    for (let i = 0; i < purArr.length; i++) {
      for (j = 0; j < purArr[i].item.length; j++) {
        finalarr.push(purArr[i].item[j]);
      }
    }
    for (let i = 0; i < porArr.length; i++) {
      for (j = 0; j < porArr[i].readyStock.length; j++) {
        finalarr.push(porArr[i].readyStock[j]);
      }
    }
    res.send({
      message: "all stock is successfully fetched",
      success: true,
      data: finalarr,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
});
router.get("/purchaseStore", async (req, res) => {
  try {
    let allpurchasesore = await PurchaseStore.find();
    res.send({
      message: "data is successfully",
      success: true,
      data: allpurchasesore,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
});

router.get("/productionStore", async (req, res) => {
  try {
    let allprodcutionStore = await ProductionStore.find();
    res.send({
      message: "data is successfully",
      success: true,
      data: allprodcutionStore,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
});

module.exports = router;
