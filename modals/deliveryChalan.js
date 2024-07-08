const mongoose=require('mongoose')
const valid=require('validator')

const deliverySchema=mongoose.Schema({
    clientDetail:{
       t:{
         type:String,
         default:'DeliveryChalan'
        },
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
       deliveryDetail:{
        deliveryChNo:{
            type:String,
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
        maturityDate:{
            type:String,
            validate: {
                validator: function(v) {
                 return valid.isDate(v,{format:'dd/mm/yyyy'})
                },
                message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
              },
            required:[true,'maturity date is required']
    
        },
        poNo:{
            type:String,
            unique:true,
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
        default:null
     },
     gstRegistration:{
        type:Boolean,
        required:[true,'you should tell about gst registration(true or false)']
  
     },
     gstNumber:{
        type:String,
        default:null
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
     selectCurrency:{
        type:String,
        enum:['India','pakistan','nepal'],
        required:[true,'country is required']
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
           
        }}]
   

})
module.exports=mongoose.model('DeliveryChalan',deliverySchema)