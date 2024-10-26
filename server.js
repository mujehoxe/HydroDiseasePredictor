import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Farm from "./src/models/Farm";

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// POST route to add a new farm
app.post('/api/farms', async (req, res) => {
    try {
        const { user, name, location, additionalInfo } = req.body;
        const newFarm = new Farm({
            user,
            name,
            location,
            additionalInfo
        });
        await newFarm.save();
        res.status(201).json({ message: 'Farm created successfully' });
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ message: 'Error creating farm' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
