import { HeroSection } from '@/features/home/HeroSection';
import { FeaturedDestinations } from '@/features/home/FeaturedDestinations';
import { CategoryExplorer } from '@/features/home/CategoryExplorer';
import { NewsletterSection } from '@/features/home/NewsletterSection';

export function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedDestinations />
      <CategoryExplorer />
      <NewsletterSection />
    </div>
  );
}
