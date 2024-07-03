const mongoose=require('mongoose');

var valid = require('validator');
const invoiceSchema=mongoose.Schema({
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
       }
    

   },
   invoiceDetail:{
    invoiceNo:{
        type:String,
        required:[true,'invoice no is required'],
        
    },
    invoiceDate:{
        type:Date,
        required:[true,'invoice date is required']
    },
    dueDate:{
        type:Date,
        required:[true,'due date is required']

    },
    maturityDate:{
        type:Date,
        required:[true,'maturity date is required']

    },
    poNo:{
        type:String,
        unique:true,
        required:[true,'po no is required']     
        
       },
       
    cashAccounting:{
        type:Boolean,
        required:[true,'cashaccounting is required']
    }

   },
   shippedDetail:{
      toShipped:{
        type:String,
        required:[true,'to shipped detail is required']
      },
      forToShipped:{
        type:String,
        required:[true,"for to shipped is required"]
      }

   },
   
   selectCountry:{
    type:String,
    enum:['India','pakistan','nepal'],
    required:[true,'country is required']
  },
  chanlanType:{
    type:String,
    required:[true,'chanlan type is required']
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
module.exports=mongoose.model('InVoice',invoiceSchema)