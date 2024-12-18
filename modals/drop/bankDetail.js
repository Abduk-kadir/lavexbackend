const mongoose=require('mongoose');
var valid = require('validator');
const bankName = require('./bankName');
bankDetail=mongoose.Schema({
    companyname:{
        type:String,
        required:[true,'companyid is required']
    },
    accountHolder:{
        type:String,
        required:[true,'payment name is required']
    },
    bankName:{
        type:String,
        required:[true,'payment name is required']
    },
    branch:{
        type:String,
       

    },
    accountNo:{
        type:String,
        required:[true,'payment name is required']

    },
    ifscCode:{
        type:String,
        required:[true,'payment name is required']

    },
    qrImage:{
        type:String,
       

    },
    term:{
        type:[String],
        required:[true,'term and condition is manadatory']
    }

})
module.exports=mongoose.model('BankDetail',bankDetail)