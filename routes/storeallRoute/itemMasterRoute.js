let express = require("express");
let router = express.Router();
const cloudinary = require('cloudinary').v2;
const ItemMaster = require("../../modals/store/itemMaster");
const BillOfMaterial = require("../../modals/store/bomModal");
const authMidd=require('../../middleware/authmiddleware')
let Logs=require('../../modals/logs/logs')
const multer  = require('multer')
const upload = multer({dest: "uploads/", })
const xlsx=require('xlsx')
cloudinary.config({ 
  cloud_name: 'dz1mqwzrt', 
  api_key: '891497942385565', 
  api_secret: 'owVGCdRJOobWpui8mf4IXfexxxE' // Click 'View API Keys' above to copy your API secret
});



router.post('/itemImport', upload.single('file'),async(req,res)=>{
   
    try{
      if (!req.file) {
        res.send({message:"no file uploaded",success:false,})
      }
      else{
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
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
    const filePath = req?.file?.path;
    console.log('filepath is:',filePath)
    let rs = await ItemMaster.findById({ _id: req.params.id });
    console.log(rs)
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
      if(str!=''){
      let js={companyname:req.params.companyname,itemId:rs.mov,actionType:'UPDATE',changedBy:"abdul",changeDetails:str,model:'Item Master'}
     
      let log=new Logs(js)
      await log.save()
      }
      if(filePath){
      let result=await cloudinary.uploader.upload(filePath)
    
      body.image=result.secure_url
      }
      else{
        console.log('not sending image state')
        let f=await ItemMaster.findById(req.params.id)
        body.image=f.image
      }
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
router.post("/addItemMaster/:companyId", upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    let result=await cloudinary.uploader.upload(filePath)
    console.log(result)
    let body = req.body;
    body.companyname=req.params.companyId
    
    body.image=result.secure_url
    let itemmaster = new ItemMaster(body);
    await itemmaster.save();
    let str=`${body.name} is created`
    let js={companyname:req.params.companyId,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Item master"}
    let log=new Logs(js)
    await log.save()
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
