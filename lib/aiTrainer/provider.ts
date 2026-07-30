export type TrainerMessage = {
  role: "user" | "assistant";
  text: string;
};

export type TrainerProviderResult = {
  text: string;
  provider: "groq_free" | "deterministic";
  model: string | null;
  zeroPaidFallback: true;
  fallbackReason?: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;

export const TRAINER_SYSTEM_PROMPT = `You are DeutschPilot AI, a German language tutor for CEFR A1-C1 learners.

Rules:
- Be warm, patient, accurate, and concise.
- Correct German with a corrected version and a brief explanation of why.
- Match the learner's CEFR level.
- For A1/A2, explain mainly in the learner's UI language and use short German examples.
- For B1-C1, use progressively more German.
- Never invent a learner's progress, subscription, teacher feedback, or exam result.
- Never request personal, financial, authentication, or health information.
- Keep ordinary replies under 300 words.
- End with one useful next exercise or question.`;

export function normalizeTrainerMessages(input: unknown): TrainerMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is { role: string; text: string } =>
      Boolean(item)
      && typeof item === "object"
      && (item as { role?: unknown }).role !== undefined
      && typeof (item as { text?: unknown }).text === "string")
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role as "user" | "assistant",
      text: item.text.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((item) => item.text.length > 0);
}

function level(value: string | undefined) {
  const normalized = String(value ?? "A1").toUpperCase();
  return ["A1", "A2", "B1", "B2", "C1"].includes(normalized) ? normalized : "A1";
}

function localeText(locale: string | undefined, de: string, en: string) {
  return locale === "de" ? de : en;
}

function deterministicExercise(userLevel: string, locale: string | undefined) {
  const exercises: Record<string, { de: string; en: string }> = {
    A1: {
      de: "**A1-Übung:** Ergänze das Verb: „Ich ___ jeden Morgen Kaffee.“ (trinken)\n\nSchreibe den vollständigen Satz. Danach prüfen wir Verbform und Wortstellung.",
      en: "**A1 exercise:** Complete the verb: “Ich ___ jeden Morgen Kaffee.” (trinken)\n\nWrite the complete sentence. Then we’ll check the verb form and word order.",
    },
    A2: {
      de: "**A2-Übung:** Verbinde mit *weil*: „Ich lerne Deutsch. Ich möchte in Deutschland arbeiten.“\n\nAchte darauf: Im weil-Satz steht das konjugierte Verb am Ende.",
      en: "**A2 exercise:** Join these with *weil*: “Ich lerne Deutsch. Ich möchte in Deutschland arbeiten.”\n\nRemember: the conjugated verb goes to the end of the *weil* clause.",
    },
    B1: {
      de: "**B1-Übung:** Formuliere höflich: „Schicken Sie mir die Unterlagen.“ Verwende *Könnten Sie …?*\n\nSchreibe einen vollständigen Satz.",
      en: "**B1 exercise:** Make this polite: “Schicken Sie mir die Unterlagen.” Use *Könnten Sie …?*\n\nWrite one complete sentence.",
    },
    B2: {
      de: "**B2-Übung:** Schreibe zwei Sätze zum Thema Homeoffice: einen Vorteil mit *einerseits* und einen Nachteil mit *andererseits*.",
      en: "**B2 exercise:** Write two sentences about remote work: one advantage using *einerseits* and one disadvantage using *andererseits*.",
    },
    C1: {
      de: "**C1-Übung:** Formuliere eine differenzierte These darüber, ob künstliche Intelligenz den Sprachunterricht verbessert. Verwende *wenngleich* oder *insofern als*.",
      en: "**C1 exercise:** Formulate a nuanced thesis on whether AI improves language education. Use *wenngleich* or *insofern als*.",
    },
  };
  return exercises[userLevel]?.[locale === "de" ? "de" : "en"] ?? exercises.A1.en;
}

function deterministicGrammar(input: string, locale: string | undefined) {
  if (/\b(?:der|die|das|article|artikel)\b/i.test(input)) {
    return localeText(
      locale,
      "**Artikel:** *der* ist maskulin, *die* feminin und *das* neutral. Lerne neue Nomen immer zusammen mit Artikel und Plural: **der Tisch – die Tische**.\n\nMöchtest du drei kurze Artikel-Fragen üben?",
      "**Articles:** *der* is masculine, *die* feminine, and *das* neuter. Learn every noun together with its article and plural: **der Tisch – die Tische**.\n\nWould you like three quick article questions?",
    );
  }
  if (/\b(?:akkusativ|accusative)\b/i.test(input)) {
    return localeText(
      locale,
      "**Akkusativ:** Er markiert oft das direkte Objekt. Nur der maskuline Artikel ändert sich deutlich: **der → den**, **ein → einen**. Beispiel: „Ich sehe **den Mann**.“\n\nBilde einen Satz mit *einen*.",
      "**Accusative:** It often marks the direct object. The clearest article change is masculine: **der → den**, **ein → einen**. Example: “Ich sehe **den Mann**.”\n\nCan you make one sentence using *einen*?",
    );
  }
  if (/\b(?:dativ|dative)\b/i.test(input)) {
    return localeText(
      locale,
      "**Dativ:** Er steht häufig nach Verben wie *helfen* und nach Präpositionen wie *mit*, *bei* und *zu*. Beispiel: „Ich helfe **dem Kind**.“\n\nSchreibe einen Satz mit *mit*.",
      "**Dative:** It commonly follows verbs such as *helfen* and prepositions such as *mit*, *bei*, and *zu*. Example: “Ich helfe **dem Kind**.”\n\nWrite one sentence with *mit*.",
    );
  }
  if (/\b(?:word order|wortstellung|weil|dass)\b/i.test(input)) {
    return localeText(
      locale,
      "**Wortstellung:** Im Hauptsatz steht das konjugierte Verb meist an Position 2. Nach *weil* oder *dass* steht es am Ende: „Ich bleibe zu Hause, weil ich krank **bin**.“\n\nVerbinde zwei eigene Sätze mit *weil*.",
      "**Word order:** In a main clause, the conjugated verb is usually in position 2. After *weil* or *dass*, it moves to the end: “Ich bleibe zu Hause, weil ich krank **bin**.”\n\nJoin two of your own sentences with *weil*.",
    );
  }
  return localeText(
    locale,
    "Nenne bitte das Grammatikthema, zum Beispiel **Artikel**, **Akkusativ**, **Dativ** oder **Wortstellung**. Dann bekommst du eine kurze Erklärung mit Übung.",
    "Name the grammar topic—such as **articles**, **accusative**, **dative**, or **word order**—and I’ll give you a short explanation plus an exercise.",
  );
}

export function deterministicTrainerReply({
  messages,
  locale,
  userLevel,
}: {
  messages: TrainerMessage[];
  locale?: string;
  userLevel?: string;
}) {
  const currentLevel = level(userLevel);
  const latest = messages.filter((message) => message.role === "user").at(-1)?.text.trim() ?? "";

  if (/\b(?:give|gib|exercise|übung)\b/i.test(latest)) {
    return deterministicExercise(currentLevel, locale);
  }
  if (/\b(?:grammar|grammatik|artikel|accusative|akkusativ|dative|dativ|word order|wortstellung)\b/i.test(latest)) {
    return deterministicGrammar(latest, locale);
  }
  if (/\b(?:vocabulary|vokabular|wortschatz|test me|teste mich)\b/i.test(latest)) {
    return localeText(
      locale,
      `**${currentLevel}-Wortschatztest:** Was bedeutet „zuverlässig“? Antworte auf Deutsch oder Englisch und verwende das Wort anschließend in einem deutschen Satz.`,
      `**${currentLevel} vocabulary test:** What does “zuverlässig” mean? Answer in English or German, then use it in one German sentence.`,
    );
  }
  if (/\b(?:conversation|gespräch|sprechen|roleplay|rollenspiel)\b/i.test(latest)) {
    return localeText(
      locale,
      "**Rollenspiel:** Wir sind in einem Café. Ich bin die Bedienung: „Guten Tag! Was möchten Sie bestellen?“\n\nAntworte mit einem vollständigen deutschen Satz.",
      "**Role-play:** We are in a café. I’m the server: “Guten Tag! Was möchten Sie bestellen?”\n\nReply with one complete German sentence.",
    );
  }
  if (/\b(?:correct|korrigier|sentence|satz)\b/i.test(latest)) {
    return localeText(
      locale,
      "Schreibe bitte **genau einen deutschen Satz**, den ich prüfen soll. Ich kontrolliere Verbposition, Fall, Artikel und Endungen und erkläre jede Änderung kurz.",
      "Paste **exactly one German sentence** you want checked. I’ll review verb position, case, articles, and endings, then briefly explain each change.",
    );
  }

  return localeText(
    locale,
    `Wir können kostenlos auf Niveau **${currentLevel}** üben. Wähle: **Satz korrigieren**, **Grammatik**, **Gespräch**, **Wortschatztest** oder **Übung**.`,
    `We can practise at **${currentLevel}** without paid AI. Choose: **correct a sentence**, **grammar**, **conversation**, **vocabulary test**, or **exercise**.`,
  );
}

export async function generateTrainerReply({
  messages,
  locale,
  userLevel,
}: {
  messages: TrainerMessage[];
  locale?: string;
  userLevel?: string;
}): Promise<TrainerProviderResult> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_AI_TRAINER_MODEL?.trim() || DEFAULT_GROQ_MODEL;
  const fallback = (fallbackReason?: string): TrainerProviderResult => ({
    text: deterministicTrainerReply({ messages, locale, userLevel }),
    provider: "deterministic",
    model: null,
    zeroPaidFallback: true,
    fallbackReason,
  });

  if (!apiKey) return fallback("GROQ_API_KEY is not configured");

  const contextualSystem = `${TRAINER_SYSTEM_PROMPT}

Current learner:
- UI language: ${locale === "de" ? "German" : "English"}
- CEFR level: ${level(userLevel)}
- This deployment has no paid AI fallback.`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: contextualSystem },
          ...messages.map((message) => ({ role: message.role, content: message.text })),
        ],
        temperature: 0.4,
        max_completion_tokens: 700,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) return fallback(`Groq free provider returned ${response.status}`);
    const body = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) return fallback("Groq free provider returned no text");

    return {
      text,
      provider: "groq_free",
      model,
      zeroPaidFallback: true,
    };
  } catch (error) {
    return fallback(error instanceof Error ? error.message : String(error));
  }
}
