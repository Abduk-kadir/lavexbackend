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
       address:{
        type:String,
        required:['true','address is required']
       },
       city:{
        type:String,
        required:['true','city is required']
       },
       country:{
        type:String,
        required:[true,'country is required']
       },
       stateCode:{
        type:String,
        required:[true,'state code is required']
       },
       toShipped:{
         type:String,
         required:[true,'to shipped detail is required']
       },
       forToShipped:{
         type:String,
         required:[true,"for to shipped is required"]
       },
       shortCode:{
         type:String,
         default:null
      },
      gstRegistration:{
         type:Boolean,
         default:false
   
      },
      gstNumber:{
         type:String,
         default:null
      },
      individual:{
         type:Boolean,
         default:false
   
      },
    

   },
   invoiceDetail:{
    invoiceNo:{
        type:Number,
        unique:true,
        required:[true,'invoice no is required'],
        
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
    indicateMaturityDat:{
      type:Boolean,
      default:false
    },
    maturityDate:{
        type:String,
        default:null

    },
    poNo:{
        type:String,    
        
       },
       
    cashAccounting:{
        type:Boolean,
        default:false
    }

   },
   
   selectCurrency:{
    type:String,
    enum:['India','pakistan','Nepal'],
    required:[true,'country is required']
  },
  deliveryChalan:{
    type:String,
    default:null
  },
  
  item:[{
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
module.exports=mongoose.model('InVoice',invoiceSchema)