const mongoose=require('mongoose');
var valid = require('validator');

paymentTypeSchema=mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'payment name is required']
    }
})

module.exports=mongoose.model('PaymentMethod',paymentTypeSchema)