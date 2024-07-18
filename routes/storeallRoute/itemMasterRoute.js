let express=require('express')
let router=express.Router()
const ItemMaster = require('../../modals/store/itemMaster');
router.post('/addItemMaster',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await ItemMaster.find()
        let val=data.reduce((acc,curr)=>curr.itemCode>acc?curr.itemCode:acc,0)
        val=val+1
        let itemmaster=new ItemMaster({...body,itemCode:val});
        await itemmaster.save();
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

router.get('/rawItem/:name',async(req,res)=>{
  
    try{
        let result=await ItemMaster.findOne({name:req.params.name},{name:1,qty:1,price:1,qtyType:1,gst:1})
        console.log(result)
        if(result==null){
          
            res.send({
                message:"please provide correct raw Item name",
                success:false,
                data:result
               })
            
        }
        else{
           
            res.send({
                message:"data is successfully fectched",
                success:true,
                data:result
               })
        }

    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
           })

    }
})

router.get('/ready/:name',async(req,res)=>{
  
    try{
        let result=await ItemMaster.findOne({name:req.params.name},{name:1,qty:1,price:1,qtyType:1,gst:1})
        console.log(result)
        if(result==null){
          
            res.send({
                message:"please provide correct ready Item name",
                success:false,
                data:result
               })
            
        }
        else{
           
            res.send({
                message:"data is successfully fectched",
                success:true,
                data:result
               })
        }

    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
           })

    }
})



module.exports=router