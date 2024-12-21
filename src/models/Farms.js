import mongoose from 'mongoose';

const { Schema } = mongoose;


const farmSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who created it
  name: { type: String, required: true },
  location: { type: String, required: true },
  additionalInfo: {
    City: String
  }
}, { timestamps: true });

export default mongoose.model('Farm', farmSchema);