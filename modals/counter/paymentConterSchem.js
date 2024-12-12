const mongoose = require('mongoose');
const CounterSchema = mongoose.Schema({
  companyname: {
    type: String,
    required: true,
    unique: true,
  },
  paymentNumber: {
    type: Number,
    default: 0,
  },
  year:{
    type:String,
  }

});

module.exports=mongoose.model('PaymentCounter', CounterSchema);