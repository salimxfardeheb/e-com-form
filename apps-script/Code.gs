/**
 * Backend du questionnaire : reçoit les réponses (POST JSON en text/plain)
 * et ajoute une ligne par réponse dans la feuille « Réponses ».
 *
 * Script lié au Google Sheet (Extensions > Apps Script).
 * Toute modification => nouvelle version du déploiement (voir README.md).
 */

var SHEET_NAME = 'Réponses';

// Ordre fixe des colonnes = ordre du questionnaire (dérivé de js/questions.js).
// [clé envoyée par le formulaire, titre affiché en ligne 1 du Sheet].
// q27 (partage) ne collecte rien ; `website` (honeypot) n'est jamais écrit.
var COLUMNS_DEF = [
  ['timestamp', 'Date d\'envoi'],
  ['lang', 'Langue'],
  ['q1', 'Q1 · Commandes / jour'],
  ['q2', 'Q2 · Plateforme'],
  ['q2_other', 'Q2 · Plateforme (autre)'],
  ['q3', 'Q3 · Livreur'],
  ['q3_other', 'Q3 · Livreur (autre)'],
  ['q4', 'Q4 · Nb confirmatrices'],
  ['q5', 'Q5 · Où sont notées les commandes'],
  ['q5_other', 'Q5 · Où (autre)'],
  ['q6', 'Q6 · Ce qui fatigue le plus'],
  ['q7', 'Q7 · Dernière fois (problème n°1)'],
  ['q8', 'Q8 · Solution essayée'],
  ['q9', 'Q9 · Fausses commandes / semaine'],
  ['q10', 'Q10 · Colis retournés / semaine'],
  ['q11', 'Q11 · Réclamations / semaine'],
  ['q12', 'Q12 · Raisons des réclamations'],
  ['q12_other', 'Q12 · Raisons (autre)'],
  ['q13', 'Q13 · Canal de réclamation'],
  ['q13_other', 'Q13 · Canal (autre)'],
  ['q14', 'Q14 · Réponse à une réclamation'],
  ['q14_other', 'Q14 · Réponse (autre)'],
  ['q15', 'Q15 · Où sont notées les réclamations'],
  ['q15_other', 'Q15 · Où (autre)'],
  ['q16', 'Q16 · Temps réclamations / semaine'],
  ['q17', 'Q17 · Coût d\'un retour (DA)'],
  ['q18', 'Q18 · Repérage fausse commande'],
  ['q18_other', 'Q18 · Repérage (autre)'],
  ['q19', 'Q19 · Liste noire'],
  ['q20', 'Q20 · Partage de fraudeurs'],
  ['q21', 'Q21 · Saisie chez le livreur'],
  ['q22', 'Q22 · Temps de saisie / jour'],
  ['q23', 'Q23 · Outils utilisés'],
  ['q24', 'Q24 · Budget outils / mois (DA)'],
  ['q25', 'Q25 · Outil abandonné ?'],
  ['q25_tool', 'Q25 · Lequel'],
  ['q26', 'Q26 · Pourquoi abandonné'],
  ['q28', 'Q28 · Accepte d\'être recontacté'],
  ['contact_shop', 'Boutique / page'],
  ['contact_name', 'Prénom'],
  ['contact_phone', 'Téléphone (WhatsApp)']
];
var COLUMNS = COLUMNS_DEF.map(function (c) { return c[0]; });
var HEADERS = COLUMNS_DEF.map(function (c) { return c[1]; });

// Colonnes numériques (montants en DA) : écrites comme nombres si la valeur
// n'est faite que de chiffres. Toutes les autres sont forcées en texte brut
// (préserve le 0 initial des téléphones, évite la conversion en date).
var NUMERIC_COLUMNS = { q17: true, q24: true };

var LOCK_TIMEOUT_MS = 20000;

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('invalid body');
  } catch (err) {
    return json_({ ok: false, error: 'invalid_json' });
  }

  // Honeypot rempli => bot : on répond succès sans rien écrire.
  if (data.website) return json_({ ok: true });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_TIMEOUT_MS);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    var sheet = getSheet_();
    writeHeaders_(sheet);
    var row = COLUMNS.map(function (key) { return cell_(key, data[key]); });
    var formats = COLUMNS.map(function (key) { return NUMERIC_COLUMNS[key] ? '0' : '@'; });
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, COLUMNS.length);
    range.setNumberFormats([formats]);
    range.setValues([row]);
    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, status: 'up' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

// Écrit (ou met à jour) la ligne de titres si elle diffère de HEADERS.
function writeHeaders_(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  var current = sheet.getLastRow() === 0 ? [] : range.getValues()[0];
  if (current.join('\u0001') === HEADERS.join('\u0001')) return;
  range.setNumberFormat('@').setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// À lancer une fois depuis l'éditeur (Exécuter > setupHeaders) pour
// renommer les colonnes sans attendre une nouvelle réponse.
function setupHeaders() {
  writeHeaders_(getSheet_());
}

function cell_(key, value) {
  if (value === undefined || value === null) return '';
  var s = String(value);
  if (NUMERIC_COLUMNS[key] && /^\d+$/.test(s)) return Number(s);
  // Anti-injection de formules.
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
