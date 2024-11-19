const express = require("express");
const Company = require("../modals/companyModal");
const Logs=require('../modals/logs/logs')
router = express.Router();
router.post("/addCompany", async (req, res) => {
  try {
    let body = req.body;
    body.role = body.role.toLowerCase();
    body.Branch=body.Branch.toUpperCase();
    let data=await Company.find()
    let max = data.reduce((acc, curr) => curr.mov > acc ? curr.mov : acc, 0)
    max = max + 1;
    body.mov=max

    let company = new Company(body);
    await company.save();
    let str=`company ${body.company} is created`
        let js={companyname:body.company,itemId:max,actionType:'CREATE',changedBy:"ABDUL",changeDetails:str,model:"Company"}
        let log=new Logs(js)
        await log.save()


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

router.put('/updateCompany/:id',async(req,res)=>{
    try{
      let result=await Company.findByIdAndUpdate(req.params.id,req.body)
      let {
        client,
        grade,
        shortCode,
        gstNumber,
        address,
        location,
        area,
        pincode,
        state,
        city,
        panNumber
        ,email,
        contactPerson,
        mobile1,
        accPerson,
        mobile2,
        fcAmount,
        fcDays,
        scAmount,
        scDays,
        shipTo,
        createdAt,
        Branch,
        salesman
        
    }=c
    let str='';
    if(shortCode!=body.shortCode){str+=`${shortCode} is changed to ${body.shortCode}  `}
    if(gstNumber!=body.gstNumber){str+=`${gstNumber} is changed to ${body.gstNumber}  `}
    if(address!=body.address){str+=`${address} is changed to ${body.address}  `}
    if(location!=body.location){str+=`${location} is changed to ${body.location}  `}
    if(area!=body.area){str+=`${area} is changed to ${body.area}  `}
    if(pincode!=body.pincode){str+=`${pincode} is changed to ${body.pincode}  `}
    if(state!=body.state){str+=`${state} is changed to ${body.state}`}
    if(city!=body.city){str+=`${city} is changed to ${body.city}  `}
    if(panNumber!=body.panNumber){str+=`pan number ${panNumber} is changed to ${body.panNumber}  `}
    if(email!=body.email){str+=`${email} is changed to ${body.email}`}
    if(contactPerson!=body.contactPerson){str+=`contact person ${contactPerson} is changed to ${body.contactPerson}  `}
    if(mobile1!=body.mobile1){str+=`${mobile1} is changed to ${body.mobile1}  `}
    if(accPerson!=body.accPerson){str+=`accountable person ${accPerson} is changed to ${body.accPerson}`}
    if(mobile2!=body.mobile2){str+=`${mobile2} is changed to ${body.mobile2}  `}
   
    if(shipTo!=body.shipTo){str+=`shiping ${shipTo} is changed to ${body.shipTo}`}
    if(Branch!=body.Branch){str+=`branch ${Branch} is changed to ${body.Branch}`}
   
    if(str!=''){
    let js={companyname:result.company,itemId:result.mov,actionType:'UPDATE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
    let log=new Logs(js)
    await log.save()
    }
     
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
        result=await Company.findByIdAndDelete(req.params.id);
        let str=`company ${result.client} is deleted`
        let js={companyname:result.company,itemId:result.mov,actionType:'DELETE',changedBy:"ABDUL",changeDetails:str,model:"Client"}
        console.log(js)
        let log=new Logs(js) 
            await log.save()
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
    


module.exports = router;
