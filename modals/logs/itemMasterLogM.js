const mongoose = require('mongoose');
const LogitemmasterSchema = mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemMaster',  // Reference to ItemMaster schema
        required: true
    },
    actionType: {
        type: String,
        enum: ['UPDATE', 'DELETE','CREATE'],
        required: [true, 'Action type is required']
    },
    changedBy: {
        type: String,
        required: [true, 'Changed by is required']
    },
    changeDetails:{
        type: String,
        required: [true, 'Change details are required']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Export the model based on the schema
module.exports = mongoose.model('Logitemmaster', LogitemmasterSchema);
