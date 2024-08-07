const mongoose=require('mongoose');
var valid = require('validator');

const quantitySchema=mongoose.Schema({
    type:{
        type:String,
        required:[true,'manufacturer name is required']
    },
     
})
module.exports=mongoose.model('QuantityTypeDropdown',quantitySchema)