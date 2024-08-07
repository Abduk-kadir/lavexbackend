const mongoose=require('mongoose');
var valid = require('validator');

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'manufacturer name is required']
    },
     
})
module.exports=mongoose.model('CategoryDropdown',categorySchema)