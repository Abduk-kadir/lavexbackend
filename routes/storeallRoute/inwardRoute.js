let express=require('express')
let router=express.Router()
const Inward = require('../../modals/store/inwardModal');
const e = require('express');
router.post('/addInward',async(req,res)=>{
    try{
        
        let inward;
        let body=req.body;
        let data=await Inward.find()
        let val=data.reduce((acc,curr)=>curr.movementNumber>acc?curr.movementNumber:acc,0)
        val=val+1
        
        let sup=await Inward.findOne({suplierName:body.suplierName})
        
       
        if(sup){
         body.item.map(elem=>{
              let val3=sup.item.find(elem2=>elem2.name==elem.name&&elem2.brand==elem.brand)
              if(val3){
              elem.quantity+=val3.quantity
             
              }

            })
          let result2= await Inward.updateOne({suplierName:body.suplierName},{$set:{item:body.item}})
          console.log(result2)

        }
        else{
            inward=new Inward({...body,movementNumber:val});
            await inward.save();
            
        }
        


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


router.get('/allInward',async(req,res)=>{
   
    
    try{
        let result=req.query.paymentType?await Inward.find({paymentType:req.query.paymentType}):await Inward.find()
        res.send({
            message:"data is successfully fetched",
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
router.put('/changeStatus/:no',async(req,res)=>{
    try{
        console.log(req.body)
        let result=await Inward.updateOne({movementNumber:req.params.no},{$set:req.body})
        
     
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

router.delete('/delInward/:id',async(req,res)=>{
    let {id}=req.params
    console.log(id)
    
    try{

        let rs=await Inward.findByIdAndDelete(id);
       
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

router.put('/updateInward/:id',async(req,res)=>{
    try{
        let result=await Inward.findByIdAndUpdate(req.params.id,req.body)
       
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
*/
module.exports=router
