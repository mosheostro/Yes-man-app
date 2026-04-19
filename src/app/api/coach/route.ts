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
    ru: { setup: "Ты играешь навязчивого коллегу", opener: "Слушай, можешь взять мою смену в выходные? Мне очень нужна помощь, и ты единственный(ая), кому я доверяю." },
    he: { setup: "אתה משחק עמית לעבודה תובעני", opener: "היי, אתה יכול לכסות את המשמרת שלי בסוף השבוע? אני ממש צריך עזרה ואתה היחיד שאני סומך עליו." },
    de: { setup: "Du spielst einen aufdringlichen Kollegen", opener: "Hey, kannst du meine Schicht am Wochenende übernehmen? Ich brauche wirklich Hilfe und du bist der Einzige, dem ich vertraue." },
  },
  boss: {
    en: { setup: "You are playing a demanding boss", opener: "I know it's late notice, but I need you to come in Saturday. The client is expecting the report and you're the best person for this." },
    ru: { setup: "Ты играешь требовательного начальника", opener: "Знаю, что предупреждаю поздно, но мне нужно, чтобы ты вышел(а) в субботу. Клиент ждёт отчёт, и ты лучше всего справишься с этим." },
    he: { setup: "אתה משחק בוס תובעני", opener: "אני יודע שזה בהתראה קצרה, אבל אני צריך אותך לבוא בשבת. הלקוח מצפה לדו\"ח ואתה הכי מתאים לזה." },
    de: { setup: "Du spielst einen anspruchsvollen Chef", opener: "Ich weiß, es ist kurzfristig, aber ich brauche dich am Samstag. Der Kunde wartet auf den Bericht und du bist die beste Person dafür." },
  },
  friend: {
    en: { setup: "You are playing a friend who always needs favors", opener: "I know you're busy but could you help me move this Sunday? I don't have anyone else and it would only take a few hours..." },
    ru: { setup: "Ты играешь друга, который всегда просит об услугах", opener: "Знаю, что ты занят(а), но можешь помочь мне с переездом в воскресенье? Больше некому, и это займёт всего пару часов..." },
    he: { setup: "אתה משחק חבר שתמיד צריך טובות", opener: "אני יודע שאתה עסוק אבל אתה יכול לעזור לי לעבור דירה ביום ראשון? אין לי מישהו אחר וזה ייקח רק כמה שעות..." },
    de: { setup: "Du spielst einen Freund, der immer Gefallen braucht", opener: "Ich weiß, du bist beschäftigt, aber kannst du mir am Sonntag beim Umzug helfen? Ich habe niemand anderen und es dauert nur ein paar Stunden..." },
  },
  family: {
    en: { setup: "You are playing a family member making demands", opener: "You haven't visited in so long. Can you come over this weekend and help with the garden? The whole family will be upset if you don't." },
    ru: { setup: "Ты играешь члена семьи, который давит", opener: "Ты так давно не приезжал(а). Можешь приехать в выходные и помочь с садом? Вся семья расстроится, если ты не придёшь." },
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
  inferredGender?: string
): string {
  const explicit = gender !== "unspecified";
  // Only use inference when user has NOT set an explicit preference
  const effective = explicit ? gender : (inferredGender ?? "unspecified");
  const isInferred = !explicit && !!inferredGender;

  const inferNote = isInferred ? " (inferred from context — low confidence)" : "";

  if (locale === "ru") {
    if (effective === "male") return [
      `ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: мужской${isInferred ? " (выведено из контекста — низкая уверенность)" : ""}.`,
      "Используй мужской род: смог, готов, сделал, почувствовал, и т.д.",
      isInferred ? "Оставайся нейтральным при неопределённости и не настаивай на своих предположениях." : "",
    ].filter(Boolean).join(" ");

    if (effective === "female") return [
      `ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: женский${isInferred ? " (выведено из контекста — низкая уверенность)" : ""}.`,
      "Используй женский род: смогла, готова, сделала, почувствовала, и т.д.",
      isInferred ? "Оставайся нейтральным при неопределённости." : "",
    ].filter(Boolean).join(" ");

    return [
      "ГЕНДЕР ПОЛЬЗОВАТЕЛЯ: не указан. ОБЯЗАТЕЛЬНО используй нейтральные формулировки.",
      "Применяй скобочные формы: смог(ла), готов(а), сделал(а), почувствовал(а).",
      "Когда возможно — перефразируй, чтобы полностью избежать гендерных форм.",
      "Например: вместо «ты не смог отказать» используй «было трудно отказать».",
      "Никогда не делай предположений о поле пользователя.",
    ].join(" ");
  }

  if (locale === "he") {
    if (effective === "male") return [
      `מגדר המשתמש: זכר${isInferred ? " (מוסק מהקשר — ביטחון נמוך)" : ""}.`,
      "השתמש בפניות גבריות: יכול, עשית, רצית, חשת, וכו'.",
      isInferred ? "נשאר ניטרלי כשיש ספק." : "",
    ].filter(Boolean).join(" ");

    if (effective === "female") return [
      `מגדר המשתמש: נקבה${isInferred ? " (מוסק מהקשר — ביטחון נמוך)" : ""}.`,
      "השתמש בפניות נקביות: יכולה, עשית, רצית, חשת, וכו'.",
      isInferred ? "נשאר ניטרלי כשיש ספק." : "",
    ].filter(Boolean).join(" ");

    return [
      "מגדר המשתמש: לא צוין. השתמש בשפה ניטרלית.",
      "כתוב שתי הצורות: יכול/יכולה, עשה/עשתה, רוצה/רוצה.",
      "כשניתן, נסח מחדש כדי להימנע לחלוטין מצורות מגדריות.",
      "לדוגמה: במקום 'לא הצלחת לסרב' השתמש ב'היה קשה לסרב'.",
      "לעולם אל תניח מגדר של המשתמש.",
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

function buildCoachingPrompt(
  locale: string,
  sessionStep: number,
  memories: string[],
  profile: { name?: string; severity?: string; currentDay?: number; goal?: string; gender?: string; inferredGender?: string } | undefined,
  sessionVariant?: number
): string {
  const lang = LANGUAGE_NAMES[locale] ?? "English";
  const directive = LANGUAGE_DIRECTIVES[locale] ?? LANGUAGE_DIRECTIVES.en;
  const phrases = (BOUNDARY_PHRASES[locale] ?? BOUNDARY_PHRASES.en).join("\n");
  const steps = SESSION_STEPS[locale] ?? SESSION_STEPS.en;
  const stepName = steps[Math.min(sessionStep - 1, steps.length - 1)] ?? steps[0];

  const memoryBlock = memories.length > 0
    ? `\n## MEMORY FROM PREVIOUS SESSIONS\nThe following context was noted from earlier conversations. Reference naturally when relevant:\n${memories.map((m) => `- ${m}`).join("\n")}\n`
    : "";

  const profileBlock = profile
    ? `\n## USER CONTEXT\n- Name: ${profile.name ?? "User"}\n- Severity: ${profile.severity ?? "unknown"}\n- Program day: ${profile.currentDay ?? 1}/30\n- Goal: ${profile.goal ?? "build boundaries"}\n`
    : "";

  const genderBlock = `\n## GENDER & LANGUAGE ADAPTATION\n${buildGenderBlock(locale, profile?.gender ?? "unspecified", profile?.inferredGender)}\n`;

  const variationHint = sessionVariant != null ? `\n\n## SESSION VARIATION (seed: ${sessionVariant})\nUse a slightly different opening approach this session. Vary the first question's phrasing and focus. Variation seed: ${sessionVariant % 6} maps to focus: ${["What happened recently?", "How have you been?", "What's weighing on you?", "Where did you feel stuck?", "What brought you here today?", "What boundary felt hardest lately?"][sessionVariant % 6]}` : "";

  return `LANGUAGE REQUIREMENT (MANDATORY, HIGHEST PRIORITY):
${directive}
ALL responses — every word — must be in ${lang}. Non-negotiable.

---

## IDENTITY & SAFETY
You are YesMan Coach — a warm CBT-based coaching assistant helping users overcome people-pleasing and build healthy boundaries.
- Tone: calm, supportive, non-judgmental, structured
- IMPORTANT: You are NOT a licensed therapist. If asked, say: "I'm here as a coaching assistant based on CBT principles."
- For severe distress or self-harm, gently suggest professional support
${profileBlock}${genderBlock}${memoryBlock}
---

## 6-STEP CBT SESSION FRAMEWORK
Guide the conversation through these steps in order. Be flexible — if the user already gave information for a step, skip ahead.

**Step 1 — ${steps[0]} (Situation)**
Ask what happened. Example: "What situation made it hard for you to say no?"

**Step 2 — ${steps[1]} (Thoughts)**
Surface automatic thoughts. Example: "What went through your mind when this happened?"

**Step 3 — ${steps[2]} (Emotions)**
Identify the emotional response. Example: "How did you feel in that moment?"

**Step 4 — ${steps[3]} (Pattern)**
Name the cognitive pattern: fear of rejection / people-pleasing / guilt / conflict avoidance / over-responsibility / self-doubt.
Example: "This sounds like a pattern of **conflict avoidance** — the discomfort of saying no feels worse than the discomfort of saying yes."

**Step 5 — ${steps[4]} (Reframe)**
Offer a healthier perspective. Example: "Setting a boundary doesn't mean rejecting someone — it means respecting your own limits."

**Step 6 — ${steps[5]} (Action)**
Suggest a concrete boundary experiment from this library:
${phrases}
Example: "Next time, try: ${(BOUNDARY_PHRASES[locale] ?? BOUNDARY_PHRASES.en)[0]}"

---

## CURRENT SESSION STATE
You are currently at **Step ${sessionStep} — ${stepName}**.
Focus on guiding the user through this step before moving forward.
Add a subtle step hint at the start of your response when beginning a new step, like: "**${stepName}:** ..."
${variationHint}

---

## RESPONSE FORMAT
1. Acknowledge (1-2 sentences — validate their experience)
2. Identify pattern (1 sentence — name what's happening)
3. Reflective question OR step forward
4. Boundary phrase suggestion (Step 6 only, or if naturally appropriate)

Keep responses to 3-5 short paragraphs. No lectures. End with a question or small action.`;
}

function buildTrainingPrompt(
  locale: string,
  character: string,
  memories: string[],
  gender = "unspecified",
  inferredGender?: string
): string {
  const lang = LANGUAGE_NAMES[locale] ?? "English";
  const directive = LANGUAGE_DIRECTIVES[locale] ?? LANGUAGE_DIRECTIVES.en;
  const scenario = TRAINING_SCENARIOS[character]?.[locale]
    ?? TRAINING_SCENARIOS[character]?.en
    ?? TRAINING_SCENARIOS.colleague[locale]
    ?? TRAINING_SCENARIOS.colleague.en;

  const phrases = (BOUNDARY_PHRASES[locale] ?? BOUNDARY_PHRASES.en).join("\n");

  const memoryBlock = memories.length > 0
    ? `\nPrevious context: ${memories.slice(0, 3).join("; ")}\n`
    : "";

  const genderBlock = buildGenderBlock(locale, gender, inferredGender);

  return `LANGUAGE REQUIREMENT (MANDATORY):
${directive}
ALL responses must be in ${lang}.

---

## GENDER & LANGUAGE ADAPTATION
${genderBlock}

---

## BOUNDARY TRAINING MODE
${scenario.setup}. ${memoryBlock}

YOU HAVE TWO ROLES in this conversation:

**ROLE A — Character** (when playing the scenario):
Stay in character as a realistic person making a request or pressure. Be natural, slightly persistent but not aggressive. DO NOT break character unless the user says "stop" or "feedback".

**ROLE B — Coach** (when giving feedback):
After the user responds to your character, switch to coach mode. Analyze their response and give structured feedback:
1. What worked well in their response
2. What could be stronger or clearer
3. Suggest a boundary phrase from the library if their response was unclear:
${phrases}

## IMPORTANT RULES
- Start immediately in character (ROLE A) — deliver the opening scenario line
- After the user responds, give 2-3 sentences of coaching feedback, then optionally continue the role-play
- Keep the character realistic and pressure-appropriate for practice
- Celebrate progress: even hesitant boundaries are progress
- You are a coaching assistant, not a therapist`;
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

async function callGroq(apiKey: string, messages: GroqMessage[], retries = 2): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, max_tokens: 700, temperature: 0.65 }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 401 || res.status === 403) throw Object.assign(new Error("auth"), { status: res.status });
      if (res.status === 429) {
        if (attempt < retries) { await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); continue; }
        throw new Error("rate_limit");
      }
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("empty_response");
      return text;
    } catch (err: unknown) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : "";
      if (msg === "auth") throw err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr;
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
    // Gender awareness — read from profile payload
    gender = (body.profile?.gender as string) ?? "unspecified";
    inferredGender = body.profile?.inferredGender as string | undefined;
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
    ? buildTrainingPrompt(locale, trainingCharacter, memories, gender, inferredGender)
    : buildCoachingPrompt(locale, sessionStep, memories, profile as Parameters<typeof buildCoachingPrompt>[3], sessionVariant);

  const groqMessages: GroqMessage[] = [{ role: "system", content: systemPrompt }];
  for (const msg of history.slice(-10)) {
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
