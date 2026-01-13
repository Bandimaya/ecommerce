'use client';
import React from 'react'
import HeroBanner from '../../components/courses/banner/HeroBanner'
import AchievementStats from '../../components/courses/microdegree/AchievementStats'
import CourseListSection from '../../components/courses/microdegree/CourseListSection'
import WhyChooseUsSection from '../../components/courses/microdegree/WhyChooseUsSection'
import ParentTestimonials from '../../components/courses/microdegree/ParentTestimonials'
import StudentSpotlights from '../../components/courses/microdegree/StudentSpotlights'
import FaqSection from '../../components/courses/microdegree/FaqSection'
import FilterSidebar from '@/components/courses/filters/FilterSidebar';
import AwardsSection from '../home/AwardsSection';
import BenefitsSection from '@/components/courses/microdegree/BenefitsSection';
import CertificationsSection from '@/components/courses/microdegree/CertificationsSection';
import CourseCard from '@/components/courses/microdegree/CourseCard';
import CourseBentoGrid from '@/components/courses/microdegree/BentoGrid';
import { FeatureShowcase } from '@/components/courses/microdegree/FeatureShowcase';

export default function Courses() {
  return (
    <div id="shop" className="microdegree-page">
      {/* <FilterSidebar /> */}
      
      {/* Main Content Area next to the sidebar */}
      <div> 
        <HeroBanner />
        <BenefitsSection />
        <CourseBentoGrid />
        {/* <CourseListSection /> */}
        {/* <WhyChooseUsSection /> */}
        <ParentTestimonials />
        <StudentSpotlights />
        <FeatureShowcase />
        <AwardsSection />
        <CertificationsSection />
        <FaqSection />
      </div>
    </div>
  );
}