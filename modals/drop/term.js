const mongoose=require('mongoose');
var valid = require('validator');
termSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'payment name is required']
    }
})
module.exports=mongoose.model('Term&Condition',termSchema)