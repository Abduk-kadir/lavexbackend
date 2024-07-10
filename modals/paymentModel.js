const mongoose=require('mongoose');
var valid = require('validator');
const { v4: uuidv4 } = require('uuid');
const paymentSchema=mongoose.Schema({
   onAccount:{
    type:Boolean,
    required:[true,'onAccount is true']
   } ,
   
    selClient:{
        type:String,
        required:[true,'select client is required']

    },
    amount:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isCurrency(v,{symbol:"Inr",require_symbol:true})
            },
            message: props => `${props.value}  please provide a valid amoumt!`
          },

          required:[true,'amount is required']

    },
    paymentMethod:{
        type:String,
        enum:['Paypal','Cash','Check/DD','Easypay','E-Pay','Other','Neft',"Check"]
    },
    bankName:{
        type:String,
        enum:['kotak-Organic','HUF','Mack','Cash','Axis','Abhyudaya-Organic']

    },
   
    paymentDate:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },
        required:[true,'due date is required']

    },
    paymentCheckNo:{
        type:String,
        required:[true,'paymentCheck no or dd is required']

    },
    outStandingAmount:{
        type:String
    },
    onAccountPendingAm:{
        type:String,
        default:null
    },
    /*
    invoiceDetail:{
        invoiceDate:{
            type:String,
            default:null
        },
        invoiceNumber:{
            type:String,
            default:null

        },
        invoiceAmount:{
            type:String,
            default:null

        },
        recievedAmount:{
            type:String,
            default:null

        },
        discountAmount:{
            default:null

        }
        
    },
    
    note:{
        type:String
    }  
   */
})
module.exports=mongoose.model('Payment',paymentSchema)
