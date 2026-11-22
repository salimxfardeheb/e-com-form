/**
 * Backend du questionnaire : reçoit les réponses (POST JSON en text/plain)
 * et ajoute une ligne par réponse dans la feuille « Réponses ».
 *
 * Script lié au Google Sheet (Extensions > Apps Script).
 * Toute modification => nouvelle version du déploiement (voir README.md).
 */

var SHEET_NAME = 'Réponses';

// Ordre fixe des colonnes = ordre du questionnaire (dérivé de js/questions.js).
// q27 (partage) ne collecte rien ; `website` (honeypot) n'est jamais écrit.
var COLUMNS = [
  'timestamp', 'lang',
  'q1',
  'q2', 'q2_other',
  'q3', 'q3_other',
  'q4',
  'q5', 'q5_other',
  'q6', 'q7', 'q8',
  'q9', 'q10', 'q11',
  'q12', 'q12_other',
  'q13', 'q13_other',
  'q14', 'q14_other',
  'q15', 'q15_other',
  'q16', 'q17',
  'q18', 'q18_other',
  'q19', 'q20', 'q21', 'q22', 'q23', 'q24',
  'q25', 'q25_tool',
  'q26',
  'q28', 'contact_shop', 'contact_name', 'contact_phone'
];

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
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
      sheet.setFrozenRows(1);
    }
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
