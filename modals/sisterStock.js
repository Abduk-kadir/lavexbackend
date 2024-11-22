const mongoose=require('mongoose')
const valid=require('validator')
const sisterStockSchema=mongoose.Schema({
    companyname:{
        type:String,
        required:[true,'company name is required']
    },
    dateCreated:{
      type:String,
      default:Date()
    },
    readyStock:[
      {
         id:{
            type:String,
            required:[true,'id is required of item ']
          },
          name:{
           type:String,
           required:[true,'name is required']
         },
         quantity:{
            type:Number,
            required:[true,'quantity is required']
        },
         qtyType:{
           type:String,
           required:[true,'type of quantity is required']
         },
         gst:{
             type:Number,
             required:[true,'gst is important']
         },
         brand:{
           type:String,
           required:[true,'brand is required']

         },
        price:{
          type:Number,
          required:[true,'price is required']
        },
        qty:{
          type:Number
    
         },
         qtyType2:{
           type:String
         },
         lowqty:{
          type:Number
         }
           
     }
   ]
  
})
module.exports=mongoose.model('SisterStock',sisterStockSchema)