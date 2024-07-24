const mongoose=require('mongoose')
const valid=require('validator')
const productionSchema=mongoose.Schema({
     prodNum:{
        type:Number,
        required:[true,'prodnumber is required']
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
   remark:{
      type:String,
      required:[true,'remark is required']
      
      
   },
   accepted:{
      type:String,
      required:[true,'accepted is required']
     

   },
     
     readyStock:[
     
      {
         name:{
            type:String,
            required:[true,'name of item is required'],
         },
         brand:{
            type:String,
            required:[true,'name of brand is required'],
         },
         qty:{
            type:Number,
            required:[true,'quantity  is required'],
            
         },
         gst:{
            type:Number,
            required:[true,'gst  is required'],
            
         },
         price:{
            type:Number,
            required:[true,'quantity  is required'],
            
         }
    
      
     }]

})
module.exports=mongoose.model('Production',productionSchema)