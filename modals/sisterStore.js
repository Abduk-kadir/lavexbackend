const mongoose=require('mongoose')
const valid=require('validator')
const sisterStoreSchema=mongoose.Schema({
    status:{
      type:String,
      default:"pending"
    },
    companyname:{
        type:String,
        required:[true,'company name is required']
    },
    sid:{
      type:String,
      required:[true,'supplier id is required']
    },
    suplierInvoiceNo:{
      type:String,
    
   },
   paymentType:{
    type:String,
    
   },
   total:{
    type:Number,
    default:0

   },
   pendingAmount:{
     type:Number,
     default:0
    
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
        }
           
     }
   ]
  
})
module.exports=mongoose.model('SisterStorePending',sisterStoreSchema)