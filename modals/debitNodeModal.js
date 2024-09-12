const mongoose=require('mongoose');
var valid = require('validator');
const debitnoteS=mongoose.Schema({
   type:{
      type:String,
      default:'DebitNote'
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
      
       address:{
        type:String,
        required:['true','address is required']
       },
      gstNumber:{
         type:String,
        
      },
      panNumber:{
        type:String
      },
      mobile:{
         type:String,
      }
      
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
  onAccount:{
       type:Boolean,
       required:[true,'onAccount is true']
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
  }]
})
module.exports=mongoose.model('DebitNote',debitnoteS)