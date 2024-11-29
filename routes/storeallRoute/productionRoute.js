let express = require("express");
let router = express.Router();
const Production = require("../../modals/store/production");
const Inward=require('../../modals/store/inwardModal')
const PurchaseStore = require("../../modals/store/purchaseStore");
const {ProductionStore} = require("../../modals/store/productionStore");
const production = require("../../modals/store/production");
const authMidd=require('../../middleware/authmiddleware')
router.get('/allMomvement/:companyname',async(req,res)=>{
 try{
 
 let data= await Production.aggregate([
    {$unwind:{path:"$readyStock"}},
    {$match:{status:'confirmed',companyname:req.params.companyname}},
    {$group:
      {_id:"$_id", 
      productNames: { $push: "$readyStock.name" },
      hsnNames:{ $push: {$toString:"$readyStock.hsnCode"} },
      priceValues:{ $push:{$toString:"$readyStock.price" }},
      qtyValues:{ $push:{$toString:"$readyStock.quantity" }},
      gtyTypValues:{ $push: {$toString:"$readyStock.qtyType"} },
      
      status: { $first: "$status" },mov: { $first: "$mov" },
      type: { $first: "move" },
      date: { $first: "$dateCreated" }, 
      total: {$sum:{$multiply: ["$readyStock.price","$readyStock.quantity",{ $add: [1, { $divide: ["$readyStock.gst", 100] }] }]}},
      totalwithoutgst:{$sum:{ $multiply: [ "$readyStock.price", "$readyStock.quantity" ] }}}},
    {$project:{
      _id:1,
      status:1,
      mov:1,
      type:1,
      date:1,
      total:1,
      totalwithoutgst:1,
      productNames:{
        $reduce:{
          input:"$productNames",
          initialValue:"",
          in:{$concat:["$$this","|","$$value"]}
        }
      },
      hsnNames:{
        $reduce:{
          input:"$hsnNames",
          initialValue:"",
          in:{$concat:["$$this","|","$$value"]}
        }
      },
      priceValues:{
        $reduce:{
          input:"$priceValues",
          initialValue:"",
          in:{$concat:["$$this","|","$$value"]}
        }
      },
      qtyValues:{
        $reduce:{
          input:"$qtyValues",
          initialValue:"",
          in:{$concat:["$$this","|","$$value"]}
        }
      },
      gtyTypValues:{
        $reduce:{
          input:"$gtyTypValues",
          initialValue:"",
          in:{$concat:["$$this","|","$$value"]}
        }
      },
      
      

    }},
    
  ])
   res.send({
    message: "data is successfully attached",
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

router.put("/changestatus/:companyId/:id", async (req, res) => {
  let parr = [];
  let purArr=[];
  try {
    let status = req.body.status;
    let prod = await Production.findOne({companyname:req.params.companyId, _id: req.params.id });
    console.log(prod)
    let result = await Production.updateOne(
      {companyname:req.params.companyId,_id: req.params.id },
      { $set: { status: req.body.status } }
    );
    let preStatus = prod.status;
    console.log("previsous status:", preStatus);
    console.log("current status", status);
    if (status == "canceled") {
      if (preStatus == "pending") {
        //await Production.deleteOne({companyname:req.params.companyId,_id: req.params.id });
      } else if (preStatus == "confirmed") {
        let { raw, readyStock } = prod;
        //here updating purchase store
        for (let i = 0; i < raw.length; i++) {
          let { id, quantity } = raw[i];
          const f = await PurchaseStore.updateOne(
            {companyname:req.params.companyId,'item.id':id },
            { $inc: { "item.$[elem].quantity":quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        }
        //ending
  
        //updating production store
        for (let i = 0; i < readyStock.length; i++) {
          let { id, quantity } = readyStock[i];
          
          const f = await ProductionStore.updateOne(
            {companyname:req.params.companyId,'readyStock.id':id },
            { $inc: { "readyStock.$[elem].quantity":-quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
         
        }
  
       // await Production.deleteOne({companyname:req.params.companyId, _id: req.params.id });
       
      }
    }

    if (status == "pending" && preStatus == "confirmed") {
      let { raw, readyStock } = prod;
      //here updating purchase store
      for (let i = 0; i < raw.length; i++) {
        let { id, quantity } = raw[i];
        const f = await PurchaseStore.updateOne(
          {companyname:req.params.companyId,'item.id':id},
          { $inc: { "item.$[elem].quantity":quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
      }
      //ending

      //updating production store
      for (let i = 0; i < readyStock.length; i++) {
        let { id, quantity } = readyStock[i];
       
        const f = await ProductionStore.updateOne(
          {companyname:req.params.companyId,'readyStock.id':id},
          { $inc: { "readyStock.$[elem].quantity":-quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
       
      }

      //let rs= await ProductionStore.updateMany({},{$pull:{readyStock:{qty:0}}}) this may use
      //let rs2= await ProductionStore.deleteMany({ readyStock: { $size: 0 } }); this may use
    }

    if (status == "confirmed" && preStatus != "confirmed") {
      console.log('hi in confirmed block and updatiing purchchase store')
      let { raw, readyStock } = prod;
      //here updating purchase store
      for (let i = 0; i < raw.length; i++) {
        let { id, quantity } = raw[i];
        const f = await PurchaseStore.updateOne(
          {companyname:req.params.companyId,'item.id':id },
          { $inc: { "item.$[elem].quantity": -quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
        if (f.matchedCount == 0) {
          let elem =raw[i];
          elem.quantity=-elem.quantity
          let f=purArr.find((elem2)=>elem2.id==elem.id)
          if(f){
           f.quantity+=elem.quantity
          }
          else{
            purArr.push(elem);
          }
         
        }
      }
      if (purArr.length > 0) {
        let purchasestore = new PurchaseStore({companyname:req.params.companyId,item: purArr });
        await purchasestore.save();
      }

      //ending

      //updating production store
      for (let i = 0; i < readyStock.length; i++) {
        let { id, quantity } = readyStock[i];
        
        const f = await ProductionStore.updateOne(
          { companyname:req.params.companyId,'readyStock.id':id},
          { $inc: { "readyStock.$[elem].quantity": quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
        if (f.matchedCount == 0) {
          let elem = readyStock[i];
          parr.push(elem);
        }
      }
      if (parr.length > 0) {
       
        let product = new ProductionStore({companyname:req.params.companyId,readyStock: parr });
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

router.post("/production3/:companyname", async (req, res) => {
  let body = req.body;
  let {readyStock}=body
  body.companyname=req.params.companyname

  try {

    let data=await Production.find({companyname:req.params.companyname})
    let max=data.reduce((acc,curr)=>curr.mov>acc?curr.mov:acc,0)
    max=max+1;
    body.mov=max;

    let total=readyStock.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
    let baseAmount=readyStock.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
    
    body.total=total
    body.baseAmount=baseAmount


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

router.get('/allProdcution/:companyname',async(req,res)=>{
    
     try{
         let data=await Production.find({companyname:req.params.companyname})
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

router.get("/prod/statuswithprev/:companyname/:id/:position", async (req, res) => {
  let position=req.params.position
  console.log(position)
  let arr = [];
  try {
  
    let current = await Production.findOne({ _id: req.params.id,companyname:req.params.companyname});
    let { readyStock } = current;
    let allProduction = await Production.find({companyname:req.params.companyname});
    allProduction = allProduction.slice(0, position-1).reverse();
    //allProduction=allProduction.slice(0,-1)
    console.log(allProduction)
   
      allProduction.map(elem=>{
       elem.readyStock.map(elem2=>{
         arr.push(elem2)
       })
      
      })

    let prevarr = arr.filter((elem) =>
      readyStock.find(
        (elem2) => elem2.id == elem.id
      )
    );
    
    let finalarr=readyStock.map(elem=>{
      console.log(elem)
      let f=prevarr.find(elem2=>elem2.id==elem.id)
      let js2=f?{id:elem._id,name:elem.name,quantity:elem.quantity,prev:f.quantity}:{id:elem._id,name:elem.name,quantity:elem.quantity,prev:0}
     
      return js2
    })
  
    res.send({
      message: "data is successfully fetched",
      success: true,
      data:finalarr,
    });
    
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});


  

router.get("/allStock/:companyname", async (req, res) => {
  try {
    let porArr = await ProductionStore.find({companyname:req.params.companyname}, { _id: 0 });
    let purArr = await PurchaseStore.find({companyname:req.params.companyname}, { _id: 0 });
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
router.get("/purchaseStore/:companyname", async (req, res) => {
  try {
    let allpurchasesore = await PurchaseStore.find({companyname:req.params.companyname});
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

router.get("/productionStore/:companyname", async (req, res) => {
  try {
    let allprodcutionStore = await ProductionStore.find({companyname:req.params.companyname});
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


router.get("/allcancelStock/:companyname", async (req, res) => {
  try {
    let porArr = await Production.find({companyname:req.params.companyname,status:'canceled'}, { _id: 0 });
    let purArr = await Inward.find({companyname:req.params.companyname,status:'canceled'}, { _id: 0 });
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

router.put('/updateProduction/:companyname/:id/:status',async(req,res)=>{
 try{
  let body=req.body
  let {readyStock}=body
  let status=req.params.status;
  console.log('status is:',status)
  if(status=='confirmed'){
    res.send({
      message:"you can not update confirmed stock please make pending first",
      success:false,
    })
  }
  else{
    let total=readyStock.reduce((acc,curr)=>acc+curr.price*curr.quantity*(1+curr.gst/100),0)
    let baseAmount=readyStock.reduce((acc,curr)=>acc+curr.price*curr.quantity,0)
    body.total=total
    body.baseAmount=baseAmount
    
    const query = { _id: req.params.id, companyname: req.params.companyname };
      const updatedDocument = await Production.findOneAndUpdate(
        query,
        body,
        {
          new: true, // This should return the updated document
          runValidators: true, // Ensure validation rules are applied
          rawResult: false // This is optional; it should be false by default
        }
      );
      res.send({
        message:'updated successfully',

        success:true
      })

  }
}
catch(err){
  res.send({
    message:err.message,
    success:false
  })
}
 
})



router.get('/momentReport',async(req,res)=>{
  try{
    let {fromDate,toDate,companyname}=req.query
    let query = {companyname:companyname,status:"confirmed"}
    let data=await Production.find(query);
    if(fromDate&&toDate){
      const [dayFrom, monthFrom, yearFrom] = fromDate.split('-');
      const [dayTo, monthTo, yearTo] = toDate.split('-');
    
      const from = new Date(`${yearFrom}-${monthFrom}-${dayFrom}`);
      const to = new Date(`${yearTo}-${monthTo}-${dayTo}`);
      data=data.filter(item => {
        const [day, month, year] = item.dateCreated.split('-');
        let itemDate= new Date(`${year}-${month}-${day}`);
        return itemDate >= from && itemDate <= to;
    });
    }
    res.send({
      message:'data is successfully fetched',
      success:true,
      data:data
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


module.exports = router;
  