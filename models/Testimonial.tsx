import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true }, // parent photo
  },
  { timestamps: true }
);

const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
