let express=require('express')
let router=express.Router()
const Inward = require('../../modals/store/inwardModal');
const PurchaseStore=require('../../modals/store/purchaseStore')


router.post('/addinward2',async(req,res)=>{
        try{
        let parr=[]    
        let inward;
        let body=req.body;
        let {item}=body
        let data=await Inward.find()
        let val=data.reduce((acc,curr)=>curr.movementNumber>acc?curr.movementNumber:acc,0)
        val=val+1
        inward=new Inward({...body,movementNumber:val});
        await inward.save();


       //this code for updating and pushing value in purchaseStore
       for(let i=0;i<item.length;i++){
        let {name,brand,quantity,price,gst}=item[i]  
        console.log(quantity) 
        let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
         if(f.matchedCount==0){
             let elem=item[i]
             parr.push(elem)
         }
        }
        if(parr.length>0){
          console.log('hit') 
          console.log(parr)
          let product=new PurchaseStore({item:parr})
          await product.save()
        }
      //ending here

       

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

router.delete('/delInward/:id',async(req,res)=>{
    let {id}=req.params
    try{

        let rs=await Inward.findByIdAndDelete(id);
        let item=rs.item

        for(let i=0;i<item.length;i++){
            let {name,brand,quantity,price,gst}=item[i]  
            let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": -quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
            }
       
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
        let bodyarr=req.body.item;
        let value=await Inward.findOne({_id:req.params.id})
        let prevarr=value.item
        let result=await Inward.findByIdAndUpdate(req.params.id,req.body)
        for(let i=0;i<prevarr.length;i++){
            let {name,brand,quantity,price,gst}=prevarr[i]  
            let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": -quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
            }

            for(let i=0;i<bodyarr.length;i++){
                let {name,brand,quantity,price,gst}=bodyarr[i]  
                let f=await PurchaseStore.updateOne( { item: { $elemMatch: { name: name, brand:brand } } }, { $inc: { "item.$[elem].quantity": quantity } }, { arrayFilters: [ { "elem.name": name, "elem.brand": brand }]})
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

module.exports=router
