// TRADUCTIONS DARIJA À RELIRE PAR UN LOCUTEUR NATIF
//
// Source de vérité : QUESTIONNAIRE.md (ordre, options et conditions inchangés).
//
// Conventions :
// - `value` : code stable snake_case, identique en fr et ar → même valeur dans le Sheet.
// - `other: true` : l'option affiche un champ texte quand elle est cochée.
//   `otherLabel` (facultatif) remplace le libellé par défaut du champ (i18n.otherPlaceholder).
// - `required` sur une question conditionnelle (`showIf`) ne s'applique que si elle est affichée.
// - q6 (`dynamic_list`) : seul l'élément n°1 est obligatoire ; `max` éléments ;
//   stockage dans une seule colonne, valeurs jointes par `separator`.
// - q7 : le jeton `{q6_1}` du libellé est remplacé par le problème n°1 saisi en q6.
// - q28 (`contact`) : `fields` affichés et obligatoires seulement si q28 = "yes".

const RANGE_WEEK = [
  { value: "0", label: { fr: "0", ar: "0" } },
  { value: "1_5", label: { fr: "1 – 5", ar: "1 – 5" } },
  { value: "6_15", label: { fr: "6 – 15", ar: "6 – 15" } },
  { value: "16_30", label: { fr: "16 – 30", ar: "16 – 30" } },
  { value: "more_30", label: { fr: "Plus de 30", ar: "كثر من 30" } },
  { value: "unknown", label: { fr: "Je ne sais pas", ar: "ما نعرفش" } },
];

const OTHER = { value: "other", label: { fr: "Autre", ar: "حاجة خرى" }, other: true };

export const QUESTIONS = [
  // ── 1 ──────────────────────────────────────────────────────────────
  {
    id: "q1",
    type: "single",
    required: true,
    label: {
      fr: "Combien de commandes par jour en moyenne ?",
      ar: "شحال من كوموند تجيك فالنهار، في المتوسط؟",
    },
    options: [
      { value: "lt_10", label: { fr: "Moins de 10", ar: "أقل من 10" } },
      { value: "10_20", label: { fr: "10 – 20", ar: "10 – 20" } },
      { value: "20_50", label: { fr: "20 – 50", ar: "20 – 50" } },
      { value: "50_100", label: { fr: "50 – 100", ar: "50 – 100" } },
      { value: "100_200", label: { fr: "100 – 200", ar: "100 – 200" } },
      { value: "gt_200", label: { fr: "Plus de 200", ar: "كثر من 200" } },
    ],
  },
  // ── 2 ──────────────────────────────────────────────────────────────
  {
    id: "q2",
    type: "multiple",
    required: true,
    label: {
      fr: "Quelle plateforme utilises-tu ?",
      ar: "واش من بلاتفورم تخدم بيها؟",
    },
    options: [
      { value: "youcan", label: { fr: "YouCan", ar: "YouCan" } },
      { value: "shopify", label: { fr: "Shopify", ar: "Shopify" } },
      { value: "woocommerce", label: { fr: "WooCommerce", ar: "WooCommerce" } },
      {
        value: "no_website",
        label: {
          fr: "Pas de site (Facebook / Instagram / WhatsApp uniquement)",
          ar: "ما عنديش سيت (فيسبوك / إنستغرام / واتساب برك)",
        },
      },
      OTHER,
    ],
  },
  // ── 3 ──────────────────────────────────────────────────────────────
  {
    id: "q3",
    type: "multiple",
    required: true,
    label: {
      fr: "Avec quel livreur ?",
      ar: "واش من ليفرور تخدم معاه؟",
    },
    options: [
      { value: "yalidine", label: { fr: "Yalidine", ar: "Yalidine" } },
      { value: "zr_express", label: { fr: "ZR Express", ar: "ZR Express" } },
      { value: "maystro_delivery", label: { fr: "Maystro Delivery", ar: "Maystro Delivery" } },
      { value: "noest", label: { fr: "Noest", ar: "Noest" } },
      {
        value: "own_courier",
        label: {
          fr: "Livreur indépendant / propre livreur",
          ar: "ليفرور مستقل / ليفرور تاعي",
        },
      },
      OTHER,
    ],
  },
  // ── 4 ──────────────────────────────────────────────────────────────
  {
    id: "q4",
    type: "single",
    required: true,
    label: {
      fr: "Combien de confirmatrices ?",
      ar: "شحال عندك من كونفيرماتريس؟",
    },
    options: [
      {
        value: "none_self",
        label: { fr: "Aucune, je confirme moi-même", ar: "حتى وحدة، نكونفيرمي وحدي" },
      },
      { value: "1", label: { fr: "1", ar: "1" } },
      { value: "2_3", label: { fr: "2 – 3", ar: "2 – 3" } },
      { value: "4_plus", label: { fr: "4 ou plus", ar: "4 ولا كثر" } },
    ],
  },
  // ── 5 ──────────────────────────────────────────────────────────────
  {
    id: "q5",
    type: "multiple",
    required: true,
    label: {
      fr: "Où sont notées les commandes ?",
      ar: "وين تكتب الكوموندات؟",
    },
    options: [
      { value: "google_sheets", label: { fr: "Google Sheets", ar: "Google Sheets" } },
      { value: "excel", label: { fr: "Excel", ar: "Excel" } },
      {
        value: "platform_dashboard",
        label: {
          fr: "Dashboard de la plateforme (YouCan, Shopify…)",
          ar: "الداشبورد تاع البلاتفورم (YouCan، Shopify…)",
        },
      },
      {
        value: "courier_dashboard",
        label: { fr: "Dashboard du livreur", ar: "الداشبورد تاع الليفرور" },
      },
      { value: "paper", label: { fr: "Cahier / papier", ar: "كراس / ورقة" } },
      OTHER,
    ],
  },
  // ── 6 ──────────────────────────────────────────────────────────────
  {
    id: "q6",
    type: "dynamic_list",
    required: true, // seul le problème n°1 est obligatoire
    max: 5,
    separator: " | ",
    label: {
      fr: "Quelles sont les choses qui te fatiguent le plus après la réception d'une commande ?",
      ar: "واش هوما الحوايج اللي يعيّوك كثر من بعد ما توصلك الكوموند؟",
    },
    // Aucun placeholder : pas de suggestion ni d'exemple (spec).
  },
  // ── 7 ──────────────────────────────────────────────────────────────
  {
    id: "q7",
    type: "textarea",
    required: false,
    label: {
      fr: "Pour le problème n°1 « {q6_1} » : la dernière fois que c'est arrivé, que s'est-il passé exactement ?",
      ar: "على المشكل رقم 1 « {q6_1} »: آخر مرة صرات، واش صرا بالضبط؟",
    },
  },
  // ── 8 ──────────────────────────────────────────────────────────────
  {
    id: "q8",
    type: "textarea",
    required: false,
    label: {
      fr: "Qu'as-tu fait pour le résoudre ?",
      ar: "واش درت باش تحلّو؟",
    },
  },
  // ── 9 ──────────────────────────────────────────────────────────────
  {
    id: "q9",
    type: "single",
    required: true,
    label: {
      fr: "La semaine dernière, combien de commandes fausses ou niées (« je n'ai rien commandé ») ?",
      ar: "السيمانة اللي فاتت، شحال من كوموند فوسي ولا نكرها الكليان (« ما كومونديت والو »)؟",
    },
    options: RANGE_WEEK,
  },
  // ── 10 ─────────────────────────────────────────────────────────────
  {
    id: "q10",
    type: "single",
    required: true,
    label: {
      fr: "La semaine dernière, combien de colis retournés ?",
      ar: "السيمانة اللي فاتت، شحال من كولي رجعلك (روتور)؟",
    },
    options: RANGE_WEEK,
  },
  // ── 11 ─────────────────────────────────────────────────────────────
  {
    id: "q11",
    type: "single",
    required: true,
    label: {
      fr: "La semaine dernière, combien de réclamations clients après livraison ?",
      ar: "السيمانة اللي فاتت، شحال من ريكلاماسيون جاتك من الكليان من بعد الليفريزون؟",
    },
    options: RANGE_WEEK,
  },
  // ── 12 ─────────────────────────────────────────────────────────────
  {
    id: "q12",
    type: "multiple",
    required: true,
    label: {
      fr: "Pour quelles raisons tes clients font-ils une réclamation ?",
      ar: "علاش الكليان تاعك يديرو ريكلاماسيون؟",
    },
    options: [
      {
        value: "damaged_defective",
        label: { fr: "Produit abîmé ou défectueux", ar: "البرودوي مكسّر ولا فيه عيب" },
      },
      {
        value: "wrong_size_color_model",
        label: { fr: "Mauvaise taille / couleur / modèle", ar: "التاي / اللون / الموديل غالط" },
      },
      {
        value: "not_as_pictured",
        label: {
          fr: "Produit différent de la photo ou de la pub",
          ar: "البرودوي ماشي كيما في التصويرة ولا البوب",
        },
      },
      { value: "incomplete_parcel", label: { fr: "Colis incomplet", ar: "الكولي ناقص" } },
      { value: "late_delivery", label: { fr: "Retard de livraison", ar: "الليفريزون تعطّلت" } },
      OTHER,
    ],
  },
  // ── 13 ─────────────────────────────────────────────────────────────
  {
    id: "q13",
    type: "multiple",
    required: true,
    label: {
      fr: "Comment le client te contacte-t-il pour une réclamation ?",
      ar: "كيفاش يتواصل معاك الكليان باش يدير ريكلاماسيون؟",
    },
    options: [
      { value: "phone_call", label: { fr: "Appel téléphonique", ar: "يعيّطلي فالتيليفون" } },
      { value: "whatsapp", label: { fr: "WhatsApp", ar: "واتساب" } },
      { value: "messenger_instagram", label: { fr: "Messenger / Instagram", ar: "ميسنجر / إنستغرام" } },
      { value: "via_courier", label: { fr: "Via le livreur", ar: "عن طريق الليفرور" } },
      OTHER,
    ],
  },
  // ── 14 ─────────────────────────────────────────────────────────────
  {
    id: "q14",
    type: "multiple",
    required: true,
    label: {
      fr: "Que fais-tu le plus souvent face à une réclamation ?",
      ar: "واش تدير أكثر حاجة كي تجيك ريكلاماسيون؟",
    },
    options: [
      { value: "exchange", label: { fr: "Échange du produit", ar: "نبدّلو البرودوي" } },
      { value: "resend_new", label: { fr: "Renvoi d'un nouveau produit", ar: "نبعثلو برودوي جديد" } },
      { value: "refund", label: { fr: "Remboursement", ar: "نرجّعلو دراهمو" } },
      {
        value: "discount_next_order",
        label: {
          fr: "Geste commercial (réduction sur la prochaine commande)",
          ar: "جيست كوميرسيال (تخفيض فالكوموند الجاية)",
        },
      },
      { value: "refuse", label: { fr: "Je refuse la réclamation", ar: "نرفض الريكلاماسيون" } },
      OTHER,
    ],
  },
  // ── 15 ─────────────────────────────────────────────────────────────
  {
    id: "q15",
    type: "multiple",
    required: true,
    label: {
      fr: "Où notes-tu les réclamations ?",
      ar: "وين تكتب الريكلاماسيونات؟",
    },
    options: [
      { value: "nowhere", label: { fr: "Nulle part", ar: "ما نكتبهم في حتى بلاصة" } },
      { value: "sheets_excel", label: { fr: "Google Sheets / Excel", ar: "Google Sheets / Excel" } },
      {
        value: "chat_conversations",
        label: {
          fr: "Dans les conversations WhatsApp / Messenger",
          ar: "في المحادثات تاع واتساب / ميسنجر",
        },
      },
      { value: "paper", label: { fr: "Cahier / papier", ar: "كراس / ورقة" } },
      { value: "tool", label: { fr: "Dans un outil", ar: "في أوتيل (تطبيق)" } },
      OTHER,
    ],
  },
  // ── 16 ─────────────────────────────────────────────────────────────
  {
    id: "q16",
    type: "single",
    required: true,
    label: {
      fr: "Combien de temps par semaine passes-tu à gérer les réclamations ?",
      ar: "شحال من وقت فالسيمانة تقعد تسيّر فالريكلاماسيونات؟",
    },
    options: [
      { value: "lt_1h", label: { fr: "Moins d'1 h", ar: "أقل من ساعة" } },
      { value: "1_3h", label: { fr: "1 – 3 h", ar: "1 – 3 سوايع" } },
      { value: "3_5h", label: { fr: "3 – 5 h", ar: "3 – 5 سوايع" } },
      { value: "gt_5h", label: { fr: "Plus de 5 h", ar: "كثر من 5 سوايع" } },
      { value: "unknown", label: { fr: "Je ne sais pas", ar: "ما نعرفش" } },
    ],
  },
  // ── 17 ─────────────────────────────────────────────────────────────
  {
    id: "q17",
    type: "number",
    required: false,
    label: {
      fr: "Combien te coûte un colis retourné (frais de livraison aller + frais de retour), en DA ?",
      ar: "شحال يخسّرك كولي يرجع (فري الليفريزون رايح + فري الروتور)، بالدينار؟",
    },
    unknownOption: { value: "unknown", label: { fr: "Je ne sais pas", ar: "ما نعرفش" } },
  },
  // ── 18 ─────────────────────────────────────────────────────────────
  {
    id: "q18",
    type: "multiple",
    required: true,
    label: {
      fr: "Comment repères-tu une fausse commande ?",
      ar: "كيفاش تعرف بلّي الكوموند فوسي؟",
    },
    options: [
      {
        value: "no_answer_confirmation",
        label: {
          fr: "Le client ne répond pas à l'appel de confirmation",
          ar: "الكليان ما يردّش كي نعيّطلو نكونفيرمي",
        },
      },
      {
        value: "known_number",
        label: { fr: "Numéro déjà connu / déjà signalé", ar: "النيميرو معروف / تسينيالا من قبل" },
      },
      {
        value: "bad_address",
        label: { fr: "Adresse incomplète ou incohérente", ar: "العنوان ناقص ولا ما يتفاهمش" },
      },
      {
        value: "courier_history",
        label: { fr: "Historique du client chez le livreur", ar: "التاريخ تاع الكليان عند الليفرور" },
      },
      {
        value: "not_detected",
        label: { fr: "Je ne la repère pas avant l'envoi", ar: "ما نعرفهاش قبل ما نبعث" },
      },
      OTHER,
    ],
  },
  // ── 19 ─────────────────────────────────────────────────────────────
  {
    id: "q19",
    type: "single",
    required: true,
    label: {
      fr: "As-tu une liste noire de numéros ?",
      ar: "عندك ليست نوار تاع النيميروات؟",
    },
    options: [
      { value: "yes_sheet", label: { fr: "Oui, dans un Sheet / Excel", ar: "إيه، في Sheet / Excel" } },
      {
        value: "yes_phone_paper",
        label: { fr: "Oui, dans mon téléphone ou sur papier", ar: "إيه، فالتيليفون ولا في ورقة" },
      },
      {
        value: "yes_tool_courier",
        label: { fr: "Oui, via un outil ou mon livreur", ar: "إيه، عن طريق أوتيل ولا الليفرور تاعي" },
      },
      { value: "no", label: { fr: "Non", ar: "لا" } },
    ],
  },
  // ── 20 ─────────────────────────────────────────────────────────────
  {
    id: "q20",
    type: "single",
    required: true,
    label: {
      fr: "Partages-tu des numéros de fraudeurs avec d'autres marchands ?",
      ar: "تبارتاجي النيميروات تاع النصّابين مع مارشون آخرين؟",
    },
    options: [
      {
        value: "yes_regularly",
        label: {
          fr: "Oui, régulièrement (groupe WhatsApp, Facebook…)",
          ar: "إيه، ديما (قروب واتساب، فيسبوك…)",
        },
      },
      { value: "yes_sometimes", label: { fr: "Oui, de temps en temps", ar: "إيه، مرّة مرّة" } },
      { value: "no", label: { fr: "Non", ar: "لا" } },
    ],
  },
  // ── 21 ─────────────────────────────────────────────────────────────
  {
    id: "q21",
    type: "single",
    required: true,
    label: {
      fr: "Comment saisis-tu les commandes chez le livreur ?",
      ar: "كيفاش تدخّل الكوموندات عند الليفرور؟",
    },
    options: [
      { value: "manual", label: { fr: "À la main, commande par commande", ar: "باليد، كوموند بكوموند" } },
      {
        value: "file_import",
        label: { fr: "Import d'un fichier (Excel / CSV)", ar: "نامبورتي فيشي (Excel / CSV)" },
      },
      {
        value: "automatic",
        label: { fr: "Automatique depuis ma plateforme", ar: "أوتوماتيك من البلاتفورم تاعي" },
      },
      {
        value: "unknown_confirmer",
        label: {
          fr: "Je ne sais pas, c'est la confirmatrice qui s'en occupe",
          ar: "ما نعرفش، الكونفيرماتريس هي اللي تتلهّى بيها",
        },
      },
    ],
  },
  // ── 22 ─────────────────────────────────────────────────────────────
  {
    id: "q22",
    type: "single",
    required: true,
    showIf: { question: "q21", in: ["manual", "file_import"] },
    label: {
      fr: "Combien de temps par jour pour cette saisie ?",
      ar: "شحال من وقت فالنهار تاكلّك هاد الصّيزي؟",
    },
    options: [
      { value: "lt_30min", label: { fr: "Moins de 30 min", ar: "أقل من 30 دقيقة" } },
      { value: "30min_1h", label: { fr: "30 min – 1 h", ar: "30 دقيقة – ساعة" } },
      { value: "1_2h", label: { fr: "1 – 2 h", ar: "1 – 2 سوايع" } },
      { value: "gt_2h", label: { fr: "Plus de 2 h", ar: "كثر من 2 سوايع" } },
    ],
  },
  // ── 23 ─────────────────────────────────────────────────────────────
  {
    id: "q23",
    type: "text",
    required: false,
    label: {
      fr: "Quels outils ou applications utilises-tu pour ton activité ?",
      ar: "واش من أوتيلات ولا تطبيقات تخدم بيهم فالخدمة تاعك؟",
    },
    placeholder: {
      fr: "Ex. : noms des applications, séparés par des virgules",
      ar: "مثلا: أسامي التطبيقات، فرّقهم بفاصلة",
    },
  },
  // ── 24 ─────────────────────────────────────────────────────────────
  {
    id: "q24",
    type: "number",
    required: false,
    label: {
      fr: "Combien paies-tu par mois pour ces outils, au total, en DA ?",
      ar: "شحال تخلّص فالشهر على هاد الأوتيلات، كامل، بالدينار؟",
    },
    unknownOption: {
      value: "free",
      label: { fr: "Rien, je n'utilise que du gratuit", ar: "والو، نخدم غير بالفابور" },
    },
  },
  // ── 25 ─────────────────────────────────────────────────────────────
  {
    id: "q25",
    type: "single",
    required: true,
    label: {
      fr: "As-tu essayé un outil puis abandonné ?",
      ar: "جرّبت شي أوتيل ومن بعد خلّيتو؟",
    },
    options: [
      {
        value: "yes",
        label: { fr: "Oui", ar: "إيه" },
        other: true,
        otherLabel: { fr: "Lequel ?", ar: "واش هو؟" },
      },
      { value: "no", label: { fr: "Non", ar: "لا" } },
    ],
  },
  // ── 26 ─────────────────────────────────────────────────────────────
  {
    id: "q26",
    type: "textarea",
    required: false,
    showIf: { question: "q25", in: ["yes"] },
    label: {
      fr: "Pourquoi l'as-tu abandonné ?",
      ar: "علاش خلّيتو؟",
    },
    // Aucun placeholder : pas de suggestion (spec).
  },
  // ── 27 ─────────────────────────────────────────────────────────────
  {
    id: "q27",
    type: "share",
    required: false, // aucune donnée collectée (bouton de partage uniquement)
    label: {
      fr: "Connais-tu un autre marchand qui pourrait répondre à ce questionnaire ?",
      ar: "تعرف مارشون آخر يقدر يجاوب على هاد الكيستيونار؟",
    },
  },
  // ── 28 ─────────────────────────────────────────────────────────────
  {
    id: "q28",
    type: "contact",
    required: true,
    label: {
      fr: "Je t'envoie le résumé des résultats. Puis-je te recontacter ?",
      ar: "نبعثلك الريزيمي تاع النتائج. نقدر نعاود نتواصل معاك؟",
    },
    options: [
      { value: "yes", label: { fr: "Oui", ar: "إيه" } },
      { value: "no", label: { fr: "Non", ar: "لا" } },
    ],
    fields: [
      {
        id: "q28_shop_name",
        type: "text",
        required: true,
        showIf: { question: "q28", in: ["yes"] },
        label: { fr: "Nom de la boutique / page", ar: "سمية البوتيك / الباج" },
      },
      {
        id: "q28_first_name",
        type: "text",
        required: true,
        showIf: { question: "q28", in: ["yes"] },
        label: { fr: "Prénom", ar: "اسمك" },
      },
      {
        id: "q28_phone",
        type: "tel",
        required: true,
        showIf: { question: "q28", in: ["yes"] },
        label: { fr: "Téléphone (WhatsApp)", ar: "نيميرو التيليفون (واتساب)" },
      },
    ],
  },
];
