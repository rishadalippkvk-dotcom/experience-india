import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './src/modules/destinations/model.js';
import connectDB from './src/config/db.js';

dotenv.config();

const dummyReviews = [
  {
    author: 'Sarah Johnson',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    content: 'An absolutely magical experience! The architecture, the food, and the people were all incredible. Highly recommend this to anyone looking to explore the true culture.',
    approved: true,
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    author: 'Michael Chen',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    content: 'One of the best trips I have ever taken. Everything was well organized and the sights were beyond my expectations. Will definitely come back.',
    approved: true,
    avatar: 'https://i.pravatar.cc/150?u=michael',
  },
  {
    author: 'Emily Davis',
    rating: 4,
    date: new Date().toISOString().split('T')[0],
    content: 'Beautiful destination with so much history. The guided tours were informational and the overall vibe was very relaxing.',
    approved: true,
    avatar: 'https://i.pravatar.cc/150?u=emily',
  },
  {
    author: 'James Wilson',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    content: 'I cannot express how wonderful this journey was. From the luxurious stays to the vibrant street culture, every moment was picture perfect.',
    approved: true,
    avatar: 'https://i.pravatar.cc/150?u=james',
  }
];

const seedReviews = async () => {
    try {
        await connectDB();
        
        const destinations = await Destination.find();
        if (destinations.length === 0) {
            console.log('No destinations found. Please seed destinations first.');
            process.exit();
        }

        console.log('Seeding reviews...');

        for (let dest of destinations) {
            // Randomly select 2-3 reviews to add to each destination
            const numReviews = Math.floor(Math.random() * 2) + 2; 
            const shuffled = [...dummyReviews].sort(() => 0.5 - Math.random());
            const selectedReviews = shuffled.slice(0, numReviews);
            
            // clear old reviews
            dest.reviews = [];
            
            for (let rev of selectedReviews) {
                dest.reviews.push(rev);
            }
            // Update review count & avg rating
            dest.reviewCount = dest.reviews.length;
            const totalRating = dest.reviews.reduce((acc, item) => item.rating + acc, 0);
            dest.rating = Math.round((totalRating / dest.reviewCount) * 10) / 10;
            
            await dest.save();
        }

        console.log('Reviews seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedReviews();
