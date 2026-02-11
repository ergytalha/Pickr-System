import { useState, useRef, useCallback, useEffect } from "react";
import logo from "../public/favicon-lasera.png";
import { shuffleArray, launchConfetti, cx } from "./utils";
import InputSection from "./components/InputSection";
import WinnerSection from "./components/WinnerSection";
import "./App.css";

export default function CekilisApp() {
  const [tab, setTab] = useState("excel");
  const [participants, setParticipants] = useState([]);
  const [manualText, setManualText] = useState("");
  const [fileName, setFileName] = useState(null);
  const [reserveCount, setReserveCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("—");
  const [mainWinner, setMainWinner] = useState(null);
  const [reserveWinners, setReserveWinners] = useState([]);
  const [drawDone, setDrawDone] = useState(false);
  const intervalRef = useRef(null);

  const minRequired = Math.max(2, 1 + reserveCount);
  const canDraw = participants.length >= minRequired && !isSpinning;

  /* status text */
  let statusText = "Henüz katılımcı yok";
  let isReady = false;
  if (participants.length > 0 && participants.length < minRequired) {
    statusText = `${participants.length} katılımcı — en az ${minRequired} gerekli`;
  } else if (participants.length >= minRequired) {
    statusText = `${participants.length} katılımcı hazır`;
    isReady = true;
  }

  /* draw */
  const startDraw = useCallback(() => {
    if (!canDraw) return;
    setIsSpinning(true);
    setDrawDone(false);
    setMainWinner(null);
    setReserveWinners([]);

    const shuffled = shuffleArray(participants);
    const winner = shuffled[0];
    const reserves = shuffled.slice(1, 1 + reserveCount);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setDisplayName(participants[Math.floor(Math.random() * participants.length)]);

      if (elapsed >= 3000) {
        clearInterval(intervalRef.current);
        setDisplayName(winner);
        setMainWinner(winner);
        setReserveWinners(reserves);
        setIsSpinning(false);
        setDrawDone(true);
        launchConfetti();
      }
    }, 50);
  }, [canDraw, participants, reserveCount]);

  /* cleanup interval on unmount */
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div className="wrapper">
      <div className="container">

        {/* ─── Header Brand ─── */}
        <div className="brand-header">
          <div className="logo-placeholder"><img src={logo} alt="Lasera Medya" /></div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="brand-name">Lasera Medya</span>
            <span className="brand-subtitle">Çekiliş Sistemi</span>
          </div>
        </div>

        {/* ─── Title ─── */}
        <div className="title-section">
          <h1>Çekiliş</h1>
          <p>İsimleri girin veya dosya yükleyin, kazananı belirleyin.</p>
        </div>

        {/* ─── Input Section (Tabs + File/Manual) ─── */}
        <InputSection
          tab={tab}
          setTab={setTab}
          fileName={fileName}
          setFileName={setFileName}
          manualText={manualText}
          setManualText={setManualText}
          setParticipants={setParticipants}
        />

        {/* ─── Reserve Stepper ─── */}
        <div className="settings-row">
          <div>
            <div className="settings-label">Yedek Kazanan</div>
            <div className="settings-hint">Çekilişte belirlenecek yedek sayısı</div>
          </div>
          <div className="stepper">
            <button
              className="stepper-btn left"
              onClick={() => setReserveCount((p) => Math.max(0, p - 1))}
              disabled={reserveCount <= 0}
            >
              −
            </button>
            <div className="stepper-value">{reserveCount}</div>
            <button
              className="stepper-btn right"
              onClick={() => setReserveCount((p) => Math.min(10, p + 1))}
              disabled={reserveCount >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* ─── Status ─── */}
        <div className="status">
          <span className={cx("status-dot", isReady && "ready")} />
          <span>{statusText}</span>
        </div>

        {/* ─── Draw Button ─── */}
        <button
          className={cx("draw-btn", isSpinning && "spinning", canDraw && !isSpinning && "can-draw")}
          onClick={startDraw}
          disabled={!canDraw}
        >
          {isSpinning ? "Çekiliş yapılıyor..." : drawDone ? "Tekrar Çek" : "Çekilişi Başlat"}
        </button>

        {/* ─── Winner Section (Winner + Reserves) ─── */}
        <WinnerSection
          isSpinning={isSpinning}
          drawDone={drawDone}
          displayName={displayName}
          mainWinner={mainWinner}
          reserveWinners={reserveWinners}
        />

        {/* ─── Footer Brand ─── */}
        <div className="brand-footer">
          <div className="footer-logo"><img src={logo} alt="Lasera Medya" /></div>
          <span className="footer-text">
            Powered by <strong>Lasera Medya</strong>
          </span>
        </div>

      </div>
    </div>
  );
}
