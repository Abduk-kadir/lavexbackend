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
});

module.exports=mongoose.model('ItemCounter', CounterSchema);

