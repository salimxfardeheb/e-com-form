# Questionnaire e-commerçants (COD)

Formulaire statique (HTML/CSS/JS vanilla, FR + darija) dont les réponses sont ajoutées dans un Google Sheet via Google Apps Script. Aucun service payant, aucune clé API.

```
index.html, css/, js/      front statique
js/config.js               URL du backend (à remplir)
apps-script/Code.gs        backend Apps Script
QUESTIONNAIRE.md           spec des 28 questions (source de vérité)
```

---

## 1. Créer le Google Sheet et le projet Apps Script

1. Crée un Google Sheet vide (https://sheets.new) et nomme-le, par exemple « Questionnaire marchands ».
2. Dans le Sheet : **Extensions > Apps Script**. Le projet créé est lié à ce Sheet.
3. Dans l'éditeur, remplace tout le contenu de `Code.gs` par celui de [`apps-script/Code.gs`](apps-script/Code.gs), puis enregistre (icône disquette ou `Ctrl+S`).

La feuille `Réponses` et sa ligne d'en-têtes sont créées automatiquement à la première réponse. Ne crée rien à la main.

## 2. Déployer en Application Web

1. Dans l'éditeur Apps Script : **Déployer > Nouveau déploiement**.
2. Roue dentée « Sélectionner le type » : **Application Web**.
3. Réglages :
   - **Exécuter en tant que : Moi** (le script écrit dans le Sheet avec ton compte) ;
   - **Qui peut accéder : Tout le monde** (et non « Tout le monde avec un compte Google », sinon les marchands devraient se connecter).
4. **Déployer**, puis **Autoriser l'accès** et choisis ton compte.
   - Google affiche « Google n'a pas validé cette application ». C'est normal pour ton propre script : clique sur **Paramètres avancés > Accéder à « nom du projet » (non sécurisé) > Autoriser**.
5. Copie l'**URL de l'application Web**. Elle se termine par `/exec`.
6. Vérifie-la : ouvre l'URL dans un navigateur. Tu dois voir `{"ok":true,"status":"up"}`.

### ⚠️ Toute modification de `Code.gs` demande une nouvelle version

Enregistrer le code ne suffit pas : l'URL `/exec` continue de servir l'ancienne version tant que le déploiement n'est pas mis à jour.

**Déployer > Gérer les déploiements >** ✏️ (modifier) **> Version : Nouvelle version > Déployer.**

L'URL reste la même. Ne passe pas par « Nouveau déploiement » : cela crée une **nouvelle URL**, qu'il faudrait recoller dans `js/config.js`.

> Si tu modifies `COLUMNS` alors que des réponses existent déjà, la ligne d'en-têtes n'est **pas** réécrite (elle n'est écrite que sur une feuille vide). Aligne les colonnes existantes à la main, ou renomme l'ancienne feuille pour repartir d'une feuille `Réponses` vide.

## 3. Brancher le front

Dans `js/config.js`, remplace la valeur par l'URL copiée :

```js
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Le front envoie le JSON en `text/plain` pour éviter le preflight CORS, qu'Apps Script ne gère pas. Il n'affiche le succès que si le script répond `{"ok":true}`.

## 4. Héberger le front gratuitement

Le site est purement statique : pas de build, la racine du dépôt est le site.

**Option A : GitHub Pages**
1. Pousse le dépôt sur GitHub.
2. **Settings > Pages > Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est publié sur `https://<utilisateur>.github.io/<dépôt>/`.

GitHub Pages est gratuit pour un dépôt **public**. Pour un dépôt privé, il faut un plan GitHub payant.

**Option B : Vercel**
1. Sur vercel.com : **Add New > Project**, puis importe le dépôt GitHub.
2. **Framework Preset : Other**. Laisse vides Build Command et Output Directory.
3. **Deploy**. Le site est publié sur `https://<projet>.vercel.app`.

Le plan gratuit Hobby de Vercel est réservé, selon ses conditions, à un usage personnel et non commercial. Si ce questionnaire sert une activité commerciale, préfère GitHub Pages (dépôt public) ou Cloudflare Pages, dont l'offre gratuite autorise l'usage commercial.

Pour tester en local : `npx serve .` puis http://localhost:3000.

## 5. Checklist de test (après déploiement)

Remplace `URL` par ton URL `/exec`.

- [ ] **Backend en ligne** : l'URL ouverte dans un navigateur affiche `{"ok":true,"status":"up"}`.
- [ ] **Envoi FR** : remplis le formulaire en français et envoie. L'écran « Merci ! » s'affiche et une ligne apparaît dans `Réponses` avec `lang` = `fr`.
- [ ] **Envoi AR** : refais-le en darija. La nouvelle ligne a `lang` = `ar` et les **mêmes codes** (`lt_10`, `youcan | other`…) dans les mêmes colonnes qu'en FR. Aucun texte arabe dans les colonnes de choix.
- [ ] **Questions conditionnelles masquées** : envoie avec q21 = « Automatique », q25 = « Non » et q28 = « Non ». Les colonnes `q22`, `q25_tool`, `q26`, `contact_shop`, `contact_name` et `contact_phone` sont vides.
- [ ] **Questions conditionnelles affichées** : envoie avec q21 = « À la main », q25 = « Oui » et q28 = « Oui ». Ces colonnes sont remplies, et le téléphone garde son `0` initial.
- [ ] **Honeypot rempli** : la réponse est `{"ok":true}` et **aucune** ligne n'est ajoutée.
  ```bash
  curl -L -H "Content-Type: text/plain;charset=utf-8" -d '{"website":"spam","q1":"lt_10"}' "URL"
  ```
- [ ] **Anti-injection** : saisis `=1+1` en q23. La cellule affiche le texte `=1+1` et non `2`.
- [ ] **Envois simultanés** : deux requêtes lancées en même temps donnent deux lignes distinctes.
  ```bash
  for i in 1 2; do curl -sL -H "Content-Type: text/plain;charset=utf-8" -d "{\"lang\":\"fr\",\"q23\":\"concurrent $i\"}" "URL" & done; wait
  ```
- [ ] **Erreur côté front** : avec une URL invalide dans `js/config.js`, l'envoi affiche le message d'erreur et le bouton « Réessayer », sans perte des réponses.

Supprime ensuite les lignes de test du Sheet.
