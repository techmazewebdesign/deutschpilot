import type { SchoolLetter, SchoolSnapshot } from "../../lib/school/contract";
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!
  );
export function letterPrintHtml(letter: SchoolLetter, snapshot: SchoolSnapshot) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:38px;color:#172d43;line-height:1.6}h1{font-size:24px}header{border-bottom:2px solid #916426;padding-bottom:18px}article{white-space:pre-wrap;margin:28px 0}footer{font-size:11px;color:#536579;margin-top:32px}</style></head><body><header><strong>${escape(snapshot.settings.name)}</strong><br>${escape(snapshot.settings.operator)}</header><h1>${escape(letter.title)}</h1><p>An: ${escape(snapshot.actor.name)}<br>Frist: ${escape(letter.dueDate)}</p><article>${escape(letter.body)}</article><p>Ort / Datum: ________________________</p><p>Unterschrift: ________________________</p><footer>Dokument-ID: ${escape(letter.id)}. Druckkopie des Schulschreibens. Diese Kopie enthält keine qualifizierte elektronische Signatur.</footer></body></html>`;
}
