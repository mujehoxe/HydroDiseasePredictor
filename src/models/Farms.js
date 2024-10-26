import mongoose from 'mongoose';

const { Schema } = mongoose;


const farmSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who created it
  name: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },  // GeoJSON format
    coordinates: { type: [Number], required: true },  // [longitude, latitude]
  },
  additionalInfo: {
    info1: String,
    info2: String,
    info3: String
  }
}, { timestamps: true });

export default mongoose.model('Farm', farmSchema);