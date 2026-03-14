import express from 'express';
import Destination from './model.js';
import { protect, admin } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// ============================================
// DESTINATIONS ROUTES
// ============================================

// @desc    Get all destinations (with optional filtering and sorting)
// @route   GET /api/destinations?category=history&sort=rating
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, sort } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        let destinations = Destination.find(query);

        // Sorting
        if (sort === 'rating') {
            destinations = destinations.sort({ rating: -1 });
        } else if (sort === 'name') {
            destinations = destinations.sort({ name: 1 });
        } else {
            destinations = destinations.sort({ createdAt: -1 });
        }

        const results = await destinations;
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination) {
            res.json(destination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const destination = new Destination(req.body);
        const createdDestination = await destination.save();
        res.status(201).json(createdDestination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (destination) {
            Object.assign(destination, req.body);
            const updatedDestination = await destination.save();
            res.json(updatedDestination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (destination) {
            await destination.deleteOne();
            res.json({ message: 'Destination removed' });
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// FOOD SPOTS ROUTES (Embedded)
// ============================================

// @desc    Get all food spots across all destinations
// @route   GET /api/destinations/food-spots/all
// @access  Public
router.get('/food-spots/all', async (req, res) => {
    try {
        const destinations = await Destination.find({});
        const allFoodSpots = [];

        destinations.forEach(dest => {
            if (dest.foodSpots && dest.foodSpots.length > 0) {
                dest.foodSpots.forEach(spot => {
                    allFoodSpots.push({
                        ...spot.toObject(),
                        destinationId: dest._id,
                        destinationName: dest.name,
                    });
                });
            }
        });

        res.json(allFoodSpots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add food spot to destination
// @route   POST /api/destinations/:id/food-spots
// @access  Private/Admin
router.post('/:id/food-spots', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.foodSpots.push(req.body);
        await destination.save();

        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update food spot
// @route   PUT /api/destinations/:destId/food-spots/:spotId
// @access  Private/Admin
router.put('/:destId/food-spots/:spotId', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const foodSpot = destination.foodSpots.id(req.params.spotId);

        if (!foodSpot) {
            return res.status(404).json({ message: 'Food spot not found' });
        }

        Object.assign(foodSpot, req.body);
        await destination.save();

        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete food spot
// @route   DELETE /api/destinations/:destId/food-spots/:spotId
// @access  Private/Admin
router.delete('/:destId/food-spots/:spotId', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.foodSpots.pull(req.params.spotId);
        await destination.save();

        res.json({ message: 'Food spot removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// HOSTELS ROUTES (Embedded)
// ============================================

// @desc    Get all hostels across all destinations
// @route   GET /api/destinations/hostels/all
// @access  Public
router.get('/hostels/all', async (req, res) => {
    try {
        const destinations = await Destination.find({});
        const allHostels = [];

        destinations.forEach(dest => {
            if (dest.hostels && dest.hostels.length > 0) {
                dest.hostels.forEach(hostel => {
                    allHostels.push({
                        ...hostel.toObject(),
                        destinationId: dest._id,
                        destinationName: dest.name,
                    });
                });
            }
        });

        res.json(allHostels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add hostel to destination
// @route   POST /api/destinations/:id/hostels
// @access  Private/Admin
router.post('/:id/hostels', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.hostels.push(req.body);
        await destination.save();

        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update hostel
// @route   PUT /api/destinations/:destId/hostels/:hostelId
// @access  Private/Admin
router.put('/:destId/hostels/:hostelId', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const hostel = destination.hostels.id(req.params.hostelId);

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }

        Object.assign(hostel, req.body);
        await destination.save();

        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete hostel
// @route   DELETE /api/destinations/:destId/hostels/:hostelId
// @access  Private/Admin
router.delete('/:destId/hostels/:hostelId', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.hostels.pull(req.params.hostelId);
        await destination.save();

        res.json({ message: 'Hostel removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============================================
// REVIEWS ROUTES (Embedded)
// ============================================

// @desc    Get all reviews across all destinations (with filtering)
// @route   GET /api/destinations/reviews/all?approved=true&rating=5
// @access  Public
router.get('/reviews/all', async (req, res) => {
    try {
        const { approved, rating } = req.query;
        const destinations = await Destination.find({});
        let allReviews = [];

        destinations.forEach(dest => {
            if (dest.reviews && dest.reviews.length > 0) {
                dest.reviews.forEach(review => {
                    allReviews.push({
                        ...review.toObject(),
                        destinationId: dest._id,
                        destinationName: dest.name,
                    });
                });
            }
        });

        // Filter by approval status
        if (approved !== undefined) {
            const isApproved = approved === 'true';
            allReviews = allReviews.filter(r => r.approved === isApproved);
        }

        // Filter by rating
        if (rating) {
            allReviews = allReviews.filter(r => r.rating === parseInt(rating));
        }

        res.json(allReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add review to destination
// @route   POST /api/destinations/:id/reviews
// @access  Public
router.post('/:id/reviews', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.reviews.push(req.body);
        await destination.save();

        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Approve review
// @route   PUT /api/destinations/:destId/reviews/:reviewId/approve
// @access  Private/Admin
router.put('/:destId/reviews/:reviewId/approve', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        const review = destination.reviews.id(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.approved = true;
        await destination.save();

        res.json({ message: 'Review approved', review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete review
// @route   DELETE /api/destinations/:destId/reviews/:reviewId
// @access  Private/Admin
router.delete('/:destId/reviews/:reviewId', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destId);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        destination.reviews.pull(req.params.reviewId);
        await destination.save();

        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
