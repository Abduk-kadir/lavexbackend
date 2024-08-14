const mongoose=require('mongoose')
const valid=require('validator')
const productionSchema=mongoose.Schema({
    status:{
      type:String,
      default:"pending"
    },
   
    dateCreated:{
      type:String,
      validate: {
          validator: function(v) {
           return valid.isDate(v,{format:'dd/mm/yyyy'})
          },
          message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
        },
       required:[true,'date is required']
    
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
      ,quantity:{
        type:Number,
        required:[true,'quantity is required']
      },
      
    
   }   
 ],
     
    readyStock:[
     
      {
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
         ,quantity:{
          type:Number,
          required:[true,'quantity is required']
        },
        price:{
          type:Number,
          required:[true,'price is required']
        }
           
     }
   ]
  
})
module.exports=mongoose.model('Production',productionSchema)