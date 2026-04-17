const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  content: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  coverImagePublicId: { type: String, default: "" },
  category: {
    type: String,
    enum: ["Technology","Lifestyle","Travel","Food","Health","Business","Design","Science","Culture","Other"],
    default: "Other",
  },
  tags: [{ type: String, trim: true }],
  readTime: { type: Number, default: 5 },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  scheduledAt: { type: Date, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    approved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  }],
  status: { type: String, enum: ["draft","published","pending","scheduled"], default: "published" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
}, { timestamps: true });

blogSchema.pre("save", function(next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g,"-").substring(0,80) + "-" + Date.now();
  }
  if (this.content) {
    const stripped = this.content.replace(/<[^>]*>/g," ");
    const words = stripped.split(/\s+/).filter(Boolean).length;
    this.readTime = Math.ceil(words / 200) || 1;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
