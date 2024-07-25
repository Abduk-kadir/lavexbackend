const mongoose=require('mongoose')
const valid=require('validator')
const PurchaseSchema=mongoose.Schema({

    item:[{
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
