/** Format legacy editorial punctuation for display without changing stored answers or links. */
export function displayText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/([A-C][12]|\d)[–—](?=[A-C][12]|\d)/g, "$1 bis ")
    .replace(/\s+[–—-]\s+([^–—<>\n.!?]{1,160}?)\s+[–—]\s+/g, ", $1, ")
    .replace(/\s*[–—]\s*/g, ": ")
    .replace(/\s+-\s+/g, ": ");
}

/** Change visible HTML text only. Attributes, URLs, and markup stay intact. */
export function displayHtml(value: string | null | undefined): string {
  return (value ?? "").split(/(<[^>]*>)/g).map((part, i) => i % 2 ? part : displayText(part)).join("");
}
