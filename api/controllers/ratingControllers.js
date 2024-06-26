const Rating = require("../models/Rating");

exports.postRating = async (req, res) => {
  try {
    const { rating = 0, comment } = req.body;
    const { user_id } = req;

    if (!rating) return res.status(400).send({
      error: "Rating must be provided"
    })

    const existingRating = await Rating.findOne({ user_id });
    if (existingRating) return res.status(400).send({
      error: "You already has given a rating. Can't rate again"
    })

    const ratingObj = {
      rating,
      user_id
    }

    if (comment) ratingObj.comment = comment;
    const newRating = new Rating(ratingObj)

    await newRating.save()

    res.status(200).send({
      message: "Rating given successfully",
      rating: newRating
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.getRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch ratings from the database with pagination
    const ratings = await Rating.find()
      .skip(skip)
      .limit(Number(limit));

    // Get the total number of ratings for pagination metadata
    const totalRatings = await Rating.countDocuments();

    res.status(200).send({
      page: Number(page),
      limit: Number(limit),
      totalRatings,
      totalPages: Math.ceil(totalRatings / limit),
      ratings
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.getRating = async (req, res) => {
  try {
    const { user_id } = req;

    const rating = await Rating.findOne({ _id: user_id })
    if (!rating) return res.status(404).send({
      error: "No rating found with the provided id"
    })

    res.status(200).send(rating)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const avgRating = Rating.aggregate([

    ])
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}