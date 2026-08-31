export type PracticeLocale = "de" | "en";
type Translation = Record<PracticeLocale, string>;

export const introductionText = "Hallo, ich heiße Nora. Ich komme aus Polen und wohne jetzt in Bremen. Ich spreche Polnisch und ein bisschen Deutsch. Am Dienstag habe ich einen Deutschkurs.";

export const introductionQuestions: ReadonlyArray<{
  id: string;
  group: "reading" | "questions";
  prompt: string;
  options: readonly string[];
  correct: number;
  explanation: Translation;
}> = [
  { id: "name", group: "reading", prompt: "Wie heißt die Person?", options: ["Bremen", "Nora", "Polen"], correct: 1,
    explanation: { de: "„Ich heiße Nora.“ Mit „Wie heißt …?“ fragst du nach dem Namen.", en: "“Ich heiße Nora.” The question “Wie heißt …?” asks for a name." } },
  { id: "origin", group: "reading", prompt: "Woher kommt Nora?", options: ["Aus Polen.", "Aus Bremen.", "Aus Deutschland."], correct: 0,
    explanation: { de: "„Ich komme aus Polen.“ „Woher?“ fragt nach der Herkunft, nicht nach dem jetzigen Wohnort.", en: "“Ich komme aus Polen.” “Woher?” asks where someone comes from, not where they live now." } },
  { id: "home", group: "reading", prompt: "Wo wohnt Nora jetzt?", options: ["In Berlin.", "In Polen.", "In Bremen."], correct: 2,
    explanation: { de: "„… und wohne jetzt in Bremen.“ „Wo?“ fragt hier nach dem Wohnort.", en: "“… und wohne jetzt in Bremen.” Here, “Wo?” asks where someone lives." } },
  { id: "day", group: "reading", prompt: "Wann hat Nora einen Deutschkurs?", options: ["Am Montag.", "Am Dienstag.", "Am Donnerstag."], correct: 1,
    explanation: { de: "„Am Dienstag habe ich einen Deutschkurs.“ „Wann?“ fragt nach dem Zeitpunkt.", en: "“Am Dienstag habe ich einen Deutschkurs.” “Wann?” asks when something happens." } },
  { id: "ask-home", group: "questions", prompt: "Ich wohne in Bremen.", options: ["Woher kommen Sie?", "Wie heißen Sie?", "Wo wohnen Sie?"], correct: 2,
    explanation: { de: "„Wo wohnen Sie?“ passt zur Angabe des Wohnorts. „Sie“ ist hier die höfliche Anrede.", en: "“Wo wohnen Sie?” asks where someone lives. “Sie” is the polite form of address here." } },
  { id: "ask-origin", group: "questions", prompt: "Ich komme aus Polen.", options: ["Woher kommen Sie?", "Wo wohnen Sie?", "Wann haben Sie einen Deutschkurs?"], correct: 0,
    explanation: { de: "„Woher kommen Sie?“ fragt nach der Herkunft. Die Antwort beginnt hier mit „aus“.", en: "“Woher kommen Sie?” asks where someone comes from. Here, the answer starts with “aus”." } },
  { id: "ask-name", group: "questions", prompt: "Ich heiße Nora.", options: ["Wann haben Sie einen Deutschkurs?", "Wie heißen Sie?", "Wo wohnen Sie?"], correct: 1,
    explanation: { de: "„Wie heißen Sie?“ fragt nach dem Namen. Dazu passt „Ich heiße Nora.“", en: "“Wie heißen Sie?” asks for a name. “Ich heiße Nora” is the matching answer." } },
];

export type PracticeAnswers = Record<string, number>;

/** Only a complete set of valid choices can be scored. No proficiency verdict. */
export function checkIntroduction(answers: PracticeAnswers) {
  if (!introductionQuestions.every(q => Object.prototype.hasOwnProperty.call(answers, q.id) && Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.options.length)) return null;
  const results = introductionQuestions.map(q => ({ id: q.id, correct: answers[q.id] === q.correct }));
  return { results, score: results.filter(result => result.correct).length, total: results.length };
}

export const practiceCopy = {
  de: {
    badge: "Kostenlos · ohne Anmeldung", title: "Deutsch A1 üben: sich vorstellen",
    intro: "Lies Noras Vorstellung. Beantworte vier Fragen zum Text und wähle danach drei passende Rückfragen. Du erhältst Erklärungen und kannst die Übung wiederholen.",
    notice: "Eigene Lernübung von DeutschPilot, kein offizieller Prüfungssatz oder Einstufungstest. Deine Antworten bleiben in dieser Übung im Browser und werden nicht an ein Lernkonto gesendet. Beim Neuladen werden sie gelöscht.",
    reading: "1. Eine kurze Vorstellung verstehen", matching: "2. Die passende Frage stellen",
    matchingHint: "Welche höfliche Frage passt zu dieser Antwort?",
    check: "Antworten prüfen", retry: "Noch einmal üben", correct: "Richtig.", wrong: "Noch nicht richtig.",
    progress: "beantwortet", result: "Dein Übungsergebnis", points: "richtig",
    resultHint: "Das Ergebnis gilt nur für diese sieben Fragen. Es bescheinigt kein Sprachniveau. Lies die Erklärungen und probiere es noch einmal.",
    answers: "Lösungen und Erklärungen zum Nachlesen", fallback: "Ohne JavaScript: Lies den Text und vergleiche deine Antworten mit den Lösungen unten.",
    next: "3. Jetzt selbst sprechen", nextBody: "Ergänze diese Sätze für dich — mit echten oder erfundenen Angaben. Lies sie laut und versuche es danach ohne Ablesen. Diese freie Sprechaufgabe wird nicht bewertet; du musst nichts eingeben oder aufnehmen.",
    links: "Lernniveaus ansehen", permalink: "Direktlink zur Übung",
  },
  en: {
    badge: "Free · no account needed", title: "Practise German A1: introduce yourself",
    intro: "Read Nora’s introduction in German. Answer four reading questions, then choose three matching follow-up questions. Check the explanations and try again.",
    notice: "An original DeutschPilot learning exercise, not an official exam paper or placement test. Your answers stay in this exercise in your browser and are not sent to a learning account. Reloading clears them.",
    reading: "1. Understand a short introduction", matching: "2. Choose the matching question",
    matchingHint: "Which polite question matches this answer?",
    check: "Check answers", retry: "Try again", correct: "Correct.", wrong: "Not quite right.",
    progress: "answered", result: "Your practice result", points: "correct",
    resultHint: "This result covers only these seven questions. It does not certify a language level. Read the explanations and try again.",
    answers: "Read the answers and explanations", fallback: "Without JavaScript: Read the text and compare your answers with the solutions below.",
    next: "3. Now introduce yourself", nextBody: "Complete these sentences privately, using real or fictional details. Read them aloud, then try without reading. This open speaking task is not graded; there is nothing to type or record.",
    links: "Explore learning levels", permalink: "Direct link to this exercise",
  },
} satisfies Record<PracticeLocale, Record<string, string>>;
