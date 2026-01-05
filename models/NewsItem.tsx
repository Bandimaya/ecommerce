import mongoose from "mongoose";

const newsItemSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const NewsItem =
  mongoose.models.NewsItem ||
  mongoose.model("NewsItem", newsItemSchema);

export default NewsItem;
