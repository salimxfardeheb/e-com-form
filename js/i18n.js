// TRADUCTIONS DARIJA À RELIRE PAR UN LOCUTEUR NATIF
//
// Textes d'interface. Jetons remplacés à l'exécution : {current}, {total}, {n}, {max}, {url}.

export const DEFAULT_LANG = "fr";

export const LANGS = {
  fr: { dir: "ltr", name: "Français" },
  ar: { dir: "rtl", name: "الدارجة" },
};

export const I18N = {
  fr: {
    pageTitle: "Questionnaire Flowmerce",
    languageLabel: "Langue",

    // Navigation
    next: "Suivant",
    previous: "Précédent",
    submit: "Envoyer",
    submitting: "Envoi en cours…",
    stepProgress: "Étape {current} sur {total}",
    optional: "(facultatif)",

    // Champs
    otherPlaceholder: "Précise…",
    numberPlaceholder: "Montant en DA",
    dynamicItemLabel: "Problème n°{n}",
    dynamicAdd: "+ Ajouter un problème",
    dynamicRemove: "Supprimer",
    shareButton: "Partager sur WhatsApp",

    // Erreurs
    errorRequired: "Cette question est obligatoire.",
    errorOtherRequired: "Précise ta réponse.",
    errorNumber: "Entre un nombre valide (chiffres uniquement).",
    errorPhone: "Entre un numéro de téléphone valide.",
    errorMaxItems: "{max} problèmes maximum.",
    errorStep: "Complète les questions obligatoires avant de continuer.",
    errorSubmit: "L'envoi a échoué. Vérifie ta connexion et réessaie.",
    retry: "Réessayer",

    // Succès
    successTitle: "Merci !",
    successMessage: "Tes réponses ont bien été envoyées.",

    // Partage WhatsApp (q27)
    shareMessage:
      "Salam, je viens de répondre à un questionnaire pour les e-commerçants (COD). Ça prend quelques minutes, tu peux le remplir ici : {url}",
  },

  ar: {
    pageTitle: "كيستيونار Flowmerce",
    languageLabel: "اللغة",

    // Navigation
    next: "التالي",
    previous: "اللّور",
    submit: "ابعث",
    submitting: "راهو يتبعث…",
    stepProgress: "المرحلة {current} من {total}",
    optional: "(ماشي لازم)",

    // Champs
    otherPlaceholder: "وضّح…",
    numberPlaceholder: "المبلغ بالدينار",
    dynamicItemLabel: "المشكل رقم {n}",
    dynamicAdd: "+ زيد مشكل",
    dynamicRemove: "نحّي",
    shareButton: "بارتاجي فالواتساب",

    // Erreurs
    errorRequired: "هاد السؤال لازم تجاوب عليه.",
    errorOtherRequired: "وضّح الجواب تاعك.",
    errorNumber: "دخّل رقم صحيح (أرقام برك).",
    errorPhone: "دخّل نيميرو تيليفون صحيح.",
    errorMaxItems: "{max} مشاكل ماكسيموم.",
    errorStep: "جاوب على الأسئلة اللازمة قبل ما تكمّل.",
    errorSubmit: "ما تبعثش. شوف الكونيكسيون وعاود.",
    retry: "عاود",

    // Succès
    successTitle: "صحّيت!",
    successMessage: "الأجوبة تاعك وصلو.",

    // Partage WhatsApp (q27)
    shareMessage:
      "السلام، جاوبت على كيستيونار تاع المارشونات تاع الإي-كوميرس (الدفع عند الاستلام). ياخذ شوية دقايق، تقدر تعمّرو هنا: {url}",
  },
};
