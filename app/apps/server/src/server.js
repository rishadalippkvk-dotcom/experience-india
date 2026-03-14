import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './modules/auth/routes.js';
import destinationRoutes from './modules/destinations/routes.js';
import User from './modules/auth/model.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Seed Admin User
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const user = new User({
                username: 'admin',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin',
            });
            await user.save();
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

seedAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
