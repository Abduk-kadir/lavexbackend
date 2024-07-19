const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
BomSchema=mongoose.Schema({

         readyStock:{
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
            price:{
              type:Number,
              required:[true]
            },
            gst:{
                type:Number,
                required:[true,'gst is important']
            },
            brand:{
              type:String,
              required:[true,'brand is required']

            }
        },
    raw:[
        {
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
          price:{
            type:Number,
            required:[true]
          },
          
          gst:{
            type:Number,
            required:[true,'gst is required']

          },
          brand:{
            type:String,
            required:[true,'brand is required']

          }
        }
    ]
        
        

    
    
    
   
})
module.exports=mongoose.model('BillOfMaterial',BomSchema)