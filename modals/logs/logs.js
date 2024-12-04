const mongoose = require('mongoose');
const LogitemmasterSchema = mongoose.Schema({
    companyname:{
        type:String,
        required:true
    },
    itemId: {
        type:Number,
     
    },
    actionType: {
        type: String,
        enum: ['UPDATE', 'DELETE','CREATE','CONFIRM','CANCEL','PENDING'],
        
    },
    changedBy: {
        type: String,
      
    },
    changeDetails:{
        type: String,
      
    },
    model:{
        type:String,
     
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Export the model based on the schema
module.exports = mongoose.model('Logs', LogitemmasterSchema);
