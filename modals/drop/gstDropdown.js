const mongoose=require('mongoose');
var valid = require('validator');

const gstSchema=mongoose.Schema({
    gst:{
        type:Number,
        required:[true,'manufacturer name is required']
    }
     
})
module.exports=mongoose.model('GstDropdown',gstSchema)