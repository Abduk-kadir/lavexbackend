const mongoose=require('mongoose');
var valid = require('validator');

const hsnSchema=mongoose.Schema({
    code:{
        type:Number,
        required:[true,'manufacturer name is required']
    },
     
})
module.exports=mongoose.model('HsncodeDropDown',hsnSchema)