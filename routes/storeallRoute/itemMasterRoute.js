let express=require('express')
let router=express.Router()
const ItemMaster = require('../../modals/store/itemMaster');
const BillOfMaterial = require('../../modals/store/bomModal');
/*router.delete('/delItemMater/:id',async(req,res)=>{
    console.log(req.params.id)
    try{
       let rs= await ItemMaster.findById({_id:req.params.id})
       let {status}=rs
       if(status=='active'){
        res.send({
            message:'status is active can not delete ',
            success:false,
          })

       }
       else{
        let rs= await ItemMaster.findByIdAndDelete({_id:req.params.id})
        res.send({
            message:'data is successfully deleted ',
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

*/





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


/*
router.put('/updatingItemMater/:id',async(req,res)=>{
    console.log(req.params.id)
    let body=req.body
   
    try{
       
      let js=await ItemMaster.findByIdAndUpdate(req.params.id,body) 
      res.send({
        message:'data is successfully updated',
        success:true,
      }) 
        
    }
    catch(err){
        res.send({
            message:err.message,
            success:false,
           
    
          })

    }

})*/
router.get('/allitem/:status',async(req,res)=>{
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



module.exports=router