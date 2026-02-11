import { useRef } from "react";
import { cx, parseFile } from "../utils";

export default function InputSection({ tab, setTab, fileName, setFileName, manualText, setManualText, setParticipants }) {
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const names = await parseFile(file);
      setParticipants(names);
    } catch {
      setParticipants([]);
    }
  };

  const handleManual = (e) => {
    const text = e.target.value;
    setManualText(text);
    const names = text.split("\n").map((n) => n.trim()).filter((n) => n !== "");
    setParticipants(names);
  };

  return (
    <>
      {/* ─── Tabs ─── */}
      <div className="tab-bar">
        <button className={cx("tab-btn", tab === "excel" && "active")} onClick={() => setTab("excel")}>Dosya Yükle</button>
        <button className={cx("tab-btn", tab === "manual" && "active")} onClick={() => setTab("manual")}>Manuel Giriş</button>
      </div>

      {/* ─── Input Area ─── */}
      <div className="input-area">
        {tab === "excel" ? (
          <div className={cx("file-zone", fileName && "has-file")}>
            <div className="file-zone-icon">📄</div>
            <div className="file-zone-text">
              {fileName || "Dosya seçmek için tıklayın"}
            </div>
            <div className="file-zone-hint">.xlsx, .xls veya .csv</div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden-input" onChange={handleFile} />
          </div>
        ) : (
          <textarea
            className="textarea"
            placeholder={"Her satıra bir isim yazın\n\nÖrn:\nAhmet\nMehmet\nAyşe"}
            value={manualText}
            onChange={handleManual}
          />
        )}
      </div>
    </>
  );
}
