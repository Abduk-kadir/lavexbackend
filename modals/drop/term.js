const mongoose=require('mongoose');
var valid = require('validator');
termSchema=mongoose.Schema({
    companyname:{
        type:String,
        required:[true,'company id is required']
    },
    name:{
        type:String,
        required:[true,'payment name is required']
    }
})
module.exports=mongoose.model('Term&Condition',termSchema)