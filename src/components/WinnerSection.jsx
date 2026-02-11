import { cx, fmt, fmtValue } from "../utils";

export default function WinnerSection({ isSpinning, drawDone, displayName, winners }) {
  return (
    <>
      {/* ─── Winner Box ─── */}
      <div className={cx("winner-box", drawDone && "done")}>
        <div className="winner-label">
          {winners.length > 1 ? "Kazananlar" : "Kazanan"}
        </div>

        {/* Single winner or spinning display */}
        {(!drawDone || winners.length === 1) && (
          <div key={displayName} className={cx("winner-name", isSpinning && "spinning", drawDone && "done")}>
            {fmtValue(displayName)}
          </div>
        )}

        {/* Multiple winners list */}
        {drawDone && winners.length > 1 && (
          <div className="winners-list">
            {winners.map((name, i) => (
              <div key={i} className="winner-item">
                <div className="winner-badge">{fmt(i + 1)}</div>
                <span className="winner-item-name">{fmtValue(name)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
