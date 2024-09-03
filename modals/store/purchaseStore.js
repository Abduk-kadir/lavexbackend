const mongoose=require('mongoose')
const valid=require('validator')
const PurchaseSchema=mongoose.Schema({
   companyname:{
      type:String,
      required:[true,'company id is required']
   },
    item:[{
        id:{
         type:String,
         required:[true,'id is required']
        },
        name:{
           type:String,
           required:[true,'name of item is required'],
        },
        brand:{
           type:String,
           required:[true,'name of brand is required'],
        },
        quantity:{
           type:Number,
           required:[true,'quantity  is required'],
           
        },
        gst:{
           type:Number,
           required:[true,'gst  is required'],
           
        },
        price:{
           type:Number,
           required:[true,'quantity  is required'],
           
        }
   
     }]

   

})
     
module.exports=mongoose.model('PurchaseStore',PurchaseSchema)
