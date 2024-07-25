const mongoose=require('mongoose')
const valid=require('validator')
const ProductionSchema=mongoose.Schema({

    readyStock:[{
        name:{
           type:String,
           required:[true,'name of item is required'],
        },
        brand:{
           type:String,
           required:[true,'name of brand is required'],
        },
        qty:{
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
     
module.exports=mongoose.model('ProductionStore',ProductionSchema)
