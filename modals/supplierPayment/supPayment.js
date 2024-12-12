const mongoose=require('mongoose')
var valid = require('validator');
const Counter=require('../counter/paymentConterSchem');

const { compareSync } = require('bcryptjs');

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

SuplierPaymentSchema.pre('save', async function (next) {
    let item = this;
    let paymentDate=item.paymentDate
    const parts = paymentDate.split(/[-/]/);
    let month=parts[1]
    let year=parts[2]
    let date1 = new Date('2020-04-01'); // Start date (e.g., 1st April 2020)
    let date2 = new Date('2024-12-12')
  
        const counter = await Counter.findOne({ companyname: item.companyname });
    
        if (counter) {
          
          item.paymentNumber = counter.paymentNumber + 1;
          counter.paymentNumber += 1;
          console.log(counter.year)
          console.log(year)
          console.log(counter.year>year)
          if(year>counter.year){
            if(Number(month)==1||Number(month)==2||Number(month)==3)
            {

            }
            else{
                item.paymentNumber=1
                counter.paymentNumber=1
                counter.year=year
            }
           
          }
          await counter.save();
        } else {
          // If no counter exists for the company, create a new counter
          console.log('hi')
          const newCounter = new Counter({
            companyname: item.companyname,
            paymentNumber: 1,
            year:year
          });
          await newCounter.save();
          item.paymentNumber = 1;
        }
    
    
      next();
  });





module.exports=mongoose.model('SupplierPayment',SuplierPaymentSchema)
