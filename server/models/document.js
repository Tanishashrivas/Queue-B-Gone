const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to admin
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  pageCount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  tokenNumber: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);