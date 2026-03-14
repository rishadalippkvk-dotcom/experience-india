import connectDB from './src/config/db.js';
import Destination from './src/modules/destinations/model.js';
import dotenv from 'dotenv';

dotenv.config();

const verify = async () => {
    try {
        await connectDB();
        const count = await Destination.countDocuments();
        console.log(`Verification: Found ${count} destinations in the database.`);
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verify();
