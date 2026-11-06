import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  X,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import { useSwitchMotion } from "../../components/useSwitchMotion";
import { useAudio, useHostAudio } from "../../audio/AudioProvider";
import { hostToken } from "../../lib";
import { QuizEditor } from "../quizzes/QuizEditor";
import { DeleteQuizDialog } from "./DeleteQuizDialog";
import { LaunchDialog } from "./LaunchDialog";
import { LiveRoomPage } from "./LiveRoomPage";
import { QuizLibrary } from "./QuizLibrary";
import { ResultsPage } from "./ResultsPage";
import { Setup } from "./SetupPage";
import { useHostWorkspace } from "./useHostWorkspace";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { PhysicsBackdrop } from "../../components/PhysicsBackdrop";

export function Host() {
  const {
    joinNotices,
    dismissJoinNotice,
    tab,
    setTab,
    quizzes,
    results,
    room,
    network,
    connected,
    error,
    setError,
    notice,
    setNotice,
    editor,
    setEditor,
    launch,
    setLaunch,
    busy,
    deleteQuiz,
    setDeleteQuiz,
    mode,
    setMode,
    teamGame,
    setTeamGame,
    teamNames,
    setTeamNames,
    refresh,
    act,
    newQuiz,
    saveQuiz,
    openRoom,
    removeQuiz,
  } = useHostWorkspace();
  const pageRef = useSwitchMotion(
    tab + (tab === "room" ? `:${room?.id ?? "empty"}` : ""),
  );
  const audio = useAudio();
  useHostAudio(room, tab, connected);
  function activateSound() {
    if (
      !audio.settings.muted &&
      audio.settings.volume > 0 &&
      (audio.snapshot.status === "locked" || audio.snapshot.status === "paused")
    ) {
      audio.unlock();
    }
  }
  if (!hostToken)
    return (
      <div className="access-screen">
        <Logo />
        <div className="card">
          <ShieldCheck size={36} />
          <h1>Teacher access</h1>
          <p>
            Open Qubix on the teacher’s laptop. If you started it from the
            terminal, use the private teacher link printed there.
          </p>
          <a className="btn primary" href="/join">
            I’m a student <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  const active = room && room.phase !== "finished";
  const roomScene = room?.phase === "lobby" ? "lobby" : room?.phase === "ranking" ? "ranking" : room?.phase === "finished" ? "finished" : "question";
  const quietBackground = tab === "room" && !!room && roomScene === "question";
  return (
    <div
      onClickCapture={activateSound}
      className={
        "host-shell" +
        (tab === "room" && room ? " is-playing phase-" + room.phase : "")
      }
    >
      <WorkspaceHeader
        tab={tab}
        onNavigate={setTab}
        quizCount={quizzes.length}
        roomActive={!!active}
        connected={connected}
        quietBackground={quietBackground}
      />
      <main className="main">
        <PhysicsBackdrop scene={tab === "room" ? roomScene : tab === "results" ? "results" : tab === "setup" ? "setup" : "library"} quiet={quietBackground} />
        <div className="content" ref={pageRef}>
          {error && (
            <div className="alert error" role="alert">
              {error}
              <button aria-label="Dismiss error" onClick={() => setError("")}>
                <X size={16} />
              </button>
            </div>
          )}
          {notice && (
            <div className="alert success" role="status">
              <CheckCircle2 size={18} />
              {notice}
            </div>
          )}
          {tab === "library" && (
            <QuizLibrary
              quizzes={quizzes}
              onCreate={newQuiz}
              onEdit={setEditor}
              onLaunch={(quiz) => {
                setLaunch(quiz);
                setMode("individual");
              }}
              onDelete={setDeleteQuiz}
              onSetup={() => setTab("setup")}
              onRefresh={refresh}
              onNotice={setNotice}
              onError={setError}
            />
          )}
          {tab === "room" && (
            <LiveRoomPage
              joinNotices={joinNotices}
              dismissJoinNotice={dismissJoinNotice}
              room={room}
              network={network}
              busy={busy}
              act={act}
              onBrowse={() => setTab("library")}
            />
          )}
          {tab === "results" && <ResultsPage results={results} />}
          {tab === "setup" && <Setup network={network} onRefresh={refresh} />}
        </div>
      </main>
      {editor && (
        <QuizEditor
          quiz={editor}
          onClose={() => setEditor(null)}
          onSave={saveQuiz}
          busy={busy}
          serverError={error}
        />
      )}
      {launch && (
        <LaunchDialog
          quiz={launch}
          mode={mode}
          onModeChange={setMode}
          teamNames={teamNames}
          onTeamNamesChange={setTeamNames}
          teamGame={teamGame}
          onTeamGameChange={setTeamGame}
          active={!!active}
          error={error}
          busy={busy}
          connected={connected}
          onClose={() => setLaunch(null)}
          onStart={openRoom}
        />
      )}
      {deleteQuiz && (
        <DeleteQuizDialog
          quiz={deleteQuiz}
          onClose={() => setDeleteQuiz(null)}
          onDelete={removeQuiz}
        />
      )}
    </div>
  );
}
