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
    hsnCode:{
        type:Number,
        required:[true,'hsn code is required']
        
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
        enum:['Box','Roll,Pcs','Pkt'],
        required:[true,'type of quantity is required']

    },
    qtyType2:{
        type:String,
        required:[true,'type2 of quantity is required']
    },
    gst:{
        type:Number,
        required:[true,'gst is required']

    },
    lawqty:{
        type:Number,
        required:[true,'law qty is important']

    },
    category:{
        type:String,
        required:[true]
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