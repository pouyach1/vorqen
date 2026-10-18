import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NeonGrid from "./components/background/NeonGrid";
import AmbientGlows from "./components/background/AmbientGlows";
import NoiseOverlay from "./components/background/NoiseOverlay";
import Hero from "./components/hero/Hero";

import TelegramBotsShowcase from "./components/sections/TelegramBotsShowcase";
import WebProjectsShowcase from "./components/sections/WebProjectsShowcase";
import TechStackMatrix from "./components/sections/TechStackMatrix";
import ExperienceTimeline from "./components/sections/ExperienceTimeline";

import CostEstimator from "./components/configurator/CostEstimator";
import ContactTerminal from "./components/sections/ContactTerminal";

import BotSimulatorModal from "./components/modals/BotSimulatorModal";
import ProjectDetailModal from "./components/modals/ProjectDetailModal";

/**
 * Conversion-focused homepage:
 * Hero → Projects → Capabilities → Contact path (bots/estimator/experience support).
 * Kuro remains in the Hero only on this page.
 */
export default function App() {
  return (
    <div className="relative min-h-screen">
      <NeonGrid />
      <AmbientGlows />
      <NoiseOverlay />

      <Navbar />

      <main>
        <Hero />
        <WebProjectsShowcase />
        <TelegramBotsShowcase />
        <TechStackMatrix />
        <CostEstimator />
        <ExperienceTimeline />
        <ContactTerminal />
      </main>

      <Footer />

      <BotSimulatorModal />
      <ProjectDetailModal />
    </div>
  );
}
