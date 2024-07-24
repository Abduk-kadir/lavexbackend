let express=require('express')
let router=express.Router()
const Production= require('../../modals/store/production');
const Inward=require('../../modals/store/inwardModal')

router.post('/addProducton',async(req,res)=>{
   let body=req.body;
   let {readyStock,raw,remark,dateCreated,accepted,prodNum}=body; 
   let parr=[]
   try{

    //this is code for updating raw store
   
    for(let i=0;i<raw.length;i++){
        let {name,brand,qty}=raw[i]
        let f=await Inward.updateOne( {item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": -qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
   
    }

    //this is code for updating store of production
    
    for(let i=0;i<readyStock.length;i++){
    let {name,brand,qty}=readyStock[i]   
    let f=await Production.updateOne( { readyStock: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "readyStock.$[elem].qty": qty } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
     if(f.matchedCount==0){
         let elem=readyStock[i]
         parr.push(elem)
     }
    }
    if(parr.length>0){
      console.log('hit') 
    
      let product=new Production({prodNum:prodNum,remark:remark,dateCreated:dateCreated,accepted:accepted,readyStock:parr})
      await product.save()
    }
      
    res.send({
        message:"data is added success fully added",
        success:true,
    })
   
   } 
   catch(err){
    res.send(err.message)
   }  

})

router.get('/allProduction',async(req,res)=>{
    try
    {
      let result=await Production.find()
      res.send({
        message:'all prodution is successfully fetched',
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

router.get('/prod/:id',async(req,res)=>{
      console.log(req.params.id)
    try{
     let prod=await Production.find({_id:req.params.id})
     res.send({
        message:'data is successfully',
        success:true,
        data:prod
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











router.get('/review/:movmentno',async(req,res)=>{
    console.log('movement no is',req.params.movmentno)
    try{
        let result=await Production.findOne({movementNumber:req.params.movmentno},{movementNumber:1,status:1,currency:1,item:1,dateCreated:1})
        console.log(result)
        if(result==null){
          
            res.send({
                message:"please provide correct movementno",
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
router.put('/changestatus/:no',async(req,res)=>{

   try{
     console.log(req.body)
     let result=await Production.updateOne({movementNumber:req.params.no},{$set:req.body})
  
     res.send({
        message:'status is successfully update',
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




router.get('/cancelList',async(req,res)=>{
    try
    {
      let result=await Production.find({status:"Canceled"})
      res.send({
        message:'all prodution is successfully fetched',
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

router.get('/allStock',async(req,res)=>{
    try
    {
      let result=await Production.find({status:"Recieved"})
      res.send({
        message:'all Stock is fetched',
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
router.delete('/delProd/:id',async(req,res)=>{
    let {id}=req.params
    console.log(id)
    
    try{

        let rs=await Production.findByIdAndDelete(id);
       
        if(rs){
            res.send({
                message:"client deleted is successfully",
                data:rs,
                success:true
            })

        }
        else{
            res.send({
                message:"please fill correct id",
                data:null,
                success:false
            })
        }
       

    }
    catch(err){
        res.send({
            message:err.message,
            data:null,
            success:false
        })

    }

})

router.put('/updateProd/:id',async(req,res)=>{
    try{
        let result=await Production.findByIdAndUpdate(req.params.id,req.body)
       
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




module.exports=router