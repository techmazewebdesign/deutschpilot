// Keep the production build self-contained. Remote Google-font downloads make
// Vercel builds dependent on an external fetch and can fail before deployment.
// Tailwind falls back to the system serif/sans/monospace stacks below.
const localFontVariable = (variable: string) => ({ variable });

export const headingFont = localFontVariable("--font-heading");
export const bodyFont = localFontVariable("--font-body");
export const monoFont = localFontVariable("--font-mono");
