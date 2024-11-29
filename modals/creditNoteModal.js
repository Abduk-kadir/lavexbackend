const mongoose=require('mongoose');
var valid = require('validator');
const creditNoteS=mongoose.Schema({
   mov:{
      type:Number,
      required:[true,'movement number is required']
     },
   type:{
      type:String,
      default:'CreditNote'
   },
   companyname:{
      type:String,
      required:['compayname is required']

   },
   status:{
      type:String,
      default:"issue"

   },
   onAccount:{
      type:Boolean,
      required:[true,'onaccount is required']

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
     
     scAmount:{
         type:Number,
         required:[true,'second credit limit is required']
     },
     scDays:{
         type:Number,
         required:[true,'second credit days is required']
     },
     stateCode:{
      type:String,
     
     },
     branch:{
      type:String
     },
      
     shipTo:{
         type:String,
         required:[true,'shipto is required']
     },
      
   },
   invoiceDetail:{
    invoiceNo:{
      type:String,
    }, 
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
       price:{
         type:Number
        },

   },
 
  item:[{
    id:{
      type:String,
     

    },
     name:{
        type:String,
      
     },
     brand:{
        type:String,
       
     },
     quantity:{
        type:Number,
       
        
     },
     qtyType:{
      type:String,
      

     },
     gst:{
        type:Number,
        required:[true,'gst  is required'],
        
     },
     price:{
        type:Number,
      
        
     },
     qty:{
      type:Number

     },
     qtyType2:{
       type:String
     },
  }],
  total:{
   type:Number,
   default:0

  },
  createdAt: {
   type: Date,
   default: Date.now
}
   
})
module.exports=mongoose.model('CreditNote',creditNoteS)