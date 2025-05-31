const mongoose = require("mongoose");
const saleSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cars",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    price: { type: Number, required: false },
    saleDate: { type: Date, default: Date.now },
    name: { type: String, required: false },
    cnic: { type: String, required: false },
    phoneNo: { type: String, required: false },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sales", saleSchema);
