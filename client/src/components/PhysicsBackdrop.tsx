import { memo, type CSSProperties } from "react";
import { Atom, Magnet, Zap } from "lucide-react";

type Placement = "page" | "header" | "sidebar";
type Scene = "library" | "lobby" | "question" | "ranking" | "finished" | "results" | "setup" | "join" | "editor";

function Gyroscope() {
  return <div className="pb-gyro"><div className="pb-gyro-core"><span /><span /><span /><b /></div></div>;
}
function Spring() {
  return <div className="pb-spring"><span className="pb-coil">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--turn": i } as CSSProperties} />)}</span></div>;
}
function Circuit() {
  return <div className="pb-circuit"><i /><i /><span /><span /><span /><b /></div>;
}

/** Decorative only: no hit targets, game timers, network calls, or per-frame JS. */
export const PhysicsBackdrop = memo(function PhysicsBackdrop({
  placement = "page", scene = "library", quiet = false,
}: { placement?: Placement; scene?: Scene; quiet?: boolean }) {
  const full = placement === "page";
  const header = placement === "header";
  const particles = full ? 16 : header ? 8 : 4;
  return (
    <div className={`physics-backdrop pb-${placement}${quiet ? " pb-quiet" : ""}`} data-scene={scene} aria-hidden="true">
      <div className="pb-orbits"><span /><span /><span /><b /></div>
      {full && <div className="pb-orbits pb-orbits-lower"><span /><span /><span /></div>}
      <div className="pb-dial" />
      <div className="pb-particles">{Array.from({ length: particles }, (_, i) => <span key={i} style={{
        "--px": `${(i * 37 + 8) % 100}%`, "--py": `${(i * 23 + 9) % 100}%`,
        "--ps": `${2 + i % 3}px`, "--po": .3 + i % 4 * .13, "--pd": `${-(i % 7)}s`,
      } as CSSProperties} />)}</div>
      {(full || header) && <>
        <div className="pb-pendulum"><span /></div>
        <Gyroscope />
        <div className="pb-magnet"><Magnet /></div>
        <div className="pb-atom"><Atom /></div>
        <Circuit />
      </>}
      {!header && <Spring />}
      {full && <>
        <div className="pb-pulley"><span className="pb-pulley-wheel" /><span className="pb-pulley-weight" /><span className="pb-pulley-weight" /></div>
        <div className="pb-lever"><span /></div>
        <div className="pb-collision"><span /><span /></div>
        <div className="pb-energy"><Zap /><span /><span /></div>
        <div className="pb-track"><span /></div>
        <div className="pb-dominos">{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ "--domino": i } as CSSProperties} />)}</div>
        <div className="pb-balance"><span className="pb-balance-beam"><span /><span /></span></div>
      </>}
    </div>
  );
});

export function PhysicsMark({ kind = "atom" }: { kind?: "atom" | "magnet" | "energy" }) {
  const Icon = kind === "magnet" ? Magnet : kind === "energy" ? Zap : Atom;
  return <span className="physics-surface-mark" aria-hidden="true"><Icon /></span>;
}
