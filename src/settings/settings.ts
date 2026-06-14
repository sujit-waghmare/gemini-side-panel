import { App, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import type GeminiPlugin from './main';
import type { GeminiView } from './main';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface KeywordTemplate {
	keyword: string;
	templatePath: string;
}

export interface ChatMessage {
	role: 'user' | 'bot';
	text: string;
	timestamp: number;
}

export interface GeminiPluginSettings {
	apiKey: string;
	modelId: string;
	noteHistories: Record<string, ChatMessage[]>;
	enableHistory: boolean;
	historyLimitType: 'days' | 'queries';
	historyLimitValue: number;
	temperature: number;
	keywordTemplates: KeywordTemplate[];
	sarvamApiKey: string;
}

export const DEFAULT_SETTINGS: GeminiPluginSettings = {
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

// ──────────────────────────────────────────────
// Setting Tab
// ──────────────────────────────────────────────

export class GeminiSettingTab extends PluginSettingTab {
	plugin: GeminiPlugin;

	constructor(app: App, plugin: GeminiPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Gemini Settings' });

		// ── API Configuration ──────────────────
		new Setting(containerEl)
			.setName('Gemini API Key')
			.addText(text =>
				text
					.setValue(this.plugin.settings.apiKey || '')
					.onChange(async (v) => {
						this.plugin.settings.apiKey = v.trim();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Model')
			.addDropdown(dropdown =>
				dropdown
					.addOption('gemini-3.1-pro-preview',       'Gemini 3.1 Pro (Advanced Thinking)')
					.addOption('gemini-3-flash-preview',        'Gemini 3 Flash (Fast & Frontier)')
					.addOption('gemini-3.1-flash-lite-preview', 'Gemini 3.1 Flash-Lite (High Volume)')
					.addOption('gemini-2.5-pro',                'Gemini 2.5 Pro (Balanced)')
					.addOption('gemini-2.5-flash',              'Gemini 2.5 Flash (Default)')
					.addOption('gemini-2.5-flash-lite',         'Gemini 2.5 Flash-Lite (Lightweight)')
					.setValue(this.plugin.settings.modelId || 'gemini-2.5-flash')
					.onChange(async (v) => {
						this.plugin.settings.modelId = v;
						// Sync into any open GeminiView
						const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType('gemini-chat-view');
						if (leaves.length > 0) {
							(leaves[0].view as GeminiView).currentModel = v;
						}
						await this.plugin.saveSettings();
					})
			);

		// ── Voice Transcription ────────────────
		containerEl.createEl('h3', { text: 'Voice Transcription' });

		new Setting(containerEl)
			.setName('Sarvam API Key')
			.setDesc('Get your free key from dashboard.sarvam.ai. Enables the 🎤 voice input button.')
			.addText(text => {
				text.inputEl.type = 'password';
				text
					.setValue(this.plugin.settings.sarvamApiKey || '')
					.onChange(async (v) => {
						this.plugin.settings.sarvamApiKey = v.trim();
						await this.plugin.saveSettings();
						// Show/hide voice btn in any open view
						const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType('gemini-chat-view');
						if (leaves.length > 0) {
							(leaves[0].view as GeminiView)._updateVoiceBtnVisibility();
						}
					});
			});

		// ── AI Behavior ────────────────────────
		containerEl.createEl('h3', { text: 'AI Behavior' });

		const safeTemp = Number(this.plugin.settings.temperature) || 1.0;

		// Fix TDZ: define DOM element BEFORE the Setting that references it
		const tempDisplay = containerEl.createSpan({ text: safeTemp.toFixed(1) });
		tempDisplay.style.marginLeft = '10px';
		tempDisplay.style.fontWeight = 'bold';

		new Setting(containerEl)
			.setName('Temperature')
			.addSlider(slider =>
				slider
					.setLimits(0.5, 1, 0.1)
					.setValue(safeTemp)
					.onChange(async (v) => {
						this.plugin.settings.temperature = v;
						tempDisplay.innerText = Number(v).toFixed(1);
						await this.plugin.saveSettings();
					})
			);

		// ── History Settings ───────────────────
		containerEl.createEl('h3', { text: 'History Settings' });

		new Setting(containerEl)
			.setName('Enable Chat History')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.enableHistory || false)
					.onChange(async (v) => {
						this.plugin.settings.enableHistory = v;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Retention Limit')
			.addDropdown(dropdown =>
				dropdown
					.addOption('days', 'Days')
					.addOption('queries', 'Queries')
					.setValue(this.plugin.settings.historyLimitType || 'days')
					.onChange(async (v) => {
						this.plugin.settings.historyLimitType = v as 'days' | 'queries';
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Limit Value')
			.addText(text =>
				text
					.setValue(String(this.plugin.settings.historyLimitValue || 7))
					.onChange(async (v) => {
						this.plugin.settings.historyLimitValue = parseInt(v) || 0;
						await this.plugin.saveSettings();
					})
			);

		// ── Template Configuration ─────────────
		containerEl.createEl('h3', { text: 'Template Configuration' });

		new Setting(containerEl).addButton(btn =>
			btn.setButtonText('Add Template').onClick(async () => {
				if (!this.plugin.settings.keywordTemplates) {
					this.plugin.settings.keywordTemplates = [];
				}
				this.plugin.settings.keywordTemplates.push({ keyword: '', templatePath: '' });
				await this.plugin.saveSettings();
				this.display();
			})
		);

		const templates = Array.isArray(this.plugin.settings.keywordTemplates)
			? this.plugin.settings.keywordTemplates
			: [];

		templates.forEach((entry: KeywordTemplate, index: number) => {
			new Setting(containerEl)
				.addText(text =>
					text
						.setPlaceholder('Display Name')
						.setValue(entry.keyword || '')
						.onChange(async (v) => {
							entry.keyword = v;
							await this.plugin.saveSettings();
						})
				)
				.addText(text =>
					text
						.setPlaceholder('File Path (e.g. Templates/Physics.md)')
						.setValue(entry.templatePath || '')
						.onChange(async (v) => {
							entry.templatePath = v;
							await this.plugin.saveSettings();
						})
				)
				.addButton(btn =>
					btn.setIcon('trash').onClick(async () => {
						this.plugin.settings.keywordTemplates.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
					})
				);
		});
	}
}
