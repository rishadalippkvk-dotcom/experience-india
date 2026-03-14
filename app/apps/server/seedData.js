import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/Destination.js';
import connectDB from './config/db.js';

dotenv.config();

const destinations = [
    {
        name: 'Jaipur',
        tagline: 'The Pink City',
        description: 'Discover the royal heritage of Rajasthan in this stunning pink-hued city, home to magnificent forts and palaces.',
        image: '/jaipur.jpg',
        category: 'history',
        rating: 4.8,
        reviewCount: 2456,
        location: 'Rajasthan, India',
        bestTime: 'October - March',
        duration: '3-4 days',
        history: 'Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India\'s first planned city. The pink color was introduced in 1876 to welcome the Prince of Wales, and the tradition has been maintained ever since. The city is a UNESCO World Heritage Site and showcases the finest examples of Rajput architecture.',
        mystery: 'The mysterious tunnels of Amber Fort are said to connect to Jaigarh Fort, spanning over 2 kilometers underground. Legend has it that royal treasures were once transported through these secret passages during times of war.',
        gallery: ['/jaipur.jpg', '/history-hampi.jpg', '/taj-mahal.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Laxmi Mishthan Bhandar',
                cuisine: 'Rajasthani',
                rating: 4.7,
                priceRange: '₹₹',
                image: '/food-thali.jpg',
                description: 'Famous for authentic Rajasthani thali and sweets since 1954.',
            },
            {
                name: 'Rawat Mishthan Bhandar',
                cuisine: 'Street Food',
                rating: 4.5,
                priceRange: '₹',
                image: '/food-street.jpg',
                description: 'Best pyaaz kachori in the city, a must-try local delicacy.',
            },
        ],
        hostels: [
            {
                name: 'Zostel Jaipur',
                rating: 4.6,
                priceRange: '₹800-1200',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Rooftop', 'Cafe'],
                description: 'Vibrant hostel in the heart of the city with stunning views.',
            },
            {
                name: 'The Hosteller Jaipur',
                rating: 4.4,
                priceRange: '₹600-1000',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Common Room', 'Kitchen'],
                description: 'Budget-friendly with great social atmosphere.',
            },
        ],
    },
    {
        name: 'Varanasi',
        tagline: 'Spiritual Capital',
        description: 'Experience the spiritual heart of India on the banks of the sacred Ganges River.',
        image: '/varanasi.jpg',
        category: 'history',
        rating: 4.7,
        reviewCount: 1890,
        location: 'Uttar Pradesh, India',
        bestTime: 'October - March',
        duration: '2-3 days',
        history: 'Varanasi is one of the world\'s oldest continuously inhabited cities, dating back over 3,000 years. It is considered the spiritual capital of India, where pilgrims come to bathe in the sacred waters of the Ganges and perform funeral rites. The city has been a center of learning and civilization for millennia.',
        mystery: 'The mysterious Aghori sadhus of Varanasi practice ancient rituals that defy conventional understanding. They are known to meditate in cremation grounds and are believed to possess supernatural powers through their intense spiritual practices.',
        gallery: ['/varanasi.jpg', '/taj-mahal.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Kashi Chat Bhandar',
                cuisine: 'Street Food',
                rating: 4.8,
                priceRange: '₹',
                image: '/food-street.jpg',
                description: 'Legendary chaat shop serving the best tamatar chaat.',
            },
        ],
        hostels: [
            {
                name: 'Zostel Varanasi',
                rating: 4.5,
                priceRange: '₹500-900',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'Rooftop', 'Yoga', 'Cafe'],
                description: 'Riverside hostel with Ganges views and yoga classes.',
            },
        ],
    },
    {
        name: 'Kerala',
        tagline: 'God\'s Own Country',
        description: 'Relax in the serene backwaters and experience the natural beauty of this tropical paradise.',
        image: '/kerala.jpg',
        category: 'nature',
        rating: 4.9,
        reviewCount: 3200,
        location: 'Kerala, India',
        bestTime: 'September - March',
        duration: '5-7 days',
        history: 'Kerala has been a major spice trade center for over 3,000 years, attracting traders from around the world. The state has a unique cultural heritage shaped by Hindu, Christian, and Islamic influences, creating a rich tapestry of traditions and festivals.',
        mystery: 'The mysterious Kodinhi village in Kerala is known as the "Twin Village" - it has an unusually high number of twin births, with over 250 sets of twins in a population of just 2,000 families. Scientists are still trying to understand this phenomenon.',
        gallery: ['/kerala.jpg', '/goa.jpg', '/udaipur.jpg'],
        foodSpots: [
            {
                name: 'Grandmother\'s Kitchen',
                cuisine: 'Kerala',
                rating: 4.9,
                priceRange: '₹₹₹',
                image: '/food-thali.jpg',
                description: 'Authentic Kerala seafood and traditional sadhya.',
            },
        ],
        hostels: [
            {
                name: 'The Lost Hostel',
                rating: 4.7,
                priceRange: '₹700-1100',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Backwater View', 'Kitchen'],
                description: 'Peaceful hostel overlooking the backwaters.',
            },
        ],
    },
    {
        name: 'Agra',
        tagline: 'Home of the Taj',
        description: 'Witness the eternal symbol of love, the magnificent Taj Mahal.',
        image: '/taj-mahal.jpg',
        category: 'history',
        rating: 4.9,
        reviewCount: 5100,
        location: 'Uttar Pradesh, India',
        bestTime: 'October - March',
        duration: '1-2 days',
        history: 'The Taj Mahal was built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal between 1632 and 1653. This white marble mausoleum is considered the finest example of Mughal architecture, combining elements of Indian, Persian, and Islamic styles.',
        mystery: 'Legend says that Shah Jahan planned to build a black Taj Mahal across the river, but it was never completed. Some believe the black marble was actually meant to be the mausoleum for the emperor himself, creating a perfect symmetry with the white Taj.',
        gallery: ['/taj-mahal.jpg', '/history-hampi.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Peshawri',
                cuisine: 'Mughlai',
                rating: 4.8,
                priceRange: '₹₹₹₹',
                image: '/food-thali.jpg',
                description: 'Famous for dal makhani and tandoori dishes.',
            },
        ],
        hostels: [
            {
                name: 'Zostel Agra',
                rating: 4.5,
                priceRange: '₹600-1000',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Rooftop', 'Taj View'],
                description: 'Rooftop cafe with stunning Taj Mahal views.',
            },
        ],
    },
    {
        name: 'Goa',
        tagline: 'Beach Paradise',
        description: 'Sun, sand, and vibrant nightlife in India\'s favorite beach destination.',
        image: '/goa.jpg',
        category: 'nature',
        rating: 4.6,
        reviewCount: 4200,
        location: 'Goa, India',
        bestTime: 'November - February',
        duration: '4-5 days',
        history: 'Goa was a Portuguese colony for over 450 years until 1961, leaving a unique blend of Indian and Portuguese cultures. The state is famous for its beaches, colonial architecture, and vibrant nightlife that attracts visitors from around the world.',
        mystery: 'The Three Kings Church in Cansaulim is said to be haunted by three Portuguese kings who poisoned each other in a power struggle. Visitors report strange occurrences and eerie feelings, especially at night.',
        gallery: ['/goa.jpg', '/kerala.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Vinayak Family Restaurant',
                cuisine: 'Goan',
                rating: 4.6,
                priceRange: '₹₹',
                image: '/food-thali.jpg',
                description: 'Authentic Goan fish curry and vindaloo.',
            },
        ],
        hostels: [
            {
                name: 'Jungle Hostel',
                rating: 4.7,
                priceRange: '₹800-1400',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'Pool', 'Bar', 'Beach Shuttle'],
                description: 'Party hostel near Anjuna Beach with pool parties.',
            },
        ],
    },
    {
        name: 'Ladakh',
        tagline: 'Land of High Passes',
        description: 'Experience the breathtaking Himalayan landscapes and ancient Buddhist monasteries.',
        image: '/ladakh.jpg',
        category: 'nature',
        rating: 4.8,
        reviewCount: 1850,
        location: 'Ladakh, India',
        bestTime: 'June - September',
        duration: '7-10 days',
        history: 'Ladakh has been a crossroads of trade routes between India, Tibet, and Central Asia for centuries. The region is deeply influenced by Tibetan Buddhism, with ancient monasteries perched on dramatic mountain cliffs that have preserved spiritual traditions for over a thousand years.',
        mystery: 'The Magnetic Hill in Ladakh defies gravity - vehicles appear to roll uphill when left in neutral. While scientists explain it as an optical illusion, locals believe it to be a place of supernatural power where the boundaries between worlds are thin.',
        gallery: ['/ladakh.jpg', '/jaisalmer.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Tibetan Kitchen',
                cuisine: 'Tibetan',
                rating: 4.7,
                priceRange: '₹₹',
                image: '/food-thali.jpg',
                description: 'Authentic momos and thukpa in Leh.',
            },
        ],
        hostels: [
            {
                name: 'Ree Hostel',
                rating: 4.8,
                priceRange: '₹1000-1800',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'Heater', 'Mountain View', 'Cafe'],
                description: 'Cozy hostel with panoramic mountain views.',
            },
        ],
    },
    {
        name: 'Udaipur',
        tagline: 'City of Lakes',
        description: 'Romantic city with stunning palaces and serene lakes.',
        image: '/udaipur.jpg',
        category: 'history',
        rating: 4.7,
        reviewCount: 2100,
        location: 'Rajasthan, India',
        bestTime: 'October - March',
        duration: '2-3 days',
        history: 'Udaipur was founded in 1559 by Maharana Udai Singh II as the new capital of the Mewar kingdom. The city is renowned for its lakes, palaces, and romantic ambiance, earning it the nickname "Venice of the East." The Lake Palace, now a luxury hotel, appears to float on Lake Pichola.',
        mystery: 'The City Palace is said to have secret tunnels connecting it to various parts of the city, including the Sajjangarh Fort. These passages were used by royalty during emergencies and some are believed to still exist, though their exact locations remain a mystery.',
        gallery: ['/udaipur.jpg', '/taj-mahal.jpg', '/jaipur.jpg'],
        foodSpots: [
            {
                name: 'Ambrai Restaurant',
                cuisine: 'Rajasthani',
                rating: 4.8,
                priceRange: '₹₹₹',
                image: '/food-thali.jpg',
                description: 'Rooftop dining with Lake Pichola views.',
            },
        ],
        hostels: [
            {
                name: 'Banjara Hostel',
                rating: 4.6,
                priceRange: '₹700-1200',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Lake View', 'Rooftop'],
                description: 'Boutique hostel with stunning lake views.',
            },
        ],
    },
    {
        name: 'Mysore',
        tagline: 'Cultural Capital',
        description: 'Experience royal heritage and the world-famous Mysore Palace.',
        image: '/mysore.jpg',
        category: 'history',
        rating: 4.6,
        reviewCount: 1650,
        location: 'Karnataka, India',
        bestTime: 'October - February',
        duration: '2-3 days',
        history: 'Mysore was the capital of the Wodeyar dynasty for nearly 600 years. The magnificent Mysore Palace, illuminated by nearly 100,000 bulbs during festivals, is one of the most visited monuments in India. The city is also famous for its silk, sandalwood, and yoga traditions.',
        mystery: 'The palace is said to have hidden treasure chambers that were sealed by the British during colonial times. Local legends speak of secret underground passages and rooms that have never been found, containing artifacts and jewels from the royal era.',
        gallery: ['/mysore.jpg', '/history-hampi.jpg', '/holi-festival.jpg'],
        foodSpots: [
            {
                name: 'Mylari Hotel',
                cuisine: 'South Indian',
                rating: 4.7,
                priceRange: '₹₹',
                image: '/food-thali.jpg',
                description: 'Famous for fluffy dosas and filter coffee.',
            },
        ],
        hostels: [
            {
                name: 'Zostel Mysore',
                rating: 4.5,
                priceRange: '₹600-1000',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Common Room', 'Kitchen'],
                description: 'Friendly hostel near the palace.',
            },
        ],
    },
    {
        name: 'Bhangarh Fort',
        tagline: 'India\'s Most Haunted',
        description: 'Explore the mysterious ruins of India\'s most haunted fort.',
        image: '/mystery-bhangarh.jpg',
        category: 'mystery',
        rating: 4.3,
        reviewCount: 890,
        location: 'Rajasthan, India',
        bestTime: 'October - March',
        duration: '1 day',
        history: 'Bhangarh Fort was built in the 17th century by Raja Madho Singh. The fort complex includes temples, palaces, and gates, all now in ruins. It was abandoned in the 18th century for unknown reasons, leading to numerous legends and ghost stories.',
        mystery: 'According to legend, a tantrik named Singhia cursed the fort after being rejected by Princess Ratnavati. The curse doomed the town to destruction and said no one could live there. The Archaeological Survey of India prohibits entry after sunset, adding to its eerie reputation.',
        gallery: ['/mystery-bhangarh.jpg', '/jaisalmer.jpg', '/history-hampi.jpg'],
        foodSpots: [
            {
                name: 'Local Dhaba',
                cuisine: 'Rajasthani',
                rating: 4.2,
                priceRange: '₹',
                image: '/food-thali.jpg',
                description: 'Simple local food near the fort.',
            },
        ],
        hostels: [
            {
                name: 'Alwar Backpackers',
                rating: 4.0,
                priceRange: '₹400-800',
                image: '/hostel-interior.jpg',
                amenities: ['WiFi', 'AC', 'Common Room'],
                description: 'Budget stay in nearby Alwar city.',
            },
        ],
    },
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing destinations
        await Destination.deleteMany({});
        console.log('Cleared existing destinations');

        // Insert new destinations
        await Destination.insertMany(destinations);
        console.log('Destinations Seeded!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
