import { Faq } from "./_landing/faq";
import { FinalCta } from "./_landing/final-cta";
import { Footer } from "./_landing/footer";
import { Gallery } from "./_landing/gallery";
import { Hero } from "./_landing/hero";
import { HowItWorks } from "./_landing/how-it-works";
import { Metrics } from "./_landing/metrics";
import { Nav } from "./_landing/nav";
import { Team } from "./_landing/team";
import { ToastRegion } from "./_landing/toast-region";

export default function Home() {
  return (
    <ToastRegion>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Metrics />
        <HowItWorks />
        <Gallery />
        <Team />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </ToastRegion>
  );
}
