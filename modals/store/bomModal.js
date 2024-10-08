const mongoose=require('mongoose')
const valid=require('validator')
const { v4: uuidv4 } = require('uuid');
const ItemSchema = mongoose.Schema({
  
  id: {
    type: String,
    required: [true, 'id is required for the item'],
  
  },
  name: {
    type: String,
    required: [true, 'name is required']
  },
  qty: {
    type: Number,
    required: [true, 'quantity is required']
  },
  qtyType: {
    type: String,
    required: [true, 'type of quantity is required']
  },
  qtyType2: {
    type: String,
    required: [true, 'type of quantity is required']
  },
  lowqty: {
    type: Number,
    required: [true, 'low quantity is required']
  },
  gst: {
    type: Number,
    required: [true, 'GST is important']
  },
  brand: {
    type: String,
    required: [true, 'brand is required']
  },
  hsnCode: {
    type: Number,
    required: [true, 'HSN code is required']
  },
  category:{
    type:String,
    required:[true,'category is requied']

  },
  quantity:{
    type:Number,
    default:0
  }
}, { _id: false });  // This disables the _id field for the raw materials

BomSchema=mongoose.Schema({
  companyname:{
    type:String,
    required:[true,'companyid  is required']
 },
  readyStock:{
    type:ItemSchema,
    required:true
    },
  raw:{
    type:[ItemSchema],
    required:true
   }
})

module.exports=mongoose.model('BillOfMaterial',BomSchema)