import NoiseOverlay from "../../components/background/NoiseOverlay";
import AboutNav from "./components/AboutNav";
import AboutScrollOdyssey from "./components/AboutScrollOdyssey";
import AboutWorkstation from "./components/AboutWorkstation";
import DepartureCTA from "./components/DepartureCTA";

/**
 * About — long scroll odyssey → living terminal → departure.
 * Header Kuro perch lives inside AboutNav.
 */
export default function About() {
  return (
    <div className="relative min-h-screen bg-void">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <NoiseOverlay />
      </div>

      <AboutNav />

      <main className="relative z-10">
        <AboutScrollOdyssey />
        <AboutWorkstation />
        <DepartureCTA />
      </main>
    </div>
  );
}
