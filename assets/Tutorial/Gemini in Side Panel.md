# Gemini Side Panel — Complete 1:1 Tutorial

---

<img src="https://img.shields.io/github/v/release/sujit-waghmare/gemini-side-panel?color=blue&style=flat-square" /><br><img src="https://img.shields.io/badge/Obsidian-v0.15.0+-purple?style=flat-square" /><br><img src="https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square" /><br><img src="https://img.shields.io/badge/Mobile%20Friendly-Yes-brightgreen?style=flat-square" />

---

## Table of Contents

- Prerequisites
- Get Your Gemini API Key
- Installation
- Settings
- Using the Panel
- Custom Note as Template
- Testing
- Troubleshooting
- Pro Tips
- Reference Card
- File Reference
- FAQ

---

## STEP 1: Prerequisites

Before anything, make sure you have:

1. **Obsidian** installed — Desktop or Mobile. Download from [obsidian.md](https://obsidian.md).
2. **A Vault** created in Obsidian.
3. **Community Plugins enabled** — Restricted Mode must be OFF.

To enable Community Plugins:
> Obsidian → Settings → Community Plugins → Turn off Restricted Mode

---

## STEP 2: Get Your Gemini API Key

The plugin requires a free API key from Google. Here is exactly how to get one:

### 2.1 — Go to Google AI Studio

1. Open your browser and go to [https://aistudio.google.com/](https://aistudio.google.com/).
2. Sign in with your Google account.

### 2.2 — Create an API Key

1. In the left sidebar, click **"Get API key"**.
2. Click **"Create API key"**.
3. Choose **"Create API key in new project"** (recommended) or select an existing project.
4. Your key will be generated — it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX`

### 2.3 — Copy and Save It

> Important
> Copy your API key immediately and store it somewhere safe (e.g. a private note). You cannot view the full key again after leaving the page.

### 2.4 — Free Tier Limits

- The free tier is sufficient for personal use.
- No credit card is required.
- Rate limits apply (requests per minute), but are generous for single-user use.

---

## STEP 3: Manual Installation

Since this plugin is not on the Obsidian community store yet, install it manually.

### Folder structure you need:

```
YourVault/
└── .obsidian/
    └── plugins/
        └── gemini-side-panel/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

### Steps:

1. Open your vault folder on your computer or mobile.
   - **Windows:** Right-click vault in Obsidian → "Show in Explorer"
   - **Mac/Linux:** Right-click vault → "Reveal in Finder / File Manager"
   - **Mobile:** Navigate to your vault folder using a file manager app

   > [!warning] I don't see a `.obsidian` folder
   > Go to your file manager settings and enable **"Show hidden files"**. The `.obsidian` folder is hidden by default.

2. Navigate to `.obsidian/plugins/`.
   - If the `plugins/` folder doesn't exist, create it manually.

3. Create a new folder named **exactly**: `gemini-side-panel`

4. Place `main.js`, `manifest.json`, and `styles.css` inside it.
   - Get these files from the [GitHub releases page](https://github.com/sujit-waghmare/gemini-side-panel/releases), or copy from the [[#File Reference]] section below.

5. Open Obsidian.

6. Go to **Settings → Community Plugins**.

7. Click the **Refresh** button (circular arrow icon).

8. Find **"Gemini Side Panel"** in the list.

9. Toggle it **ON**.

✅ Plugin is now installed and active.

---

## STEP 4: Plugin Settings

Go to:
> Settings → (scroll down) → Gemini Side Panel

You will see four sections:

### 🔑 Section 1: API Configuration

- **API Key** — Paste your key from [[#STEP 2 Get Your Gemini API Key|Step 2]] here. No trailing spaces.
- **Model** — Choose which Gemini model to use by default.

| Model | Best For |
|---|---|
| Gemini 3.1 Pro | Advanced reasoning, complex questions |
| Gemini 3 Flash | Fast responses, frontier tasks |
| Gemini 3.1 Flash-Lite | High-volume, lightweight use |
| Gemini 2.5 Pro | Balanced quality and speed |
| Gemini 2.5 Flash | **Default.** General everyday use |
| Gemini 2.5 Flash-Lite | Minimal resource usage |

### 🌡️ Section 2: AI Behavior

- **Temperature Slider** — Controls how strictly Gemini follows your selected source.

| Value | Behavior |
|---|---|
| `1.0` | Strict — answers only from Note or Internet, no mixing |
| `0.5` | Flexible — uses source as reference, fills gaps intelligently |

> Recommendation
> Keep at `1.0` for study/research notes. Drop to `0.7` for creative or exploratory chats.

### 🔢 Section 3: History Settings

- **Enable Chat History** — Off by default. Toggle ON to save each note's chat separately.
- **Retention Limit** — Choose between:
  - `Days` — Auto-deletes messages older than X days
  - `Queries` — Keeps only the last X question-answer pairs
- **Limit Value** — Enter the number (e.g. `7` for 7 days, or `10` for 10 query pairs).

> How history works
> Each note stores its own independent chat history. Opening Note A shows Note A's chat. Opening Note B shows a clean slate (or Note B's own history if it has one).

### 📝 Section 4: Template Configuration

This is where you register your custom `.md` notes as response templates.

- Click **"Add Template"** to create a new entry.
- Fill in two fields:
  - **Display Name** — What appears in the chat menu (e.g. `Physics Layout`)
  - **File Path** — Path to your template note in the vault (e.g. `Templates/Physics.md`)
- The `.md` extension is auto-added if you forget it.
- Click the 🗑️ trash icon to remove a template entry.

> See `Step 6` for a full walkthrough of creating and using templates.

---

## STEP 5: Using the Gemini Side Panel

### 5.1 — Opening the Chat Panel

Three ways to open it:

| Method | How |
|---|---|
| **Ribbon Icon** | Click the 🤖 bot icon in the left ribbon |
| **Command Palette** | `Ctrl/Cmd + P` → type `Open Gemini in right panel` or `left panel` |
| **Selection Mode** | Highlight text in a note → open via Command Palette → text pre-fills the input |

### 5.2 — The Chat Interface

Once open, you will see:

- **Chat history area** — All messages appear here, rendered as Markdown.
- **Input field** — Type your question. Press `Enter` for a new line. Click **Send** to submit.
- **Send button** — Submits your message.
- **Menu icon** (☰) — Opens the floating settings dropdown next to Send.

### 5.3 — The Dropdown Menu

Click the **☰ Menu icon** to open it. It has four accordion sections:

#### Model
> Collapsed by default. Expand to switch the active Gemini model on the fly without going to settings.

| Option | Description |
|---|---|
| 3.1 Pro | Advanced thinking |
| 3 Flash | Fast & frontier |
| 3.1 Flash-Lite | High volume |
| 2.5 Pro | Balanced |
| 2.5 Flash | Default |
| 2.5 Flash-Lite | Lightweight |

#### Source
Controls what Gemini uses to answer your question.

| Option | What it does |
|---|---|
| **Note** | Strictly reads your current open note only. Refuses to use outside knowledge. |
| **Internet** | Uses Gemini's full training data and general knowledge. Note is background context only. |

> [!tip] Use Note mode for studying. Use Internet mode for research or open-ended questions.

#### Format
Controls how Gemini structures its reply.

| Option | Output Style |
|---|---|
| **Better Visuals** | Bold headings, tables, bullet lists |
| **Better Understanding** | Deep analogies, concept explanations |
| **Brief Information** | Extremely concise, no fluff |

> [!note] Selecting a Template in the next section will override and disable Format automatically.

#### Templates
Lists all templates you configured in [[#STEP 4 Plugin Settings|Settings → Template Configuration]].

- **None** — No template active; Format rules apply normally.
- **Your custom templates** — Selecting one forces Gemini to mirror that note's exact structure.

### 5.4 — Copying a Response

- **Long-press** (hold 600ms) any Gemini response bubble to copy its full contents.
- A **"Copied!"** notice confirms the action.
- Works on both desktop (hold click) and mobile (hold tap).

### 5.5 — Clearing Chat History

- Run Command Palette → **"Clear Gemini chat history"**
- This clears only the **currently active note's** history.
- Other notes' histories remain untouched.

### 5.6 — LaTeX Math Support

The panel renders LaTeX math automatically.

| Syntax | Result |
|---|---|
| `$E = mc^2$` | Inline math |
| `$$\int_0^\infty f(x)dx$$` | Display/block math |

Just ask a math question and Gemini will output LaTeX, which the panel renders automatically.

---

## STEP 6: Custom Note as Template

This is the most powerful feature. You can force Gemini to reply in the **exact structure of any `.md` note** in your vault.

### 6.1 — What a Template Does

When you select a template, the plugin:
1. Reads the full content of your chosen `.md` note.
2. Passes it to Gemini with a **CRITICAL RULE** instruction: *"Mirror this exact structure."*
3. Gemini's reply will follow the headings, bullet style, table layout, and formatting of your template — applied to your actual question.

### 6.2 — Create a Template Note

First, create the `.md` note that will serve as your structure blueprint.

**Example — Physics Answer Layout:**

Create a note at `Templates/Physics.md` with this content:

```markdown
## Topic
[Topic name here]

## Core Concept
[One-sentence definition]

## Key Formula
| Symbol | Meaning |
|---|---|
|  |  |

$$
[Main formula here]
$$

## Step-by-Step Explanation
1. 
2. 
3. 

## Real-World Example
> [Practical application]

## Common Mistakes
- 
- 

## Summary
[2-3 sentence recap]
```

This is your layout. Gemini will fill in every section based on whatever question you ask.

### 6.3 — Register the Template in Settings

1. Go to **Settings → Gemini Side Panel → Template Configuration**.
2. Click **"Add Template"**.
3. Fill in:
   - **Display Name:** `Physics Layout`
   - **File Path:** `Templates/Physics`  *(`.md` is added automatically)*
4. The template now appears in your chat menu.

### 6.4 — Use the Template in Chat

1. Open the note you want to ask about (or any note).
2. Open the Gemini panel.
3. Click the **☰ Menu** icon.
4. Expand **Templates** → select `Physics Layout`.
   - Notice: Format section auto-sets to `None`. This is correct.
5. Type your question, e.g.: `Explain Newton's Second Law`
6. Click **Send**.

Gemini will reply using **your exact template structure** — with Topic, Core Concept, Key Formula, Steps, Example, Mistakes, and Summary all filled in.

### 6.5 — Template Rules and Behaviour

| Behaviour | Detail |
|---|---|
| Format auto-clears | Selecting a template sets Format to `None` |
| Format clears template | Selecting a Format (Visuals/etc.) clears the active template |
| They are mutually exclusive | You can use one or the other, never both |
| Path is case-sensitive | `Templates/Physics.md` ≠ `templates/physics.md` |
| `.md` is optional | Plugin appends it automatically if missing |
| Invalid path = instant error | Bot replies with ⚠️ error without calling the API |

### 6.6 — More Template Ideas

| Template Name | Use Case | What to put in it |
|---|---|---|
| `Lecture Notes` | Structure Gemini answers like your class notes | Headings: Intro, Theory, Examples, Questions |
| `Book Summary` | Summarise chapters consistently | Sections: Overview, Key Ideas, Quotes, My Take |
| `Code Review` | Get structured code feedback | Sections: What it does, Issues, Suggestions, Refactored version |
| `Study Card` | Flashcard-style output | Front, Back, Related Concepts, Memory Hook |
| `Research Brief` | Structured research answers | Background, Evidence, Gaps, Conclusion |

### 6.7 — Using Source + Template Together

Templates work with both Source modes:

- **Note + Template** — Gemini reads your current note, then answers in your template's structure. Great for summarising and restructuring your own notes.
- **Internet + Template** — Gemini pulls from its full knowledge, then formats it using your template. Great for researching new topics in your own layout.

---

## STEP 7: Testing It Works

Follow this exact sequence:

1. **Template Test**
   - Select a custom template from the dropdown menu.
   - Confirm Format shows as `None`.
   - Send any question.
   - Verify the reply matches your template's heading structure exactly.

2. **Note History Test**
   - Enable history in Settings.
   - Open Note A and send a message.
   - Switch to Note B — chat area should be empty.
   - Switch back to Note A — your previous chat should reappear.

3. **Invalid Template Test**
   - In Settings, add a template with a fake path: `DoesNotExist/Fake`.
   - Select it in the menu.
   - Send a message.
   - Bot should immediately reply with `⚠️ Error: Could not find template file...` without calling the API.

4. **Source Test**
   - Open any note with content.
   - Set Source to **Note**, ask about something NOT in the note.
   - Gemini should say: `"I cannot find that in this note."`
   - Switch to **Internet**, ask the same question — it should answer fully.

---

## Troubleshooting

<details>
<summary><strong>API Key missing! notice appears</strong></summary>
 1. Go to <strong>Settings → Gemini Side Panel → API Key</strong>. <br>
 2. Paste your key again. Make sure there are no trailing spaces or newlines.<br>
 3. Confirm you saved by closing and reopening settings.<br>
   </details>

<details>
<summary><strong>Could not find template file error</strong></summary>
 1. Check <strong>Settings → Template Configuration</strong>.<br>
 2. Path is <strong>case-sensitive</strong>: Templates/Physics.md ≠ templates/physics.md<br>
 3. Make sure the file actually exists in your vault at that exact path.<br>
 4. Try adding .md explicitly even though it's auto-appended — occasionally helps on mobile.<br>
   </details>

<details>
<summary><strong>Failed to load plugin</strong></summary>
 1. Confirm all three files exist: main.js, manifest.json, styles.css<br>
 2. Folder must be named exactly: gemini-side-panel<br>
 3. Check for syntax corruption: open<br> .obsidian/plugins/gemini-side-panel/data.json and verify it is valid JSON (or delete it to reset settings).<br>
   </details>

<details>
<summary><strong>Connection failed / API not responding</strong></summary>
 1. Check your internet connection.<br>
 2. Visit <a href="[https://aistudio.google.com/](https://aistudio.google.com/)">Google AI Studio</a> to confirm your API key is active and not expired.<br>
 3. Free tier may hit rate limits — wait 60 seconds and retry.<br>
   </details>

<details>
<summary><strong>Gemini ignores my template structure</strong></summary>
 1. Confirm Template is selected (not Format) in the dropdown.<br>
 2. Format should show as None when a template is active.<br>
 3. Increase Temperature to 1.0 — lower temperatures make the model less strict about following rules.<br>
 4. Make your template more explicit: add placeholder text like [Fill this section] in each section.<br>
   </details>

<details>
<summary><strong>Chat history not saving</strong></summary>
 1. Go to <strong>Settings → History Settings → Enable Chat History</strong> — toggle it ON.<br>
 2. History is per-note. Make sure you have a note open (not an empty workspace).<br>
   </details>

---

## Pro Tips

* **Selection Mode** — Highlight a paragraph in any note, then open the panel via Command Palette. The selected text pre-fills the input. Great for asking about a specific section.
* **Theme Sync** — Chat bubbles and menus inherit your Obsidian accent color automatically via `--interactive-accent`. Change your theme and the panel follows.
* **Golden Ratio Input** — The input area uses a $1.618$ nested radius ratio, preventing text clipping on any screen size.
* **Model on the fly** — Switch models mid-conversation in the dropdown without going to settings. Useful for switching from Flash (fast draft) to Pro (deep analysis) on the same note.
* **Clear only what you need** — `Clear Gemini chat history` only wipes the active note. All other notes keep their history intact.
* **Template + Note Source combo** — The most powerful combo: Source = Note, Template = your layout. Gemini reads your note and outputs a perfectly structured answer in your format.
* **Brief for quick lookups** — Set Format to `Brief Information` when you just need a one-liner fact. No need to switch models.

---

## Quick Reference Card

| What you want | How to do it |
|---|---|
| Open the panel | Click 🤖 ribbon icon, or `Ctrl+P` → `Open Gemini` |
| Open on left side | `Ctrl+P` → `Open Gemini in left panel` |
| Pre-fill with selected text | Highlight text → `Ctrl+P` → `Open Gemini` |
| Switch AI model | Menu ☰ → Model → pick one |
| Answer from note only | Menu ☰ → Source → Note |
| Answer from internet | Menu ☰ → Source → Internet |
| Use visual formatting | Menu ☰ → Format → Better Visuals |
| Use a template | Menu ☰ → Templates → select your template |
| Remove active template | Menu ☰ → Templates → None |
| Copy a response | Long-press (600ms hold) any bot bubble |
| Clear this note's chat | `Ctrl+P` → `Clear Gemini chat history` |
| Adjust strictness | Settings → AI Behavior → Temperature slider |
| Add a new template | Settings → Template Configuration → Add Template |

---

## File Reference

| File | Purpose | Edit? |
|---|---|---|
| `manifest.json` | Plugin ID, versioning, Obsidian compatibility | ❌ No |
| `main.js` | All logic: chat, API calls, templates, history, settings | ❌ No |
| `styles.css` | All visual styles for the panel | ❌ No |

*Plugin version: 1.3.3 — Compatible with Obsidian 0.15.0 and above*

### manifest.json
```json
{
    "id": "gemini-side-panel v1.3",
    "name": "Gemini Side Panel",
    "version": "1.3.3",
    "minAppVersion": "0.15.0",
    "description": "Side-panel chat for Gemini with note-specific history, temperature control, and custom template referencing.",
    "author": "Waghmare",
    "authorUrl": "https://github.com/sujit-waghmare",
    "fundingUrl": "https://paypal.me/waghmaresujit",
    "isDesktopOnly": false
}
```

---

## FAQ
<details>
<summary><strong>Q: Is this plugin free?</strong></summary>
Yes. The plugin itself is free. You only need a free Gemini API key from Google AI Studio.
</details>
<details>
<summary><strong>Q: Does it work on mobile?</strong></summary>
Yes. Both Android and iOS are supported. Install by placing the files in your vault's .obsidian/plugins/gemini-side-panel/ folder.
</details>
<details>
<summary><strong>Q: Can I use multiple templates?</strong></summary>
Yes. Add as many as you like in Settings → Template Configuration. Only one can be active at a time in the chat.
</details>
<details>
<summary><strong>Q: Will Gemini always follow my template structure?</strong></summary>
It strongly enforces it via a CRITICAL RULE prompt. Occasionally complex questions may deviate slightly. Setting temperature to 1.0 improves compliance.
</details>
<details>
<summary><strong>Q: Does the plugin send my notes to Google?</strong></summary>
Only when Source is set to Note and you send a message. The current note's content is sent to the Gemini API as context. No data is stored by the plugin.
</details>
<details>
<summary><strong>Q: What is the difference between Note and Internet mode?</strong></summary>
Note mode locks Gemini to your note's content only — it will refuse to answer anything not in the note. Internet mode uses Gemini's full knowledge; your note is background context only.
</details>
<details>
<summary><strong>Q: Can I use LaTeX in my questions?</strong></summary>
Yes. Type ... for inline or 
for block math. Gemini will also output LaTeX in its responses, which the panel renders automatically.
</details>
<details>
<summary><strong>Q: Where is chat history stored?</strong></summary>
Locally inside your vault, in .obsidian/plugins/gemini-side-panel/data.json. It never leaves your device unless you send a message (which includes recent context).
</details>
<details>
<summary><strong>Q: Can I use a template note that has images or embeds?</strong></summary>
The plugin reads raw Markdown text. Images and embeds won't be sent to Gemini, but the heading and text structure will be enforced correctly.
</details>
<details>
<summary><strong>Q: The model section is collapsed by default — why?</strong></summary>
Model switching is less frequent. It defaults to collapsed to keep the menu clean. Expand it anytime to switch models mid-chat.
</details>