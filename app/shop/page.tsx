"use client"
import Shop from "@/components/shop/Shop";
import HeroSection from "../home/HeroSection";
import CategoryShowcase from "@/components/shop/CategoryShowcase";
import StemParkShowcase from "@/components/shop/StemParkShowcase";
import SantaShop from "@/components/shop/SantaShop";
import StemParkTestimonials from "@/components/shop/Testimonials";

const Index = () => {

    return (
        <div id="shop" className="microdegree-page">
            <HeroSection />
            <div>
                <CategoryShowcase />

                <StemParkShowcase />

                <SantaShop />

                <Shop />

                <StemParkTestimonials />
            </div>
        </div>
    );
};



export default Index;