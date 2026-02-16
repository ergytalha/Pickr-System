import { useState, useRef, useCallback, useEffect } from "react";
import logo from "../public/favicon-lasera.png";
import {
  shuffleArray,
  launchConfetti,
  exportToExcel,
  exportToPDF,
  fmt,
  fmtValue,
  cx,
} from "./utils";
import InputSection from "./components/InputSection";
import WinnerSection from "./components/WinnerSection";
import "./App.css";

/* ─── localStorage helpers ─── */
const STORAGE_KEY = "cekilis-kazananlar";

function loadWinners() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWinners(winners) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(winners));
}

export default function CekilisApp() {
  const [tab, setTab] = useState("excel");
  const [participants, setParticipants] = useState([]);
  const [manualText, setManualText] = useState("");
  const [fileName, setFileName] = useState(null);
  const [winnerCount, setWinnerCount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("—");
  const [winners, setWinners] = useState([]);
  const [allPastWinners, setAllPastWinners] = useState(loadWinners);
  const [drawDone, setDrawDone] = useState(false);
  const intervalRef = useRef(null);

  /* persist winners to localStorage whenever they change */
  useEffect(() => {
    saveWinners(allPastWinners);
  }, [allPastWinners]);

  /* available participants = those who haven't won yet */
  const available = participants.filter((p) => !allPastWinners.includes(p));
  const canDraw = available.length >= winnerCount && !isSpinning;

  /* status text */
  let statusText = "Henüz katılımcı yok";
  let isReady = false;
  if (participants.length === 0) {
    statusText = "Henüz katılımcı yok";
  } else if (available.length < winnerCount) {
    statusText = `${fmt(available.length)} kişi kaldı — ${fmt(winnerCount)} kazanan için yeterli değil`;
  } else {
    statusText = `${fmt(available.length)} katılımcı hazır`;
    isReady = true;
  }

  /* draw */
  const startDraw = useCallback(() => {
    if (!canDraw) return;
    setIsSpinning(true);
    setDrawDone(false);
    setWinners([]);

    const shuffled = shuffleArray(available);
    const drawn = shuffled.slice(0, winnerCount);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setDisplayName(available[Math.floor(Math.random() * available.length)]);

      if (elapsed >= 3000) {
        clearInterval(intervalRef.current);
        setDisplayName(drawn[0]);
        setWinners(drawn);
        setAllPastWinners((prev) => [...prev, ...drawn]);
        setIsSpinning(false);
        setDrawDone(true);
        launchConfetti();
      }
    }, 50);
  }, [canDraw, available, winnerCount]);

  /* reset all past winners */
  const resetWinners = () => {
    setAllPastWinners([]);
    setWinners([]);
    setDrawDone(false);
    setDisplayName("—");
  };

  /* cleanup interval on unmount */
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  return (
    <div className="wrapper">
      {/* ═══ Right: Past Winners Sidebar ═══ */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div>
            <div className="sidebar-title">Kazananlar</div>
            <div className="sidebar-count">
              {allPastWinners.length > 0
                ? `${fmt(allPastWinners.length)} kişi çekildi`
                : "Henüz kazanan yok"}
            </div>
          </div>
          {allPastWinners.length > 0 && !isSpinning && (
            <button className="reset-btn-small" onClick={resetWinners}>
              Sıfırla
            </button>
          )}
        </div>

        <div className="sidebar-list">
          {allPastWinners.length === 0 ? (
            <div className="sidebar-empty">
              <div className="sidebar-empty-icon">🏆</div>
              <div>Çekiliş yapıldığında kazananlar burada listelenecek</div>
            </div>
          ) : (
            allPastWinners.map((name, i) => (
              <div key={i} className="sidebar-item">
                <div className="sidebar-badge">{fmt(i + 1)}</div>
                <span className="sidebar-name">{fmtValue(name)}</span>
              </div>
            ))
          )}
        </div>

        {/* ─── Export Buttons ─── */}
        {allPastWinners.length > 0 && (
          <div className="sidebar-footer">
            <button
              className="export-btn excel"
              onClick={() => exportToExcel(allPastWinners)}
            >
              <span className="export-icon">📊</span> Excel İndir
            </button>
            <button
              className="export-btn pdf"
              onClick={() => exportToPDF(allPastWinners)}
            >
              <span className="export-icon">📄</span> PDF İndir
            </button>
          </div>
        )}
      </div>

      <div className="layout">
        {/* ═══ Left: Draw Panel ═══ */}
        <div className="container">
          {/* ─── Header Brand ─── */}
          {/* <div className="brand-header">
            <div className="logo-placeholder"><img src={logo} alt="Lasera Medya" /></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="brand-name">Lasera Medya</span>
              <span className="brand-subtitle">Çekiliş Sistemi</span>
            </div>
          </div> */}

          {/* ─── Title ─── */}
          <div className="title-section">
            <h1>Çekiliş</h1>
            <p>İsimleri girin veya dosya yükleyin, kazananı belirleyin.</p>
          </div>

          {/* ─── Input Section ─── */}
          <InputSection
            tab={tab}
            setTab={setTab}
            fileName={fileName}
            setFileName={setFileName}
            manualText={manualText}
            setManualText={setManualText}
            setParticipants={setParticipants}
          />

          {/* ─── Winner Count Stepper ─── */}
          <div className="settings-row">
            <div>
              <div className="settings-label">Kazanan Sayısı</div>
              <div className="settings-hint">
                Çekilişte belirlenecek kazanan sayısı
              </div>
            </div>
            <div className="stepper">
              <button
                className="stepper-btn left"
                onClick={() => setWinnerCount((p) => Math.max(1, p - 1))}
                disabled={winnerCount <= 1}
              >
                −
              </button>
              <div className="stepper-value">{winnerCount}</div>
              <button
                className="stepper-btn right"
                onClick={() => setWinnerCount((p) => Math.min(100, p + 1))}
                disabled={winnerCount >= 100}
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
            className={cx(
              "draw-btn",
              isSpinning && "spinning",
              canDraw && !isSpinning && "can-draw",
            )}
            onClick={startDraw}
            disabled={!canDraw}
          >
            {isSpinning
              ? "Çekiliş yapılıyor..."
              : drawDone
                ? "Tekrar Çek"
                : "Çekilişi Başlat"}
          </button>

          {/* ─── Current Winner ─── */}
          <WinnerSection
            isSpinning={isSpinning}
            drawDone={drawDone}
            displayName={displayName}
            winners={winners}
          />

          {/* ─── Footer Brand ─── */}
          <div className="brand-footer">
            {/* <div className="footer-logo"><img src={logo} alt="Lasera Medya" /></div> */}
            <span className="footer-text">
              Powered by <strong>Lasera Medya</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
