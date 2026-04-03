# Sakaii OS for Jellyfin

Sakaii OS for Jellyfin is a premium custom theme for Jellyfin built around a calm, cinematic, Apple-like visual language with a distinct Sakaii identity.

This repository is a clean refactor separate from Nova UI. Nova UI remains the legacy V1 theme, while Sakaii OS is the dedicated V2 project.

## Vision

The goal is to make Jellyfin feel like a native Sakaii media platform:

- premium but restrained
- minimal but immersive
- cinematic without becoming noisy
- elegant on desktop, tablet, and mobile

The design should feel closer to a polished media OS than to a flashy CSS skin.

## Current Build Status

The current build already includes:

- shell and header redesign
- media card redesign
- item details page redesign
- login screen redesign
- dialogs, menus, progress UI, and mobile polish

This is now usable as a first visual build, but it should still be tested against a real Jellyfin instance to adjust selectors and plugin interactions if needed.

## Project Structure

- `style.css`: main theme entry point (self-contained, includes inlined tokens)
- `tokens.css`: shared design tokens (reference file)
- `custom.js`: optional UX enhancements
- `fonts/`: self-hosted Inter font files
- `docs/vision.md`: visual and product direction
- `docs/roadmap.md`: implementation phases

## Design Principles

- deep graphite surfaces instead of pure flat black
- subtle glass layers and restrained blur
- soft motion and precise spacing
- one controlled accent family
- consistent UI components across Jellyfin screens

## Compatibility

| Jellyfin Version | Status |
|------------------|--------|
| 10.11.x | Supported (CSS in Branding) |
| 10.10.x | Supported (CSS in General) |
| 10.9.x | Mostly works, some selectors may differ |

**Important:**
- The admin dashboard is NOT themed on Jellyfin 10.11+ (this is a Jellyfin limitation, not a theme bug — the dashboard is a separate React app that does not load custom CSS).
- The **Dark** base theme must be selected in your Jellyfin display settings for Sakaii OS to render correctly.
- Backdrops must be enabled in Settings > Display > Backdrops.

## Installation

### Recommended Workflow

0. Set your Jellyfin base theme to **Dark** (Settings > Display > Theme).
1. Enable **Backdrops** in Settings > Display.
2. Apply the CSS only.
3. Test desktop and mobile layouts.
4. Adjust any plugin-specific conflicts.
5. Add optional JavaScript only after the visual layer feels stable.

### CSS

**Jellyfin 10.11+**: Dashboard > Branding > Custom CSS  
**Jellyfin 10.10 and earlier**: Dashboard > General > Custom CSS

Then add:

```css
@import url('https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@main/style.css');
```

For a pinned version (recommended for production):
```css
@import url('https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@v2.0.0/style.css');
```

> **Note:** Do not use `raw.githubusercontent.com` — it does not support `@import` of relative paths, which will break the font loading. Use jsDelivr only.

### Fonts

The Inter font is self-hosted in the `fonts/` directory of this repository. No external font requests are made, so no CSP (Content-Security-Policy) modifications are needed on your Jellyfin reverse proxy.

The fonts are served automatically when using the jsDelivr import above.

### Login Background

The login page uses your Jellyfin splash screen image by default. Configure it in Dashboard > Branding > Login Splash Screen.

To use a custom image instead, add this to your Custom CSS **before** the Sakaii import:

```css
:root {
  --loginPageBgUrl: url('https://your-server/path/to/image.jpg');
}
```

### JavaScript (Optional)

If you use the `JavaScript Injector` plugin, add this script globally:

```javascript
let script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@main/custom.js';
document.head.appendChild(script);
```

## Notes

- `style.css` is self-contained and includes inlined design tokens — you only need to import `style.css`.
- If your browser caches old CSS aggressively, force refresh after changes.
- Some plugins can alter Jellyfin layouts and may need dedicated compatibility tweaks.
