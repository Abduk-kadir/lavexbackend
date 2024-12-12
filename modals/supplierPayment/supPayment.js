const mongoose=require('mongoose')
var valid = require('validator');
const Counter=require('../counter/paymentConterSchem');
const paymentConterSchem = require('../counter/paymentConterSchem');
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
/*
SuplierPaymentSchema.pre('save', async function (next) {
    const item = this;
    let paymentDate=item.paymentDate
    const parts = paymentDate.split(/[-/]/);
    let month=parts[1]
    let year=parts[2]
    let f= await paymentConterSchem.find({companyname:item.companyname}) 
    console.log('find:',f)
    if(f){
        item.mov+=f.mov
        f.mov+=1
        if(f.year!==year){
            if(month==4){
                f.year=year
                await paymentConterSchem.deleteMany({})
            }
        }
        else{
            if(month==4)
        }
        
        await f.save()
      
    }
    else{
       
        let paycounter=new paymentConterSchem({
            mov:1,
            companyname:item.companyname,
            year:year
        })
       await paycounter.save()
       item.mov=1

    }
  
    next();
  });

*/



module.exports=mongoose.model('SupplierPayment',SuplierPaymentSchema)
