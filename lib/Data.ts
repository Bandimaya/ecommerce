// lib/stemData.ts

export interface StemProduct {
  id: number;
  title: string;
  category: string;
  age: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge: string;
  rating: number;
  outcomes: string[];
}



export const stemResults: StemProduct[] = [
  {
    id: 1,
    title: "Avishkaar Tweak FULL",
    category: "Robotics",
    age: "6+",
    price: "₹15,000",
    image: "https://images.avishkaar.cc/products/Tweak+2.0/Main+Carousel/01-hero-image.jpg",
    badge: "New Arrival",
    rating: 4.8,
    outcomes: ["Logic Building", "Hands-on Learning", "STEM Basics"],
  },
  {
    id: 2,
    title: "Maker Board 3.0",
    category: "Coding",
    age: "8+",
    price: "₹1,499",
    image: "https://images.avishkaar.cc/marketing/01-hero.webp",
    badge: "Best Seller",
    rating: 4.9,
    outcomes: ["Programming", "IoT Basics", "Problem Solving"],
  },
  {
    id: 3,
    title: "MEX DIY Robotics Advanced",
    category: "Robotics",
    age: "10+",
    price: "₹12,999",
    image: "https://images.avishkaar.cc/products/MRAK+2.0+KIT/Avishkaar.cc/Main+Carousel/01-hero+image-v2.webp",
    badge: "Premium",
    rating: 4.8,
    outcomes: ["Engineering Thinking", "Mechanical Design", "Complex Circuits"],
  },
  {
    id: 4,
    title: "ABot Robotics Kit",
    category: "Robotics",
    age: "8+",
    price: "₹4,199",
    originalPrice: "₹4,999",
    image: "https://images.avishkaar.cc/products/hero_image/avishkaar.cc+index/01-hero-image-avishkaarcc-index-.webp",
    badge: "Popular",
    rating: 4.9,
    outcomes: ["Autonomous Motion", "Sensor Integration", "Coding Logic"],
  },
  {
    id: 5,
    title: "MEX Build-a-Bike Kit",
    category: "Engineering",
    age: "8+",
    price: "₹3,299",
    originalPrice: "₹3,999",
    image: "https://images.avishkaar.cc/products/misc/mex-bike-1000x1000.webp",
    badge: "Sale",
    rating: 4.4,
    outcomes: ["Mechanics", "Assembly Skills", "Physical Science"],
  },
  {
    id: 6,
    title: "MEX 10-in-1 Explorer",
    category: "Robotics",
    age: "6+",
    price: "₹999",
    originalPrice: "₹1,499",
    image: "https://images.avishkaar.cc/products/MEX_MREK/avishkaar.cc/carousel/1-hero-image.webp",
    badge: "Hot Deal",
    rating: 4.5,
    outcomes: ["Structural Design", "Creativity", "Motor Skills"],
  },
  {
    id: 7,
    title: "AI & Robotics Workshop",
    category: "Advanced Tech",
    age: "12+",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1581091012184-123a124e568?auto=format&fit=crop&w=800&q=80", // Kept high-quality fallback
    badge: "Masterclass",
    rating: 5.0,
    outcomes: ["AI Integration", "Python", "System Architecture"],
  },
  {
    id: 8,
    title: "Electronics Lab Kit",
    category: "Electronics",
    age: "10+",
    price: "₹1,599",
    image: "https://images.unsplash.com/photo-1596518584465-84f1b94c0eb4?auto=format&fit=crop&w=800&q=80", // Kept high-quality fallback
    badge: "Essential",
    rating: 4.7,
    outcomes: ["Circuit Design", "Current & Voltage", "Prototyping"],
  },
];

// lib/data.ts

export interface Product {
  id?: number;
  _id?: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isFeatured: boolean;
  isNew: boolean;
  description: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Nebula Wireless X1",
    category: "Audio Gear",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=95",
    isFeatured: true,
    isNew: true,
    description: "Experience sound like never before with active noise cancellation and 40-hour battery life. The premium materials ensure comfort for long listening sessions, while the bespoke drivers deliver deep bass and crystal-clear highs."
  },
  {
    id: 2,
    name: "Aero Glide Runners",
    category: "Footwear",
    price: 145,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=95",
    isFeatured: true,
    isNew: false,
    description: "Ultra-lightweight mesh construction meets responsive cushioning for your daily run. The breathable upper keeps your feet cool, and the durable outsole provides excellent traction on various surfaces."
  },
  {
    id: 3,
    name: "Chronos Minimalist",
    category: "Accessories",
    price: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=95",
    isFeatured: true,
    isNew: true,
    description: "Timeless design featuring a genuine leather strap and sapphire crystal glass. The precise Japanese quartz movement ensures accurate timekeeping, and the minimalist dial complements any outfit."
  },
  {
    id: 4,
    name: "Horizon Lens 50mm",
    category: "Photography",
    price: 850,
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1600&q=95",
    isFeatured: true,
    isNew: false,
    description: "Capture stunning portraits with the f/1.8 aperture and silent autofocus motor. The multi-coated glass reduces flare and ghosting, resulting in sharp, high-contrast images even in challenging lighting conditions."
  },
  {
    id: 5,
    name: "Ergo Luxe Chair",
    category: "Furniture",
    price: 450,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1600&q=95",
    isFeatured: true,
    isNew: false,
    description: "Designed for all-day comfort with lumbar support and premium breathable fabric. The adjustable height and tilt mechanism allow you to find the perfect seating position, reducing strain on your back and neck."
  }
];

// lib/shop-data.ts
// lib/shop-data.ts

export const MOCK_CATEGORIES = [
  { _id: "robotics", title: "Robotics" },
  { _id: "drones", title: "Drones & Flying" },
  { _id: "coding", title: "Coding Kits" },
  { _id: "ai", title: "AI & IoT" },
  { _id: "spare", title: "Spare Parts" },
];

export const MOCK_PRODUCTS_SHOP = [
  {
    _id: "prod_1",
    name: "Titan Rover 4WD Kit",
    slug: "titan-rover-4wd",
    categories: [{ _id: "robotics", title: "Robotics" }, { _id: "ai", title: "AI & IoT" }],
    description: "An all-terrain rover kit with autonomous navigation capabilities.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 149.99, salePrice: 129.99 }
    ],
    variants: [], 
    isNew: true
  },
  {
    _id: "prod_2",
    name: "SkyHawk Drone Builder",
    slug: "skyhawk-drone",
    categories: [{ _id: "drones", title: "Drones & Flying" }],
    description: "Build your own quadcopter from scratch with modular parts.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 299.99, salePrice: 249.99 }
    ],
    variants: [],
    isNew: false
  },
  {
    _id: "prod_3",
    name: "Logic Gate Starter Pack",
    slug: "logic-gate-pack",
    categories: [{ _id: "coding", title: "Coding Kits" }],
    description: "Physical logic gates to teach computer architecture basics.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 49.99, salePrice: 49.99 } 
    ],
    variants: [],
    isNew: true
  },
  {
    _id: "prod_4",
    name: "Hydraulic Arm V2",
    slug: "hydraulic-arm-v2",
    categories: [{ _id: "robotics", title: "Robotics" }],
    description: "Learn fluid mechanics by building a powerful robotic arm.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 89.99, salePrice: 69.99 }
    ],
    variants: [],
    isNew: false
  },
  {
    _id: "prod_5",
    name: "Smart Garden IoT Sensor",
    slug: "smart-garden-sensor",
    categories: [{ _id: "ai", title: "AI & IoT" }, { _id: "coding", title: "Coding Kits" }],
    description: "Monitor soil moisture and sunlight with this WiFi-enabled kit.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1592833159057-65a284572d25?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 39.99, salePrice: 34.99 }
    ],
    variants: [],
    isNew: true
  },
  {
    _id: "prod_6",
    name: "High-Torque Servo Motor",
    slug: "servo-motor-mg996r",
    categories: [{ _id: "spare", title: "Spare Parts" }, { _id: "robotics", title: "Robotics" }],
    description: "Metal gear servo for heavy-duty robotic applications.",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" }
    ],
    pricing: [
      { currency: "USD", originalPrice: 15.99, salePrice: 12.99 }
    ],
    variants: [
        { _id: "v1", pricing: [{ currency: "USD", salePrice: 12.99 }] },
        { _id: "v2", pricing: [{ currency: "USD", salePrice: 45.00 }] } 
    ],
    isNew: false
  },
];

// data.ts

export interface Review {
    id: number;
    name: string;
    role: string;
    img: string;       // User Avatar
    thumbnail: string; // Video Cover Image
    video: string;     // The actual video URL
    text: string;
}

export const REVIEWS: Review[] = [
    {
        id: 1,
        name: "Rohit Goel",
        role: "Parent",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        text: "I didn't know where to start so I got on a call with the team and they helped me understand this world better.",
    },
    {
        id: 2,
        name: "Ankur Bansal",
        role: "Parent",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        text: "The team is just not selling a product, they are creating minds. It's a holistic approach to learning.",
    },
    {
        id: 3,
        name: "Priya Sharma",
        role: "Educator",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        text: "Integrating these robotics kits into our curriculum has transformed how our students engage with physics.",
    },
    {
        id: 4,
        name: "Aarav Patel",
        role: "Student",
        img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1535378437327-1e54580665ce?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        text: "I built my first autonomous line-following bot yesterday! It felt like magic when it actually worked.",
    },
    {
        id: 5,
        name: "Meera Reddy",
        role: "Parent",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        text: "My daughter used to be afraid of coding. Now she's writing Python scripts to control her drone. Amazing progress.",
    },
    {
        id: 6,
        name: "Vikram Singh",
        role: "Mentor",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        text: "Hands-on learning is the only way to teach engineering. These kits are durable enough for classroom abuse.",
    },
    {
        id: 7,
        name: "Ishaan Kumar",
        role: "Student",
        img: "https://images.unsplash.com/photo-1485206412256-701b8b4878b6?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        text: "The drone flying workshop was the best weekend ever. I learned about aerodynamics and stability.",
    },
    {
        id: 8,
        name: "Neha Bindal",
        role: "Parent",
        img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        text: "My son has grown with this platform. He has become more confident and innovative in his approach to problems.",
    },
    {
        id: 9,
        name: "Sanjay Gupta",
        role: "Principal",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        text: "We set up an innovation lab last year. Seeing students stay back after school to finish robots is the best reward.",
    },
    {
        id: 10,
        name: "Riya Desai",
        role: "Innovator",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        text: "Winning the regional robotics competition gave me the confidence to pursue engineering in college.",
    }
];

// lib/CourseData.ts

export interface CourseProps {
    id: string | number;
    title: string;
    img: string;
    age: string;
    description: string;
    level?: string;
    duration?: string;
    enrolled?: string;
}

export const STEM_COURSES: CourseProps[] = [
    {
        id: "MD-01",
        title: "Autonomous Robotics",
        img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=600",
        age: "8-12",
        description: "Master sensors, logic gates, and motor control by building bots that navigate independently.",
        level: "Advanced",
        duration: "24 Sessions",
        enrolled: "1.5k+"
    },
    {
        id: "MD-02",
        title: "Python for Creators",
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600",
        age: "10-15",
        description: "Move beyond blocks to real-world syntax. Build apps, games, and automation scripts.",
        level: "Intermediate",
        duration: "18 Sessions",
        enrolled: "2.1k+"
    },
    {
        id: "MD-03",
        title: "Space Tech & Satellites",
        img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600",
        age: "12+",
        description: "Explore orbital mechanics and data transmission through satellite simulation kits.",
        level: "Expert",
        duration: "30 Sessions",
        enrolled: "800+"
    },
    {
        id: "MD-04",
        title: "AI & Machine Learning",
        img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600",
        age: "11-14",
        description: "Teach computers to recognize images and patterns using neural network basics.",
        level: "Intermediate",
        duration: "20 Sessions",
        enrolled: "1.2k+"
    },
    // --- EXTRA 5 MEMBERS ---
    {
        id: "MD-05",
        title: "Drone Engineering",
        img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600",
        age: "12-16",
        description: "Understand aerodynamics and flight controllers while assembling and coding custom quadcopters.",
        level: "Advanced",
        duration: "22 Sessions",
        enrolled: "950+"
    },
    {
        id: "MD-06",
        title: "Internet of Things (IoT)",
        img: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=600",
        age: "10-14",
        description: "Connect the physical world to the cloud. Build smart home devices and automated plant waterers.",
        level: "Intermediate",
        duration: "15 Sessions",
        enrolled: "1.8k+"
    },
    {
        id: "MD-07",
        title: "Game Dev with Unity",
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
        age: "13-17",
        description: "Architect 3D environments and script character physics using C# and the Unity Engine.",
        level: "Expert",
        duration: "40 Sessions",
        enrolled: "2.5k+"
    },
    {
        id: "MD-08",
        title: "Renewable Energy Kits",
        img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600",
        age: "8-11",
        description: "Harness the sun and wind. Build solar-powered vehicles and learn about sustainable engineering.",
        level: "Beginner",
        duration: "12 Sessions",
        enrolled: "3.2k+"
    },
    {
        id: "MD-09",
        title: "Cyber Security Lab",
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600",
        age: "14+",
        description: "Learn ethical hacking, data encryption, and how to defend networks against digital threats.",
        level: "Advanced",
        duration: "25 Sessions",
        enrolled: "700+"
    }
];

export const TESTIMONIALS = [
  {
    quote: "I didn't know where to start with robotics for my son. Now Aryan is building his own bots!",
    name: "Rohit Goel",
    designation: "Parent of Aryan (Age 10)",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-a-young-boy-building-a-robot-41221-large.mp4"
  },
  {
    quote: "The curriculum is so well structured that my daughter learns something new every single day.",
    name: "Ankur Bansal",
    designation: "Parent of Riya (Age 12)",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-girl-studying-with-a-laptop-and-writing-in-a-notebook-42702-large.mp4"
  },
  {
    quote: "My son has grown significantly. He's more confident in his logic and problem-solving skills.",
    name: "Neha Bindal",
    designation: "Parent of Vihaan (Age 9)",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-little-boy-working-on-a-laptop-42805-large.mp4"
  },
  {
    quote: "The kit quality is exceptional. My daughter spent hours building and understanding the sensors.",
    name: "Vikram Sethi",
    designation: "Parent of Sana (Age 11)",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-working-on-a-motherboard-42749-large.mp4"
  },
  {
    quote: "Avishkaar's competitions gave my son a platform to showcase his talent globally.",
    name: "Priya Sharma",
    designation: "Parent of Ishaan (Age 13)",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-kids-playing-with-a-robot-41219-large.mp4"
  },
  {
    quote: "The online mentors are very patient. They explain complex coding concepts so simply.",
    name: "Sanjay Gupta",
    designation: "Parent of Meher (Age 8)",
    src: "https://images.unsplash.com/photo-1540560086597-1904e84ca4ad?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-child-learning-on-a-digital-tablet-42801-large.mp4"
  },
  {
    quote: "Seeing my child build a smart home system at age 12 was a proud moment for our family.",
    name: "Karan Malhotra",
    designation: "Parent of Arjun (Age 12)",
    src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-boy-conducting-a-science-experiment-at-home-42813-large.mp4"
  },
  {
    quote: "The transition from block-based coding to Python was handled so smoothly.",
    name: "Aditi Rao",
    designation: "Parent of Kavya (Age 14)",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    quote: "Best investment for my kids' future. They are learning logic, creativity, and persistence.",
    name: "Rajesh Varma",
    designation: "Parent of Twin Boys (Age 10)",
    src: "https://images.unsplash.com/photo-1480427461900-e1902f1039c2?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-children-looking-at-a-screen-while-coding-41223-large.mp4"
  },
  {
    quote: "We love how the projects relate to real-world problems. It makes learning relevant.",
    name: "Simran Kaur",
    designation: "Parent of Gurnoor (Age 9)",
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800",
    video: "https://assets.mixkit.co/videos/preview/mixkit-teenager-studying-on-his-laptop-at-home-42709-large.mp4"
  }
];
// data.ts
export const stemMedia = [
  {
    id: 1,
    type: "video",
    // Modern robotics lab / hardware assembly
    url: "https://cdn.pixabay.com/video/2021/04/20/71746-541575825_tiny.mp4", 
  },
  {
    id: 2,
    type: "image",
    // Coding interface / software development
    url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2062&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "video",
    // Professional mentorship / online teaching
    url: "https://cdn.pixabay.com/video/2020/07/07/43977-437500331_tiny.mp4",
  },
  {
    id: 4,
    type: "image",
    // Digital library / online learning workspace
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
  },
  {
    id: 5,
    type: "video",
    // Competition / teamwork / high-energy robotics league
    url: "https://cdn.pixabay.com/video/2016/03/17/2436-158399589_tiny.mp4",
  },
  {
    id: 6,
    type: "image",
    // Success / Certificate / STEM Achievement
    url: "https://images.unsplash.com/photo-1523240715630-9918c1381942?q=80&w=2070&auto=format&fit=crop",
  }
];

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export const PARENT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "The transformation in Kabir's logical thinking is incredible. He doesn't just play games anymore; he explains the mechanics behind them. Avishkaar turned his screen time into 'creation time'.",
    name: "Rohit Goel",
    designation: "Parent of Kabir (Age 10)",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    quote: "Finding a curriculum that balances fun with deep technical learning is rare. My daughter's confidence in Python and Robotics has soared. The mentorship here is top-notch!",
    name: "Ankur Bansal",
    designation: "Parent of Riya (Age 12)",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    quote: "Avishkaar isn't just about kits; it's about a mindset. Vihaan has learned to embrace failure as a step toward fixing his code. That resilience is a life skill I'm grateful for.",
    name: "Neha Bindal",
    designation: "Parent of Vihaan (Age 9)",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  {
    quote: "The personalized attention during the live sessions made all the difference. Isha went from being intimidated by hardware to building her own smart home prototype in weeks.",
    name: "Dr. Smita Rao",
    designation: "Parent of Isha (Age 14)",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  }
];

// lib/Data.ts

export const INDIAN_STATES_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
};

export const SUBJECTS: string[] = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Robotics",
  "Artificial Intelligence",
  "Coding (Python/JS)",
  "Vedic Maths",
  "Environmental Science",
  "Astronomy",
  "Statistics"
];

export const QUALIFICATIONS: string[] = [
  "Bachelors (B.E/B.Tech/B.Sc)",
  "Masters (M.E/M.Tech/M.Sc)",
  "PhD",
  "Diploma",
  "Undergraduate Student",
  "Other"
];

export const GRADE_LEVELS: string[] = [
  "Primary (Class 1-5)",
  "Middle School (Class 6-8)",
  "High School (Class 9-10)",
  "Senior Secondary (Class 11-12)",
  "Undergraduate",
  "Competitive Exams (IIT-JEE/NEET)"
];

export const EXPERIENCE_LEVELS: string[] = [
  "Fresher (0 years)",
  "1-2 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years"
];