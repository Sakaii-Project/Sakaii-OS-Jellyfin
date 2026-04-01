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

- `style.css`: main theme entry point
- `tokens.css`: shared design tokens
- `custom.js`: optional UX enhancements
- `docs/vision.md`: visual and product direction
- `docs/roadmap.md`: implementation phases

## Design Principles

- deep graphite surfaces instead of pure flat black
- subtle glass layers and restrained blur
- soft motion and precise spacing
- one controlled accent family
- consistent UI components across Jellyfin screens

## Installation

### CSS

In Jellyfin, go to:

`Dashboard > General > Custom CSS`

Then add:

```css
@import url('https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@main/style.css');
```

If you prefer GitHub raw hosting instead of jsDelivr:

```css
@import url('https://raw.githubusercontent.com/Sakaii-Project/Sakaii-OS-Jellyfin/main/style.css');
```

### JavaScript (Optional)

If you use the `JavaScript Injector` plugin, add this script globally:

```javascript
let script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/Sakaii-Project/Sakaii-OS-Jellyfin@main/custom.js';
document.head.appendChild(script);
```

## Recommended Workflow

1. Apply the CSS only.
2. Test desktop and mobile layouts.
3. Adjust any plugin-specific conflicts.
4. Add optional JavaScript only after the visual layer feels stable.

## Notes

- `tokens.css` is imported by `style.css`, so you only need to import `style.css`.
- If your browser caches old CSS aggressively, force refresh after changes.
- Some plugins can alter Jellyfin layouts and may need dedicated compatibility tweaks.
