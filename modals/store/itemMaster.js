const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');



ItemMasterSchema=mongoose.Schema({
    mov:{
        type:Number,
        default: uuidv4,
    },
    companyname:{
       type:String,
       //required:[true,'companyid  is required']
    },
    name:{
        type:String,
       
       // required:[true,'name is required']

    },
   qtyType:{
    type:String,
    //required:[true,'type of quantity is required']
   },
   qty:{
    type:Number,
    //required:[true,'quantity is required']


   },
   qtyType2:{
        type:String,
        //required:[true,'hsn code is required']
        
    },
    brand:{
        type:String,
        //required:[true,'brand is required']

    },
    lowqty:{
        type:Number,
        //required:[true,'law qty is important']

    },
    price:{
        type:Number,
        //required:['price is required']
    },
    
    gst:{
        type:Number,
        //required:[true,'gst is required']

    },
    hsnCode:{
        type:Number,
       //required:[true,'hsn code is required']

    },
   
    category:{
        type:String,
        //required:[true]
    },

    stockStatus:{
        type:String,
        default:" "
    },
    image:{
        type:String,
        
    }
})



module.exports=mongoose.model('ItemMaster',ItemMasterSchema)