const mongoose=require('mongoose')
var valid = require('validator');
const ClientPaymentSchema=mongoose.Schema({
    paymentNumber:{
        type:Number,
       required:[true,'payment number is required']
    },
    paymentDate:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },
        required:[true,'payment date is required']
    },
    
    paymentMethod:{
        type:String,
        required:[true,'payment method is required']
    },
    bankName:{
        type:String,
        required:[true,'bank name is required']
    },
    clientName:{
        type:String,
        required:[true,'suplername name is required']
    },
    payCheckorDdNo:{
        type:Number
    },
    outstandingAmount:{
        type:Number,
        required:[true,'payment number is required']
    },
    selectCurrency:{
        type:String,
        required:[true,'payment number is required']
    },
    note:{
        type:String,
        required:[true,'note is required']
    },
    
    item:[
        {
          
            dateCreated:{
                type:String,
                required:[true,'invoice date is created is required']

            },
            clientInvoiceNo:{
                type:Number,
                required:[true,'invoice number is required']

            },
            invoiceAmount:{
                type:Number,
                required:[true,'invoice amount is required']

            },
            balanceAmount:{
                type:Number,
                required:[true,'balance amount is required']

            },
            paidAmount:{
                type:Number,
                default:0

            },
            discountAmount:{
                type:Number,
                default:0

            }
        }
    ]
  
})
module.exports=mongoose.model('ClientPayment',ClientPaymentSchema)
