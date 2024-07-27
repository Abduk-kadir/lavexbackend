const mongoose=require('mongoose');
var valid = require('validator');

paymentTypeSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'payment name is required']
    }
})

module.exports=mongoose.model('PaymentName',paymentTypeSchema)