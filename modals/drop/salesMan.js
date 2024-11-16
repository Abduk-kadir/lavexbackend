const mongoose=require('mongoose')
let salesmanSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('SalesMan',salesmanSchema)