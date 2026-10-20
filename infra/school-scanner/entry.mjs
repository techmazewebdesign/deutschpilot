import { readFileSync } from "node:fs";
const file = process.env.SCHOOL_SCANNER_TOKEN_FILE;
if (!file) throw new Error("Scanner secret file required");
const token = readFileSync(file, "utf8").trim();
if (token.length < 32) throw new Error("Scanner secret must contain at least 32 characters");
process.env.SCHOOL_SCANNER_TOKEN = token;
await import("./scanner.mjs");
