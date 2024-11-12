const mongoose=require('mongoose')
var valid = require('validator');
const ClientPaymentSchema=mongoose.Schema({
   companyname:{
        type:String,
        required:[true,'companyid is required']
   },
   cid:{
       type:String,
       required:[true,'companyid is required']
   },
   cname:{
     type:String
   },
   paymentNumber:{
       type:Number,
      required:[true,'payment number is required']
   },
   paymentDate:{
       type:String,
     /*  validate: {
           validator: function(v) {
            return valid.isDate(v,{format:'dd/mm/yyyy'})
           },
           message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
         },*/
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
  
   payCheckorDdNo:{
       type:Number
   },
   payingAmount:{
       type:Number,
       required:[true,'paying amount is important']
   },
   outStandingAmount:{
       type:Number,
       required:[true,'payment number is required']
   },
   note:{
       type:String,
       
   },
   invoiceList:[
    {
       invoiceDate:{
           type:String,
           required:[true,'invoice date is required']
       },
       invoiceId:{
           type:String,
           required:[true,'inward number is required']
       },
       invoiceMov:{
        type:Number,
       
       },
       total:{
           type:Number,
           required:[true,'amount is required']

       },
       paid:{
           type:Number,
           required:[true,'paid amount is required']

       },
       discount:{
           type:Number,
           default:0
       },
       pendingAmount:{
           type:Number,
           required:[true,'paid amount is required']
       }

    }

   ]
      
  
})
module.exports=mongoose.model('CashClientPayment',ClientPaymentSchema)
