const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
ItemMasterSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']

    },
    itemCode:{
        type:String,
        required:['item code is required']

    },
    qty:{
        type:Number,
        required:[true,'quantity is required']

    },
    price:{
        type:Number,
        required:['price is required']
    },
    qtyType:{
        type:String,
        required:[true,'type of quantity is required']

    },
    gst:{
        type:Number,
        required:[true,'gst is required']

    },
    store:{
        type:String,
        required:[true,'store is required']

    },
    brand:{
        type:String,
        required:[true,'brand is required']

    },
    manufacturar:{
        type:String,
        default:null
        
    },
   
    stockStatus:{
        type:String,
        enum:['Part','ReadyStock','Fixasset','Raw']
    }
})
module.exports=mongoose.model('ItemMaster',ItemMasterSchema)