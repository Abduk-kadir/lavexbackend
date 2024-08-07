const mongoose=require('mongoose');
var valid = require('validator');
const stockStatusSchema=mongoose.Schema({
    status:{
        type:String,
        required:[true,'status is required']
    }
     
})
module.exports=mongoose.model('StockStatusDropdown',stockStatusSchema)