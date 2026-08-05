import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import TablesFacilitiesSection from '@/sections/TablesFacilitiesSection';
import PricingSection from '@/sections/PricingSection';
import EventsBookingSection from '@/sections/EventsBookingSection';
import ContactSection from '@/sections/ContactSection';

export default function Home() {
  return (
    <main className="relative w-full bg-primary-black text-primary-white overflow-hidden">
      {/* 
        The canvas will typically sit outside the main scroll flow, 
        but we assemble the DOM sections here. 
      */}
      <HeroSection />
      <AboutSection />
      <TablesFacilitiesSection />
      <PricingSection />
      <EventsBookingSection />
      <ContactSection />
    </main>
  );
}
