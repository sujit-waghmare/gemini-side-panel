# Changelog

All notable changes to **Gemini Side Panel** will be documented here.

---

## [1.3.3] — 2026-04-20

### Fixed
- Fixed `authorUrl` typo in `manifest.json`
- Fixed manifest `id` field to match plugin folder name (`gemini-side-panel`)

---

## [1.3.0] — 2026-04-20

### Added
- **Template Drawer:** Added a 'Templates' section to the chat menu. Define custom `.md` templates in settings to force Gemini to reply in a specific structural format.
- **Mutual Exclusivity:** Formats (Visuals, Understanding, Brief) and Templates are now mutually exclusive. Selecting a template disables standard formats; selecting a standard format clears the active template.
- **Robust Template Engine:** Plugin auto-appends `.md` to paths if forgotten. Enforces template structure via `CRITICAL RULE` system prompts. Outputs explicit UI errors for invalid template file paths.

---

## [1.2.0]

### Added
- Accordion-style collapsible sections in the chat menu (Model, Source, Format)
- Model section collapsed by default to save space
- Chevron icons indicate expand/collapse state

---

## [1.0.0]

### Added
- Initial release
- Side-panel Gemini chat via Google AI API
- Note-specific chat history with day/query-based retention
- Temperature slider (0.5–1.0)
- Source toggle: Note (strict context) vs Internet (general knowledge)
- Format options: Better Visuals, Better Understanding, Brief Information
- LaTeX rendering via `$inline$` and `$$block$$`
- Hold-to-copy on chat bubbles (600ms)
- Commands: Open left/right panel, Clear chat history
- Full mobile support (`isDesktopOnly: false`)
