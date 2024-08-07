const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
ItemMasterSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']

    },
   qtyType:{
    type:String,
    required:[true,'type of quantity is required']
   },
   qty:{
    type:Number,
    required:[true,'quantity is required']


   },
   qtyType2:{
        type:String,
        required:[true,'hsn code is required']
        
    },
    brand:{
        type:String,
        required:[true,'brand is required']

    },
    lowqty:{
        type:Number,
        required:[true,'law qty is important']

    },
    price:{
        type:Number,
        required:['price is required']
    },
    
    gst:{
        type:Number,
        required:[true,'gst is required']

    },
    hsnCode:{
        type:Number,
       required:[true,'hsn code is required']

    },
   
    category:{
        type:String,
        required:[true]
    },
    status:{
        type:String,
        required:[true,'status is required']
    },
    stockStatus:{
        type:String,
        required:[true,'stockStatus is required']
    },
    usedInBom:{
        type:String,
        required:[true,'used in bom']
    }
})
module.exports=mongoose.model('ItemMaster',ItemMasterSchema)