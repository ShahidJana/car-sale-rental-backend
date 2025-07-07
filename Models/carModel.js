const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: false },
    model: { type: String, required: false },
    year: { type: Number, required: false },
    price: { type: Number, required: false },
    engine: { type: Number, required: false },
    fuelTankCapacity: { type: Number, required: false },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
      required: false,
    },

    condition: {
      type: String,
      enum: ["used", "new"],
      required: true,
    },
    bodyType: {
      type: String,
      enum: [
        "sedan",
        "hatchback",
        "suv",
        "crossover",
        "coupe",
        "convertible",
        "wagon",
        "pickup",
        "van",
        "roadster",
      ],
      required: false,
    },
    listingType: {
      type: String,
      enum: ["sale", "rent", "offer", "ads"],
      required: true,
    },
    // location: { type: String, required: false },
    features: { type: [String], default: [] },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    mileage: { type: Number, required: false },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid", "cng"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual", "cvt"],
      required: true,
    },
    color: { type: String, required: false },
    description: { type: String, required: false },
    seatingCapacity: { type: Number, required: false },
    doors: { type: Number, required: false },
  },
  { timestamps: true }
);

const Car = mongoose.model("Cars", carSchema);

module.exports = Car;
