let express = require("express");
let router = express.Router();
const ItemMaster = require("../../modals/store/itemMaster");
const BillOfMaterial = require("../../modals/store/bomModal");
const authMidd=require('../../middleware/authmiddleware')
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






module.exports = router;
