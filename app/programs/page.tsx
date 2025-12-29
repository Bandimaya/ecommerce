"use client"
import { ArrowRight, Calendar, Users, BookOpen, Trophy, Sparkles, Target, Zap, Shield, TrendingUp, Clock, Star, CheckCircle, Cpu, Rocket, Palette, Database, Wifi, Globe, Code, Bot, Brain, Satellite, Atom, Microscope } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const iconMap: any = {
    Users, BookOpen, Trophy, Calendar, Target, Zap, Shield, TrendingUp,
    Cpu, Rocket, Palette, Database, Wifi, Globe, Code, Bot, Brain,
    Satellite, Atom, Microscope
};

const STEM_IMAGES = [
    "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop", // Robotics
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop", // 3D Printing
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop", // AI Lab
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop", // Electronics
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&auto=format&fit=crop" // Drone
];

// Real-world STEM programs with detailed descriptions
const mainPrograms = [
    {
        _id: "1",
        title: "Robotics Engineering & Automation",
        subtitle: "FIRST Robotics Competition Track",
        description: "Design, build, and program competitive robots using industry-standard tools like VEX Robotics and Arduino. Students participate in regional competitions while learning mechanical engineering, electrical systems, and autonomous programming.",
        features: [
            "VEX Robotics Competition",
            "Arduino Programming",
            "PID Control Systems",
            "Computer Vision Integration",
            "3D CAD Design (SolidWorks)",
            "Team Collaboration & Project Management"
        ],
        durationWeeks: 16,
        ageGroup: "Ages 14-18",
        prerequisites: "Basic algebra understanding",
        icon: "Cpu",
        image: { url: STEM_IMAGES[0] },
        certification: "FIRST Robotics Certification",
        equipment: ["VEX Robotics Kit", "3D Printer Access", "Laptops with CAD Software"],
        learningOutcomes: [
            "Design functional robotic systems",
            "Program autonomous behaviors",
            "Troubleshoot electrical circuits",
            "Collaborate in engineering teams"
        ]
    },
    {
        _id: "2",
        title: "3D Design & Digital Fabrication",
        subtitle: "MakerSpace Certification Program",
        description: "Master professional 3D design tools and fabrication techniques. From concept sketches to functional prototypes, students learn CAD modeling, 3D printing, laser cutting, and material science to bring their ideas to life.",
        features: [
            "Fusion 360 Professional Certification",
            "CAD to CAM Workflow",
            "Material Properties & Selection",
            "Prototype Testing & Iteration",
            "Portfolio Development",
            "Industry Guest Lectures"
        ],
        durationWeeks: 12,
        ageGroup: "Ages 13-17",
        prerequisites: "None required",
        icon: "Rocket",
        image: { url: STEM_IMAGES[1] },
        certification: "Autodesk Fusion 360 Certified User",
        equipment: ["Ultimaker S5 3D Printers", "Glowforge Laser Cutter", "Electronics Lab"],
        learningOutcomes: [
            "Create manufacturable 3D models",
            "Operate digital fabrication tools",
            "Understand material constraints",
            "Document design processes"
        ]
    },
    {
        _id: "3",
        title: "Artificial Intelligence & Machine Learning",
        subtitle: "Google AI Education Partner Program",
        description: "Dive into the fundamentals of AI with hands-on projects in computer vision, natural language processing, and predictive modeling. Students build real AI applications using Python and TensorFlow while exploring ethical AI considerations.",
        features: [
            "Python Programming for AI",
            "Neural Networks & Deep Learning",
            "Computer Vision with OpenCV",
            "Natural Language Processing",
            "Ethical AI & Bias Detection",
            "Real-world Dataset Projects"
        ],
        durationWeeks: 14,
        ageGroup: "Ages 15-19",
        prerequisites: "Algebra II or equivalent",
        icon: "Brain",
        image: { url: STEM_IMAGES[2] },
        certification: "Google AI Fundamentals Certificate",
        equipment: ["NVIDIA GPU Workstations", "Robotics Kits with Sensors", "Cloud Computing Credits"],
        learningOutcomes: [
            "Train machine learning models",
            "Implement computer vision algorithms",
            "Analyze AI ethics and bias",
            "Deploy AI solutions"
        ]
    }
];

const additionalPrograms = [
    {
        _id: "a1",
        title: "Cybersecurity & Ethical Hacking",
        description: "Learn to defend networks and systems through hands-on labs in cryptography, network security, and vulnerability assessment. Students earn industry-recognized badges and compete in national competitions.",
        duration: "8 weeks",
        level: "Intermediate",
        icon: "Shield",
        skills: ["Network Security", "Cryptography", "Penetration Testing", "Digital Forensics"],
        certifications: ["CompTIA Security+ Prep", "Cybersecurity Fundamentals Badge"]
    },
    {
        _id: "a2",
        title: "Drone Technology & Aerodynamics",
        description: "Design, build, and program autonomous drones for mapping, photography, and delivery applications. Includes FAA Part 107 test preparation and commercial drone operation training.",
        duration: "10 weeks",
        level: "Beginner-Intermediate",
        icon: "Satellite",
        skills: ["Aerodynamics", "Flight Control Programming", "Aerial Photography", "Safety Protocols"],
        certifications: ["FAA Part 107 Test Prep", "Drone Pilot Certification"]
    },
    {
        _id: "a3",
        title: "Internet of Things (IoT) Development",
        description: "Create smart devices and connected systems using Raspberry Pi, sensors, and cloud platforms. Students build home automation systems, environmental monitors, and wearable technology.",
        duration: "12 weeks",
        level: "Intermediate",
        icon: "Wifi",
        skills: ["Raspberry Pi Programming", "Sensor Integration", "Cloud Connectivity", "Data Analysis"],
        certifications: ["IoT Developer Certificate", "AWS IoT Badge"]
    },
    {
        _id: "a4",
        title: "Quantum Computing Fundamentals",
        description: "Introduction to quantum mechanics and quantum computing using IBM Qiskit. Students learn quantum algorithms and run experiments on real quantum computers through the cloud.",
        duration: "6 weeks",
        level: "Advanced",
        icon: "Atom",
        skills: ["Quantum Algorithms", "Qiskit Programming", "Quantum Circuit Design", "Quantum Simulation"],
        certifications: ["IBM Qiskit Developer Certificate"]
    },
    {
        _id: "a5",
        title: "Biotechnology & Genetic Engineering",
        description: "Explore CRISPR technology, DNA sequencing, and synthetic biology through hands-on lab experiments. Students work with micropipettes, gel electrophoresis, and bacterial transformation.",
        duration: "14 weeks",
        level: "Intermediate-Advanced",
        icon: "Microscope",
        skills: ["DNA Extraction", "PCR Techniques", "Gel Electrophoresis", "Bioinformatics"],
        certifications: ["Biotech Lab Safety Certification", "CRISPR Basics Certificate"]
    },
    {
        _id: "a6",
        title: "Game Development with Unity",
        description: "Create 3D games and interactive experiences using Unity game engine and C# programming. Includes VR/AR development and publishing to app stores.",
        duration: "10 weeks",
        level: "Beginner",
        icon: "Code",
        skills: ["C# Programming", "3D Modeling", "Physics Simulation", "UI/UX Design"],
        certifications: ["Unity Certified User", "Game Developer Portfolio"]
    },
    {
        _id: "a7",
        title: "Renewable Energy Systems",
        description: "Design and build solar, wind, and hydroelectric power systems. Students create working models and analyze energy efficiency in real-world scenarios.",
        duration: "8 weeks",
        level: "Beginner-Intermediate",
        icon: "Zap",
        skills: ["Circuit Design", "Energy Measurement", "System Efficiency", "Sustainable Design"],
        certifications: ["Renewable Energy Basics Certificate"]
    },
    {
        _id: "a8",
        title: "Space Exploration & Satellite Technology",
        description: "Learn orbital mechanics, satellite communication, and space mission planning. Includes building weather balloon payloads and analyzing satellite data.",
        duration: "12 weeks",
        level: "Intermediate",
        icon: "Globe",
        skills: ["Orbital Calculations", "Telemetry Analysis", "Mission Planning", "Data Visualization"],
        certifications: ["Space Mission Fundamentals", "Satellite Operations Certificate"]
    }
];

// Real-world success stories
const successStories = [
    {
        name: "Sophia Chen",
        age: 16,
        program: "Robotics Engineering",
        achievement: "Led team to FIRST Robotics World Championship",
        quote: "The program gave me the confidence to pursue engineering at MIT.",
        image: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?w=400&auto=format&fit=crop"
    },
    {
        name: "Marcus Johnson",
        age: 17,
        program: "AI & Machine Learning",
        achievement: "Developed AI tool for early autism detection",
        quote: "I never thought I could build something that helps real people.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop"
    },
    {
        name: "Aisha Patel",
        age: 15,
        program: "3D Design & Fabrication",
        achievement: "Designed affordable prosthetic hand",
        quote: "Seeing my design help someone walk again was life-changing.",
        image: "https://images.unsplash.com/photo-1494790108755-2616b786d4d4?w=400&auto=format&fit=crop"
    }
];

const Programs = () => {
    const { t } = useI18n();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Main Programs */}
            <section className="py-20 md:py-28 bg-card/50">
                <div className="container px-4 md:px-6 mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex justify-center items-center gap-3 mb-4"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: isMobile ? '20px' : '40px' }}
                                // @ts-ignore
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="h-[2px] bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                            <span className="text-xs md:text-lg font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Flagship Program
                            </span>
                            {/* @ts-ignore */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: isMobile ? '20px' : '40px' }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                            />
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Immersive STEM Pathways
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive programs with industry certification and competition opportunities
                        </motion.p>
                    </motion.div>

                    <div className="space-y-24">
                        {mainPrograms.map((program: any, index) => {
                            const Icon = iconMap[program.icon];
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={program._id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={isEven ? slideInLeft : slideInRight}
                                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}
                                >
                                    {/* Image Section */}
                                    <div className="w-full lg:w-1/2">
                                        <div className="relative group">
                                            <motion.div
                                                className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                                                whileHover={{ scale: 1.02 }}
                                            />
                                            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl">
                                                <img
                                                    src={program.image?.url || STEM_IMAGES[index % STEM_IMAGES.length]}
                                                    alt={program.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                                        <Clock className="w-4 h-4 text-white" />
                                                        <span className="text-sm font-medium text-white">{program.durationWeeks || 12} weeks</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                                                        <span className="text-sm font-medium text-white">{program.ageGroup || "Ages 13-18"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="w-full lg:w-1/2">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="text-sm font-semibold text-primary block">{program.subtitle}</span>
                                                        <span className="text-xs text-muted-foreground">{program.certification || "Industry Certification Available"}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                                                    {program.title}
                                                </h3>

                                                <p className="text-muted-foreground leading-relaxed mb-6">
                                                    {program.description}
                                                </p>

                                                {/* Program Details */}
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-muted-foreground">Duration</h4>
                                                        <p className="font-medium">{program.durationWeeks || 12} weeks</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-muted-foreground">Age Group</h4>
                                                        <p className="font-medium">{program.ageGroup || "Ages 13-18"}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-muted-foreground">Prerequisites</h4>
                                                        <p className="font-medium">{program.prerequisites || "None required"}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-muted-foreground">Equipment Provided</h4>
                                                        <p className="font-medium">Full lab access</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <h4 className="font-semibold text-lg">Key Learning Outcomes</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {program.learningOutcomes?.map((outcome: string, idx: number) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            viewport={{ once: true }}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary/50 transition-colors"
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                                            <span className="text-sm font-medium">{outcome}</span>
                                                        </motion.div>
                                                    )) || program.features?.slice(0, 4).map((feature: any, idx: number) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            viewport={{ once: true }}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-secondary/50 transition-colors"
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                                            <span className="text-sm font-medium">{feature}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                <Button size="lg" className="rounded-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all">
                                                    Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
                                                </Button>
                                                <Button variant="outline" size="lg" className="rounded-lg px-8 py-6 font-semibold border-2">
                                                    Download Syllabus
                                                </Button>
                                                <Button variant="ghost" size="lg" className="text-muted-foreground">
                                                    View Competition Schedule →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-12"
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                            Student Success Stories
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            See how our students are making an impact with their STEM skills
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {successStories.map((student, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleIn}
                                transition={{ delay: index * 0.2 }}
                                className="bg-card rounded-2xl p-8 border hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <img
                                        src={student.image}
                                        alt={student.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                                    />
                                    <div>
                                        <h3 className="font-bold text-xl">{student.name}, {student.age}</h3>
                                        <p className="text-primary font-medium">{student.program}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-secondary/30 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Achievement:</h4>
                                        <p className="text-sm">{student.achievement}</p>
                                    </div>

                                    <blockquote className="italic text-muted-foreground border-l-4 border-primary/30 pl-4 py-2">
                                        "{student.quote}"
                                    </blockquote>

                                    <div className="pt-4 border-t border-border">
                                        <Button variant="ghost" className="w-full">
                                            Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Programs */}
            <section className="py-20 md:py-28">
                <div className="container px-4 md:px-6 mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex justify-center items-center gap-3 mb-4"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: isMobile ? '20px' : '40px' }}
                                // @ts-ignore
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="h-[2px] bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                            <span className="text-xs md:text-lg font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Specialized Track
                            </span>
                            {/* @ts-ignore */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: isMobile ? '20px' : '40px' }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                            />
                        </motion.div>
                        <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Focused Skill Development
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Master specific technologies and earn industry-recognized certifications
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {additionalPrograms.map((program: any, index) => {
                            const Icon = iconMap[program.icon];

                            return (
                                <motion.div
                                    key={program._id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={scaleIn}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="group"
                                >
                                    <div className="bg-card rounded-xl border p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-primary/30 flex flex-col">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            {Icon && <Icon className="w-7 h-7 text-primary" />}
                                        </div>

                                        <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                                            {program.title}
                                        </h3>

                                        <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                                            {program.description}
                                        </p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Duration:</span>
                                                <span className="font-medium">{program.duration}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Level:</span>
                                                <span className="font-medium">{program.level}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {program.skills?.slice(0, 3).map((skill: string, idx: number) => (
                                                <span key={idx} className="px-3 py-1 text-xs bg-secondary rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-border mt-auto">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-between px-0 hover:bg-transparent group-hover:text-primary"
                                            >
                                                <span className="font-medium">View Details</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div
                            variants={scaleIn}
                            className="bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 md:p-12 border shadow-2xl overflow-hidden relative"
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full translate-y-1/2 -translate-x-1/2" />
                            </div>

                            <div className="relative z-10 text-center">
                                <motion.div variants={fadeInUp}>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                        Ready to Start Your STEM Journey?
                                    </h2>

                                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                        Join 2,500+ students who have transformed their futures through our programs.
                                        Schedule a free trial class or speak with our program advisors.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                        <div className="bg-background/50 rounded-xl p-6">
                                            <h4 className="font-bold mb-2">Free Trial Class</h4>
                                            <p className="text-sm text-muted-foreground">Experience our teaching style</p>
                                        </div>
                                        <div className="bg-background/50 rounded-xl p-6">
                                            <h4 className="font-bold mb-2">1:1 Consultation</h4>
                                            <p className="text-sm text-muted-foreground">Personalized program guidance</p>
                                        </div>
                                        <div className="bg-background/50 rounded-xl p-6">
                                            <h4 className="font-bold mb-2">Financial Aid</h4>
                                            <p className="text-sm text-muted-foreground">Scholarships available</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={fadeInUp}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Button size="lg" className="rounded-lg px-10 py-7 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                                        Schedule Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-lg px-10 py-7 text-base font-semibold border-2">
                                        Download Course Catalog
                                    </Button>
                                    <Button variant="ghost" size="lg" className="rounded-lg px-10 py-7 text-base font-semibold">
                                        Contact Admissions
                                    </Button>
                                </motion.div>

                                <motion.div
                                    variants={fadeInUp}
                                    className="mt-10 pt-8 border-t border-border"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        Next cohort starts: January 15, 2024 • Limited spots available • Early bird discount until December 31
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Programs;