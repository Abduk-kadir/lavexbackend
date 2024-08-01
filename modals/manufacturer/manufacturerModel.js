const mongoose=require('mongoose');
var valid = require('validator');

const ManufacturerSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'manufacturer name is required']
    },
     
})
module.exports=mongoose.model('Manufacturer',ManufacturerSchema)