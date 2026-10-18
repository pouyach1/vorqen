import AboutKineticManifesto from "./chapters/AboutKineticManifesto";
import AboutStoryCorridor from "./chapters/AboutStoryCorridor";
import AboutControlledChaos from "./chapters/AboutControlledChaos";
import AboutTypeExplosion from "./chapters/AboutTypeExplosion";
import AboutStoryBridge from "./chapters/AboutStoryBridge";

/** Scroll-driven editorial chapters between Identity Hero and AboutWorkstation. */
export default function AboutLivingJourney() {
  return (
    <>
      <AboutKineticManifesto />
      <AboutStoryCorridor />
      <AboutControlledChaos />
      <AboutTypeExplosion />
      <AboutStoryBridge />
    </>
  );
}
