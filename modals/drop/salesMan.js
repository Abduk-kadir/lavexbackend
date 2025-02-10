const mongoose=require('mongoose')
let salesmanSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    com:{
        type:Number,
        required:[true,'commission is required']
    }
})
module.exports=mongoose.model('SalesMan',salesmanSchema)