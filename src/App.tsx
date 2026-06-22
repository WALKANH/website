/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Exporter from './components/Exporter';

import {
  servicesData,
  trustPoints,
  campaignsData,
  stepsData,
  testimonialsData,
  pricingPlans,
  faqData
} from './data';

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState('');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // account for sticky navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    scrollToSection('contact');
  };

  return (
    <div className="bg-[#0b0b0b] text-white/90 min-h-screen selection:bg-[#E8401C] selection:text-white font-sans overflow-x-hidden antialiased">
      
      {/* 1. Sticky Navigation Bar */}
      <Navbar onScrollToContact={() => scrollToSection('contact')} />

      {/* 2. Hero Section */}
      <Hero
        onScrollToContact={() => scrollToSection('contact')}
        onScrollToPortfolio={() => scrollToSection('portfolio')}
      />

      {/* 3. Services Directory Section */}
      <Services
        services={servicesData}
        onScrollToContact={() => scrollToSection('contact')}
      />

      {/* 4. Why Us Badge & Metrics Grid */}
      <WhyUs points={trustPoints} />

      {/* 5. Filterable Gallery Portfolio */}
      <Portfolio campaigns={campaignsData} />

      {/* 6. Horizonal Process Roadmap */}
      <Process steps={stepsData} />

      {/* 7. Auto-rotating Feedback Carousel */}
      <Testimonials testimonials={testimonialsData} />

      {/* 8. Comparative Pricing Options */}
      <Pricing
        plans={pricingPlans}
        onSelectPlan={handleSelectPlan}
      />

      {/* 9. Collapsible FAQ Accordion */}
      <FAQ faqs={faqData} />

      {/* 10. Planning Contact Questionaire Form */}
      <ContactForm preselectedPlan={selectedPlan} />

      {/* 11. Custom Interactive Map Info Footer */}
      <Footer />

      {/* Standalone Single File Downloader/Exporter Badge */}
      <Exporter />

    </div>
  );
}

