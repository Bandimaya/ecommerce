// models/Winner.js
import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  team: { type: String, required: true },
  event: { type: String, required: true },
  position: { type: String, required: true },
  school: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Winner = mongoose.models.Winner || mongoose.model('Winner', winnerSchema);

export default Winner;
