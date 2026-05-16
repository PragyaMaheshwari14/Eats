const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const storageService = require("../services/storage.service");
const commentModel = require("../models/comment.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid(),
    );

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food item created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error("createFood error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (error) {
    console.error("getFoodItems error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ message: "Food unliked successfully" });
    }

    const like = await likeModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Food liked successfully", like });
  } catch (error) {
    console.error("likeFood error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    const save = await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({ message: "Food saved successfully", save });
  } catch (error) {
    console.error("saveFood error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function getSaveFood(req, res) {
  try {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate("food");

    // Return empty array instead of 404 — easier to handle on frontend
    res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods: savedFoods ?? [],
    });
  } catch (error) {
    console.error("getSaveFood error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// NEW: returns all food IDs the current user has liked
async function getLikedFoods(req, res) {
  try {
    const user = req.user;
    const likes = await likeModel.find({ user: user._id }).select("food");
    const likedFoodIds = likes.map((l) => l.food.toString());
    res.status(200).json({ likedFoodIds });
  } catch (error) {
    console.error("getLikedFoods error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function addComment(req, res) {
  try {
    const { foodId, text } = req.body;
    const user = req.user;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }

    const comment = await commentModel.create({ user: user._id, food: foodId, text });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } });

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getComments(req, res) {
  try {
    const { foodId } = req.params;
    const comments = await commentModel
      .find({ food: foodId })
      .populate("user", "fullName");
    res.status(200).json({ comments });
  } catch (error) {
    console.error("getComments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
  getLikedFoods,
  addComment,
  getComments,
};