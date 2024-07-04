const mongoose=require('mongoose');
var valid = require('validator');
const debitnoteS=mongoose.Schema({
    suplierDetail:{
        suplier:{
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
       debitNoteDetail:{
        debitNoteNo:{
            type:Number,
            required:[true,'invoice no is required'],
            
        },
        toInvoiceNumber:{
         type:String,
         required:true
     },
     fromDate:{
        type:Date,
        required:[true,'from Date is required']
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
            type:Number,
            required:[true,'po no is requ']     
            
           },
           
        cashAccounting:{
            type:Boolean,
            required:[true,'cashaccounting is required']
        }
    
       },
       individual:{
        type:Boolean,
        required:[true,'you should tell about individual(true or false)']
  
     },
     shortCode:{
        type:String,
        default:null,
        
     },
     gstRegistration:{
        type:Boolean,
        required:[true,'you should tell about gst registration(true or false)']
  
     },
     gstNumber:{
        type:String,
        default:null
     },
       
       selectCurrency:{
        type:String,
        enum:['IndianCurrency','pakistanCurrency','nepalCurrency'],
        required:[true,'type of currency is required']
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
module.exports=mongoose.model('DebitNote',debitnoteS)