const mongoose=require('mongoose');
var valid = require('validator');
const invoiceSchema=mongoose.Schema({
   mov:{
      type:Number,
      required:[true,'movement number is required']
     },
   type:{
      type:String,
      default:'Invoice'
   },
   companyname:{
      type:String,
      required:['compayname is required']

   },
   status:{
      type:String,
      default:"issue"

   },
   clientDetail:{
     id:{
       type:String,
       required:[true,'id is required']

     },
    client:{
        type:String,
        required:[true,'client is required'],
       },
       grade:{
       type:String,
       default:" "
       }, 
       address:{
        type:String,
        required:['true','address is required']
       },
       area:{
         type:String,
         required:[true,'area is required']
       },
      gstNumber:{
         type:String,
         default:null
      },
      fcAmount:{
         type:Number,
         required:[true,'first credit limit is required']
     },
     
     fcDays:{
         type:Number,
         required:[true,'first credit days is required']
     },
     
     scAmount:{
         type:Number,
         required:[true,'second credit limit is required']
     },
     scDays:{
         type:Number,
         required:[true,'second credit days is required']
     },
     stateCode:{
      type:String,
      
     
     },
     Branch:{
      type:String,
     
     },
      
     shipTo:{
         type:String,
         required:[true,'shipto is required']
     },
      
   },
   invoiceDetail:{
    invoiceDate:{
        type:String,
        validate: {
         validator: function(v) {
          return valid.isDate(v,{format:'dd/mm/yyyy'})
         },
         message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
       },
       required:[true,'invoice date is required']
    },
    dueDate:{
        type:String,
        validate: {
         validator: function(v) {
          return valid.isDate(v,{format:'dd/mm/yyyy'})
         },
         message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
       },
        required:[true,'due date is required']

    },
    poNo:{
        type:String,    
       },

   },
  selectDc:{
    type:Array,
    default:[]
  },
  
  item:[{
    id:{
      type:"String",
      required:[true,'id is important of item']
    },
     name:{
        type:String,
        required:[true,'name of item is required'],
     },
     brand:{
        type:String,
        required:[true,'name of brand is required'],
     },
     quantity:{
        type:Number,
        required:[true,'quantity  is required'],
        
     },
     qtyType:{
      type:String,
      required:[true,'quantity type is required']

     },
     gst:{
        type:Number,
        required:[true,'gst  is required'],
        
     },
     qty:{
      type:Number

     },
     qtyType2:{
       type:String
     },
     price:{
        type:Number,
        required:[true,'quantity  is required'],
        
     },
     loosePack:{
      type:Boolean,
      
     }
  }],
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
   default:0
  },
  createdAt: {
   type: Date,
   default: Date.now
}
})
module.exports=mongoose.model('InVoice',invoiceSchema)