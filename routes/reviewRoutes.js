const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");
const validateReview = require("../middleware/validateReview");

router.post("/", validateReview, reviewController.createReview);
router.get("/service/:id", reviewController.getReviewsByService);

module.exports = router;