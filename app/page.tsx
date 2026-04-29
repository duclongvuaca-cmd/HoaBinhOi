import { Hero } from "@/components/hero";
import { ItineraryPreview } from "@/components/itinerary-preview";
import { POIGrid } from "@/components/poi-grid";
import { LocalSecrets } from "@/components/local-secrets";
import { AiSuggest } from "@/components/ai-suggest";
import { EmailSignup } from "@/components/email-signup";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ItineraryPreview />
      <POIGrid />
      <LocalSecrets />
      <AiSuggest />
      <EmailSignup />
      <Footer />
    </main>
  );
}
