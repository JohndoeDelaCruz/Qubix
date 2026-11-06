import { BookOpen, Radio, Settings, Trophy, Wifi, WifiOff } from "lucide-react";
import { MotionToggle } from "../../animation";
import { AudioControls } from "../../audio/AudioControls";
import { Logo } from "../../components/Logo";
import { Pill } from "../../components/Pill";
import { Avatar } from "../../components/game/Avatar";
import { PhysicsBackdrop } from "../../components/PhysicsBackdrop";

export function WorkspaceHeader({
  tab,
  onNavigate,
  quizCount,
  roomActive,
  connected,
  quietBackground = false,
}: {
  tab: string;
  onNavigate: (tab: string) => void;
  quizCount: number;
  roomActive: boolean;
  connected: boolean;
  quietBackground?: boolean;
}) {
  const pages = [
    { id: "library", icon: BookOpen, label: "Quiz library" },
    { id: "room", icon: Radio, label: "Live room" },
    { id: "results", icon: Trophy, label: "Results" },
    { id: "setup", icon: Settings, label: "Setup & connection" },
  ];
  return (
    <header className="topbar workspace-header">
      <PhysicsBackdrop placement="header" quiet={quietBackground} />
      <div className="workspace-header-top">
        <Logo />
        <div className="top-right">
          <AudioControls />
          <MotionToggle />
          <Pill kind={connected ? "green" : "red"}>
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
            {connected ? "Local host ready" : "Reconnecting"}
          </Pill>
          <Avatar avatar="friendly-robot" size={32} />
        </div>
      </div>
      <nav className="workspace-nav" aria-label="Teacher workspace">
        {pages.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "active" : ""}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === "room" && roomActive && <span className="live-dot" />}
            {id === "library" && <small>{quizCount}</small>}
          </button>
        ))}
      </nav>
    </header>
  );
}
