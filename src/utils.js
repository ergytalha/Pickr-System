import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── Fisher-Yates Shuffle ─── */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Confetti Launcher ─── */
export function launchConfetti() {
  const colors = ["#e85d04", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    Object.assign(piece.style, {
      position: "fixed",
      width: `${6 + Math.random() * 6}px`,
      height: `${6 + Math.random() * 6}px`,
      borderRadius: "2px",
      pointerEvents: "none",
      zIndex: "9999",
      left: `${Math.random() * 100}vw`,
      top: "-10px",
      background: colors[Math.floor(Math.random() * colors.length)],
      animation: `confettiFall ${2 + Math.random() * 1.5}s ease-out ${Math.random() * 0.8}s forwards`,
    });
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

/* ─── Excel/CSV Parser ─── */
export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const names = [];
        jsonData.forEach((row) => {
          if (Array.isArray(row)) {
            row.forEach((cell) => {
              const val = String(cell || "").trim();
              if (val && !["ad", "isim", "name"].includes(val.toLowerCase())) {
                names.push(val);
              }
            });
          }
        });
        resolve(names);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject("Dosya okunamadı");
    reader.readAsArrayBuffer(file);
  });
}

/* ─── Export winners as Excel ─── */
export function exportToExcel(winners) {
  const data = winners.map((name, i) => ({ Sıra: i + 1, Kazanan: name }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [{ wch: 6 }, { wch: 30 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kazananlar");
  XLSX.writeFile(wb, `cekilis-kazananlar-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/* ─── Export winners as PDF ─── */
export function exportToPDF(winners) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString("tr-TR");

  doc.setFontSize(18);
  doc.setTextColor(232, 93, 4);
  doc.text("Cekilis Sonuclari", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122);
  doc.text(`Tarih: ${date}  -  Toplam: ${winners.length.toLocaleString("tr-TR")} kazanan`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [["Sira", "Kazanan"]],
    body: winners.map((name, i) => [i + 1, String(name)]),
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [232, 93, 4], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [255, 247, 237] },
    columnStyles: { 0: { halign: "center", cellWidth: 20 } },
  });

  doc.save(`cekilis-kazananlar-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ─── Number formatter (Turkish locale: 42.720) ─── */
export const fmt = (n) => n.toLocaleString("tr-TR");

/* ─── Format value: if numeric string, add thousand separators ─── */
export const fmtValue = (val) => {
  const str = String(val).trim();
  if (/^\d+$/.test(str)) return Number(str).toLocaleString("tr-TR");
  return str;
};

/* ─── className builder ─── */
export const cx = (...classes) => classes.filter(Boolean).join(" ");
