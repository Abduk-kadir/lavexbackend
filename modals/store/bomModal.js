const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
BomSchema=mongoose.Schema({
         readyStock:{
             id:{
               type:String,
               required:[true,'id is required of item ']
             },
             name:{
              type:String,
              required:[true,'name is required']
            },
           
            qty:{
              type:Number,
              required:[true,'quantity is required']
            },
            qtyType:{
              type:String,
              required:[true,'type of quantity is required']
            },
            qtyType2:{
              type:String,
              required:[true,'type of quantity is required']
            },
            lowqty:{
              type:Number,
              required:[true,'low quantity is required']
            },
            gst:{
                type:Number,
                required:[true,'gst is important']
            },
            brand:{
              type:String,
              required:[true,'brand is required']

            },
            hsnCode:{
              type:Number,
              required:[true,'hsncode is required']
            }
            
        },
     raw:[
        {
         id:{
            type:String,
            required:[true,'id is required of item ']
          },
          name:{
           type:String,
           required:[true,'name is required']
         },
         quantity:{
           type:Number,
           required:[true,'quantitiy is required']

         },
         qty:{
           type:Number,
           required:[true,'quantity is required']
         },
         qtyType:{
           type:String,
           required:[true,'type of quantity is required']
         },
         qtyType2:{
           type:String,
           required:[true,'type of quantity is required']
         },
         lowqty:{
           type:Number,
           required:[true,'low quantity is required']
         },
         gst:{
             type:Number,
             required:[true,'gst is important']
         },
         brand:{
           type:String,
           required:[true,'brand is required']

         },
         hsnCode:{
          type:Number,
          required:[true,'hsncode is required']
        }
        }
        
    ]
    
   
})
module.exports=mongoose.model('BillOfMaterial',BomSchema)