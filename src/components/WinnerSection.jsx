import { useState } from "react";
import { cx } from "../utils";

export default function WinnerSection({ isSpinning, drawDone, displayName, mainWinner, reserveWinners }) {
  const [revealedSet, setRevealedSet] = useState(new Set());

  const revealReserve = (index) => {
    setRevealedSet((prev) => new Set(prev).add(index));
  };

  return (
    <>
      {/* ─── Winner Box ─── */}
      <div className={cx("winner-box", drawDone && "done")}>
        <div className="winner-label">Kazanan</div>
        <div key={mainWinner || displayName} className={cx("winner-name", isSpinning && "spinning", drawDone && "done")}>
          {displayName}
        </div>
      </div>

      {/* ─── Reserves ─── */}
      {drawDone && reserveWinners.length > 0 && (
        <div className="reserves-section">
          <div className="reserves-label">Yedek Kazananlar</div>
          {reserveWinners.map((name, i) => {
            const revealed = revealedSet.has(i);
            return (
              <div key={i} className={cx("reserve-item", revealed && "revealed")}>
                <div className="reserve-item-left">
                  <div className={cx("reserve-badge", revealed && "revealed")}>{i + 1}</div>
                  <span className={cx("reserve-name", revealed && "revealed")}>
                    {revealed ? name : "Gizli yedek kazanan"}
                  </span>
                </div>
                {revealed ? (
                  <span className="reserve-check">✓</span>
                ) : (
                  <button className="reveal-btn" onClick={() => revealReserve(i)}>
                    Göster
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
