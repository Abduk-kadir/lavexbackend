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
  },
  month:{
    type:String,
    default:"4"
  }

});

module.exports=mongoose.model('ClientPaymentCounter', CounterSchema);