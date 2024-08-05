const mongoose=require('mongoose');
var valid = require('validator');
const creditNoteS=mongoose.Schema({
   type:{
      type:String,
      default:'CreditNote'
   },
   companyname:{
      type:String,
      required:['compayname is required']

   },
   creditNoteNo:{
      type:Number,
      unique:true,
      required:[true,'invoice no is required'], 
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
       
      
      
    
      
       selectCurrency:{
        type:String,
        enum:['India','Pakistan'],
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
    
      }],
      
      InvoiceDetail:{
         toInvoiceNumber:{
          type:String,
         
          required:[true,"invoice number is required"]
            },
        fromDate:{
         type:String,
         validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },
         required:[true,'from Date is required']
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
         maturityDate:{
             type:String,
             required:[true,'maturity date is required']
     
         },
         poNo:{
             type:String,
                 
             
            },
            
         cashAccounting:{
             type:Boolean,
             required:[true,'cashaccounting is required']
         }
     
        }
   
   



})
module.exports=mongoose.model('CreditNote',creditNoteS)