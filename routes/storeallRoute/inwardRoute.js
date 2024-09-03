let express=require('express')
let router=express.Router()
const Inward = require('../../modals/store/inwardModal');
const PurchaseStore = require('../../modals/store/purchaseStore');
const authMidd=require('..//../middleware/authmiddleware')
router.put('/changestatus/:id',async(req,res)=>{
    let parr=[]
    try{
      let status=req.body.status
      let prod=await   Inward.findOne({_id:req.params.id})
      let result=await Inward.updateOne({_id:req.params.id},{$set:{status:req.body.status}})
      let preStatus=prod.status
      console.log('previsous status:',preStatus)
      console.log('current status',status)
      
      if(status=='canceled'){
        if(preStatus=='pending'){
            await Inward.deleteOne({_id:req.params.id})
            console.log('in pending')
        }
        else if(preStatus=='confirmed'){
            let {item}=prod;
            console.log('i am here');
            //here updating purchase store
            for(let i=0;i<item.length;i++){
                let {id,quantity}=item[i]  
                console.log(id)
                console.log(quantity)
                const f = await PurchaseStore.updateOne(
                    {item:{$elemMatch:{id:id}}},
                    { $inc: { "item.$[elem].quantity":-quantity } },
                    { arrayFilters: [{ "elem.id": id }] }
                  );
              
               
                }
           await Inward.deleteOne({_id:req.params.id}) 
           

        }
      }
 
     

      if(status=='pending'&&preStatus=='confirmed'){
        let {item}=prod;
        console.log('i am here');
        //here updating purchase store
        for(let i=0;i<item.length;i++){
            let {id,quantity}=item[i]  
            console.log(id)
            console.log(quantity)
            const f = await PurchaseStore.updateOne(
                {item:{$elemMatch:{id:id}}},
                { $inc: { "item.$[elem].quantity":-quantity } },
                { arrayFilters: [{ "elem.id": id }] }
              );
          
           
            }
       
         //ending

       
        
          
        
        

      }

      if(status=='confirmed'&&preStatus!='confirmed'){
       let {item}=prod;
      //here updating purchase store
      for(let i=0;i<item.length;i++){
        let {id,quantity}=item[i]  
        console.log(id)
        console.log(quantity)
        console.log(quantity)
        const f = await PurchaseStore.updateOne(
            {item:{$elemMatch:{id:id}}},
            { $inc: { "item.$[elem].quantity": quantity } },
            { arrayFilters: [{ "elem.id": id }] }
          );
        console.log(f)
        if(f.matchedCount==0){
            let elem=item[i]
            parr.push(elem)
        }
        }
        if(parr.length>0){
          
            let purchaseStore=new PurchaseStore({item:parr})
            await purchaseStore.save()
           
        }
       //ending
    
      }
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











router.get('/allInward',async(req,res)=>{
 
    try{
        let result=await Inward.find()
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


router.post('/addinward3',async(req,res)=>{

    try{
        console.log('ihfdh')
        let body=req.body;
        let inward=new Inward(body);
        await inward.save();
        console.log('hi')
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

router.get('/getinward/:id',async(req,res)=>{
      
      try{
      let data=await Inward.find({status:'confirmed',sid:req.params.id})
      if(data.length>0){
        res.send({
        message:"data is successfully fetched",
        success:true,
        data:data
      })
      }
      else{
        res.send({
            message:"no invoice found for this supplier",
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




router.get('/getInwardbySup/:name',async(req,res)=>{
    try{
         let data=await Inward.aggregate([{$match:{suplierName:req.params.name}},
            {$project:{suplierInvoiceNo:1,dateCreated:1,
                calculatedAmount:{
                $reduce:{
                    input:"$item",
                    initialValue:0,
                    in:{$add:["$$value",{$multiply:["$$this.price","$$this.quantity",{$add:[1,{$divide:["$$this.gst",100]}]}]}]}
                }
              },
             
            }
           },
           {
            $project: {
                suplierInvoiceNo: 1,
                dateCreated: 1,
                invoiceAmount: "$calculatedAmount",
                balanceAmount: "$calculatedAmount"
            }
          }
        ])
        console.log(data)
        if(data.length==0){
            res.send({
                message:"No invoice found by this supler",
                success:true, 
             })

        }
        else{
        res.send({
            message:"data is successfully added",
            success:true, 
            data:data
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





module.exports=router
