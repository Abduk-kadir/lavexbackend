const mongoose=require('mongoose')
const valid=require('validator')
const deliverySchema=mongoose.Schema({
   mov:{
      type:Number,
      required:[true,'movement number is required']
     },
   type:{
      type:String,
      default:'DeliveryChalan'
   },
   companyname:{
      type:String,
      required:['compayname is required']

   },
   status:{
      type:String,
      default:"issue"

   },
   clientDetail:{
      id:{
          type:String,
          required:[true,'id is required']
      },
    client:{
        type:String,
        required:[true,'client is required'],
       },
       grade:{
       type:String,
       default:" "
       }, 
       address:{
        type:String,
        required:['true','address is required']
       },
      gstNumber:{
         type:String,
         default:null
      },
      fcAmount:{
         type:Number,
         required:[true,'first credit limit is required']
     },
     
     fcDays:{
         type:Number,
         required:[true,'first credit days is required']
     },
     stateCode:{
      type:String,
     
     },
     
     scAmount:{
         type:Number,
         required:[true,'second credit limit is required']
     },
     scDays:{
         type:Number,
         required:[true,'second credit days is required']
     },
      
     shipTo:{
         type:String,
         required:[true,'shipto is required']
     },
      
   },
   invoiceDetail:{
    invoiceDate:{
        type:String,
        validate: {
         validator: function(v) {
          return valid.isDate(v,{format:'dd/mm/yyyy'})
         },
         message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
       },
       required:[true,'invoice date is required']
    },
    dueDate:{
        type:String,
        validate: {
         validator: function(v) {
          return valid.isDate(v,{format:'dd/mm/yyyy'})
         },
         message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
       },
        required:[true,'due date is required']

    },
    poNo:{
        type:String,    
       },

   },
  
  item:[{
    id:{
      type:String,
      required:[true,'id is important']

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
     qtyType:{
      type:String,
      required:[true,'quantity type is required']

     },
     gst:{
        type:Number,
        required:[true,'gst  is required'],
        
     },
     price:{
        type:Number,
        required:[true,'quantity  is required'],
        
     }
  }],
  createdAt: {
   type: Date,
   default: Date.now
}

})
module.exports=mongoose.model('DeliveryChalan',deliverySchema)