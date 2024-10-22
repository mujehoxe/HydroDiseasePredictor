import mongoose from 'mongoose';

const { Schema } = mongoose;

const predictionSchema = new mongoose.Schema({
  farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },  // Reference to the farm
  plantDisease: { type: String, required: true },  // Name of the plant disease
  risk: { type: Number, required: true },  // Percentage risk (0-100)
  time: { type: Date, default: Date.now },  // Timestamp
}, { timestamps: true });

export default mongoose.model('Prediction', predictionSchema);