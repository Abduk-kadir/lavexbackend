const mongoose = require("mongoose");
const valid = require("validator");
const ProductionSchema = mongoose.Schema({
  readyStock: [
    {
      id: {
        type: String,
        required: [true, "id is required"],
      },
      name: {
        type: String,
        required: [true, "name of item is required"],
      },
      brand: {
        type: String,
        required: [true, "name of brand is required"],
      },
      qty: {
        type: Number,
        required: [true, "quantity  is required"],
      },
      qtyType: {
        type: String,
        required: [true, "quantity type is required"],
      },
      qtyType2: {
        type: String,
        required: [true, "quantity type   is required"],
      },
      quantity:{
        type: Number,
        required: [true, "quantity is required"],
      },
      gst: {
        type: Number,
        required: [true, "gst  is required"],
      },
      price: {
        type: Number,
        required: [true, "price  is required"],
      },
    },
  ],
});

const ProductionStore = mongoose.model("ProductionStore", ProductionSchema);
const ProductionStore2 = mongoose.model("ProductionStore2", ProductionSchema);
module.exports = { ProductionStore, ProductionStore2 };
