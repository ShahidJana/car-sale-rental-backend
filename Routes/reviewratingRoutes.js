
const router = require('express').Router();
const reviewController = require("../Controller/reviewratingController");

router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/car/:carId", reviewController.getReviewsByCarId);

module.exports = router;
