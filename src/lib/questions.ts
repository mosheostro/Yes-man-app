// ─── Dynamic Question Engine ─────────────────────────────────────────────────
// 110 questions across 7 categories × 4 locales.
// The picker selects 5 contextually relevant questions per call,
// weighted by detected patterns, session step, and conversation history.

export type QCategory =
  | "general"
  | "fear_of_rejection"
  | "conflict_avoidance"
  | "guilt"
  | "over_responsibility"
  | "people_pleasing"
  | "self_doubt";

export interface DQ {
  id: string;
  en: string;
  ru: string; // All Russian uses present-tense or impersonal forms (gender-neutral)
  he: string;
  de: string;
  cats: QCategory[];
  steps?: number[]; // CBT steps 1-6 where this chip fits best
}

export const QUESTIONS: DQ[] = [

  // ── GENERAL (20) ───────────────────────────────────────────────────────────
  {
    id: "g01", cats: ["general", "people_pleasing"],
    en: "I couldn't say no again",
    ru: "Снова не получилось сказать нет",
    he: "שוב לא הצלחתי להגיד לא",
    de: "Ich konnte wieder nicht Nein sagen",
  },
  {
    id: "g02", cats: ["general", "guilt"],
    en: "I feel guilty for setting a boundary",
    ru: "Чувствую вину за попытку поставить границу",
    he: "אני מרגיש אשמה על הצבת גבול",
    de: "Ich fühle mich schuldig wegen einer Grenze",
  },
  {
    id: "g03", cats: ["general"],
    en: "How do I handle pressure at work?",
    ru: "Как справляться с давлением на работе?",
    he: "איך להתמודד עם לחץ בעבודה?",
    de: "Wie gehe ich mit Druck bei der Arbeit um?",
  },
  {
    id: "g04", cats: ["general", "fear_of_rejection"],
    en: "I'm afraid of being rejected",
    ru: "Страшно, что меня могут отвергнуть",
    he: "אני מפחד מדחייה",
    de: "Ich habe Angst vor Ablehnung",
  },
  {
    id: "g05", cats: ["general", "people_pleasing"],
    en: "Help me practice saying no",
    ru: "Хочу потренироваться говорить «нет»",
    he: "עזור לי להתאמן להגיד לא",
    de: "Hilf mir Nein sagen zu üben",
  },
  {
    id: "g06", cats: ["general", "self_doubt"],
    en: "Nobody believes me when I say no",
    ru: "Мне не верят, когда я говорю нет",
    he: "לא מאמינים לי כשאני אומר לא",
    de: "Mir wird nicht geglaubt wenn ich Nein sage",
  },
  {
    id: "g07", cats: ["general", "guilt"],
    en: "I apologize too much",
    ru: "Я слишком много извиняюсь",
    he: "אני מתנצל יותר מדי",
    de: "Ich entschuldige mich zu oft",
  },
  {
    id: "g08", cats: ["general", "over_responsibility"],
    en: "I struggle with family pressure",
    ru: "Трудно справляться с давлением семьи",
    he: "קשה לי עם לחץ משפחתי",
    de: "Ich kämpfe mit Familienerwartungen",
  },
  {
    id: "g09", cats: ["general", "over_responsibility"],
    en: "I feel responsible for everyone's feelings",
    ru: "Я чувствую ответственность за эмоции других",
    he: "אני מרגיש אחראי לרגשות של כולם",
    de: "Ich fühle mich für die Gefühle aller verantwortlich",
  },
  {
    id: "g10", cats: ["general", "self_doubt"],
    en: "I don't know how to ask for what I need",
    ru: "Не знаю, как попросить о том, что мне нужно",
    he: "אני לא יודע לבקש את מה שאני צריך",
    de: "Ich weiß nicht wie ich nach dem fragen soll was ich brauche",
  },
  {
    id: "g11", cats: ["general", "over_responsibility"],
    en: "I always end up doing more than I agreed to",
    ru: "Всегда делаю больше, чем договаривались",
    he: "תמיד מסתיים שאני עושה יותר ממה שהסכמתי",
    de: "Ich tue immer mehr als vereinbart",
  },
  {
    id: "g12", cats: ["general", "people_pleasing"],
    en: "I feel exhausted from pleasing others",
    ru: "Надоело постоянно угождать другим",
    he: "אני עייף מלרצות אחרים",
    de: "Ich bin erschöpft davon andere zu erfreuen",
  },
  {
    id: "g13", cats: ["general", "self_doubt"],
    en: "Someone is taking advantage of my kindness",
    ru: "Кто-то пользуется моей добротой",
    he: "מישהו מנצל את הטוב לב שלי",
    de: "Jemand nutzt meine Freundlichkeit aus",
  },
  {
    id: "g14", cats: ["general", "self_doubt"],
    en: "I changed my mind but feel I can't say so",
    ru: "Хочу изменить решение, но не знаю как сказать",
    he: "התחרטתי אבל לא מצליח לומר את זה",
    de: "Ich habe meine Meinung geändert kann es aber nicht sagen",
  },
  {
    id: "g15", cats: ["general", "conflict_avoidance"],
    en: "I need help with a difficult conversation",
    ru: "Нужна помощь в сложном разговоре",
    he: "אני צריך עזרה בשיחה קשה",
    de: "Ich brauche Hilfe bei einem schwierigen Gespräch",
  },
  {
    id: "g16", cats: ["general", "people_pleasing"],
    en: "I feel taken for granted",
    ru: "Меня воспринимают как само собой разумеющееся",
    he: "מרגיש שמובן מאליו שאסכים",
    de: "Ich werde als selbstverständlich angesehen",
  },
  {
    id: "g17", cats: ["general", "over_responsibility"],
    en: "My colleague keeps delegating work to me",
    ru: "Коллега постоянно перекладывает задачи на меня",
    he: "עמית לעבודה מעביר לי כל הזמן משימות",
    de: "Mein Kollege delegiert ständig Aufgaben an mich",
  },
  {
    id: "g18", cats: ["general", "self_doubt"],
    en: "I can't stop overthinking after saying no",
    ru: "После отказа не могу перестать прокручивать ситуацию",
    he: "אחרי שאמרתי לא אני לא מפסיק לחשוב על זה",
    de: "Ich kann nach einem Nein nicht aufhören zu grübeln",
  },
  {
    id: "g19", cats: ["general", "guilt"],
    en: "I feel selfish when I put myself first",
    ru: "Трудно ставить себя на первое место без чувства эгоизма",
    he: "קשה לי לשים את עצמי ראשון בלי להרגיש אגואיסט",
    de: "Ich fühle mich egoistisch wenn ich mich selbst an erste Stelle setze",
  },
  {
    id: "g20", cats: ["general", "guilt"],
    en: "Someone constantly guilt-trips me",
    ru: "Меня постоянно пытаются вызвать на чувство вины",
    he: "מישהו כל הזמן מנסה לגרום לי להרגיש אשם",
    de: "Jemand gibt mir ständig ein schlechtes Gewissen",
  },

  // ── FEAR OF REJECTION (15) ─────────────────────────────────────────────────
  {
    id: "fr01", cats: ["fear_of_rejection"],
    en: "I'm terrified of someone being angry at me",
    ru: "Я боюсь, что человек разозлится на меня",
    he: "אני מפחד שמישהו יכעס עלי",
    de: "Ich habe Angst dass jemand wütend auf mich wird",
  },
  {
    id: "fr02", cats: ["fear_of_rejection", "people_pleasing"],
    en: "I say yes so people will like me",
    ru: "Соглашаюсь, чтобы меня любили",
    he: "אני אומר כן כדי שיאהבו אותי",
    de: "Ich sage Ja damit die Leute mich mögen",
  },
  {
    id: "fr03", cats: ["fear_of_rejection"],
    en: "I can't handle when people are disappointed in me",
    ru: "Не могу вынести, когда люди разочарованы мной",
    he: "אני לא מסוגל להתמודד כשאנשים מאוכזבים ממני",
    de: "Ich kann es nicht ertragen wenn Menschen enttäuscht von mir sind",
  },
  {
    id: "fr04", cats: ["fear_of_rejection"],
    en: "I keep relationships at any cost",
    ru: "Сохраняю отношения любой ценой",
    he: "אני שומר על קשרים בכל מחיר",
    de: "Ich halte Beziehungen um jeden Preis aufrecht",
  },
  {
    id: "fr05", cats: ["fear_of_rejection", "self_doubt"],
    en: "What others think about me paralyzes me",
    ru: "Мнение других обо мне меня парализует",
    he: "מה שאנשים חושבים עלי משתק אותי",
    de: "Was andere über mich denken lähmt mich",
  },
  {
    id: "fr06", cats: ["fear_of_rejection"],
    en: "I say yes to avoid being abandoned",
    ru: "Соглашаюсь, чтобы меня не бросили",
    he: "אני אומר כן כדי לא להיות נעזב",
    de: "Ich sage Ja um nicht verlassen zu werden",
  },
  {
    id: "fr07", cats: ["fear_of_rejection"],
    en: "The silence after setting a boundary is unbearable",
    ru: "Тишина после отказа кажется невыносимой",
    he: "השתיקה אחרי הצבת גבול בלתי נסבלת",
    de: "Die Stille nach einer Grenze fühlt sich unerträglich an",
  },
  {
    id: "fr08", cats: ["fear_of_rejection"],
    en: "I'm afraid of being seen as difficult or cold",
    ru: "Боюсь прослыть «трудным» или «холодным» человеком",
    he: "אני מפחד להיתפס כקשה או קר",
    de: "Ich habe Angst als schwierig oder kalt zu gelten",
  },
  {
    id: "fr09", cats: ["fear_of_rejection"],
    en: "I worry I'll lose the relationship if I say no",
    ru: "Боюсь потерять отношения, если откажу",
    he: "אני חושש לאבד את הקשר אם אגיד לא",
    de: "Ich mache mir Sorgen die Beziehung zu verlieren wenn ich Nein sage",
  },
  {
    id: "fr10", cats: ["fear_of_rejection"],
    en: "I get anxious when someone seems upset with me",
    ru: "Тревожусь, когда чувствую, что кто-то расстроен из-за меня",
    he: "אני נהיה חרד כשאני מרגיש שמישהו כועס עלי",
    de: "Ich werde ängstlich wenn ich spüre dass jemand auf mich böse ist",
  },
  {
    id: "fr11", cats: ["fear_of_rejection", "people_pleasing"],
    en: "I need everyone to approve of what I do",
    ru: "Мне нужно одобрение каждого",
    he: "אני צריך שכולם יסכימו למה שאני עושה",
    de: "Ich brauche die Zustimmung von allen",
  },
  {
    id: "fr12", cats: ["fear_of_rejection"],
    en: "Hard to act when someone might be offended",
    ru: "Трудно действовать, когда кто-то может обидеться",
    he: "קשה לפעול כשמישהו עלול להיפגע",
    de: "Es ist schwer zu handeln wenn jemand beleidigt sein könnte",
  },
  {
    id: "fr13", cats: ["fear_of_rejection"],
    en: "Saying yes feels like the safe option",
    ru: "Согласие кажется «безопасным» выходом",
    he: "לומר כן מרגיש כמו האופציה הבטוחה",
    de: "Ja sagen fühlt sich wie die sichere Option an",
  },
  {
    id: "fr14", cats: ["fear_of_rejection", "conflict_avoidance"],
    en: "I dread any conflict with people I love",
    ru: "Боюсь любого конфликта с близкими людьми",
    he: "אני חושש מכל קונפליקט עם אנשים שאני אוהב",
    de: "Ich scheue jeden Konflikt mit Menschen die ich liebe",
  },
  {
    id: "fr15", cats: ["fear_of_rejection"],
    en: "Being liked feels like a matter of survival",
    ru: "Быть принятым другими ощущается как вопрос выживания",
    he: "להיות אהוב מרגיש כעניין של הישרדות",
    de: "Gemocht zu werden fühlt sich wie eine Überlebensfrage an",
  },

  // ── CONFLICT AVOIDANCE (15) ────────────────────────────────────────────────
  {
    id: "ca01", cats: ["conflict_avoidance"],
    en: "I avoid disagreements at all costs",
    ru: "Избегаю разногласий любой ценой",
    he: "אני נמנע מחילוקי דעות בכל מחיר",
    de: "Ich vermeide Meinungsverschiedenheiten um jeden Preis",
  },
  {
    id: "ca02", cats: ["conflict_avoidance"],
    en: "I give in the moment there's tension",
    ru: "Сдаюсь при малейшем напряжении",
    he: "אני מוותר ברגע שיש מתח",
    de: "Ich gebe nach sobald es Spannung gibt",
  },
  {
    id: "ca03", cats: ["conflict_avoidance", "people_pleasing"],
    en: "I say yes just to make peace",
    ru: "Соглашаюсь просто чтобы помириться",
    he: "אני אומר כן רק כדי לעשות שלום",
    de: "Ich sage Ja nur um Frieden zu machen",
  },
  {
    id: "ca04", cats: ["conflict_avoidance"],
    en: "I can't stand a tense atmosphere",
    ru: "Не переношу напряжённую атмосферу",
    he: "אני לא יכול לסבול אווירה מתוחה",
    de: "Ich kann eine angespannte Atmosphäre nicht ertragen",
  },
  {
    id: "ca05", cats: ["conflict_avoidance", "guilt"],
    en: "I apologize even when I'm not in the wrong",
    ru: "Извиняюсь, даже когда я не виноват",
    he: "אני מתנצל גם כשאני לא אשם",
    de: "Ich entschuldige mich auch wenn ich nicht im Unrecht bin",
  },
  {
    id: "ca06", cats: ["conflict_avoidance"],
    en: "I back down as soon as someone pushes back",
    ru: "Отступаю, как только встречаю сопротивление",
    he: "אני נסוג ברגע שמישהו לוחץ בחזרה",
    de: "Ich gebe nach sobald jemand zurückdrängt",
  },
  {
    id: "ca07", cats: ["conflict_avoidance"],
    en: "I'd rather suffer silently than cause a scene",
    ru: "Лучше потерплю в тишине, чем устрою сцену",
    he: "עדיף לי לסבול בשקט מאשר לגרום לסצנה",
    de: "Ich leide lieber still als eine Szene zu machen",
  },
  {
    id: "ca08", cats: ["conflict_avoidance", "self_doubt"],
    en: "I pretend to agree even when I don't",
    ru: "Делаю вид, что согласен, хотя внутри — нет",
    he: "אני מעמיד פנים שאני מסכים כשאני לא",
    de: "Ich tue so als ob ich einverstanden wäre obwohl ich es nicht bin",
  },
  {
    id: "ca09", cats: ["conflict_avoidance"],
    en: "I freeze when someone raises their voice",
    ru: "Замираю, когда кто-то повышает голос",
    he: "אני קופא כשמישהו מרים את הקול",
    de: "Ich erstarr wenn jemand die Stimme erhebt",
  },
  {
    id: "ca10", cats: ["conflict_avoidance", "people_pleasing"],
    en: "I smooth over problems instead of addressing them",
    ru: "Замазываю проблемы вместо того, чтобы их решать",
    he: "אני מחליק בעיות במקום לטפל בהן",
    de: "Ich glätte Probleme anstatt sie anzugehen",
  },
  {
    id: "ca11", cats: ["conflict_avoidance", "self_doubt"],
    en: "I agree with things I know are wrong to keep peace",
    ru: "Соглашаюсь с тем, что считаю неправильным, ради мира",
    he: "אני מסכים לדברים שאני יודע שהם לא נכונים כדי לשמור על שלום",
    de: "Ich stimme Dingen zu die ich für falsch halte um den Frieden zu wahren",
  },
  {
    id: "ca12", cats: ["conflict_avoidance", "over_responsibility"],
    en: "I'm worn out managing everyone's emotions",
    ru: "Сил нет управлять чужими эмоциями — это изматывает",
    he: "אני מותש מניהול הרגשות של כולם",
    de: "Ich bin erschöpft davon die Emotionen aller zu managen",
  },
  {
    id: "ca13", cats: ["conflict_avoidance"],
    en: "I never voice my real opinion in a group",
    ru: "Никогда не высказываю своё настоящее мнение в группе",
    he: "אני אף פעם לא אומר את דעתי האמיתית בקבוצה",
    de: "Ich äußere meine echte Meinung nie in einer Gruppe",
  },
  {
    id: "ca14", cats: ["conflict_avoidance"],
    en: "I let people walk over me to avoid confrontation",
    ru: "Позволяю другим ходить по мне, лишь бы не конфликтовать",
    he: "אני מאפשר לאנשים לרמוס אותי כדי להימנע מעימות",
    de: "Ich lasse mich übertreten um Konfrontation zu vermeiden",
  },
  {
    id: "ca15", cats: ["conflict_avoidance"],
    en: "I spend days worrying about one disagreement",
    ru: "Могу несколько дней переживать из-за одного конфликта",
    he: "אני מבלה ימים בדאגה בגלל ויכוח אחד",
    de: "Ich mache mir tagelang Sorgen wegen einer Meinungsverschiedenheit",
  },

  // ── GUILT (15) ────────────────────────────────────────────────────────────
  {
    id: "gu01", cats: ["guilt"],
    en: "I feel like a bad person when I say no",
    ru: "Когда отказываю — чувствую себя плохим человеком",
    he: "אני מרגיש כמו אדם רע כשאני אומר לא",
    de: "Ich fühle mich wie ein schlechter Mensch wenn ich Nein sage",
  },
  {
    id: "gu02", cats: ["guilt", "people_pleasing"],
    en: "I say yes out of obligation",
    ru: "Соглашаюсь из чувства долга",
    he: "אני אומר כן מתוך חובה",
    de: "Ich sage Ja aus Pflichtgefühl",
  },
  {
    id: "gu03", cats: ["guilt", "self_doubt"],
    en: "It's hard to put my needs first",
    ru: "Трудно ставить свои потребности на первое место",
    he: "קשה לי לשים את הצרכים שלי ראשונים",
    de: "Es ist schwer meine Bedürfnisse an erste Stelle zu setzen",
  },
  {
    id: "gu04", cats: ["guilt"],
    en: "I always think others' needs come first",
    ru: "Всегда думаю, что чужие нужды важнее",
    he: "אני תמיד חושב שהצרכים של אחרים קודמים",
    de: "Ich denke immer dass die Bedürfnisse anderer zuerst kommen",
  },
  {
    id: "gu05", cats: ["guilt", "over_responsibility"],
    en: "I can't enjoy myself when others are struggling",
    ru: "Не могу наслаждаться жизнью, когда кому-то рядом плохо",
    he: "אני לא יכול ליהנות כשאחרים סובלים",
    de: "Ich kann mich nicht freuen wenn andere kämpfen",
  },
  {
    id: "gu06", cats: ["guilt"],
    en: "I feel guilty for having free time",
    ru: "Я чувствую вину за своё свободное время",
    he: "אני מרגיש אשמה על כך שיש לי זמן פנוי",
    de: "Ich fühle mich schuldig wenn ich Freizeit habe",
  },
  {
    id: "gu07", cats: ["guilt", "people_pleasing"],
    en: "I say yes even when I'm completely drained",
    ru: "Соглашаюсь, даже когда у меня совсем нет сил",
    he: "אני אומר כן גם כשאני לגמרי מרוקן",
    de: "Ich sage Ja auch wenn ich völlig erschöpft bin",
  },
  {
    id: "gu08", cats: ["guilt", "over_responsibility"],
    en: "I feel responsible when others are unhappy",
    ru: "Чувствую ответственность, когда другим плохо",
    he: "אני מרגיש אחראי כשאחרים אינם מרוצים",
    de: "Ich fühle mich verantwortlich wenn andere unglücklich sind",
  },
  {
    id: "gu09", cats: ["guilt"],
    en: "I give more emotionally than I can afford",
    ru: "Отдаю больше эмоционально, чем у меня есть",
    he: "אני נותן יותר ממה שיש לי רגשית",
    de: "Ich gebe emotional mehr als ich kann",
  },
  {
    id: "gu10", cats: ["guilt"],
    en: "I feel like I owe everyone something",
    ru: "Ощущение, что я всем что-то должен",
    he: "אני מרגיש שאני חייב לכולם משהו",
    de: "Ich fühle dass ich allen etwas schulde",
  },
  {
    id: "gu11", cats: ["guilt", "over_responsibility"],
    en: "I help others even when it hurts me",
    ru: "Помогаю другим, даже когда это причиняет мне вред",
    he: "אני עוזר לאחרים גם כשזה פוגע בי",
    de: "Ich helfe anderen auch wenn es mir schadet",
  },
  {
    id: "gu12", cats: ["guilt", "self_doubt"],
    en: "I feel guilty for wanting things for myself",
    ru: "Чувствую вину за то, что чего-то хочу для себя",
    he: "אני מרגיש אשמה על כך שאני רוצה דברים לעצמי",
    de: "Ich fühle mich schuldig wenn ich etwas für mich selbst möchte",
  },
  {
    id: "gu13", cats: ["guilt"],
    en: "Guilt follows me after every no I say",
    ru: "После каждого отказа меня преследует вина",
    he: "אשמה רודפת אותי אחרי כל לא שאני אומר",
    de: "Schuldgefühle verfolgen mich nach jedem Nein",
  },
  {
    id: "gu14", cats: ["guilt"],
    en: "It's hard to receive without immediately giving back",
    ru: "Трудно принять что-то, не отдав взамен немедленно",
    he: "קשה לי לקבל בלי להחזיר מיד",
    de: "Es ist schwer etwas anzunehmen ohne sofort zurückzugeben",
  },
  {
    id: "gu15", cats: ["guilt", "self_doubt"],
    en: "I sometimes feel like I take up too much space",
    ru: "Иногда кажется, что я занимаю слишком много места",
    he: "לפעמים אני מרגיש שאני לוקח יותר מדי מקום",
    de: "Manchmal fühle ich dass ich zu viel Raum einnehme",
  },

  // ── OVER-RESPONSIBILITY (15) ───────────────────────────────────────────────
  {
    id: "or01", cats: ["over_responsibility"],
    en: "I take others' problems on as my own",
    ru: "Принимаю чужие проблемы близко к сердцу как свои",
    he: "אני לוקח על עצמי את הבעיות של אחרים",
    de: "Ich nehme die Probleme anderer als meine eigenen an",
  },
  {
    id: "or02", cats: ["over_responsibility"],
    en: "I can't stop until everyone around me is okay",
    ru: "Не могу успокоиться, пока все вокруг не в порядке",
    he: "אני לא יכול לעצור עד שכולם סביבי בסדר",
    de: "Ich kann nicht aufhören bis alle um mich herum okay sind",
  },
  {
    id: "or03", cats: ["over_responsibility", "guilt"],
    en: "I feel responsible for everyone's mood",
    ru: "Я чувствую ответственность за настроение всех вокруг",
    he: "אני מרגיש אחראי למצב הרוח של כולם",
    de: "Ich fühle mich verantwortlich für die Stimmung aller",
  },
  {
    id: "or04", cats: ["over_responsibility"],
    en: "I fix things that aren't mine to fix",
    ru: "Исправляю то, что исправлять — не моя задача",
    he: "אני מתקן דברים שלא מוטל עלי לתקן",
    de: "Ich repariere Dinge die nicht meine Aufgabe sind",
  },
  {
    id: "or05", cats: ["over_responsibility"],
    en: "I can't step back even when I'm burnt out",
    ru: "Не могу отступить, даже когда полностью выгораю",
    he: "אני לא יכול לסגת גם כשאני שרוף לגמרי",
    de: "Ich kann mich nicht zurückziehen auch wenn ich ausgebrannt bin",
  },
  {
    id: "or06", cats: ["over_responsibility"],
    en: "I carry the whole team on my back",
    ru: "Несу всю команду на своих плечах",
    he: "אני נושא את כל הצוות על הגב שלי",
    de: "Ich trage das ganze Team auf meinem Rücken",
  },
  {
    id: "or07", cats: ["over_responsibility"],
    en: "I can't bring myself to say that's not my job",
    ru: "Не могу сказать «это не моя работа»",
    he: "אני לא מסוגל לומר שזה לא העבודה שלי",
    de: "Ich kann es mir nicht erlauben zu sagen das ist nicht mein Job",
  },
  {
    id: "or08", cats: ["over_responsibility", "people_pleasing"],
    en: "I jump in to help before being asked",
    ru: "Бросаюсь помогать, не дожидаясь просьбы",
    he: "אני קופץ לעזור לפני שמישהו מבקש",
    de: "Ich springe ein um zu helfen bevor ich darum gebeten werde",
  },
  {
    id: "or09", cats: ["over_responsibility"],
    en: "I feel like everything falls apart if I step back",
    ru: "Кажется, что если я отстранюсь — всё рухнет",
    he: "אני מרגיש שהכל יתפרק אם אסוג",
    de: "Ich fühle dass alles auseinanderfällt wenn ich mich zurückziehe",
  },
  {
    id: "or10", cats: ["over_responsibility"],
    en: "Others have come to expect me to always be there",
    ru: "Другие уже привыкли, что я всегда рядом и всегда помогаю",
    he: "אחרים התרגלו לצפות שאני תמיד שם",
    de: "Andere erwarten von mir dass ich immer da bin",
  },
  {
    id: "or11", cats: ["over_responsibility"],
    en: "It's hard to let others handle things themselves",
    ru: "Трудно позволить другим справляться самостоятельно",
    he: "קשה לי לאפשר לאחרים להתמודד בעצמם",
    de: "Es ist schwer anderen zu erlauben Dinge selbst zu handhaben",
  },
  {
    id: "or12", cats: ["over_responsibility", "guilt"],
    en: "I can't rest when someone near me is struggling",
    ru: "Не могу отдыхать, зная, что кому-то рядом плохо",
    he: "אני לא יכול לנוח כשמישהו קרוב אלי מתקשה",
    de: "Ich kann nicht ruhen wenn jemand in meiner Nähe kämpft",
  },
  {
    id: "or13", cats: ["over_responsibility"],
    en: "I agree to lead even when I shouldn't",
    ru: "Соглашаюсь брать на себя руководство, когда не должен",
    he: "אני מסכים להוביל גם כשלא כדאי",
    de: "Ich stimme zu zu führen auch wenn ich es nicht sollte",
  },
  {
    id: "or14", cats: ["over_responsibility"],
    en: "I feel like I'm holding everything together alone",
    ru: "Ощущение, что держу всё в одиночку",
    he: "אני מרגיש שאני מחזיק הכל ביחד לבד",
    de: "Ich fühle dass ich alles allein zusammenhalte",
  },
  {
    id: "or15", cats: ["over_responsibility"],
    en: "I feel responsible for outcomes I can't control",
    ru: "Чувствую ответственность за результаты, которые не в моих руках",
    he: "אני מרגיש אחראי לתוצאות שלא בשליטתי",
    de: "Ich fühle mich verantwortlich für Ergebnisse die ich nicht kontrollieren kann",
  },

  // ── PEOPLE PLEASING (15) ──────────────────────────────────────────────────
  {
    id: "pp01", cats: ["people_pleasing"],
    en: "I say what people want to hear",
    ru: "Говорю то, что хотят услышать",
    he: "אני אומר מה שאנשים רוצים לשמוע",
    de: "Ich sage was die Leute hören wollen",
  },
  {
    id: "pp02", cats: ["people_pleasing"],
    en: "I can't be myself around certain people",
    ru: "С некоторыми людьми не могу быть собой",
    he: "אני לא יכול להיות עצמי סביב אנשים מסוימים",
    de: "Ich kann ich selbst nicht sein wenn bestimmte Menschen dabei sind",
  },
  {
    id: "pp03", cats: ["people_pleasing", "self_doubt"],
    en: "I mirror others' opinions without realizing it",
    ru: "Отражаю чужие мнения, даже не замечая этого",
    he: "אני משקף דעות של אחרים בלי לשים לב",
    de: "Ich spiegele die Meinungen anderer ohne es zu merken",
  },
  {
    id: "pp04", cats: ["people_pleasing", "fear_of_rejection"],
    en: "It's hard to disagree with authority figures",
    ru: "Трудно не соглашаться с авторитетными людьми",
    he: "קשה לי לחלוק דעה עם דמויות סמכותיות",
    de: "Es ist schwer Autoritätspersonen zu widersprechen",
  },
  {
    id: "pp05", cats: ["people_pleasing"],
    en: "I check if others are pleased before I feel okay",
    ru: "Сначала убеждаюсь, что все довольны, — только потом успокаиваюсь",
    he: "אני בודק אם אחרים מרוצים לפני שאני מרגיש בסדר",
    de: "Ich prüfe ob andere zufrieden sind bevor ich mich okay fühle",
  },
  {
    id: "pp06", cats: ["people_pleasing", "self_doubt"],
    en: "I edit myself heavily before speaking",
    ru: "Тщательно фильтрую каждое слово перед тем, как сказать",
    he: "אני עורך את עצמי יסודית לפני שאני מדבר",
    de: "Ich zensiere mich stark bevor ich spreche",
  },
  {
    id: "pp07", cats: ["people_pleasing"],
    en: "My decisions depend on what others will think",
    ru: "Мои решения зависят от того, что подумают другие",
    he: "ההחלטות שלי תלויות במה שאחרים יחשבו",
    de: "Meine Entscheidungen hängen davon ab was andere denken werden",
  },
  {
    id: "pp08", cats: ["people_pleasing", "self_doubt"],
    en: "I can't decide without reassurance from others",
    ru: "Не могу решиться без одобрения других",
    he: "אני לא יכול להחליט בלי אישור מאחרים",
    de: "Ich kann nicht entscheiden ohne Bestätigung von anderen",
  },
  {
    id: "pp09", cats: ["people_pleasing"],
    en: "I mold myself to fit what people expect",
    ru: "Подстраиваюсь под то, чего от меня ожидают",
    he: "אני מתעצב לפי מה שאנשים מצפים",
    de: "Ich forme mich nach dem was Menschen erwarten",
  },
  {
    id: "pp10", cats: ["people_pleasing", "self_doubt"],
    en: "My opinions shift depending on who I'm with",
    ru: "Мои взгляды меняются в зависимости от того, с кем я общаюсь",
    he: "הדעות שלי משתנות בהתאם למי שאיתי",
    de: "Meine Meinungen ändern sich je nachdem mit wem ich zusammen bin",
  },
  {
    id: "pp11", cats: ["people_pleasing", "self_doubt"],
    en: "It's hard to know what I actually want",
    ru: "Трудно понять, чего я на самом деле хочу",
    he: "קשה לי לדעת מה אני באמת רוצה",
    de: "Es ist schwer zu wissen was ich wirklich will",
  },
  {
    id: "pp12", cats: ["people_pleasing", "guilt"],
    en: "I do favors out of fear, not love",
    ru: "Помогаю из страха, а не из желания",
    he: "אני עושה טובות מתוך פחד לא מאהבה",
    de: "Ich tue Gefallen aus Angst nicht aus Liebe",
  },
  {
    id: "pp13", cats: ["people_pleasing"],
    en: "I'm exhausted from always being \"on\" for others",
    ru: "Изматывает постоянно быть «в форме» для других",
    he: "אני מותש מלהיות תמיד זמין לאחרים",
    de: "Ich bin erschöpft davon immer für andere da zu sein",
  },
  {
    id: "pp14", cats: ["people_pleasing"],
    en: "I change my plans when someone seems disappointed",
    ru: "Меняю планы, как только кто-то выглядит расстроенным",
    he: "אני משנה את התוכניות שלי כשמישהו נראה מאוכזב",
    de: "Ich ändere meine Pläne wenn jemand enttäuscht wirkt",
  },
  {
    id: "pp15", cats: ["people_pleasing"],
    en: "I agree to things I immediately regret",
    ru: "Соглашаюсь на то, о чём тут же сожалею",
    he: "אני מסכים לדברים שאני מיד מתחרט עליהם",
    de: "Ich stimme Dingen zu die ich sofort bereue",
  },

  // ── SELF DOUBT (15) ───────────────────────────────────────────────────────
  {
    id: "sd01", cats: ["self_doubt"],
    en: "I question whether my needs are even valid",
    ru: "Сомневаюсь, имею ли я право на свои потребности",
    he: "אני מטיל ספק אם הצרכים שלי בכלל לגיטימיים",
    de: "Ich zweifle ob meine Bedürfnisse überhaupt berechtigt sind",
  },
  {
    id: "sd02", cats: ["self_doubt"],
    en: "I don't feel I have the right to ask for things",
    ru: "Не чувствую, что имею право что-то просить",
    he: "אני לא מרגיש שיש לי את הזכות לבקש דברים",
    de: "Ich fühle nicht dass ich das Recht habe nach Dingen zu fragen",
  },
  {
    id: "sd03", cats: ["self_doubt", "guilt"],
    en: "My feelings seem less important than others'",
    ru: "Мои чувства кажутся менее важными, чем чужие",
    he: "הרגשות שלי נראים פחות חשובים מאלה של אחרים",
    de: "Meine Gefühle scheinen weniger wichtig als die der anderen",
  },
  {
    id: "sd04", cats: ["self_doubt"],
    en: "I second-guess every boundary I try to set",
    ru: "Сомневаюсь в каждой границе, которую пытаюсь поставить",
    he: "אני מפקפק בכל גבול שאני מנסה להציב",
    de: "Ich zweifle an jeder Grenze die ich versuche zu setzen",
  },
  {
    id: "sd05", cats: ["self_doubt"],
    en: "I think I'm overreacting when something bothers me",
    ru: "Думаю, что преувеличиваю, когда что-то меня беспокоит",
    he: "אני חושב שאני מגיב יתר על המידה כשמשהו מטריד אותי",
    de: "Ich denke ich überreagiere wenn mich etwas stört",
  },
  {
    id: "sd06", cats: ["self_doubt"],
    en: "It's hard to trust my own judgment",
    ru: "Трудно доверять собственным суждениям",
    he: "קשה לי לסמוך על שיקול הדעת שלי",
    de: "Es ist schwer meinem eigenen Urteil zu vertrauen",
  },
  {
    id: "sd07", cats: ["self_doubt"],
    en: "I tell myself I'm just too sensitive",
    ru: "Говорю себе, что я просто слишком чувствителен",
    he: "אני אומר לעצמי שאני פשוט רגיש מדי",
    de: "Ich sage mir dass ich einfach zu sensibel bin",
  },
  {
    id: "sd08", cats: ["self_doubt"],
    en: "I wonder if I'm asking too much",
    ru: "Задаюсь вопросом — не слишком ли многого я прошу?",
    he: "אני תוהה אם אני מבקש יותר מדי",
    de: "Ich frage mich ob ich zu viel verlange",
  },
  {
    id: "sd09", cats: ["self_doubt"],
    en: "I talk myself out of needs before voicing them",
    ru: "Убеждаю себя отказаться от потребности ещё до того, как её выскажу",
    he: "אני מרתיע את עצמי מצרכים לפני שאני מביע אותם",
    de: "Ich rede mir Bedürfnisse aus bevor ich sie äußere",
  },
  {
    id: "sd10", cats: ["self_doubt"],
    en: "I assume others know better than me",
    ru: "Считаю, что другие знают лучше меня",
    he: "אני מניח שאחרים יודעים טוב ממני",
    de: "Ich nehme an dass andere es besser wissen als ich",
  },
  {
    id: "sd11", cats: ["self_doubt"],
    en: "I doubt myself even when I know I'm right",
    ru: "Сомневаюсь в себе, даже когда знаю, что прав",
    he: "אני מפקפק בעצמי גם כשאני יודע שאני צודק",
    de: "Ich zweifle an mir selbst auch wenn ich weiß dass ich recht habe",
  },
  {
    id: "sd12", cats: ["self_doubt", "guilt"],
    en: "I keep quiet because I assume I'm probably wrong",
    ru: "Молчу, потому что считаю — скорее всего, я не прав",
    he: "אני שותק כי אני מניח שאני כנראה טועה",
    de: "Ich schweige weil ich annehme dass ich wahrscheinlich falsch liege",
  },
  {
    id: "sd13", cats: ["self_doubt"],
    en: "It's hard to recognize when something crosses a line for me",
    ru: "Трудно заметить, когда что-то переходит мои границы",
    he: "קשה לי לזהות מתי משהו חוצה גבול עבורי",
    de: "Es ist schwer zu erkennen wenn etwas eine Grenze für mich überschreitet",
  },
  {
    id: "sd14", cats: ["self_doubt"],
    en: "I feel embarrassed to have needs at all",
    ru: "Стыдно даже иметь потребности",
    he: "אני מרגיש נבוך מכך שיש לי צרכים בכלל",
    de: "Ich schäme mich überhaupt Bedürfnisse zu haben",
  },
  {
    id: "sd15", cats: ["self_doubt"],
    en: "I minimize my pain to avoid being a burden",
    ru: "Преуменьшаю свою боль, чтобы не быть обузой",
    he: "אני ממזער את הכאב שלי כדי לא להיות נטל",
    de: "Ich verkleinere meinen Schmerz um keine Last zu sein",
  },
];

// ─── Context-aware picker ─────────────────────────────────────────────────────

/**
 * Deterministic seeded random — avoids Math.random() so the same
 * (seed, msgCount) pair always produces the same ranking.
 */
function seededRand(seed: number, index: number, msgCount: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + msgCount * 233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Pick 5 contextually relevant questions.
 *
 * Scoring:
 *  +4  question's category matches a detected pattern
 *  +2  question fits the current CBT step
 *  +1  general category bonus early in session (step ≤ 2)
 *  ±0.5 deterministic jitter so equal-score questions vary between calls
 *
 * Diversity rule: at most 2 questions from the same primary category.
 */
export function pickContextualQuestions({
  locale,
  patterns,
  step,
  usedIds,
  seed,
  msgCount,
}: {
  locale: string;
  patterns: string[];
  step: number;
  usedIds: string[];
  seed: number;
  msgCount: number;
}): { id: string; text: string }[] {
  const locKey = (["en", "ru", "he", "de"].includes(locale) ? locale : "en") as "en" | "ru" | "he" | "de";

  // Filter out already-used questions
  const pool = QUESTIONS.filter((q) => !usedIds.includes(q.id));

  // Score
  const scored = pool.map((q, i) => {
    let score = 0;

    for (const p of patterns) {
      if (q.cats.includes(p as QCategory)) score += 4;
    }
    if (q.steps && q.steps.includes(step)) score += 2;
    if (q.cats.includes("general") && step <= 2) score += 1;

    // Jitter: tiny deterministic nudge to break ties differently each call
    score += seededRand(seed, i, msgCount) * 0.5;

    return { q, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Pick top 5 with diversity: max 2 per primary category
  const picked: typeof scored = [];
  const catCount: Record<string, number> = {};

  for (const item of scored) {
    if (picked.length >= 5) break;
    const primary = item.q.cats[0];
    const count = catCount[primary] ?? 0;
    if (count >= 2) continue;
    picked.push(item);
    catCount[primary] = count + 1;
  }

  // Fallback: fill remaining slots ignoring diversity
  if (picked.length < 5) {
    for (const item of scored) {
      if (picked.length >= 5) break;
      if (!picked.includes(item)) picked.push(item);
    }
  }

  return picked.map(({ q }) => ({ id: q.id, text: q[locKey] }));
}
