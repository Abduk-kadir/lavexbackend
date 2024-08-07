const mongoose=require('mongoose');
var valid = require('validator');
const lowqtySchema=mongoose.Schema({
    lowqty:{
        type:Number,
        required:[true,'manufacturer name is required']
    }
     
})
module.exports=mongoose.model('LowDropdown',lowqtySchema)