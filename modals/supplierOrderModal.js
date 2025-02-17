const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
const OrderSchema=mongoose.Schema({
   companyname:{
      type:String,
      required:[true,'company name is required']
   },
   sid:{
      type:String,
      required:[true,'suplier id is required']
   },
    name:{
        type:String,
        required:[true,'name is required of supplier']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
     address:{
        type:String,
        required:['true', 'address is required']
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
    
    
     
     item:[{
        "id":{
         type:String,
         required:['id of item is required']

        },
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
        qtyType:{
         type:String,
         required:[true,'type of quantity is required']
        },
        qtyType2:{
         type:String,
         required:[true,'type of quantity is required']
        },
        gst:{
           type:Number,
           required:[true,'gst  is required'],
           
        },
        price:{
           type:Number,
           required:[true,'quantity  is required'],
           
        },
        quantity:{
         type:Number,
         required:[true,'quantity is required']
        },
        lowqty:{
         type:Number,
         required:[true,'low quantity is require']
       },
   
     }],
    
})
     
module.exports=mongoose.model('SupplierOrder',OrderSchema)
