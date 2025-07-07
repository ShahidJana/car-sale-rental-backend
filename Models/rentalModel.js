const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
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

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
