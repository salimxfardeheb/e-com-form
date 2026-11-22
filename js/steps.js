// Étapes du formulaire. L'ordre des questions de QUESTIONNAIRE.md est conservé :
// chaque étape contient une plage contiguë de questions.

export const STEPS = [
  {
    id: "profile",
    title: { fr: "Ton activité", ar: "الخدمة تاعك" },
    questionIds: ["q1", "q2", "q3", "q4", "q5"],
  },
  {
    id: "problems",
    title: { fr: "Ce qui te fatigue", ar: "واش يعيّيك" },
    questionIds: ["q6", "q7", "q8"],
  },
  {
    id: "complaints",
    title: { fr: "Ta semaine et les réclamations", ar: "السيمانة تاعك والريكلاماسيونات" },
    questionIds: ["q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16"],
  },
  {
    id: "fraud_returns",
    title: { fr: "Fraude et retours", ar: "الكوموندات الفوسي والروتور" },
    questionIds: ["q17", "q18", "q19", "q20"],
  },
  {
    id: "tools",
    title: { fr: "Tes outils", ar: "الأوتيلات تاعك" },
    questionIds: ["q21", "q22", "q23", "q24", "q25", "q26"],
  },
  {
    id: "closing",
    title: { fr: "Pour finir", ar: "باش نكمّلو" },
    questionIds: ["q27", "q28"],
  },
];
