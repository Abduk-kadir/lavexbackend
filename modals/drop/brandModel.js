const mongoose=require('mongoose');
var valid = require('validator');

const BrandSchema=mongoose.Schema({
    brand:{
        type:String,
        required:[true,'brand name is required']
    },
     
})
module.exports=mongoose.model('BrandDropdown',BrandSchema)