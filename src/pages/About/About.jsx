import NeonGrid from "../../components/background/NeonGrid";
import AmbientGlows from "../../components/background/AmbientGlows";
import NoiseOverlay from "../../components/background/NoiseOverlay";
import AboutNav from "./components/AboutNav";
import AboutWorkstation from "./components/AboutWorkstation";
import DepartureCTA from "./components/DepartureCTA";

/** About page — Kuro remains as presentation assistant inside the workstation. */
export default function About() {
  return (
    <div className="relative min-h-screen">
      <NeonGrid />
      <AmbientGlows />
      <NoiseOverlay />

      <AboutNav />

      <main>
        <AboutWorkstation />
        <DepartureCTA />
      </main>
    </div>
  );
}
