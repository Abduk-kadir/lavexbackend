const mongoose=require('mongoose');
var valid = require('validator');
const invoiceSchema=mongoose.Schema({
   type:{
      type:String,
      default:'Invoice'
   },
   companyname:{
      type:String,
      required:['compayname is required']

   },
   clientDetail:{
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
  selectDc:{
    type:String,
    default:null
  },
  
  item:[{
    id:{
      type:"String",
      required:[true,'id is important of item']
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
module.exports=mongoose.model('InVoice',invoiceSchema)