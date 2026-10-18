import type { Lesson, Vocab } from "./models";

const starterLessons: Lesson[] = [
  { id: "a1-greetings", level: "A1", title: "Begrüßungen", subtitle: "Ankommen und sich vorstellen", minutes: 6, note: "Guten Morgen nutzt du meist bis zum späten Vormittag. Guten Tag ist neutral und sicher.", phrases: [{ de: "Guten Morgen!", en: "Good morning!" }, { de: "Ich heiße …", en: "My name is …" }, { de: "Freut mich.", en: "Nice to meet you." }], question: "Wie sagst du ‘My name is Sam’ auf Deutsch?", options: ["Ich bin Name Sam.", "Ich heiße Sam.", "Mein heiße Sam."], answer: 1 },
  { id: "a1-cafe", level: "A1", title: "Im Café", subtitle: "Höflich bestellen", minutes: 7, note: "Ich möchte … ist höflich und passt fast überall. Bitte steht häufig am Ende.", phrases: [{ de: "Ich möchte einen Kaffee, bitte.", en: "I would like a coffee, please." }, { de: "Was kostet das?", en: "How much is that?" }, { de: "Die Rechnung, bitte.", en: "The bill, please." }], question: "Welche Bestellung ist höflich?", options: ["Kaffee jetzt.", "Ich möchte einen Kaffee, bitte.", "Du gibst Kaffee."], answer: 1 },
  { id: "a1-directions", level: "A1", title: "Unterwegs", subtitle: "Nach dem Weg fragen", minutes: 8, note: "Wo ist …? fragt nach einem Ort. Wie komme ich zu …? fragt nach dem Weg.", phrases: [{ de: "Wo ist der Bahnhof?", en: "Where is the train station?" }, { de: "Gehen Sie geradeaus.", en: "Go straight ahead." }, { de: "Dann links.", en: "Then left." }], question: "Was bedeutet ‘geradeaus’?", options: ["straight ahead", "to the right", "back"], answer: 0 },
  { id: "a2-routine", level: "A2", title: "Mein Alltag", subtitle: "Trennbare Verben", minutes: 9, note: "Im Hauptsatz wandert der Vorsatz ans Ende: Ich stehe um sieben Uhr auf.", phrases: [{ de: "Ich stehe um sieben Uhr auf.", en: "I get up at seven." }, { de: "Danach kaufe ich ein.", en: "After that I go shopping." }, { de: "Abends rufe ich meine Mutter an.", en: "In the evening I call my mother." }], question: "Welche Wortstellung ist richtig?", options: ["Ich aufstehe um sieben.", "Ich stehe um sieben auf.", "Ich stehe auf um sieben auf."], answer: 1 },
  { id: "a2-doctor", level: "A2", title: "Beim Arzt", subtitle: "Beschwerden beschreiben", minutes: 9, note: "Mir ist … beschreibt einen Zustand. Ich habe … nutzt du mit Nomen wie Schmerzen oder Fieber.", phrases: [{ de: "Ich habe Kopfschmerzen.", en: "I have a headache." }, { de: "Mir ist schwindelig.", en: "I feel dizzy." }, { de: "Seit gestern.", en: "Since yesterday." }], question: "Wie sagst du ‘I have a headache’?", options: ["Mir bin Kopf.", "Ich habe Kopfschmerzen.", "Ich mache Kopfschmerz."], answer: 1 },
  { id: "b1-opinion", level: "B1", title: "Meinung sagen", subtitle: "Argumente verbinden", minutes: 10, note: "Nach weil steht das konjugierte Verb am Ende. Nach deshalb bleibt es im Hauptsatz auf Position zwei.", phrases: [{ de: "Meiner Meinung nach …", en: "In my opinion …" }, { de: "Ich denke, dass …", en: "I think that …" }, { de: "Das ist wichtig, weil …", en: "That is important because …" }], question: "Welche Form ist richtig?", options: ["weil es ist wichtig", "weil wichtig es ist", "weil es wichtig ist"], answer: 2 },
  { id: "b2-interview", level: "B2", title: "Vorstellungsgespräch", subtitle: "Erfahrung präzise darstellen", minutes: 12, note: "Konkrete Beispiele wirken stärker als allgemeine Eigenschaften: Situation, Aufgabe, Handlung, Ergebnis.", phrases: [{ de: "Zu meinen Stärken gehört …", en: "One of my strengths is …" }, { de: "Ein konkretes Beispiel dafür ist …", en: "A concrete example is …" }, { de: "Dadurch konnte ich …", en: "As a result, I was able to …" }], question: "Welche Antwort ist am konkretesten?", options: ["Ich bin gut.", "Ich arbeite immer viel.", "Ich koordinierte das Projekt und verkürzte die Lieferzeit."], answer: 2 },
  { id: "c1-disagree", level: "C1", title: "Diplomatisch widersprechen", subtitle: "Nuancen in Diskussionen", minutes: 12, note: "Teilzustimmung plus Einschränkung hält den Ton konstruktiv und zeigt sprachliche Präzision.", phrases: [{ de: "Dem kann ich nur bedingt zustimmen.", en: "I can only agree with that to a limited extent." }, { de: "Dabei sollte jedoch berücksichtigt werden, dass …", en: "However, it should be taken into account that …" }, { de: "Ich würde den Schwerpunkt anders setzen.", en: "I would place the emphasis differently." }], question: "Welche Formulierung widerspricht diplomatisch?", options: ["Das ist falsch.", "Dem kann ich nur bedingt zustimmen.", "Du verstehst das nicht."], answer: 1 },
];

const starterVocabulary: Vocab[] = [
  { id: "v1", level: "A1", de: "der Bahnhof", en: "train station", example: "Der Bahnhof ist dort." },
  { id: "v2", level: "A1", de: "bestellen", en: "to order", example: "Ich möchte etwas bestellen." },
  { id: "v3", level: "A1", de: "die Rechnung", en: "the bill", example: "Die Rechnung, bitte." },
  { id: "v4", level: "A1", de: "geradeaus", en: "straight ahead", example: "Gehen Sie geradeaus." },
  { id: "v5", level: "A2", de: "zuverlässig", en: "reliable", example: "Meine Kollegin ist sehr zuverlässig." },
  { id: "v6", level: "A2", de: "die Verspätung", en: "the delay", example: "Der Zug hat Verspätung." },
  { id: "v7", level: "A2", de: "sich bewerben", en: "to apply", example: "Ich bewerbe mich um die Stelle." },
  { id: "v8", level: "B1", de: "die Voraussetzung", en: "prerequisite", example: "Deutsch ist eine wichtige Voraussetzung." },
  { id: "v9", level: "B1", de: "berücksichtigen", en: "to take into account", example: "Wir müssen die Kosten berücksichtigen." },
  { id: "v10", level: "B1", de: "der Widerspruch", en: "the objection", example: "Sie legt Widerspruch ein." },
  { id: "v11", level: "B2", de: "nachvollziehbar", en: "comprehensible", example: "Die Entscheidung ist nachvollziehbar." },
  { id: "v12", level: "B2", de: "die Auswirkung", en: "the impact", example: "Die Maßnahme hat positive Auswirkungen." },
  { id: "v13", level: "C1", de: "abwägen", en: "to weigh up", example: "Wir müssen Chancen und Risiken abwägen." },
  { id: "v14", level: "C1", de: "weitgehend", en: "largely", example: "Die Ziele wurden weitgehend erreicht." },
];

// Source: existing project-owned vocabulary SQL seeds; regenerated by scripts/sync-vocabulary.mjs.
import webVocabulary from "./data/web-vocabulary.json";
export const vocabulary: Vocab[] = [...starterVocabulary, ...(webVocabulary as Vocab[]).filter(word => !starterVocabulary.some(item => item.level === word.level && item.de === word.de))];

import webLessons from "./data/web-lessons.json";
export const lessons: Lesson[] = [...starterLessons, ...(webLessons as Lesson[])];
