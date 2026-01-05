import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    youtubeId: { type: String, required: true }, // e.g. 40imd1I80Sk
  },
  { timestamps: true }
);

const Video =
  mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
