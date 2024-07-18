const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');

const invardSchema=mongoose.Schema({
    paymentType:{
        type:String,
        required:[true,'type of inward is important'],
        enum:['Cash','Neft','PayPal','E-Pay','EasyPay','Other']
    },
    status:{
        type:String,
        default:""

    },
    forUnit:{
        type:String,
        enum:['Unit1'],
        require:[true,"it shoul be Unit1"]

    },
    suplierName:{
        type:String,
        required:[true,'name is required of supplier']
    } ,
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
        default:null,
       
     },
     individual:{
        type:Boolean,
        required:[true,'individual is important']
  
     },
     accountPerson:{
        type:String,
        required:['true', 'accountable person is required']
     },
     city:{
        type:String,
        required:['true', 'city is required']
     },
     address:{
        type:String,
        required:['true', 'address is required']
     },
     country:{
        type:String,
        required:['true', 'country is required']
     },
     movementNumber:{
        type:Number,
        unique:true,
        required:[true,'movement number is required'],
       
     },
     remark:{
        type:String,
        required:[true,'remark is important']
        
     },
     accepted:{
        type:String,
        required:[true,'accepted is required']

     },
    
     dateCreated:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },
        required:[true ,'date is important'] 
       
     },
     suplierInvoiceNo:{
        type:String,
        required:[true,'invoce number of suplier is important']
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
     
module.exports=mongoose.model('Inward',invardSchema)
