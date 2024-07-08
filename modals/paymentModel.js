const mongoose=require('mongoose');
var valid = require('validator');
const cashSchema=mongoose.Schema({
    paymentNumber:{
        type:Number,
        required:[true,'payment number is requird']
    },
    paymentAmount:{
        type:Number,
        required:[true,'payment amount is required']

    },
    bankName:{
        type:String,
        enum:['kotak-Organic','HUF','Mack','Cash','Axis','Abhyudaya-Organic']



    }

})