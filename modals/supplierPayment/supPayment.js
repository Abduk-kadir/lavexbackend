const mongoose=require('mongoose')
var valid = require('validator');
const FinancialYearModel=require('../financialYear')
const getNewPaymentNumber = async () => {
    // Get the current year and check if it's the start of the new financial year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    const newFinancialYearStart = 4; // Assuming financial year starts in April
    console.log('current year:',currentYear)
    console.log('current month:',currentMonth)

    let year = currentYear;
    if (currentMonth < newFinancialYearStart) {
        year = currentYear - 1; // If before April, use the previous year's financial year
    }

    // Find or create the financial year document
    let financialYear = await FinancialYearModel.findOne({ year });
    if (!financialYear) {
        // If no document exists for the financial year, create a new one and reset counter
        financialYear = new FinancialYearModel({ year, paymentNumberCounter: 1 });
        await financialYear.save();
    }

    // Increment and return the next payment number
    const paymentNumber = financialYear.paymentNumberCounter;
    financialYear.paymentNumberCounter += 1; // Increment the counter for the next payment
    await financialYear.save(); // Save the updated counter

    return paymentNumber;
};



const SuplierPaymentSchema=mongoose.Schema({
    companyname:{
         type:String,
         required:[true,'companyid is required']
    },
    sid:{
        type:String,
        required:[true,'companyid is required']
    },
    sname:{
        type:String
    },
    paymentNumber: {
        type: Number,
        required: [true, 'payment number is required'],
        default: async function() {
            // Use the custom function to get the new payment number
            return await getNewPaymentNumber();
        },
    },
    paymentDate:{
        type:String,
      /*  validate: {
            validator: function(v) {
             return valid.isDate(v,{format:'dd/mm/yyyy'})
            },
            message: props => `date should be dd/mm/yyyy or dd-mm-yyyy`
          },*/
        required:[true,'payment date is required']
        
    },
    
    paymentMethod:{
        type:String,
        required:[true,'payment method is required']
    },
    bankName:{
        type:String,
        required:[true,'bank name is required']
    },
   
    payCheckorDdNo:{
        type:String
    },
    payingAmount:{
        type:Number,
        required:[true,'paying amount is important']
    },
    outStandingAmount:{
        type:Number,
        required:[true,'payment number is required']
    },
    note:{
        type:String,
        
    },
    inwardList:[
     {
        inwardMov:{
            type:Number,
        },
        invoiceDate:{
            type:String,
            required:[true,'invoice date is required']
        },
        inwardId:{
            type:String,
            required:[true,'inward number is required']
        },
        total:{
            type:Number,
            required:[true,'amount is required']

        },
        paid:{
            type:Number,
            required:[true,'paid amount is required']

        },
        discount:{
            type:Number,
            default:0
        },
        pendingAmount:{
            type:Number,
            required:[true,'paid amount is required']
        }

     }

    ]
       
    
    
  
})
module.exports=mongoose.model('SupplierPayment',SuplierPaymentSchema)
