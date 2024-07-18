const mongoose=require('mongoose');
var valid = require('validator');
const debitnoteS=mongoose.Schema({
   tpye:{
      type:String,
      default:'DebitNote'
     },
      companyname:{
      type:String,
      required:[true,'company name is required']
      
     },
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
       debitNoteDetail:{
        debitNoteNo:{
            type:String,
            unique:true,
            required:[true,'invoice no is required'],
            
        },
        toInvoiceNumber:{
         type:String,
         required:true
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
            type:Number,
            required:[true,'po no is requ']     
            
           },
           
        cashAccounting:{
            type:Boolean,
            required:[true,'cashaccounting is required']
        }
    
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
    
      }]
      
     
   
  



})
module.exports=mongoose.model('DebitNote',debitnoteS)