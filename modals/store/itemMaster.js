const mongoose=require('mongoose')
const valid=require('validator')
const Counter=require('../counter/itemConterSchem')
ItemMasterSchema=mongoose.Schema({
    mov:{
        type:Number,
        //required:['mov number is required']
    },
    companyname:{
       type:String,
       //required:[true,'companyid  is required']
    },
    name:{
        type:String,
       
       // required:[true,'name is required']

    },
   qtyType:{
    type:String,
    //required:[true,'type of quantity is required']
   },
   qty:{
    type:Number,
    //required:[true,'quantity is required']


   },
   qtyType2:{
        type:String,
        //required:[true,'hsn code is required']
        
    },
    brand:{
        type:String,
        //required:[true,'brand is required']

    },
    lowqty:{
        type:Number,
        //required:[true,'law qty is important']

    },
    price:{
        type:Number,
        //required:['price is required']
    },
    
    gst:{
        type:Number,
        //required:[true,'gst is required']

    },
    hsnCode:{
        type:Number,
       //required:[true,'hsn code is required']

    },
   
    category:{
        type:String,
        //required:[true]
    },

    stockStatus:{
        type:String,
        default:" "
    },
    image:{
        type:String,
        
    }
})
ItemMasterSchema.pre('save', async function (next) {
    const item = this;
    console.log('first')
    console.log('item in middleware:',item)
    
    // If `mov` is not set, we need to fetch the counter for the company
    if (!item.mov) {
      const counter = await Counter.findOne({ companyname: item.companyname });
  
      if (counter) {
        // Increment the counter for the company
        item.mov = counter.mov + 1;
        // Update the counter document with the new `mov` value
        counter.mov += 1;
        await counter.save();
      } else {
        // If no counter exists for the company, create a new counter
        const newCounter = new Counter({
          companyname: item.companyname,
          mov: 1,
        });
        await newCounter.save();
        item.mov = 1;
      }
    }
  
    next();
  });


module.exports=mongoose.model('ItemMaster',ItemMasterSchema)