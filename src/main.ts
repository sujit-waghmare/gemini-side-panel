import {
	App,
	ItemView,
	MarkdownRenderer,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
	WorkspaceLeaf,
	requestUrl,
	setIcon,
} from 'obsidian';

import {
	DEFAULT_SETTINGS,
	GeminiPluginSettings,
	GeminiSettingTab,
	ChatMessage,
} from './settings';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const VIEW_TYPE_GEMINI = 'gemini-chat-view';

type DropdownKey = 'model' | 'source' | 'format' | 'templates';
type Source = 'note' | 'internet';
type Format = 'visuals' | 'understanding' | 'brief' | 'none';

interface GeminiModel {
	id: string;
	name: string;
}

const GEMINI_MODELS: GeminiModel[] = [
	{ id: 'gemini-3.1-pro-preview',       name: '3.1 Pro' },
	{ id: 'gemini-3-flash-preview',        name: '3 Flash' },
	{ id: 'gemini-3.1-flash-lite-preview', name: '3.1 Flash-Lite' },
	{ id: 'gemini-2.5-pro',               name: '2.5 Pro' },
	{ id: 'gemini-2.5-flash',             name: '2.5 Flash' },
	{ id: 'gemini-2.5-flash-lite',        name: '2.5 Flash-Lite' },
];

// ──────────────────────────────────────────────
// GeminiView
// ──────────────────────────────────────────────

export class GeminiView extends ItemView {
	plugin: GeminiPlugin;

	// Chat state
	currentSource: Source = 'note';
	currentFormat: Format = 'visuals';
	selectedTemplatePath: string | null = null;
	currentModel: string;

	// Accordion state — model collapsed by default
	dropdownState: Record<DropdownKey, boolean> = {
		model: false,
		source: true,
		format: true,
		templates: true,
	};

	// DOM refs
	private chatHistory!: HTMLElement;
	private dropdownElement!: HTMLElement;
	inputField!: HTMLTextAreaElement;

	// Voice recording state
	private mediaRecorder: MediaRecorder | null = null;
	private audioChunks: Blob[] = [];
	private isRecording = false;
	voiceBtn!: HTMLElement;

	constructor(leaf: WorkspaceLeaf, plugin: GeminiPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.currentModel = this.plugin.settings?.modelId || 'gemini-2.5-flash';
	}

	getViewType(): string { return VIEW_TYPE_GEMINI; }
	getDisplayText(): string { return 'Gemini Chat'; }

	async onOpen(): Promise<void> {
		const container = this.contentEl.createDiv({ cls: 'gemini-chat-container' });
		this.chatHistory = container.createDiv({ cls: 'gemini-history' });

		const inputSection = container.createDiv({ cls: 'gemini-input-container' });
		this.dropdownElement = inputSection.createDiv({ cls: 'gemini-dropdown' });
		this.renderDropdown();

		const wrapper = inputSection.createDiv({ cls: 'gemini-input-wrapper' });
		this.inputField = wrapper.createEl('textarea', {
			cls: 'gemini-input-area',
			placeholder: 'Message...',
		}) as HTMLTextAreaElement;

		this.inputField.addEventListener('input', () => {
			this.inputField.style.height = 'auto';
			this.inputField.style.height = this.inputField.scrollHeight + 'px';
		});

		const actionRow = inputSection.createDiv({ cls: 'gemini-actions-row' });
		const sendBtn = actionRow.createEl('button', { cls: 'gemini-send-btn', text: 'Send' });

		// Voice button — only shown if Sarvam key is set
		this.voiceBtn = actionRow.createDiv({ cls: 'gemini-voice-btn' });
		setIcon(this.voiceBtn, 'mic');
		this.voiceBtn.setAttribute('aria-label', 'Hold to record');
		this._updateVoiceBtnVisibility();

		const menuBtn = actionRow.createDiv({ cls: 'gemini-menu-btn' });
		setIcon(menuBtn, 'menu');

		menuBtn.onclick = (e: MouseEvent) => {
			e.stopPropagation();
			this.renderDropdown();
			this.dropdownElement.classList.toggle('is-open');
		};

		document.addEventListener('click', () => {
			this.dropdownElement.classList.remove('is-open');
		});

		sendBtn.onclick = () => this.handleSend();

		// Voice: hold to record, release to transcribe
		this.voiceBtn.addEventListener('pointerdown', (e: Event) => {
			e.preventDefault();
			this._startRecording();
		});
		this.voiceBtn.addEventListener('pointerup', () => this._stopRecording());
		this.voiceBtn.addEventListener('pointerleave', () => {
			if (this.isRecording) this._stopRecording();
		});

		this.registerEvent(this.app.workspace.on('file-open', () => this.refreshHistory()));
		await this.refreshHistory();
	}

	// ── Voice Visibility ──────────────────────

	_updateVoiceBtnVisibility(): void {
		if (!this.voiceBtn) return;
		const hasKey = !!(this.plugin.settings?.sarvamApiKey && this.plugin.settings.sarvamApiKey.trim());
		this.voiceBtn.style.display = hasKey ? 'flex' : 'none';
	}

	// ── Voice Recording ───────────────────────

	private async _startRecording(): Promise<void> {
		if (this.isRecording) return;
		if (!this.plugin.settings.sarvamApiKey) {
			new Notice('Sarvam API key missing. Add it in settings.');
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			this.audioChunks = [];
			this.mediaRecorder = new MediaRecorder(stream, { mimeType: this._getSupportedMimeType() });

			this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
				if (e.data.size > 0) this.audioChunks.push(e.data);
			};

			this.mediaRecorder.onstop = async () => {
				stream.getTracks().forEach(t => t.stop());
				await this._transcribeAudio();
			};

			this.mediaRecorder.start();
			this.isRecording = true;
			this.voiceBtn.classList.add('is-recording');
			setIcon(this.voiceBtn, 'mic-off');
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			new Notice(`Mic access denied: ${message}`);
		}
	}

	private _stopRecording(): void {
		if (!this.isRecording || !this.mediaRecorder) return;
		this.mediaRecorder.stop();
		this.isRecording = false;
		this.voiceBtn.classList.remove('is-recording');
		setIcon(this.voiceBtn, 'mic');
	}

	private _getSupportedMimeType(): string {
		const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
		for (const t of types) {
			if (MediaRecorder.isTypeSupported(t)) return t;
		}
		return '';
	}

	private async _transcribeAudio(): Promise<void> {
		if (!this.audioChunks.length) return;

		const fullMimeType = this._getSupportedMimeType() || 'audio/webm';
		const cleanMimeType = fullMimeType.split(';')[0];
		const blob = new Blob(this.audioChunks, { type: fullMimeType });

		const boundary = '----SarvamBoundary' + Date.now();
		const ext = cleanMimeType.includes('ogg') ? 'ogg' : cleanMimeType.includes('mp4') ? 'mp4' : 'webm';
		const filename = `recording.${ext}`;

		const audioBuffer = await blob.arrayBuffer();
		const encoder = new TextEncoder();

		const partHeader =
			`--${boundary}\r\n` +
			`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
			`Content-Type: ${cleanMimeType}\r\n\r\n`;

		const modelPart =
			`\r\n--${boundary}\r\n` +
			`Content-Disposition: form-data; name="model"\r\n\r\n` +
			`saaras:v3` +
			`\r\n--${boundary}\r\n` +
			`Content-Disposition: form-data; name="mode"\r\n\r\n` +
			`transcribe` +
			`\r\n--${boundary}--\r\n`;

		const headerBytes = encoder.encode(partHeader);
		const footerBytes = encoder.encode(modelPart);

		const body = new Uint8Array(headerBytes.byteLength + audioBuffer.byteLength + footerBytes.byteLength);
		body.set(headerBytes, 0);
		body.set(new Uint8Array(audioBuffer), headerBytes.byteLength);
		body.set(footerBytes, headerBytes.byteLength + audioBuffer.byteLength);

		const indicator = this.chatHistory.createDiv({ cls: 'gemini-transcribing-indicator' });
		indicator.setText('🎤 Transcribing...');
		this.chatHistory.scrollTop = this.chatHistory.scrollHeight;

		try {
			const response = await requestUrl({
				url: 'https://api.sarvam.ai/speech-to-text',
				method: 'POST',
				headers: {
					'api-subscription-key': this.plugin.settings.sarvamApiKey.trim(),
					'Content-Type': `multipart/form-data; boundary=${boundary}`,
				},
				body: body.buffer,
				throw: false,
			});

			indicator.remove();

			if (response.status !== 200) {
				const errMsg = response.json?.message || response.text || 'Unknown error';
				new Notice(`Sarvam error ${response.status}: ${errMsg}`);
				return;
			}

			const transcript: string | undefined = response.json?.transcript;
			if (!transcript) {
				new Notice('No transcript returned.');
				return;
			}

			const current = this.inputField.value;
			this.inputField.value = current ? current + ' ' + transcript : transcript;
			this.inputField.dispatchEvent(new Event('input'));
			this.inputField.focus();

			new Notice(`Transcribed (${response.json?.language_code || 'unknown lang'})`);
		} catch (err: unknown) {
			indicator.remove();
			const message = err instanceof Error ? err.message : String(err);
			new Notice(`Transcription failed: ${message}`);
		}
	}

	// ── History ───────────────────────────────

	async refreshHistory(): Promise<void> {
		this.chatHistory.empty();
		if (!this.plugin.settings?.enableHistory) return;

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return;

		this.plugin.cleanExpiredHistory(activeFile.path);

		const history: ChatMessage[] =
			(this.plugin.settings.noteHistories && this.plugin.settings.noteHistories[activeFile.path])
				? this.plugin.settings.noteHistories[activeFile.path]
				: [];

		for (const msg of history) { await this.appendMessage(msg.role, msg.text, false); }
	}

	async clearHistory(): Promise<void> {
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile && this.plugin.settings.noteHistories) {
			delete this.plugin.settings.noteHistories[activeFile.path];
			await this.plugin.saveSettings();
			this.chatHistory.empty();
			new Notice('History cleared.');
		}
	}

	// ── Dropdown ──────────────────────────────

	private createSection(
		key: DropdownKey,
		title: string,
		itemsRenderer: (content: HTMLElement) => void
	): void {
		const sectionWrapper = this.dropdownElement.createDiv({ cls: 'gemini-dropdown-section' });
		const header = sectionWrapper.createDiv({ cls: 'gemini-dropdown-section-header' });
		header.createSpan({ text: title, cls: 'gemini-dropdown-section-title' });
		const chevron = header.createDiv({ cls: 'gemini-chevron-icon' });
		setIcon(chevron, this.dropdownState[key] ? 'chevron-down' : 'chevron-right');

		const content = sectionWrapper.createDiv({ cls: 'gemini-dropdown-section-content' });
		if (!this.dropdownState[key]) content.style.display = 'none';

		header.onclick = (e: MouseEvent) => {
			e.stopPropagation();
			this.dropdownState[key] = !this.dropdownState[key];
			this.renderDropdown();
		};

		itemsRenderer(content);
	}

	renderDropdown(): void {
		this.dropdownElement.empty();

		// --- MODEL ---
		this.createSection('model', 'Model', (content) => {
			GEMINI_MODELS.forEach(m => {
				this.createDropdownItem(
					content,
					m.name,
					async () => {
						this.currentModel = m.id;
						this.plugin.settings.modelId = m.id;
						await this.plugin.saveSettings();
					},
					() => this.currentModel === m.id
				);
			});
		});

		this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });

		// --- SOURCE ---
		this.createSection('source', 'Source', (content) => {
			this.createDropdownItem(content, 'Note',
				() => { this.currentSource = 'note'; },
				() => this.currentSource === 'note'
			);
			this.createDropdownItem(content, 'Internet',
				() => { this.currentSource = 'internet'; },
				() => this.currentSource === 'internet'
			);
		});

		this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });

		// --- FORMAT ---
		this.createSection('format', 'Format', (content) => {
			this.createDropdownItem(content, 'Better Visuals',
				() => { this.currentFormat = 'visuals'; this.selectedTemplatePath = null; },
				() => this.currentFormat === 'visuals'
			);
			this.createDropdownItem(content, 'Better Understanding',
				() => { this.currentFormat = 'understanding'; this.selectedTemplatePath = null; },
				() => this.currentFormat === 'understanding'
			);
			this.createDropdownItem(content, 'Brief Information',
				() => { this.currentFormat = 'brief'; this.selectedTemplatePath = null; },
				() => this.currentFormat === 'brief'
			);
		});

		this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });

		// --- TEMPLATES ---
		this.createSection('templates', 'Templates', (content) => {
			this.createDropdownItem(content, 'None',
				() => { this.selectedTemplatePath = null; this.currentFormat = 'visuals'; },
				() => this.selectedTemplatePath === null
			);

			const templates = Array.isArray(this.plugin.settings.keywordTemplates)
				? this.plugin.settings.keywordTemplates : [];

			templates.forEach(entry => {
				if (!entry || !entry.keyword) return;
				this.createDropdownItem(
					content,
					entry.keyword,
					() => { this.selectedTemplatePath = entry.templatePath; this.currentFormat = 'none'; },
					() => this.selectedTemplatePath === entry.templatePath
				);
			});
		});
	}

	private createDropdownItem(
		container: HTMLElement,
		label: string,
		onClick: () => void,
		isSelected: () => boolean
	): void {
		const item = container.createDiv({ cls: 'gemini-dropdown-item' });
		item.createSpan({ text: label });
		const checkIcon = item.createDiv({ cls: 'gemini-check-icon' });
		setIcon(checkIcon, 'check');
		if (isSelected()) checkIcon.classList.add('is-selected');
		item.onclick = (e: MouseEvent) => { e.stopPropagation(); onClick(); this.renderDropdown(); };
	}

	// ── Send ──────────────────────────────────

	async handleSend(): Promise<void> {
		const userQuery = this.inputField.value.trim();
		if (!userQuery) return;

		const { apiKey, temperature } = this.plugin.settings;
		const modelId = this.currentModel || this.plugin.settings.modelId;
		const activeFile = this.app.workspace.getActiveFile();

		if (!apiKey) { new Notice('API Key missing!'); return; }

		let templateContext = '';
		if (this.selectedTemplatePath) {
			let path = this.selectedTemplatePath;
			if (!path.endsWith('.md')) path += '.md';
			const tFile = this.app.vault.getAbstractFileByPath(path);
			if (tFile instanceof TFile) {
				templateContext =
					`\n\n=== START OF REQUIRED TEMPLATE FORMAT ===\n${await this.app.vault.read(tFile)}\n=== END OF REQUIRED TEMPLATE FORMAT ===\n\n` +
					`CRITICAL RULE: You MUST structure your final answer using the EXACT headings, bullet points, and style shown in the required template above. Do not deviate.`;
			} else {
				this.appendMessage('bot', `⚠️ **Error:** Could not find template file at \`${path}\`. Please check the path in settings.`);
				return;
			}
		}

		await this.appendMessage('user', userQuery);
		this.inputField.value = '';
		this.inputField.style.height = 'auto';

		try {
			const noteContent = activeFile ? await this.app.vault.read(activeFile) : '';
			const response = await this.callGemini(
				userQuery,
				noteContent + templateContext,
				apiKey.trim(),
				modelId,
				this.currentSource,
				this.currentFormat,
				temperature
			);
			await this.appendMessage('bot', response);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			await this.appendMessage('bot', `❌ Error: ${message}`);
		}
	}

	// ── Messages ──────────────────────────────

	async appendMessage(role: 'user' | 'bot', text: string, shouldSave = true): Promise<void> {
		const activeFile = this.app.workspace.getActiveFile();
		const row = this.chatHistory.createDiv({ cls: `gemini-msg-row ${role}` });
		const iconContainer = row.createDiv({ cls: 'gemini-icon' });
		setIcon(iconContainer, role === 'user' ? 'user' : 'bot');
		const bubble = row.createDiv({ cls: 'gemini-bubble' });

		if (shouldSave && activeFile && this.plugin.settings.enableHistory) {
			if (!this.plugin.settings.noteHistories) this.plugin.settings.noteHistories = {};
			if (!this.plugin.settings.noteHistories[activeFile.path]) {
				this.plugin.settings.noteHistories[activeFile.path] = [];
			}
			this.plugin.settings.noteHistories[activeFile.path].push({ role, text, timestamp: Date.now() });

			if (this.plugin.settings.historyLimitType === 'queries') {
				const limit = parseInt(String(this.plugin.settings.historyLimitValue)) || 7;
				while (this.plugin.settings.noteHistories[activeFile.path].length > limit * 2) {
					this.plugin.settings.noteHistories[activeFile.path].shift();
				}
			}
			await this.plugin.saveSettings();
		}

		let holdTimer: number;
		const startHold = () => {
			holdTimer = window.setTimeout(() => {
				navigator.clipboard.writeText(text);
				new Notice('Copied!');
				bubble.style.transform = 'scale(0.95)';
				setTimeout(() => { bubble.style.transform = 'scale(1)'; }, 100);
			}, 600);
		};
		const cancelHold = () => window.clearTimeout(holdTimer);
		bubble.addEventListener('pointerdown', startHold);
		bubble.addEventListener('pointerup', cancelHold);
		bubble.addEventListener('pointerleave', cancelHold);
		bubble.addEventListener('contextmenu', (e) => e.preventDefault());

		await MarkdownRenderer.render(this.app, text, bubble, '/', this);
		this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
	}

	// ── Gemini API ────────────────────────────

	private async callGemini(
		query: string,
		context: string,
		apiKey: string,
		modelId: string,
		source: Source,
		format: Format,
		temp: number
	): Promise<string> {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
		const safeTemp = parseFloat(String(temp)) || 1.0;

		let sourceInstr: string;
		if (source === 'note') {
			sourceInstr =
				'STRICT INSTRUCTION: You are an assistant analyzing a specific note. ' +
				'Answer ONLY based on the note content provided below. If the information is not present in the note, ' +
				'explicitly state: "I cannot find that in this note." Do NOT use any outside knowledge.';
			if (safeTemp < 0.9) sourceInstr += ' Use the note as a primary reference point but be helpful.';
		} else {
			sourceInstr =
				"INSTRUCTION: You are an AI assistant. The user has selected 'Internet' as the source. " +
				'You SHOULD use your general knowledge and internet data to provide a complete and accurate answer. ' +
				'The provided note content is for BACKGROUND CONTEXT ONLY. If the answer is not in the note, answer it using the internet.';
			if (safeTemp >= 0.9) sourceInstr += ' Provide a pure internet-based solution.';
		}

		let formatInstr: string;
		if (format === 'visuals')       formatInstr = 'FORMAT: Use bold headings, tables, and lists.';
		else if (format === 'understanding') formatInstr = 'FORMAT: Deep analogies and concepts.';
		else if (format === 'brief')    formatInstr = 'FORMAT: Extremely concise.';
		else                            formatInstr = 'FORMAT: You are in TEMPLATE MODE. Ignore standard visual rules and strictly mirror the layout of the provided template.';

		const prompt =
			`${sourceInstr}\n${formatInstr}\n\n` +
			`LATEX: Use $inline$ and $$display$$.\n\n` +
			`CONTEXT (NOTE AND SELECTED TEMPLATE):\n${context}\n\n` +
			`QUESTION:\n${query}`;

		try {
			const response = await requestUrl({
				url,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: { temperature: safeTemp },
				}),
				throw: false,
			});

			if (response.status !== 200) {
				const errorData: string =
					response.json?.error?.message ?? response.text ?? 'Unknown API Error';
				return `Error ${response.status}: ${errorData}`;
			}

			return response.json?.candidates?.[0]?.content?.parts?.[0]?.text
				?? 'Error: Gemini API returned an empty response. This might be due to safety filters.';
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : String(e);
			return `Connection failed: ${message}. Make sure your internet is on.`;
		}
	}
}

// ──────────────────────────────────────────────
// Plugin
// ──────────────────────────────────────────────

export default class GeminiPlugin extends Plugin {
	settings!: GeminiPluginSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_GEMINI, (leaf) => new GeminiView(leaf, this));
		this.addRibbonIcon('bot', 'Open Gemini', () => this.activateView('right'));

		this.addCommand({
			id: 'open-gemini-right',
			name: 'Open Gemini in right panel',
			callback: () => this.activateWithSelection('right'),
		});
		this.addCommand({
			id: 'open-gemini-left',
			name: 'Open Gemini in left panel',
			callback: () => this.activateWithSelection('left'),
		});
		this.addCommand({
			id: 'clear-gemini-chat',
			name: 'Clear Gemini chat history',
			callback: () => {
				const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(VIEW_TYPE_GEMINI);
				if (leaves.length > 0) (leaves[0].view as GeminiView).clearHistory();
			},
		});

		this.addSettingTab(new GeminiSettingTab(this.app, this));
	}

	// ── History helpers ───────────────────────

	cleanExpiredHistory(path: string): void {
		if (
			!this.settings ||
			this.settings.historyLimitType !== 'days' ||
			!this.settings.noteHistories?.[path]
		) return;

		const limitValue = parseInt(String(this.settings.historyLimitValue)) || 7;
		const expiryMs = limitValue * 24 * 60 * 60 * 1000;
		const now = Date.now();

		this.settings.noteHistories[path] = this.settings.noteHistories[path].filter(
			(msg: ChatMessage) => now - msg.timestamp < expiryMs
		);
	}

	// ── View helpers ──────────────────────────

	private activateWithSelection(side: 'left' | 'right'): void {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		this.activateView(side, activeView ? activeView.editor.getSelection() : '');
	}

	async activateView(side: 'left' | 'right', initialText = ''): Promise<void> {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(VIEW_TYPE_GEMINI)[0] ?? null;

		if (!leaf) {
			leaf = side === 'left'
				? workspace.getLeftLeaf(false)
				: workspace.getRightLeaf(false);
			await leaf!.setViewState({ type: VIEW_TYPE_GEMINI, active: true });
		}

		workspace.revealLeaf(leaf!);

		if (initialText && leaf!.view instanceof GeminiView) {
			(leaf!.view as GeminiView).inputField.value = initialText;
			(leaf!.view as GeminiView).inputField.focus();
			(leaf!.view as GeminiView).inputField.dispatchEvent(new Event('input'));
		}
	}

	// ── Settings ──────────────────────────────

	async loadSettings(): Promise<void> {
		this.settings = {
			apiKey: '',
			modelId: 'gemini-2.5-flash',
			noteHistories: {},
			enableHistory: false,
			historyLimitType: 'days',
			historyLimitValue: 7,
			temperature: 1.0,
			keywordTemplates: [],
			sarvamApiKey: '',
		};
		const loadedData = (await this.loadData()) || {};
		Object.assign(this.settings, loadedData);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
