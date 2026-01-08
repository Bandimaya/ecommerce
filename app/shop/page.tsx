"use client"
import Shop from "@/components/shop/Shop";
import HeroSection from "../home/HeroSection";
import CategoryShowcase from "@/components/shop/CategoryShowcase";
import StemParkShowcase from "@/components/shop/StemParkShowcase";
import SantaShop from "@/components/shop/SantaShop";
import StemParkTestimonials from "@/components/shop/Testimonials";
import { motion } from "framer-motion";

const Index = () => {

    return (
        <div id="shop" className="microdegree-page">

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <HeroSection />
            </motion.div>

            <div>
                <CategoryShowcase />

                <Shop />

                <StemParkShowcase />

                <SantaShop />

                <StemParkTestimonials />
            </div>
        </div>
    );
};

export default Index;