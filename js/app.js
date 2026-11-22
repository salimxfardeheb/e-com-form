import { QUESTIONS } from "./questions.js";
import { STEPS } from "./steps.js";
import { I18N, LANGS, DEFAULT_LANG } from "./i18n.js";
import { APPS_SCRIPT_URL } from "./config.js";

// ── Constantes ─────────────────────────────────────────────────────
const Q = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
const SEP = " | ";
// Clés d'envoi spécifiques (sinon `${id}_other` / id du champ).
const OTHER_KEYS = { q25: "q25_tool" };
const FIELD_KEYS = {
  q28_shop_name: "contact_shop",
  q28_first_name: "contact_name",
  q28_phone: "contact_phone",
};
const PHONE_RE = /^\+?\d{9,15}$/;
const NUMBER_RE = /^\d+$/;

// ── État ───────────────────────────────────────────────────────────
// A : réponses. Clés : id (valeur principale), `${id}:other`, `${id}:unknown`,
// et id des champs de contact.
const A = { q6: [""] };
const state = { lang: DEFAULT_LANG, step: 0, errors: {}, sending: false, submitFailed: false, done: false };

// ── DOM ────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const dom = {
  langSwitch: $("lang-switch"),
  progress: $("progress"),
  progressText: $("progress-text"),
  progressFill: $("progress-fill"),
  form: $("form"),
  stepTitle: $("step-title"),
  questions: $("questions"),
  honeypot: $("website"),
  submitError: $("submit-error"),
  submitErrorText: $("submit-error-text"),
  retry: $("retry"),
  prev: $("prev"),
  next: $("next"),
  success: $("success"),
  successTitle: $("success-title"),
  successMessage: $("success-message"),
};

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (k in node && typeof v !== "string") node[k] = v;
    else node.setAttribute(k, v === true ? "" : v);
  }
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
}

// ── i18n ───────────────────────────────────────────────────────────
function t(key, vars = {}) {
  return I18N[state.lang][key].replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
const L = (obj) => obj[state.lang];

function questionLabel(q) {
  const p1 = (A.q6?.[0] || "").trim() || "…";
  return L(q.label).replace("{q6_1}", p1);
}

// ── Conditions ─────────────────────────────────────────────────────
function condMet(cond) {
  if (!cond) return true;
  const parent = Q[cond.question];
  if (parent && !isVisible(parent)) return false;
  return cond.in.includes(A[cond.question]);
}
const isVisible = (q) => condMet(q.showIf);

function clearQuestion(q) {
  let had = false;
  for (const k of Object.keys(A)) {
    if (k === q.id || k.startsWith(q.id + ":")) {
      delete A[k];
      had = true;
    }
  }
  for (const f of q.fields || []) {
    if (f.id in A) { delete A[f.id]; had = true; }
  }
  delete state.errors[q.id];
  return had;
}

function clearFields(q) {
  for (const f of q.fields || []) {
    delete A[f.id];
    delete state.errors[f.id];
  }
}

// Applique toutes les conditions : efface les réponses devenues masquées
// et met à jour l'affichage des blocs de l'étape courante.
function applyConditions() {
  for (const q of QUESTIONS) {
    if (q.showIf && !isVisible(q) && clearQuestion(q)) {
      const box = boxOf(q.id);
      if (box) box.replaceWith(renderQuestion(q));
    }
    for (const f of q.fields || []) {
      if (!condMet(f.showIf) && f.id in A) delete A[f.id];
    }
  }
  for (const box of dom.questions.querySelectorAll(".q")) {
    const q = Q[box.dataset.qid];
    box.hidden = !isVisible(q);
    const fieldsBox = box.querySelector(".contact-fields");
    if (fieldsBox) {
      const show = q.fields.some((f) => condMet(f.showIf));
      if (!show && !fieldsBox.hidden) {
        clearFields(q);
        for (const input of fieldsBox.querySelectorAll("input")) {
          input.value = "";
          input.removeAttribute("aria-invalid");
        }
        for (const err of fieldsBox.querySelectorAll(".error")) err.hidden = true;
      }
      fieldsBox.hidden = !show;
    }
  }
}

const boxOf = (id) => dom.questions.querySelector(`.q[data-qid="${id}"]`);

function onChange(id) {
  if (state.errors[id]) {
    delete state.errors[id];
    showError(id);
  }
  applyConditions();
  if (id === "q6") {
    const label = dom.questions.querySelector('[data-qid="q7"] .q-label-text');
    if (label) label.textContent = questionLabel(Q.q7);
  }
}

// ── Erreurs ────────────────────────────────────────────────────────
function errorNode(id) {
  const key = state.errors[id];
  return el("p", { class: "error", id: `${id}-error`, text: key ? t(key) : "", hidden: !key });
}

function showError(id) {
  const node = $(`${id}-error`);
  if (!node) return;
  const key = state.errors[id];
  node.textContent = key ? t(key) : "";
  node.hidden = !key;
  const box = boxOf(id);
  const target = box ? box : node.closest(".field");
  if (!target) return;
  const inputs = box
    ? target.querySelectorAll(":scope > .input, :scope > .textarea, .dyn-row .input, .number-input")
    : target.querySelectorAll(".input");
  for (const input of inputs) {
    if (key) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
}

// ── Rendu : coque commune ──────────────────────────────────────────
function shell(q, { fieldset }) {
  const box = el(fieldset ? "fieldset" : "div", { class: "q", "data-qid": q.id });
  const labelProps = fieldset
    ? { class: "q-label", id: `${q.id}-label` }
    : { class: "q-label", id: `${q.id}-label`, for: `${q.id}-input` };
  const label = el(fieldset ? "legend" : "label", labelProps, el("span", { class: "q-label-text", text: questionLabel(q) }));
  if (!q.required && q.type !== "share") {
    label.append(" ", el("span", { class: "q-optional", text: t("optional") }));
  }
  box.append(label);
  return box;
}

function describedBy(id) {
  return `${id}-error`;
}

// ── Rendu : choix (single / multiple / contact) ────────────────────
function renderOptions(q, multiple) {
  const list = el("div", { class: "options" });
  const selected = () => (multiple ? A[q.id] || [] : A[q.id] ? [A[q.id]] : []);

  const otherInputs = [];
  for (const o of q.options) {
    const input = el("input", {
      type: multiple ? "checkbox" : "radio",
      name: q.id,
      value: o.value,
      checked: selected().includes(o.value),
      "aria-describedby": describedBy(q.id),
    });
    list.append(el("label", { class: "option" }, input, el("span", { text: L(o.label) })));

    if (o.other) {
      const otherText = o.otherLabel ? L(o.otherLabel) : t("otherPlaceholder");
      const other = el("input", {
        type: "text",
        class: "input other-input",
        placeholder: otherText,
        "aria-label": otherText,
        value: A[q.id + ":other"] || "",
        hidden: !selected().includes(o.value),
        "aria-describedby": describedBy(q.id),
        oninput: (e) => {
          A[q.id + ":other"] = e.target.value;
          onChange(q.id);
        },
      });
      otherInputs.push({ value: o.value, node: other });
      list.append(other);
    }
  }

  list.addEventListener("change", (e) => {
    if (e.target.name !== q.id) return;
    if (multiple) {
      A[q.id] = [...list.querySelectorAll(`input[name="${q.id}"]:checked`)].map((i) => i.value);
    } else {
      A[q.id] = e.target.value;
    }
    const sel = selected();
    for (const { value, node } of otherInputs) {
      const on = sel.includes(value);
      if (!on && !node.hidden) {
        node.value = "";
        delete A[q.id + ":other"];
      }
      node.hidden = !on;
      if (on && e.target.value === value && e.target.checked) node.focus();
    }
    onChange(q.id);
  });
  return list;
}

function renderSingle(q) {
  const box = shell(q, { fieldset: true });
  box.append(renderOptions(q, false), errorNode(q.id));
  return box;
}

function renderMultiple(q) {
  const box = shell(q, { fieldset: true });
  box.append(renderOptions(q, true), errorNode(q.id));
  return box;
}

// ── Rendu : texte ──────────────────────────────────────────────────
function renderText(q, multiline) {
  const box = shell(q, { fieldset: false });
  const input = el(multiline ? "textarea" : "input", {
    id: `${q.id}-input`,
    class: multiline ? "textarea" : "input",
    type: multiline ? undefined : "text",
    placeholder: q.placeholder ? L(q.placeholder) : undefined,
    "aria-describedby": describedBy(q.id),
    oninput: (e) => {
      A[q.id] = e.target.value;
      onChange(q.id);
    },
  });
  input.value = A[q.id] || "";
  box.append(input, errorNode(q.id));
  return box;
}

// ── Rendu : nombre ─────────────────────────────────────────────────
function renderNumber(q) {
  const box = shell(q, { fieldset: false });
  const unknown = !!A[q.id + ":unknown"];
  const input = el("input", {
    id: `${q.id}-input`,
    class: "input number-input",
    type: "text",
    inputmode: "numeric",
    autocomplete: "off",
    placeholder: t("numberPlaceholder"),
    disabled: unknown,
    "aria-describedby": describedBy(q.id),
    oninput: (e) => {
      A[q.id] = e.target.value;
      onChange(q.id);
    },
  });
  input.value = unknown ? "" : A[q.id] || "";
  box.append(input);

  if (q.unknownOption) {
    const check = el("input", {
      type: "checkbox",
      checked: unknown,
      onchange: (e) => {
        A[q.id + ":unknown"] = e.target.checked;
        if (e.target.checked) {
          input.value = "";
          delete A[q.id];
        }
        input.disabled = e.target.checked;
        onChange(q.id);
      },
    });
    box.append(el("label", { class: "option unknown" }, check, el("span", { text: L(q.unknownOption.label) })));
  }
  box.append(errorNode(q.id));
  return box;
}

// ── Rendu : liste dynamique (q6) ───────────────────────────────────
function renderDynamicList(q) {
  const box = shell(q, { fieldset: true });
  const list = el("div", { class: "dyn-list" });
  const add = el("button", { type: "button", class: "btn btn-secondary btn-add", text: t("dynamicAdd") });

  const draw = (focusIndex) => {
    const items = A[q.id];
    list.replaceChildren();
    items.forEach((value, i) => {
      const inputId = `${q.id}-input${i === 0 ? "" : "-" + (i + 1)}`;
      const input = el("input", {
        id: inputId,
        class: "input",
        type: "text",
        "aria-describedby": i === 0 ? describedBy(q.id) : undefined,
        oninput: (e) => {
          A[q.id][i] = e.target.value;
          onChange(q.id);
        },
      });
      input.value = value;
      const row = el("div", { class: "dyn-row" }, input);
      if (i > 0) {
        row.append(
          el("button", {
            type: "button",
            class: "btn-remove",
            text: "✕",
            "aria-label": `${t("dynamicRemove")} – ${t("dynamicItemLabel", { n: i + 1 })}`,
            title: t("dynamicRemove"),
            onclick: () => {
              A[q.id].splice(i, 1);
              draw(Math.min(i, A[q.id].length - 1));
              onChange(q.id);
            },
          }),
        );
      }
      list.append(
        el("div", { class: "dyn-item" },
          el("label", { class: "dyn-item-label", for: inputId, text: t("dynamicItemLabel", { n: i + 1 }) }),
          row,
        ),
      );
      if (i === 0 && state.errors[q.id]) input.setAttribute("aria-invalid", "true");
    });
    add.hidden = items.length >= q.max;
    if (focusIndex !== undefined) list.querySelectorAll(".input")[focusIndex]?.focus();
  };

  add.addEventListener("click", () => {
    if (A[q.id].length >= q.max) return;
    A[q.id].push("");
    draw(A[q.id].length - 1);
  });

  draw();
  box.append(list, add, errorNode(q.id));
  return box;
}

// ── Rendu : partage WhatsApp ───────────────────────────────────────
function shareUrl() {
  return "https://wa.me/?text=" + encodeURIComponent(t("shareMessage", { url: location.href }));
}

function renderShare(q) {
  const box = shell(q, { fieldset: false });
  box.querySelector(".q-label").removeAttribute("for");
  box.append(
    el("a", {
      class: "btn btn-share",
      href: shareUrl(),
      target: "_blank",
      rel: "noopener noreferrer",
      text: t("shareButton"),
    }),
  );
  return box;
}

// ── Rendu : contact (q28) ──────────────────────────────────────────
const FIELD_ATTRS = {
  q28_shop_name: { autocomplete: "organization" },
  q28_first_name: { autocomplete: "given-name" },
  q28_phone: { autocomplete: "tel", inputmode: "tel", dir: "ltr" },
};

function renderContact(q) {
  const box = shell(q, { fieldset: true });
  box.append(renderOptions(q, false), errorNode(q.id));
  const fieldsBox = el("div", { class: "contact-fields", hidden: !q.fields.some((f) => condMet(f.showIf)) });
  for (const f of q.fields) {
    const inputId = `${f.id}-input`;
    const input = el("input", {
      id: inputId,
      class: "input",
      type: f.type === "tel" ? "tel" : "text",
      "aria-describedby": describedBy(f.id),
      ...(FIELD_ATTRS[f.id] || {}),
      oninput: (e) => {
        A[f.id] = e.target.value;
        onChange(f.id);
      },
    });
    input.value = A[f.id] || "";
    if (state.errors[f.id]) input.setAttribute("aria-invalid", "true");
    fieldsBox.append(
      el("div", { class: "field" },
        el("label", { class: "field-label", for: inputId, text: L(f.label) }),
        input,
        errorNode(f.id),
      ),
    );
  }
  box.append(fieldsBox);
  return box;
}

// ── Dispatch ───────────────────────────────────────────────────────
const RENDERERS = {
  single: renderSingle,
  multiple: renderMultiple,
  text: (q) => renderText(q, false),
  textarea: (q) => renderText(q, true),
  number: renderNumber,
  dynamic_list: renderDynamicList,
  share: renderShare,
  contact: renderContact,
};

function renderQuestion(q) {
  const box = RENDERERS[q.type](q);
  box.hidden = !isVisible(q);
  return box;
}

// ── Validation ─────────────────────────────────────────────────────
const trim = (v) => (typeof v === "string" ? v.trim() : "");
const normNumber = (v) => trim(v).replace(/\s+/g, "");
const normPhone = (v) => trim(v).replace(/[\s.\-()]/g, "");

function validateQuestion(q, errors) {
  if (!isVisible(q)) return;
  const v = A[q.id];
  switch (q.type) {
    case "single":
    case "multiple":
    case "contact": {
      const sel = q.type === "multiple" ? v || [] : v ? [v] : [];
      if (q.required && sel.length === 0) {
        errors[q.id] = "errorRequired";
        break;
      }
      const otherSelected = q.options.some((o) => o.other && sel.includes(o.value));
      if (otherSelected && !trim(A[q.id + ":other"])) errors[q.id] = "errorOtherRequired";
      for (const f of q.fields || []) {
        if (!condMet(f.showIf)) continue;
        const fv = trim(A[f.id]);
        if (f.required && !fv) errors[f.id] = "errorRequired";
        else if (fv && f.type === "tel" && !PHONE_RE.test(normPhone(fv))) errors[f.id] = "errorPhone";
      }
      break;
    }
    case "text":
    case "textarea":
      if (q.required && !trim(v)) errors[q.id] = "errorRequired";
      break;
    case "number": {
      const n = normNumber(v);
      if (n && !NUMBER_RE.test(n)) errors[q.id] = "errorNumber";
      else if (q.required && !n && !A[q.id + ":unknown"]) errors[q.id] = "errorRequired";
      break;
    }
    case "dynamic_list":
      if (q.required && !trim((v || [])[0])) errors[q.id] = "errorRequired";
      break;
  }
}

function errorIdsOf(q) {
  return [q.id, ...(q.fields || []).map((f) => f.id)];
}

function validateStep() {
  const step = STEPS[state.step];
  const errors = {};
  for (const id of step.questionIds) validateQuestion(Q[id], errors);
  for (const id of step.questionIds) {
    for (const eid of errorIdsOf(Q[id])) {
      if (errors[eid]) state.errors[eid] = errors[eid];
      else delete state.errors[eid];
      showError(eid);
    }
  }
  const first = Object.keys(errors)[0];
  if (first) {
    const errNode = $(`${first}-error`);
    const container = errNode.closest(".field") || boxOf(first);
    container.scrollIntoView({ block: "center" });
    container.querySelector("input:not([type=hidden]):not(:disabled), textarea")?.focus({ preventScroll: true });
    return false;
  }
  return true;
}

// ── Données envoyées ───────────────────────────────────────────────
function buildPayload() {
  const data = { timestamp: new Date().toISOString(), lang: state.lang };
  for (const q of QUESTIONS) {
    if (q.type === "share") continue; // aucune donnée collectée
    const vis = isVisible(q);
    const v = A[q.id];
    switch (q.type) {
      case "single":
      case "contact":
        data[q.id] = vis ? v || "" : "";
        break;
      case "multiple":
        data[q.id] = vis ? (v || []).join(SEP) : "";
        break;
      case "text":
      case "textarea":
        data[q.id] = vis ? trim(v) : "";
        break;
      case "number":
        data[q.id] = !vis ? "" : A[q.id + ":unknown"] ? q.unknownOption.value : normNumber(v);
        break;
      case "dynamic_list":
        data[q.id] = vis
          ? (v || []).map((s) => trim(s).replaceAll("|", "/")).filter(Boolean).join(SEP)
          : "";
        break;
    }
    if (q.options?.some((o) => o.other)) {
      const sel = q.type === "multiple" ? v || [] : [v];
      const otherSelected = q.options.some((o) => o.other && sel.includes(o.value));
      data[OTHER_KEYS[q.id] || `${q.id}_other`] = vis && otherSelected ? trim(A[q.id + ":other"]) : "";
    }
    for (const f of q.fields || []) {
      const fv = vis && condMet(f.showIf) ? trim(A[f.id]) : "";
      data[FIELD_KEYS[f.id] || f.id] = f.type === "tel" ? normPhone(fv) : fv;
    }
  }
  data.website = dom.honeypot.value;
  return data;
}

async function submit() {
  if (state.sending) return;
  state.sending = true;
  state.submitFailed = false;
  renderNav();
  try {
    if (!/^https:\/\//.test(APPS_SCRIPT_URL)) throw new Error("APPS_SCRIPT_URL non configurée");
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(buildPayload()),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    // Apps Script répond 200 même en cas d'erreur : seul `ok: true` vaut succès.
    const result = await res.json();
    if (!result || result.ok !== true) throw new Error(result?.error || "réponse invalide");
    state.done = true;
  } catch {
    state.submitFailed = true;
  } finally {
    state.sending = false;
  }
  if (state.done) {
    renderSuccess();
  } else {
    renderNav();
    dom.submitError.scrollIntoView({ block: "center" });
  }
}

// ── Navigation ─────────────────────────────────────────────────────
const isLast = () => state.step === STEPS.length - 1;

function goNext() {
  if (state.sending) return;
  if (!validateStep()) return;
  if (isLast()) {
    submit();
    return;
  }
  state.step++;
  state.submitFailed = false;
  renderStep(true);
}

function goPrev() {
  if (state.sending || state.step === 0) return;
  state.step--;
  state.submitFailed = false;
  renderStep(true);
}

// ── Rendu global ───────────────────────────────────────────────────
function renderChrome() {
  const html = document.documentElement;
  html.lang = state.lang;
  html.dir = LANGS[state.lang].dir;
  document.title = t("pageTitle");
  dom.langSwitch.setAttribute("aria-label", t("languageLabel"));
  dom.langSwitch.replaceChildren(
    ...Object.entries(LANGS).map(([code, info]) =>
      el("button", {
        type: "button",
        lang: code,
        "aria-pressed": String(code === state.lang),
        text: info.name,
        onclick: () => setLang(code),
      }),
    ),
  );
  dom.retry.textContent = t("retry");
  dom.successTitle.textContent = t("successTitle");
  dom.successMessage.textContent = t("successMessage");
}

function renderNav() {
  dom.prev.textContent = t("previous");
  dom.prev.hidden = state.step === 0;
  dom.prev.disabled = state.sending;
  dom.next.textContent = state.sending ? t("submitting") : isLast() ? t("submit") : t("next");
  dom.next.disabled = state.sending;
  dom.submitError.hidden = !state.submitFailed;
  dom.submitErrorText.textContent = t("errorSubmit");
  dom.retry.disabled = state.sending;
}

function renderStep(moveFocus) {
  const step = STEPS[state.step];
  dom.progressText.textContent = t("stepProgress", { current: state.step + 1, total: STEPS.length });
  dom.progressFill.style.width = `${((state.step + 1) / STEPS.length) * 100}%`;
  dom.stepTitle.textContent = L(step.title);
  dom.questions.replaceChildren(...step.questionIds.map((id) => renderQuestion(Q[id])));
  applyConditions();
  renderNav();
  if (moveFocus) {
    window.scrollTo(0, 0);
    dom.stepTitle.focus({ preventScroll: true });
  }
}

function renderSuccess() {
  dom.form.hidden = true;
  dom.progress.hidden = true;
  dom.success.hidden = false;
  window.scrollTo(0, 0);
  dom.successTitle.focus({ preventScroll: true });
}

function setLang(code) {
  if (code === state.lang || !LANGS[code]) return;
  state.lang = code;
  renderChrome();
  if (!state.done) renderStep(false);
}

// ── Démarrage ──────────────────────────────────────────────────────
dom.form.addEventListener("submit", (e) => {
  e.preventDefault();
  goNext();
});
dom.prev.addEventListener("click", goPrev);
dom.retry.addEventListener("click", goNext);

renderChrome();
renderStep(false);
