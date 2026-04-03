# Audit & Corrections — Sakaii OS for Jellyfin
**Date :** 2026-04-03  
**Scope :** 18 bugs identifiés et corrigés sur le build V2

---

## Fichiers modifiés

| Fichier | Nature |
|---------|--------|
| `style.css` | Modifié (1596 → 1743 lignes) |
| `tokens.css` | Modifié |
| `custom.js` | Réécrit |
| `README.md` | Réécrit |
| `fonts/` | Nouveau dossier (5 fichiers .woff2) |
| `.github/workflows/build.yml` | Nouveau fichier |

---

## Corrections appliquées

### CRITIQUE 01 — Google Fonts bloqué par CSP

**Problème :** `@import url("https://fonts.googleapis.com/css2?...")` en ligne 1 de `style.css` était bloqué silencieusement par les CSP des reverse proxies Jellyfin (Nginx, Caddy, Cloudflare). La police Inter ne chargeait jamais.

**Fix appliqué :**
- Suppression du `@import` Google Fonts
- Création du dossier `fonts/` avec 5 fichiers `.woff2` téléchargés depuis `@fontsource/inter` via jsDelivr :
  - `fonts/Inter-Regular.woff2` (weight 400)
  - `fonts/Inter-Medium.woff2` (weight 500)
  - `fonts/Inter-SemiBold.woff2` (weight 600)
  - `fonts/Inter-Bold.woff2` (weight 700)
  - `fonts/Inter-ExtraBold.woff2` (weight 800)
- Ajout de 5 blocs `@font-face` pointant vers `./fonts/Inter-*.woff2`
- Font-stack élargi : `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Documentation dans le README (section **Fonts**)

---

### CRITIQUE 02 — Header flottant ne compensait pas toutes les pages

**Problème :** Seule `.homeSectionsContainer` avait un `padding-top` compensatoire. Sur les pages bibliothèque, settings, recherche, etc., le contenu passait derrière le header pill.

**Fix appliqué :**
- Ajout d'un sélecteur global après `.homeSectionsContainer` :
  ```css
  .mainAnimatedPage, .libraryPage, .itemDetailPage, .adminPage,
  .myPreferencesPage, .searchPage, .nowPlayingPage, .lyricsPage {
    padding-top: calc(var(--sakaii-header-height) + 28px) !important;
  }
  ```
- `.skinHeader.osdHeader` extrait dans son propre bloc CSS (full-width, pas de pill, pas de backdrop-filter) :
  ```css
  .skinHeader.osdHeader {
    top: 0 !important; left: 0 !important; right: 0 !important;
    width: 100% !important; border-radius: 0 !important;
    background: linear-gradient(180deg, rgba(0,0,0,0.7), transparent) !important;
    border: none !important; box-shadow: none !important;
    backdrop-filter: none !important;
  }
  ```
- Même exclusion appliquée dans les media queries `@media (max-width: 768px)` et `@media (max-width: 480px)`

---

### CRITIQUE 03 — Blurhash/placeholders masqués = cards vides au chargement

**Problème :** Deux blocs CSS masquaient agressivement les canvas blurhash (`opacity: 0`, `display: none`), produisant des cards vides pendant le chargement des images.

**Fix appliqué :**
- Suppression du premier bloc (lignes 536-546 de l'original) qui forçait `opacity: 0` sur tous les canvas/svg/blurhash
- Remplacement par deux blocs scopés :
  - Canvas blurhash : `opacity: 0.35`, `filter: brightness(0.4) saturate(0.5)` — visible mais intégré au thème sombre
  - SVG placeholders (icônes par défaut) : `opacity: 0.15` — discret mais pas invisible

---

### CRITIQUE 04 — Incompatibilité Jellyfin 10.11

**Problème :** Le README indiquait `Dashboard > General > Custom CSS`, obsolète depuis Jellyfin 10.11 (octobre 2025). Le champ a été déplacé dans Branding.

**Fix appliqué :**
- README mis à jour : `Dashboard > Branding > Custom CSS` pour 10.11+, `Dashboard > General > Custom CSS` pour 10.10 et antérieur
- Ajout d'une table de compatibilité dans le README
- Note explicite : le dashboard admin n'est PAS thémé sur 10.11+ (limitation Jellyfin, pas un bug du thème)
- Dans `style.css` : `.dashboardSection` et `.dashboardContent` retirés de la liste des sélecteurs actifs et mis en commentaire avec explication

---

### CRITIQUE 05 — Image login Unsplash en hotlink

**Problème :** `url("https://images.unsplash.com/...")` dans `#loginPage::before` — bloqué par CSP, sujet à disparition, problème RGPD.

**Fix appliqué :**
- URL Unsplash remplacée par `var(--loginPageBgUrl, fallback-gradient)`
- Variable `--loginPageBgUrl` définie dans les tokens inlinés :
  ```css
  --loginPageBgUrl: url("/Branding/Splashscreen?format=webp&quality=50&width=1920&blur=0");
  ```
  → utilise le splashscreen natif Jellyfin configuré dans Dashboard > Branding
- Documentation dans le README : comment surcharger avec une image custom via `:root { --loginPageBgUrl: url(...); }`

---

### MAJEUR 06 — `body:has()` non supporté sur JMP et smart TV

**Problème :** `body:has(#loginPage) .skinHeader { display: none }` ne fonctionnait pas sur Jellyfin Media Player (Qt 5.x WebEngine) et certaines smart TV.

**Fix appliqué :**
- Suppression des 3 lignes `body:has(...)` 
- Remplacement par :
  ```css
  #loginPage ~ .skinHeader,
  #loginPage .skinHeader { display: none !important; }
  
  #loginPage { position: relative; z-index: 100 !important; }
  ```

---

### MAJEUR 07 — Overlay hover des cards neutralisé

**Problème :** Le bloc "compatibility reset" forçait `background: transparent !important; backdrop-filter: none !important;` sur `.card .cardOverlayContainer`, annulant complètement l'effet de hover overlay défini plus haut.

**Fix appliqué :** Résolu par la suppression du bloc compatibility reset (BUG-08). Les styles de hover overlay (gradient + backdrop-filter au survol) fonctionnent désormais correctement.

---

### MAJEUR 08 — Conflits de spécificité / code dupliqué (~200 lignes)

**Problème :** Le bloc "Jellyfin media compatibility reset" (lignes 655-770 de l'original) redéfinissait ou contredisait des styles définis plus haut (lignes 460-534). Doublons exacts, conflits de spécificité, règles `!important` contradictoires.

**Fix appliqué :**
- Suppression complète du bloc "Jellyfin media compatibility reset" (116 lignes supprimées)
- Les styles de cards dans le bloc principal (lignes 452-654) couvrent déjà tout ce qui est nécessaire
- Chaque propriété de card est désormais définie une seule fois avec la bonne spécificité

---

### MAJEUR 09 — Performance du backdrop-filter

**Problème :** `backdrop-filter: blur(16px) saturate(125%)` sur le header et le drawer causait du lag sur appareils peu puissants.

**Fix appliqué :**
- `--sakaii-blur-soft` : 16px → **10px** dans `tokens.css` (et dans les tokens inlinés de `style.css`)
- `will-change: backdrop-filter !important` ajouté sur `.skinHeader` et `.mainDrawer`
- Media query mobile 768px : blur 12px → **8px**
- Commentaire ajouté pour désactiver le blur sur clients légers :
  ```css
  /* To disable blur effects on low-power devices, add to your Custom CSS:
     .skinHeader, .mainDrawer { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
  */
  ```

---

### MAJEUR 10 — Pages Settings non thémées

**Problème :** Les pages préférences, settings, recherche et now playing gardaient le style Jellyfin par défaut.

**Fix appliqué :** Ajout d'un bloc CSS avant les media queries :
- Couleur de texte pour `.myPreferencesPage`, `.adminPage`, `.searchPage`, `.nowPlayingPage`, `#myPreferencesMenuPage`, `#displayPreferencesPage`
- Styling de la `nowPlayingBar` (glass background, border-top, boutons)
- Slider de progression avec gradient accent

---

### MAJEUR 11 — `@import "./tokens.css"` relatif cassé

**Problème :** Le chemin relatif ne fonctionnait pas si le CSS était copié-collé dans le champ Custom CSS de Jellyfin, ni via `raw.githubusercontent.com`.

**Fix appliqué :**
- `@import url("./tokens.css")` → `@import url("https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@main/tokens.css")`
- **Bonus :** Tokens inlinés directement dans `style.css` au début (dans un `:root` complet) — `style.css` est désormais auto-suffisant même sans résolution de l'import
- README : suppression de l'option `raw.githubusercontent.com`, avertissement explicite, jsDelivr comme seule méthode recommandée
- Import versionné ajouté dans le README : `@import url('...@v2.0.0/style.css')`

---

### MAJEUR 12 — Player controls non thémés

**Problème :** Le player vidéo et la now playing bar n'étaient pas thémés.

**Fix appliqué :** Ajout d'un bloc "Player & OSD" avant les media queries :
- `.videoOsdBottom` : gradient sombre en bas
- `.osdHeader` : gradient sombre en haut (distinct du header pill)
- `.osdTitle`, `.osdTimeText` : couleurs du thème
- `.upNextContainer` : glass surface avec border, radius, blur, shadow
- Boutons shuffle/repeat : couleur secondaire

---

### MINEUR 13 — `custom.js` placeholder vide

**Fix appliqué :** `custom.js` entièrement réécrit :
- En-tête documentaire expliquant que le script est optionnel
- `SAKAII_VERSION = "2.0.0"`
- `LONG_ABSENCE_MS = 15 * 60 * 1000` (15 minutes, contre 5 avant)
- Event custom `sakaii:returned` dispatché après longue absence
- `console.info` versionné au chargement

---

### MINEUR 14 — `content: "Sakaii OS"` doublon

**Problème :** Le sélecteur `#loginPage .manualLoginForm::before, #loginPage form::before` pouvait afficher le badge "Sakaii OS" deux fois si les deux éléments coexistaient dans le DOM.

**Fix appliqué :**
```css
/* Avant */
#loginPage .manualLoginForm::before,
#loginPage form::before { ... }

/* Après */
#loginPage form:first-of-type::before { ... }
```

---

### MINEUR 15 — `color-scheme: dark` absent du fichier principal

**Fix appliqué :** `color-scheme: dark;` ajouté dans le bloc `:root` de `style.css` (il existait déjà dans `tokens.css` mais pas dans le `:root` de style.css qui le surchargeait).

---

### MINEUR 16 — Pas de forcing du thème Dark de base

**Fix appliqué :**
- Variables natives Jellyfin ajoutées dans le `:root` de `style.css` :
  ```css
  --theme-primary-color: var(--sakaii-accent);
  --theme-text-color: var(--sakaii-text-primary);
  --theme-secondary-text-color: var(--sakaii-text-secondary);
  --theme-background-color: var(--sakaii-bg-0);
  ```
- README : "Recommended Workflow" commence par "Set your Jellyfin base theme to Dark" et "Enable Backdrops"

---

### MINEUR 17 — Dropdowns natifs / hardcoded color

**Fix appliqué :**
- Commentaire ajouté expliquant les limitations des `<select>` natifs (Chrome/Edge uniquement, ignorés sur Firefox/Safari/mobile)
- Couleur hardcodée `#1a1d23` remplacée par `var(--sakaii-bg-2)` pour utiliser les tokens

---

### MINEUR 18 — Pas de minification ni versioning

**Fix appliqué :** Création de `.github/workflows/build.yml` :
- Déclenchement sur push sur `main` et tags `v*`
- Minification avec `clean-css-cli` : `style.css` → `dist/style.min.css`, `tokens.css` → `dist/tokens.min.css`
- Copie de `custom.js` → `dist/custom.min.js`
- Déploiement automatique sur la branche `dist` via `peaceiris/actions-gh-pages`

---

## Statistiques

| Métrique | Avant | Après |
|----------|-------|-------|
| Lignes `style.css` | 1596 | 1743 |
| Lignes supprimées (compat reset) | — | −116 |
| Lignes ajoutées (features + fixes) | — | +263 |
| Fichiers polices | 0 | 5 woff2 |
| Fichiers CI/CD | 0 | 1 |
| Requêtes externes au chargement | 2 (Google Fonts + tokens.css) | 1 (tokens.css CDN, optionnel) |
| Hardcoded colors | 1 (`#1a1d23`) | 0 |
| `!important` contradictoires | ~12 (compat reset vs overlay) | 0 |
