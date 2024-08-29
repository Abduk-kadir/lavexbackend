const express = require("express");
const Company = require("../modals/companyModal");
router = express.Router();
router.post("/addCompany", async (req, res) => {
  try {
    let body = req.body;
    body.role.toLowerCase();
    let company = new Company(body);
    await company.save();
    res.send({
      message: "company is successfully added",
      success: true,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
    });
  }
});
router.get("/allcompany", async (req, res) => {
  try {
    let result = await Company.find();
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
/*
router.put('/addTransaltion/:id',async(req,res)=>{
    
    try
    {  
        console.log("arman")
        await Company.updateOne({_id:req.params.id},{$set:req.body})
        res.send({
            message:"translation is successfully updated",
            success:false
        })
            
    }
    catch(err){
        res.send({
            message:err.message,
            success:false

        })

    }
        
   

})

router.get('/getcompany/:id',async(req,res)=>{
    
    try
    {
        let cp=await Company.findById(req.params.id)
        res.send({
            message:"data is fetched successfully",
            data:cp,
            success:true

        })
    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:false

        })

    }

})


router.put('/updateCompany/:id',async(req,res)=>{
    console.log('fjdjshjkdkhgjkdh')
    console.log(req.params.id)
    try{
      let result=await Company.findByIdAndUpdate(req.params.id,req.body)
     
      res.send({
        message:"data is successfully updated",
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

router.delete('/deleteCompany/:id',async(req,res)=>{
    try{
        await Company.findByIdAndDelete(req.params.id);
        res.send({
            message:"data is successfully deleted",
            success:true

        })
    }
    catch(err){
       res.send({
        message:"please provide correct id",
        success:false
       })

    }

})
    
*/

module.exports = router;
