const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cars", // Should match the model name used for car schema
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Should match the model name used for user schema
      required: false,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      // default: 'pending',
    },
    location: { type: String, required: false },
    pickupDateTime: { type: Date, required: false },
    dropoffDateTime: { type: Date, required: false },
    name: { type: String, required: false },
    cnic: { type: String, required: false },
    phoneNo: { type: String, required: false },
    address: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Rental = mongoose.model("Rental", rentalSchema); // Model name should be singular

module.exports = Rental;
