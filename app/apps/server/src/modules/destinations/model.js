import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
    avatar: { type: String },
});

const foodSpotSchema = mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 0 },
    priceRange: { type: String },
    image: { type: String },
    description: { type: String },
});

const hostelSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    priceRange: { type: String },
    image: { type: String },
    amenities: [{ type: String }],
    description: { type: String },
});

const destinationSchema = mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    location: { type: String, required: true },
    category: { type: String, default: 'history' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    bestTime: { type: String },
    duration: { type: String },
    image: { type: String },
    history: { type: String },
    mystery: { type: String },
    gallery: [{ type: String }],

    // Embedded sub-documents
    foodSpots: [foodSpotSchema],
    hostels: [hostelSchema],
    reviews: [reviewSchema]
}, {
    timestamps: true,
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
