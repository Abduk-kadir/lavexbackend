let express = require("express");
let router = express.Router();
const ItemMaster = require("../../modals/store/itemMaster");
const BillOfMaterial = require("../../modals/store/bomModal");
const authMidd=require('../../middleware/authmiddleware')
let Logitemmaster=require('../../modals/logs/itemMasterLogM')
router.get("/usedInBom/:id", async (req, res) => {
  let inbomdata;
  try {
    let rs = await ItemMaster.findById({ _id: req.params.id });
    if (rs.stockStatus == "Raw") {
      inbomdata = await BillOfMaterial.find({
        raw: { $elemMatch: { id: rs.id } },
      });
    } else {
      inbomdata = await BillOfMaterial.find({ "readyStock.id": rs.id });
    }
    res.send({
      message:"this item master used in following bom",
      success:true,
      data:inbomdata
    })
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});

router.put('/updatingItemMater/:id',async(req,res)=>{
  let inbomdata;
  let body=req.body
  try {
    let rs = await ItemMaster.findById({ _id: req.params.id });
    if (rs.stockStatus == "Raw") {
      inbomdata = await BillOfMaterial.find({
        raw: { $elemMatch: { id: rs.id } },
      });
     
    } else {
      inbomdata = await BillOfMaterial.find({ "readyStock.id": rs.id });
    }
    
    if(inbomdata.length>0){
      res.send({
        message:"this item master used in  boms can not delete",
        success:false,
      })

    }
    else{
     
      let {name,qtyType,qtyType2,qty,hsnCode,brand,stockStatus,lowqty,category,price}=rs
      console.log(name,qtyType,qtyType2,qty,hsnCode,brand,stockStatus,lowqty,category)
      let str='';
      if(name!=body.name){str=`name was ${name} and changed name is ${body.name}  `}
      if(qtyType!=body.qtyType){str+=`quantity type was ${qtyType} and changed quantity type  is ${body.qtyType}`}
      if(qtyType2!=body.qtyType2){str+=`quantity type2  was ${qtyType2} and changed qtytype2 is ${body.qtyType2}`}
      if(qty!=body.qty){str+=`quantity was ${qty} and changed quantity is ${body.qty}`}
      if(hsnCode!=body.hsnCode){str+=`hsncode was ${hsnCode} and changed hsncode is ${body.hsnCode}`}
      if(brand!=body.brand){str+=`brand was ${brand} and changed brand is ${body.brand}`}
      if(price!=body.price){str+=`price was ${price} and changed price is ${body.price}`}
      if(lowqty!=body.lowqty){str+=`lowqty was ${lowqty} and changed name is ${body.lowqty}`}
      if(category!=body.category){str+=`category was ${category} and changed name is ${body.category}`}
      let js={itemId:rs.mov,actionType:'UPDATE',changedBy:"abdul",changeDetails:str}
      let log=new Logitemmaster(js)
      await log.save()
      
      await ItemMaster.findByIdAndUpdate(req.params.id,body,{runValidators: true }) 
      res.send({
        message:"item master is successfully updated",
        success:true,
      })

    }
   
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }

})
router.delete('/deletingItemMater/:id',async(req,res)=>{
  let inbomdata;
  let body=req.body
  try {
    let rs = await ItemMaster.findById({ _id: req.params.id });
    if (rs.stockStatus == "Raw") {
      inbomdata = await BillOfMaterial.find({
        raw: { $elemMatch: { id: rs.id } },
      });
    } else {
      inbomdata = await BillOfMaterial.find({ "readyStock.id": rs.id });
    }
    
    if(inbomdata.length>0){
      res.send({
        message:"this item master used in bom can not delete",
        success:false,
      })

    }
    else{

      console.log(rs)
      let {name,quantitiy,qtytype,qtytype2,qty,hsnCode,brand,stockStatus,status,lowqty,category}=rs
      console.log(name,quantitiy,qtytype,qtytype2,qty,hsnCode,brand,stockStatus,status,lowqty,category)
      let str=`${rs.name} is deleted`
      let js={itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str}
      let log=new Logitemmaster(js)
      await log.save()
      await ItemMaster.findByIdAndDelete(req.params.id)
      res.send({
        message:"item master is successfully deleted",
        success:true,
      })

    }
   
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }

})



router.post("/addItemMaster/:companyId", async (req, res) => {
  try {
    let body = req.body;
    body.companyname=req.params.companyId
    let data=await ItemMaster.find()
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    body.mov=max
    let itemmaster = new ItemMaster(body);
    await itemmaster.save();
    res.send({
      message: "data is successfully added",
      success: true,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});
router.get("/allItemMaster/:companyId/:role", async (req, res) => {
  try {
    let role=req.params.role
    let result =role=='master'?await ItemMaster.find({companyname:req.params.companyId}):await ItemMaster.find({stockStatus:"ReadyStock"});
    res.send({
      message: "data is fetched successfully",
      success: true,
      data: result,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
});

router.get('/itemLog',async(req,res)=>{
  try{
       let data=await Logitemmaster.find().sort({timestamp:-1})
       res.send({
        message:'success',
        data:data,

       })

  }
  catch(err){
    res.send({
      message:err.message,
      data:null,
      
     })



  }
})




module.exports = router;
