import { Atom, Magnet, Zap } from "lucide-react";
import "./PhysicsArt.css";

/** Decorative artwork only; game content stays subject-independent. */
export function PhysicsArt() {
  return (
    <div className="physics-art" aria-hidden="true">
      <span className="physics-orbit" />
      <span className="physics-orbit physics-orbit-outer" />
      <span className="physics-particle particle-one" />
      <span className="physics-particle particle-two" />
      <span className="physics-particle particle-three" />
      <div className="physics-element physics-pendulum">
        <span className="pendulum-support" />
        <span className="pendulum-arm"><span className="pendulum-bob" /></span>
      </div>
      <div className="physics-element physics-magnet"><Magnet /></div>
      <div className="physics-element physics-atom"><Atom /></div>
      <div className="physics-element physics-bolt"><Zap /></div>
    </div>
  );
}
