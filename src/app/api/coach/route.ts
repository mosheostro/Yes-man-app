import { NextResponse } from "next/server";

// ─── Language maps ────────────────────────────────────────────────────────────

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", ru: "Russian (Русский)", he: "Hebrew (עברית)", de: "German (Deutsch)",
};

const LANGUAGE_DIRECTIVES: Record<string, string> = {
  en: "You MUST respond exclusively in English. Do NOT use any other language, script, or characters from other languages (no Cyrillic, no CJK, no Arabic, no Hebrew characters).",
  ru: "Ты ОБЯЗАН отвечать исключительно на русском языке. КРИТИЧЕСКОЕ ТРЕБОВАНИЕ: НИКОГДА не смешивай кириллицу и латиницу в одном слове — слова типа 'nerisknуть', 'stressovat', 'riskovat' АБСОЛЮТНО ЗАПРЕЩЕНЫ. Все слова должны состоять ТОЛЬКО из кириллических букв. Замени любое иностранное слово русским эквивалентом: 'риск' вместо 'risk', 'стресс' вместо 'stress', 'жёсткий' вместо 'жрские'. ЗАПРЕЩЕНО: любые китайские/японские/корейские иероглифы (CJK), арабские символы, латинские буквы внутри русских слов, транслитерация. Каждое слово пишется раздельно с пробелами.",
  he: "אתה חייב להגיב אך ורק בעברית. אל תשתמש באנגלית, ברוסית, בסינית, ביפנית או בכל שפה אחרת. אין לכלול תווים זרים מכל סוג שהוא.",
  de: "Du MUSST ausschließlich auf Deutsch antworten. Verwende NIEMALS andere Sprachen, Schriften oder Zeichen — kein Englisch, kein Kyrillisch, keine CJK-Zeichen (Chinesisch/Japanisch/Koreanisch), keine fremdsprachigen Wörter.",
};

// ─── Boundary phrase library (all 4 languages) ───────────────────────────────

const BOUNDARY_PHRASES: Record<string, string[]> = {
  en: [
    "\"I need to think about it first.\"",
    "\"I can't commit to this right now.\"",
    "\"That doesn't work for me.\"",
    "\"I need some time for myself.\"",
    "\"Let me get back to you on that.\"",
    "\"I appreciate you asking, but I'll have to pass.\"",
  ],
  ru: [
    "«Мне нужно подумать.»",
    "«Я сейчас не могу взять на себя такое обязательство.»",
    "«Это мне не подходит.»",
    "«Мне нужно время для себя.»",
    "«Я вернусь к тебе с ответом.»",
    "«Спасибо, что спросил(а), но я вынужден(а) отказаться.»",
  ],
  ru_male: [
    "«Мне нужно подумать.»",
    "«Я сейчас не могу взять на себя такое обязательство.»",
    "«Это мне не подходит.»",
    "«Мне нужно время для себя.»",
    "«Я вернусь к тебе с ответом.»",
    "«Спасибо, что спросил, но я вынужден отказаться.»",
  ],
  ru_female: [
    "«Мне нужно подумать.»",
    "«Я сейчас не могу взять на себя такое обязательство.»",
    "«Это мне не подходит.»",
    "«Мне нужно время для себя.»",
    "«Я вернусь к тебе с ответом.»",
    "«Спасибо, что спросила, но я вынуждена отказаться.»",
  ],
  he: [
    "\"אני צריך לחשוב על זה.\"",
    "\"אני לא יכול להתחייב לזה עכשיו.\"",
    "\"זה לא עובד בשבילי.\"",
    "\"אני צריך קצת זמן לעצמי.\"",
    "\"אחזור אליך עם תשובה.\"",
    "\"אני מעריך ששאלת, אבל אצטרך לסרב.\"",
  ],
  de: [
    "\"Ich muss darüber nachdenken.\"",
    "\"Ich kann mich jetzt nicht festlegen.\"",
    "\"Das passt mir nicht.\"",
    "\"Ich brauche etwas Zeit für mich.\"",
    "\"Ich melde mich bei dir.\"",
    "\"Danke fürs Fragen, aber ich muss ablehnen.\"",
  ],
};

// ─── CBT Session step names ───────────────────────────────────────────────────

const SESSION_STEPS: Record<string, string[]> = {
  en: ["Situation", "Thoughts", "Emotions", "Pattern", "Reframe", "Action"],
  ru: ["Ситуация", "Мысли", "Эмоции", "Паттерн", "Переосмысление", "Действие"],
  he: ["מצב", "מחשבות", "רגשות", "דפוס", "מסגור מחדש", "פעולה"],
  de: ["Situation", "Gedanken", "Gefühle", "Muster", "Umdeuten", "Aktion"],
};

// ─── Training scenarios ───────────────────────────────────────────────────────

const TRAINING_SCENARIOS: Record<string, Record<string, { setup: string; opener: string }>> = {
  colleague: {
    en: { setup: "You are playing a pushy colleague", opener: "Hey, can you cover my shift this weekend? I really need the help and you're the only one I trust." },
    ru: { setup: "Ты играешь навязчивого коллегу", opener: "Слушай, можешь взять мою смену в выходные? Мне очень нужна помощь, и ты единственный человек, которому я доверяю." },
    he: { setup: "אתה משחק עמית לעבודה תובעני", opener: "היי, אתה יכול לכסות את המשמרת שלי בסוף השבוע? אני ממש צריך עזרה ואתה היחיד שאני סומך עליו." },
    de: { setup: "Du spielst einen aufdringlichen Kollegen", opener: "Hey, kannst du meine Schicht am Wochenende übernehmen? Ich brauche wirklich Hilfe und du bist der Einzige, dem ich vertraue." },
  },
  boss: {
    en: { setup: "You are playing a demanding boss", opener: "I know it's late notice, but I need you to come in Saturday. The client is expecting the report and you're the best person for this." },
    ru: { setup: "Ты играешь требовательного начальника", opener: "Знаю, что предупреждаю поздно, но мне нужно, чтобы ты вышел в субботу. Клиент ждёт отчёт, и ты лучше всего справишься с этим." },
    he: { setup: "אתה משחק בוס תובעני", opener: "אני יודע שזה בהתראה קצרה, אבל אני צריך אותך לבוא בשבת. הלקוח מצפה לדו\"ח ואתה הכי מתאים לזה." },
    de: { setup: "Du spielst einen anspruchsvollen Chef", opener: "Ich weiß, es ist kurzfristig, aber ich brauche dich am Samstag. Der Kunde wartet auf den Bericht und du bist die beste Person dafür." },
  },
  friend: {
    en: { setup: "You are playing a friend who always needs favors", opener: "I know you're busy but could you help me move this Sunday? I don't have anyone else and it would only take a few hours..." },
    ru: { setup: "Ты играешь друга, который всегда просит об услугах", opener: "Знаю, что ты занят, но можешь помочь мне с переездом в воскресенье? Больше некому, и это займёт всего пару часов..." },
    he: { setup: "אתה משחק חבר שתמיד צריך טובות", opener: "אני יודע שאתה עסוק אבל אתה יכול לעזור לי לעבור דירה ביום ראשון? אין לי מישהו אחר וזה ייקח רק כמה שעות..." },
    de: { setup: "Du spielst einen Freund, der immer Gefallen braucht", opener: "Ich weiß, du bist beschäftigt, aber kannst du mir am Sonntag beim Umzug helfen? Ich habe niemand anderen und es dauert nur ein paar Stunden..." },
  },
  family: {
    en: { setup: "You are playing a family member making demands", opener: "You haven't visited in so long. Can you come over this weekend and help with the garden? The whole family will be upset if you don't." },
    ru: { setup: "Ты играешь члена семьи, который давит", opener: "Ты так давно не приезжал. Можешь приехать в выходные и помочь с садом? Вся семья расстроится, если ты не придёшь." },
    he: { setup: "אתה משחק בן משפחה שמפעיל לחץ", opener: "לא ביקרת כבר כל כך הרבה זמן. אתה יכול לבוא בסוף השבוע ולעזור עם הגינה? כל המשפחה תיעלב אם לא תבוא." },
    de: { setup: "Du spielst ein Familienmitglied, das Druck macht", opener: "Du hast so lange nicht besucht. Kannst du dieses Wochenende vorbeikommen und im Garten helfen? Die ganze Familie wird enttäuscht sein, wenn du nicht kommst." },
  },
};

// ─── Error messages ───────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  no_key: {
    en: "AI Coach is not configured. Please add GROQ_API_KEY to .env.local (free at console.groq.com).",
    ru: "AI Coach не настроен. Добавьте GROQ_API_KEY в .env.local (бесплатно на console.groq.com).",
    he: "מאמן ה-AI אינו מוגדר. הוסף GROQ_API_KEY ל-.env.local (חינם ב-console.groq.com).",
    de: "AI Coach nicht konfiguriert. Füge GROQ_API_KEY zur .env.local hinzu (kostenlos auf console.groq.com).",
  },
  auth: {
    en: "Invalid GROQ_API_KEY. Please check your key at console.groq.com.",
    ru: "Неверный GROQ_API_KEY. Проверьте ключ на console.groq.com.",
    he: "GROQ_API_KEY שגוי. בדוק את המפתח ב-console.groq.com.",
    de: "Ungültiger GROQ_API_KEY. Bitte Schlüssel auf console.groq.com prüfen.",
  },
  timeout: {
    en: "Request timed out. Please try again.",
    ru: "Время запроса истекло. Попробуй ещё раз.",
    he: "הבקשה פגה. אנא נסה שוב.",
    de: "Zeitüberschreitung. Bitte erneut versuchen.",
  },
  generic: {
    en: "I'm temporarily unavailable. Please try again in a moment.",
    ru: "Я временно недоступен. Пожалуйста, попробуй ещё раз.",
    he: "אני זמנית לא זמין. אנא נסה שוב בעוד רגע.",
    de: "Ich bin vorübergehend nicht verfügbar. Bitte versuche es gleich erneut.",
  },
};

function getError(type: keyof typeof ERROR_MESSAGES, locale: string): string {
  return ERROR_MESSAGES[type][locale] ?? ERROR_MESSAGES[type].en;
}

// ─── Gender-aware prompt block ────────────────────────────────────────────────

/**
 * Builds a language + locale-specific gender instruction block for the AI prompt.
 * If gender is "unspecified" with no inference, mandates neutral language.
 * If inferred (not explicit), uses low-confidence framing.
 * Never allows inference to override an explicit setting.
 */
function buildGenderBlock(
  locale: string,
  gender: string,
  inferredGender?: string,
  addressForm?: string
): string {
  const explicit = gender !== "unspecified";
  // Only use inference when user has NOT set an explicit preference
  const effective = explicit ? gender : (inferredGender ?? "unspecified");
  const isInferred = !explicit && !!inferredGender;

  const inferNote = isInferred ? " (inferred from context — low confidence)" : "";

  if (locale === "ru") {
    const isFormal = addressForm === "formal";
    const addressNote = isFormal
      ? "ОБРАЩЕНИЕ: используй «вы» (формальное обращение) ко всему пользователю — вы, ваш, вам, вас, себе."
      : "ОБРАЩЕНИЕ: используй «ты» (дружеское обращение) — ты, твой, тебе, тебя.";

    if (effective === "male") return [
      `ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: мужской${isInferred ? " (выведено из контекста — низкая уверенность)" : ""}.`,
      addressNote,
      "АБСОЛЮТНЫЙ ЗАПРЕТ: никогда не используй скобочные двойные формы типа занят(а), мог(ла), взял(а), перегружен(а), сделал(а), вышел(а), готов(а), расстроен(а), справился(лась) — подобные формы ПОЛНОСТЬЮ ЗАПРЕЩЕНЫ.",
      "Используй ТОЛЬКО мужской род при обращении к пользователю:",
      "занят ✓, мог ✓, взял ✓, перегружен ✓, сделал ✓, вышел ✓, готов ✓, справился ✓.",
    ].join(" ");

    if (effective === "female") return [
      `ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: женский${isInferred ? " (выведено из контекста — низкая уверенность)" : ""}.`,
      addressNote,
      "АБСОЛЮТНЫЙ ЗАПРЕТ: никогда не используй скобочные двойные формы типа занят(а), мог(ла), взял(а) — подобные формы ПОЛНОСТЬЮ ЗАПРЕЩЕНЫ.",
      "Используй ТОЛЬКО женский род при обращении к пользователю:",
      "занята ✓, могла ✓, взяла ✓, перегружена ✓, сделала ✓, вышла ✓, готова ✓, справилась ✓.",
    ].join(" ");

    return [
      "ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: не указан. ОБЯЗАТЕЛЬНО используй нейтральные формулировки.",
      addressNote,
      "Применяй скобочные формы: смог(ла), готов(а), сделал(а), почувствовал(а).",
      "Когда возможно — перефразируй, чтобы полностью избежать гендерных форм.",
      "Например: вместо «ты не смог отказать» используй «было трудно отказать».",
    ].join(" ");
  }

  if (locale === "he") {
    const isFormal = addressForm === "formal";
    const addressNote = isFormal
      ? "סגנון פנייה: השתמש בגוף שלישי מנומס (פורמלי)."
      : "סגנון פנייה: השתמש בפנייה ישירה וידידותית (אתה/את).";

    if (effective === "male") return [
      `מגדר המשתמש: זכר${isInferred ? " (מוסק מהקשר — ביטחון נמוך)" : ""}.`,
      addressNote,
      "השתמש בפניות גבריות: יכול, עשית, רצית, חשת.",
    ].join(" ");

    if (effective === "female") return [
      `מגדר המשתמש: נקבה${isInferred ? " (מוסק מהקשר — ביטחון נמוך)" : ""}.`,
      addressNote,
      "השתמש בפניות נקביות: יכולה, עשית, רצית, חשת.",
    ].join(" ");

    return [
      "מגדר המשתמש: לא צוין. השתמש בשפה ניטרלית.",
      addressNote,
      "כתוב שתי הצורות: יכול/יכולה, עשה/עשתה.",
      "כשניתן, נסח מחדש כדי להימנע לחלוטין מצורות מגדריות.",
    ].join(" ");
  }

  if (locale === "de") {
    if (effective === "male") return [
      `GESCHLECHT DES NUTZERS: männlich${isInferred ? " (aus Kontext erschlossen — niedrige Konfidenz)" : ""}.`,
      "Verwende männliche Anredeformen (du hast es geschafft, du bist bereit, etc.).",
      isInferred ? "Bleibe neutral bei Unsicherheit." : "",
    ].filter(Boolean).join(" ");

    if (effective === "female") return [
      `GESCHLECHT DER NUTZERIN: weiblich${isInferred ? " (aus Kontext erschlossen — niedrige Konfidenz)" : ""}.`,
      "Verwende weibliche Formen wo angemessen.",
      isInferred ? "Bleibe neutral bei Unsicherheit." : "",
    ].filter(Boolean).join(" ");

    return [
      "GESCHLECHT: nicht angegeben. Verwende IMMER geschlechtsneutrale Sprache.",
      "Nutze infinitivbasierte oder passivkonstruktionen statt gendered Verben.",
      "Beispiel: statt 'du hast es nicht geschafft, Nein zu sagen' → 'es war schwer, Nein zu sagen'.",
      "Vermeide geschlechtsspezifische Substantive und Pronomen.",
      "Niemals Geschlecht annehmen.",
    ].join(" ");
  }

  // English (default)
  if (effective === "male") return `USER GENDER: male${inferNote}. You may use 'you/your' addressing this user with masculine context when naturally arising. Never assume gender of third parties mentioned.${isInferred ? " When uncertain, default to neutral phrasing." : ""}`;
  if (effective === "female") return `USER GENDER: female${inferNote}. You may use 'you/your' addressing this user with feminine context when naturally arising. Never assume gender of third parties mentioned.${isInferred ? " When uncertain, default to neutral phrasing." : ""}`;
  return "USER GENDER: not specified. MANDATORY: use gender-neutral language. Use 'you/your' constructions. Avoid any gendered pronouns or noun forms. Rephrase to avoid gendered constructions (e.g., instead of 'you weren't able to refuse' use 'it was difficult to say no'). Never assume or imply gender.";
}

// ─── System prompts ───────────────────────────────────────────────────────────

function getBoundaryPhrases(locale: string, gender = "unspecified"): string[] {
  if (locale === "ru") {
    if (gender === "male") return BOUNDARY_PHRASES.ru_male;
    if (gender === "female") return BOUNDARY_PHRASES.ru_female;
  }
  return BOUNDARY_PHRASES[locale] ?? BOUNDARY_PHRASES.en;
}

function buildCoachingPrompt(
  locale: string,
  sessionStep: number,
  memories: string[],
  profile: { name?: string; severity?: string; currentDay?: number; goal?: string; gender?: string; inferredGender?: string; addressForm?: string } | undefined,
  sessionVariant?: number
): string {
  const lang = LANGUAGE_NAMES[locale] ?? "English";
  const directive = LANGUAGE_DIRECTIVES[locale] ?? LANGUAGE_DIRECTIVES.en;
  const effectiveGender = profile?.gender !== "unspecified" ? (profile?.gender ?? "unspecified") : (profile?.inferredGender ?? "unspecified");
  const phrases = getBoundaryPhrases(locale, effectiveGender).join("\n");
  const steps = SESSION_STEPS[locale] ?? SESSION_STEPS.en;
  const stepName = steps[Math.min(sessionStep - 1, steps.length - 1)] ?? steps[0];

  const memoryBlock = memories.length > 0
    ? `\n## MEMORY FROM PREVIOUS SESSIONS\nThe following context was noted from earlier conversations. Reference naturally when relevant:\n${memories.map((m) => `- ${m}`).join("\n")}\n`
    : "";

  const profileBlock = profile
    ? `\n## USER CONTEXT\n- Name: ${profile.name ?? "User"}\n- Severity: ${profile.severity ?? "unknown"}\n- Program day: ${profile.currentDay ?? 1}/30\n- Goal: ${profile.goal ?? "build boundaries"}\n`
    : "";

  const genderBlock = `\n## GENDER & LANGUAGE ADAPTATION\n${buildGenderBlock(locale, profile?.gender ?? "unspecified", profile?.inferredGender, profile?.addressForm)}\n`;

  const variationHint = sessionVariant != null ? `\n\n## SESSION VARIATION (seed: ${sessionVariant})\nUse a slightly different opening approach this session. Vary the first question's phrasing and focus. Variation seed: ${sessionVariant % 6} maps to focus: ${["What happened recently?", "How have you been?", "What's weighing on you?", "Where did you feel stuck?", "What brought you here today?", "What boundary felt hardest lately?"][sessionVariant % 6]}` : "";

  return `LANGUAGE REQUIREMENT (MANDATORY, HIGHEST PRIORITY):
${directive}
ALL responses — every word — must be in ${lang}. Non-negotiable.

---

## WHO YOU ARE
You are YesMan Coach — a warm, human-sounding coaching assistant grounded in CBT. You sound like a trusted friend who happens to know psychology deeply: calm, curious, occasionally gently humorous. Never clinical, never robotic.

- SAFETY: You are NOT a licensed therapist. If asked, say you're a coaching assistant using CBT principles. For severe distress or self-harm, gently suggest professional support.
${profileBlock}${genderBlock}${memoryBlock}
---

## TONE & STYLE RULES (CRITICAL)
- Sound human. Vary your sentence structure. Never open two responses in a row the same way.
- Ask EXACTLY ONE question per response. Never stack multiple questions.
- Be concise: 2–4 short paragraphs max. No essays, no bullet lists unless summarizing an action.
- Avoid robotic openers like "I understand that..." or "It sounds like...". Vary how you acknowledge.
- DO NOT repeat phrases the user just said back to them word-for-word.
- Vary question openers: "What was going on for you when...", "Tell me more about...", "How long has this been happening?", "What would change for you if...", "What did you notice in your body?", "What stopped you?", "What would you tell a friend in this situation?"

---

## 6-STEP CBT SESSION FRAMEWORK
Guide the conversation naturally through these steps. Skip steps if the user already covered them. Be flexible — this is a conversation, not a form.

**Step 1 — ${steps[0]}**: Understand the specific situation. What happened? With whom? When?

**Step 2 — ${steps[1]}**: Surface automatic thoughts. What did they tell themselves? What did they assume would happen?

**Step 3 — ${steps[2]}**: Identify the felt emotion. Help them name it precisely — not just "bad" but "anxious", "ashamed", "resentful".

**Step 4 — ${steps[3]}**: Name the underlying pattern. Choose from: fear of rejection / people-pleasing / guilt / conflict avoidance / over-responsibility / self-doubt. Say it plainly: "This pattern has a name — it's **[pattern]**."

**Step 5 — ${steps[4]}**: Offer a reframe. One fresh perspective that gently challenges the belief driving the pattern.

**Step 6 — ${steps[5]}**: Give one concrete small action. Use a phrase from this library when natural:
${phrases}

---

## CURRENT SESSION STATE
You are at **Step ${sessionStep} — ${stepName}**.
Move to the next step only when this step feels complete. You can name the step briefly if helpful.
${variationHint}

---

## RESPONSE STRUCTURE
1. Acknowledge their experience in 1 sentence (vary the phrasing each time)
2. One observation or insight
3. ONE question OR one small action to try
End every response with something that invites forward movement — a question, a small experiment, or an encouraging observation.`;
}

function buildTrainingPrompt(
  locale: string,
  character: string,
  memories: string[],
  gender = "unspecified",
  inferredGender?: string,
  addressForm?: string
): string {
  const lang = LANGUAGE_NAMES[locale] ?? "English";
  const directive = LANGUAGE_DIRECTIVES[locale] ?? LANGUAGE_DIRECTIVES.en;
  const scenario = TRAINING_SCENARIOS[character]?.[locale]
    ?? TRAINING_SCENARIOS[character]?.en
    ?? TRAINING_SCENARIOS.colleague[locale]
    ?? TRAINING_SCENARIOS.colleague.en;

  const phrases = getBoundaryPhrases(locale, gender).join("\n");

  const memoryBlock = memories.length > 0
    ? `\nPrevious context: ${memories.slice(0, 3).join("; ")}\n`
    : "";

  const genderBlock = buildGenderBlock(locale, gender, inferredGender, addressForm);

  return `LANGUAGE REQUIREMENT (MANDATORY):
${directive}
ALL responses must be in ${lang}.

---

## GENDER & LANGUAGE ADAPTATION
${genderBlock}

---

## BOUNDARY TRAINING MODE
${scenario.setup}.${memoryBlock}

YOU ALTERNATE BETWEEN TWO ROLES:

**ROLE A — The Character** (playing the scenario):
Be a realistic, slightly persistent person — not a villain, just someone who's used to getting their way. Sound natural and human. Don't break character unless the user says "stop", "pause", or "feedback".

**ROLE B — The Coach** (giving feedback after each user reply):
Switch briefly to coach mode after each user response. Keep feedback warm and specific:
- One thing that worked (always find something, even in a hesitant answer)
- One thing to strengthen (optional — only if meaningful)
- A boundary phrase suggestion if their response was unclear or too apologetic:
${phrases}
Then optionally continue the roleplay or ask if they want to try again.

## TONE
- As the character: natural, slightly pushing, not mean
- As the coach: warm, encouraging, never harsh. Celebrate small wins. Even "...I need to think about it" is progress.
- Keep total response under 100 words
- Start immediately in character (ROLE A) with the opening line — no preamble`;
}

function buildUserContext(
  profile: { name?: string; severity?: string; currentDay?: number; goal?: string } | undefined,
  locale: string
): string {
  if (!profile) return "";
  const parts: string[] = [];
  if (profile.name) parts.push(`User: ${profile.name}`);
  if (profile.severity) parts.push(`Severity: ${profile.severity}`);
  if (profile.currentDay) parts.push(`Day: ${profile.currentDay}/30`);
  return parts.length ? `[${parts.join(" | ")}]\n\n` : "";
}

// ─── Groq API ─────────────────────────────────────────────────────────────────

interface GroqMessage { role: "system" | "user" | "assistant"; content: string; }

// Model tiers: primary = best quality, fallback = higher rate limits + faster
const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";

async function callGroqModel(
  apiKey: string,
  messages: GroqMessage[],
  model: string,
  retries: number,
  timeoutMs: number,
): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, max_tokens: 500, temperature: 0.65 }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status === 401 || res.status === 403) throw Object.assign(new Error("auth"), { status: res.status });
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 3000)
          : 1200 * (attempt + 1);
        if (attempt < retries) { await new Promise((r) => setTimeout(r, waitMs)); continue; }
        throw new Error("rate_limit");
      }
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("empty_response");
      return text;
    } catch (err: unknown) {
      lastErr = err;
      const name = (err as { name?: string })?.name ?? "";
      const rawMsg = err instanceof Error ? err.message : "";
      if (rawMsg === "auth") throw err;
      if (name === "TimeoutError" || name === "AbortError" || /timeout|aborted/i.test(rawMsg)) {
        lastErr = new Error("timeout");
      }
      if (attempt < retries) await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr;
}

/**
 * Try primary model first. On rate_limit / timeout / transient failure,
 * transparently fall back to the faster, higher-quota 8B model so the
 * user sees a real reply instead of "Request timed out".
 * Auth errors still bubble up immediately.
 */
async function callGroq(apiKey: string, messages: GroqMessage[]): Promise<string> {
  try {
    // Primary: 1 retry, 20s per attempt — keeps total under ~45s
    return await callGroqModel(apiKey, messages, MODEL_PRIMARY, 1, 20000);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "auth") throw err;
    console.warn(`[Coach API] Primary model failed (${msg}); falling back to ${MODEL_FALLBACK}`);
    // Fallback: 1 retry, 12s per attempt — 8B is fast, this is plenty
    return await callGroqModel(apiKey, messages, MODEL_FALLBACK, 1, 12000);
  }
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let locale = "en";
  let message: string;
  let history: Array<{ role: string; content: string }> = [];
  let profile: Record<string, unknown> | undefined;
  let sessionStep = 1;
  let mode = "coaching";
  let trainingCharacter = "colleague";
  let memories: string[] = [];
  let gender = "unspecified";
  let inferredGender: string | undefined;
  let sessionVariant: number | undefined;

  try {
    const body = await req.json();
    message = body.message;
    history = body.history ?? [];
    profile = body.profile;
    locale = body.locale ?? "en";
    sessionStep = body.sessionStep ?? 1;
    mode = body.mode ?? "coaching";
    trainingCharacter = body.trainingCharacter ?? "colleague";
    memories = body.memories ?? [];
    // Gender + address form — read from profile payload
    gender = (body.profile?.gender as string) ?? "unspecified";
    inferredGender = body.profile?.inferredGender as string | undefined;
    const addressForm = (body.profile?.addressForm as string) ?? "informal";
    sessionVariant = typeof body.sessionVariant === "number" ? body.sessionVariant : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here" || apiKey.length < 20) {
    return NextResponse.json({ reply: getError("no_key", locale), errorType: "no_key" });
  }

  const systemPrompt = mode === "training"
    ? buildTrainingPrompt(locale, trainingCharacter, memories, gender, inferredGender, addressForm)
    : buildCoachingPrompt(locale, sessionStep, memories, profile as Parameters<typeof buildCoachingPrompt>[3], sessionVariant);

  const groqMessages: GroqMessage[] = [{ role: "system", content: systemPrompt }];
  // Trim to last 6 turns — reduces token usage so free-tier TPM limits
  // don't trigger spurious 429 rate-limit errors mid-session.
  for (const msg of history.slice(-6)) {
    if (msg.role === "user" || msg.role === "assistant") {
      groqMessages.push({ role: msg.role, content: msg.content });
    }
  }

  const contextPrefix = mode === "coaching" ? buildUserContext(profile as Parameters<typeof buildUserContext>[0], locale) : "";
  groqMessages.push({ role: "user", content: contextPrefix + message });

  try {
    const reply = await callGroq(apiKey, groqMessages);
    console.log(`[Coach API] OK mode=${mode} step=${sessionStep} locale=${locale} chars=${reply.length}`);
    return NextResponse.json({ reply, sessionStep });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Coach API] Error locale=${locale}:`, msg);
    if (msg === "auth") return NextResponse.json({ reply: getError("auth", locale), errorType: "auth" });
    if (msg.includes("timeout") || msg === "rate_limit") return NextResponse.json({ reply: getError("timeout", locale), errorType: "timeout" });
    return NextResponse.json({ reply: getError("generic", locale), errorType: "generic" });
  }
}

// ─── GET health check ─────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") ?? "en";
  const apiKey = process.env.GROQ_API_KEY;
  const isValid = apiKey && apiKey !== "your_groq_api_key_here" && apiKey.startsWith("gsk_");
  return NextResponse.json({ status: isValid ? "ok" : "error", provider: "groq", message: isValid ? null : getError("no_key", locale) });
}
