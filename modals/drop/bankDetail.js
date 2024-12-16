const mongoose=require('mongoose');
var valid = require('validator');
bankDetail=mongoose.Schema({
    companyname:{
        type:String,
        required:[true,'companyid is required']
    },
    name:{
        type:String,
        required:[true,'payment name is required']
    },
    branch:{
        type:String,
        required:[true,'payment name is required']

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
        required:[true,'payment name is required']

    }

})
module.exports=mongoose.model('BankDetail',bankDetail)