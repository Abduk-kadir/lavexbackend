let express=require('express')
let router=express.Router()
const ItemMaster = require('../../modals/store/itemMaster');
const BillOfMaterial = require('../../modals/store/bomModal');
router.delete('/delItemMater/:id',async(req,res)=>{
    console.log(req.params.id)
    try{
        let rs= await ItemMaster.findByIdAndDelete({_id:req.params.id})
        if(rs.stockStatus=='Raw'||rs.stockStatus=='Part'||rs.stockStatus=='Fixed_Asset')
        {
                console.log('rs.name:',rs.name)
                let f=await BillOfMaterial.updateMany( {},{ $pull: { raw: { name: rs.name } } } )  
                console.log(f)
        }
        else
        {
                let f=await BillOfMaterial.deleteMany({"readyStock.name":rs.name})
        }

        
        res.send({
            message:"item is sussessfully deleted",
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







router.post('/addItemMaster',async(req,res)=>{
    try{
        
        let body=req.body;
        let data=await ItemMaster.findOne({name:body.name})
        console.log(data)
        console.log(!data)
        if(!data){
        let itemmaster=new ItemMaster(body);
        await itemmaster.save();
        res.send({
           message:"data is successfully added",
           success:true, 
        })
       }
       else{
        res.send({
            message:"this name is already exist",
            success:false, 
         })

       }
      }
       catch(err){
           res.send({
               message:err.message,
               success:false,
        
           })
   
       }

})
router.get('/allItemMaster',async(req,res)=>{
    try{
      let result=await ItemMaster.find()
      res.send({
        message:"data is fetched successfully",
        success:true,
        data:result

      })
    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
    
          })

    }

})

router.put('/updatingItemMater/:id',async(req,res)=>{
    console.log(req.params.id)
    let body=req.body
    let name=body.name
    try{
        let rs= await ItemMaster.findByIdAndUpdate({_id:req.params.id},req.body)
        if(rs.stockStatus=='Raw'||rs.stockStatus=='Part'||rs.stockStatus=='Fixed_Asset')
        {
         
                let f=await BillOfMaterial.updateMany( { raw: { $elemMatch: { name:name } } },
                    { $set: { "raw.$[elem]":body } }, { arrayFilters: [ { "elem.name":name }]}
                 )  
               
        
        }
        else{

                let f=await BillOfMaterial.updateMany({"readyStock.name":name},{$set:{readyStock:body}})
                   

        }

        
        res.send({
            message:"item is sussessfully updated",
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


router.get('/allbystatus/:status',async(req,res)=>{
      try{
        let result=await ItemMaster.find({stockStatus:req.params.status})
        res.send({
          message:"data is fetched successfully",
          success:true,
          data:result
  
        })

      }
      catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
    
          })

      }

})

router.get('/rawItem/:name',async(req,res)=>{
  
    try{
        let result=await ItemMaster.findOne({name:req.params.name},{name:1,qty:1,price:1,qtyType:1,gst:1,brand:1})
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