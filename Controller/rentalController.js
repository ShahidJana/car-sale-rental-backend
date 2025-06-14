const Rental = require("../Models/rentalModel");
const User = require("../Models/User");
const sendEmail = require("../utils/sendMail");

exports.createRental = async (req, res) => {
  try {
    let user = null;
    let showCongrats = false;
    let message = "Car Booked Successfully";

    const { userId, pickupDateTime, dropoffDateTime } = req.body;

    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Loyalty system
      user.loyaltyCounter = (user.loyaltyCounter || 0) + 1;
      if (user.loyaltyCounter >= 5) {
        message = "Congratulations! 🎉 You've booked 5 rentals with us!";
        showCongrats = true;
        user.loyaltyCounter = 0;
      }

      await user.save();
    }

    const rental = new Rental(req.body);
    const savedRental = await rental.save();

    const { name, phoneNo, address, location } = savedRental;

    // Only format pickup/dropoff if both are valid
    const pickupDate = pickupDateTime
      ? new Date(pickupDateTime).toLocaleDateString()
      : "";
    const pickupTime = pickupDateTime
      ? new Date(pickupDateTime).toLocaleTimeString()
      : "";
    const dropoffDate = dropoffDateTime
      ? new Date(dropoffDateTime).toLocaleDateString()
      : "";
    const dropoffTime = dropoffDateTime
      ? new Date(dropoffDateTime).toLocaleTimeString()
      : "";

    const emailBody = (
      name,
      email,
      phoneNo,
      address,
      showCongrats,
      location,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime
    ) => {
      return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 28px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h3 style="color: #222; text-align: center; font-size: 18px; margin-bottom: 30px;">
      ${
        showCongrats ? "🎉 Congratulations!" : "New Message from Rental Booking"
      }
    </h3>

    ${
      showCongrats
        ? `<p style="font-size: 14px; color: #333; text-align: center; margin-bottom: 20px;">
            You've successfully completed your 5th rental! We appreciate your loyalty.
          </p>`
        : ""
    }

    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Name: ${name}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Email: ${email}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Phone: ${phoneNo}</p>

    <p style="font-size: 14px; color: #333; margin-bottom: 10px;"> <span style="font-bold">Location: </span> ${location}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Pickup Date & Time: ${pickupDate} at ${pickupTime}</p>
    <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Dropoff Date & Time: ${dropoffDate} at ${dropoffTime}</p>

    <div>
      <p style="font-size: 14px; color: #333; margin-bottom: 10px;">Address:</p>
      <div style="background-color: #f9f9f9; padding: 18px; border-radius: 6px; color: #444; font-size: 12px; line-height: 1.6;">
        ${address}
      </div>
    </div>

    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
      — Sent via <strong>JANADRIVE</strong> Contact Form —
    </p>
  </div>
  `;
    };

    // Optional email (only if user exists)
    if (user) {
      await sendEmail(
        "janashahid999@gmail.com",
        user.email,
        "New Booking JANADRIVE",
        emailBody(
          name,
          user.email,
          phoneNo,
          address,
          showCongrats,
          location,
          pickupDate,
          dropoffDate,
          pickupTime,
          dropoffTime
        )
      );
    }

    res.status(201).json({ success: true, message, rental: savedRental });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("carId").populate("userId");
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("carId")
      .populate("userId");
    if (!rental)
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update rental by ID
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!rental)
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    res
      .status(200)
      .json({ success: true, message: "Rental Car Updated", rental });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete rental by ID
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental)
      return res
        .status(404)
        .json({ success: false, message: "Rental not found" });
    res
      .status(200)
      .json({ success: true, message: "Rental car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
