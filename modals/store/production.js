const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');

const productionSchema=mongoose.Schema({
   /* forUnit:{
        type:String,
        default:"Unit1"

     },
     status:{
      type:String,
      default:""

     },
  
     city:{
        type:String,
        required:['true', 'city is required']
     },
     address:{
        type:String,
        required:['true', 'address is required']
     },
     country:{
        type:String,
        required:['true', 'country is required']
     },
     currency:{
      type:String,
      required:[true,'currency is required'],
      enum:["INR","$"]
     },
    movementNumber:{
        type:Number,
        unique:true,
        required:[true,'movement number is required'],
     },
     dateCreated:{
        type:String,
        validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },
        required:[true ,'date is important'] 
       
     },
     remark:{
        type:String,
        required:[true,'remark is important']
        
     },
     accepted:{
        type:String,
        required:[true,'accepted is required']

     },
    */
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