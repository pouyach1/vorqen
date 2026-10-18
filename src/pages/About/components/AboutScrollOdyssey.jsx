import OdysseyIgnition from "../odyssey/OdysseyIgnition";
import OdysseyIdentity from "../odyssey/OdysseyIdentity";
import OdysseyTunnel from "../odyssey/OdysseyTunnel";
import OdysseyCorridor from "../odyssey/OdysseyCorridor";
import OdysseyFragments from "../odyssey/OdysseyFragments";
import OdysseyScale from "../odyssey/OdysseyScale";
import OdysseyTimeline from "../odyssey/OdysseyTimeline";
import OdysseyBridge from "../odyssey/OdysseyBridge";

/** Long scroll odyssey before Living Terminal — cyber tunnel + cinematic editorial. */
export default function AboutScrollOdyssey() {
  return (
    <div id="about-scroll-odyssey" className="relative bg-void">
      <OdysseyIgnition />
      <OdysseyIdentity />
      <OdysseyTunnel />
      <OdysseyCorridor />
      <OdysseyFragments />
      <OdysseyScale />
      <OdysseyTimeline />
      <OdysseyBridge />
    </div>
  );
}
