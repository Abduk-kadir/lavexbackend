let express=require('express')
let router=express.Router()
const Manufacturer = require('../modals/manufacturer/manufacturerModel');
router.post('/create',async(req,res)=>{
    try{
        let manufacturer=new Manufacturer(req.body);
        await manufacturer.save();
        res.send({
           message:"data is successfully added",
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
module.exports=router