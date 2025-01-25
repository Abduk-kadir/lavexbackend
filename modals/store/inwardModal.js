const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
const invardSchema=mongoose.Schema({
   mov:{
    type:Number,
    required:[true,'movement number is required']
   },
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
    gstNumber:{
        type:String,
        default:[true,'gst number is required'],
       
     },
     address:{
        type:String,
        required:['true', 'address is required']
     },
     contactPersonName:{
      type:String,

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
     inwardCreated: {
      type: String,
      default: () => {
        const date = new Date();
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
    },
     
     suplierInvoiceNo:{
        type:String,
        required:[true,'invoce number of suplier is important']
     },
     paymentType:{
      type:String,
      required:[true,'payment  type is required']
     },
     total:{
      type:Number,
      default:0

     },
     pendingAmount:{
       type:Number,
       default:0
      
     },
     discountAmount:{
      type:Number,
      required:[true,'discount amount is required'],
      default:0
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
     status:{
      type:String,
      default:"pending"
     },
     total:{
      type:Number,
     },
     baseAmount:{
      type:Number,
     },
     pendingamount:{
      type:Number
     }
     

})
     
module.exports=mongoose.model('Inward',invardSchema)
