let express = require("express");
let router = express.Router();
const cloudinary = require('cloudinary').v2;
const ItemMaster = require("../../modals/store/itemMaster");
const BillOfMaterial = require("../../modals/store/bomModal");
const authMidd=require('../../middleware/authmiddleware')
let Logs=require('../../modals/logs/logs')
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const xlsx=require('xlsx')
cloudinary.config({ 
  cloud_name: 'dz1mqwzrt', 
  api_key: '891497942385565', 
  api_secret: 'owVGCdRJOobWpui8mf4IXfexxxE' // Click 'View API Keys' above to copy your API secret
});

router.post("/addItemMaster/:companyId", upload.single('image'), async (req, res) => {
  try {
   
    if (!req.file) {
      return res.status(400).send({
        message: "No image file provided.",
        success: false,
      });
    }
    cloudinary.uploader.upload_stream({resource_type: 'auto', }, async (error, result) => {
      if (error) {
        return res.status(500).send({
          message: error.message,
          success: false,
        });
      }
      let body = req.body;
      body.companyname = req.params.companyId;
      body.image = result.secure_url; 
      let itemmaster = new ItemMaster(body);
      await itemmaster.save();

      res.send({
        message: "Data successfully added",
        success: true,
      });
    }).end(req.file.buffer); // Send the file buffer directly to Cloudinary
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
  
});

router.post('/itemImport', upload.single('file'),async(req,res)=>{
   
    try{
      
      if (!req.file) {
       
        res.send({message:"no file uploaded",success:false,})
      }
      else{
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        console.log(workbook)
        const sheetName = workbook.SheetNames[0];
        const worksheet=workbook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(worksheet);
        

      }



    }
    catch(err){

       res.send(err.message)
    }
   

})



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

router.put('/updatingItemMater/:id/:companyname', upload.single('image'),async(req,res)=>{
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
      
      if(req.file){
        cloudinary.uploader.upload_stream({resource_type: 'auto', }, async (error, result) => {
          if (error) {
            return res.status(500).send({
              message: error.message,
              success: false,
            });
          }
          body.image = result.secure_url; 
          await ItemMaster.findByIdAndUpdate(req.params.id,body,{runValidators: true }) 
          res.send({
            message:"item master is successfully updated",
            success:true,
          })
          
        }).end(req.file.buffer);
      }
      else{
      
        let f=await ItemMaster.findById(req.params.id)
        body.image=f.image
        await ItemMaster.findByIdAndUpdate(req.params.id,body,{runValidators: true }) 
        res.send({
          message:"item master is successfully updated",
          success:true,
        })
        
      }
      

    }
   
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }

})
router.delete('/deletingItemMater/:id/:companyname',async(req,res)=>{
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
      let {name,qtyType,qtyType2,qty,hsnCode,brand,stockStatus,lowqty,category}=rs
      console.log(name,qtyType,qtyType2,qty,hsnCode,brand,stockStatus,lowqty,category)
      let str=`${rs.name} is deleted`
      let js={companyname:req.params.companyname,itemId:rs.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Item Master"}
      let log=new Logs(js)
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
