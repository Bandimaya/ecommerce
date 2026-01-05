import mongoose, { Schema, Document } from 'mongoose';

interface IEvent extends Document {
  title: string;
  subtitle: string;
  category: string;
  thumbnail: string;
  logo: string;
  color: string;
  bgGradient: string;
  count: number;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    logo: { type: String, required: true },
    color: { type: String, required: true },
    bgGradient: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;
