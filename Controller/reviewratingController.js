const Review = require("../Models/reviewratingModel");

exports.createReview = async (req, res) => {
  try {
    const { carId, userId, rating, comment } = req.body;

    // Prevent duplicate review by the same user for the same car
    // const existing = await Review.findOne({ carId, userId });
    // if (existing) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already reviewed this car.",
    //   });
    // }

    const newReview = await new Review({ carId, userId, rating, comment }).save();

    const populatedReview = await Review.findById(newReview._id)
      .populate("userId", "name email")
      .populate("carId", "name");

    res.status(201).json({
      success: true,
      message: "Thanks for your feedback!",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("carId", "name");

    res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name email")
      .populate("carId", "name");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("userId", "name email")
      .populate("carId", "name");

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReviewsByCarId = async (req, res) => {
  try {
    const reviews = await Review.find({ carId: req.params.carId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

