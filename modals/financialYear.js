const mongoose=require('mongoose')
const FinancialYear = mongoose.Schema({
    year: {
        type: String,
        required: true,
        unique: true, // Ensure one record per year
    },
    paymentNumberCounter: {
        type: Number,
        default: 1, // Start counter from 1 every year
    }
});
module.exports=mongoose.model('FinancialYear',FinancialYear)
