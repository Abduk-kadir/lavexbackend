const mongoose = require('mongoose');
const CounterSchema = mongoose.Schema({
  companyname: {
    type: String,
    required: true,
    unique: true,
  },
  mov: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true,
  },
  year:{
    type:String,
    required:true,
  }
});

module.exports=mongoose.model('PaymentCounter', CounterSchema);