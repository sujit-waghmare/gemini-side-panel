const { Plugin, PluginSettingTab, Setting, ItemView, requestUrl, MarkdownView, setIcon, MarkdownRenderer, Notice, TFile } = require('obsidian');

const VIEW_TYPE_GEMINI = "gemini-chat-view";

class GeminiView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.currentSource = 'note';
        this.currentFormat = 'visuals';
        this.selectedTemplatePath = null; 
        this.currentModel = this.plugin.settings.modelId || 'gemini-2.5-flash';
        
        // State tracking for accordion menus (model is false/collapsed by default)
        this.dropdownState = { model: false, source: true, format: true, templates: true };
    }

    getViewType() { return VIEW_TYPE_GEMINI; }
    getDisplayText() { return "Gemini Chat"; }

    async onOpen() {
        const container = this.contentEl.createDiv({ cls: 'gemini-chat-container' });
        this.chatHistory = container.createDiv({ cls: 'gemini-history' });
        const inputSection = container.createDiv({ cls: 'gemini-input-container' });
        
        this.dropdownElement = inputSection.createDiv({ cls: 'gemini-dropdown' });
        this.renderDropdown();

        const wrapper = inputSection.createDiv({ cls: 'gemini-input-wrapper' });
        this.inputField = wrapper.createEl('textarea', { cls: 'gemini-input-area', placeholder: 'Message...' });
        
        this.inputField.addEventListener('input', () => {
            this.inputField.style.height = 'auto';
            this.inputField.style.height = this.inputField.scrollHeight + 'px';
        });

        const actionRow = inputSection.createDiv({ cls: 'gemini-actions-row' });
        const sendBtn = actionRow.createEl('button', { cls: 'gemini-send-btn', text: 'Send' });
        const menuBtn = actionRow.createDiv({ cls: 'gemini-menu-btn' });
        setIcon(menuBtn, 'menu');

        menuBtn.onclick = (e) => { 
            e.stopPropagation(); 
            this.renderDropdown(); 
            this.dropdownElement.classList.toggle('is-open'); 
        };
        
        document.addEventListener('click', () => this.dropdownElement.classList.remove('is-open'));
        sendBtn.onclick = () => this.handleSend();

        this.registerEvent(this.app.workspace.on('file-open', () => this.refreshHistory()));
        await this.refreshHistory();
    }

    async refreshHistory() {
        this.chatHistory.empty();
        if (!this.plugin.settings.enableHistory) return;
        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) return;
        this.plugin.cleanExpiredHistory(activeFile.path);
        
        const history = (this.plugin.settings.noteHistories && this.plugin.settings.noteHistories[activeFile.path]) ? this.plugin.settings.noteHistories[activeFile.path] : [];
        for (const msg of history) { await this.appendMessage(msg.role, msg.text, false); }
    }

    // Creates an accordion section
    createSection(key, title, itemsRenderer) {
        const sectionWrapper = this.dropdownElement.createDiv({ cls: 'gemini-dropdown-section' });
        
        const header = sectionWrapper.createDiv({ cls: 'gemini-dropdown-section-header' });
        header.createSpan({ text: title, cls: 'gemini-dropdown-section-title' });
        const chevron = header.createDiv({ cls: 'gemini-chevron-icon' });
        
        setIcon(chevron, this.dropdownState[key] ? 'chevron-down' : 'chevron-right');

        const content = sectionWrapper.createDiv({ cls: 'gemini-dropdown-section-content' });
        if (!this.dropdownState[key]) content.style.display = 'none';

        header.onclick = (e) => {
            e.stopPropagation();
            this.dropdownState[key] = !this.dropdownState[key];
            this.renderDropdown();
        };

        itemsRenderer(content);
    }

    renderDropdown() {
        this.dropdownElement.empty();

        // --- MODEL ---
        this.createSection('model', 'Model', (content) => {
            const models = [
                { id: 'gemini-3.1-pro-preview', name: '3.1 Pro' },
                { id: 'gemini-3-flash-preview', name: '3 Flash' },
                { id: 'gemini-3.1-flash-lite-preview', name: '3.1 Flash-Lite' },
                { id: 'gemini-2.5-pro', name: '2.5 Pro' },
                { id: 'gemini-2.5-flash', name: '2.5 Flash' },
                { id: 'gemini-2.5-flash-lite', name: '2.5 Flash-Lite' }
            ];
            models.forEach(m => {
                this.createDropdownItem(content, m.name, async () => {
                    this.currentModel = m.id;
                    this.plugin.settings.modelId = m.id; 
                    await this.plugin.saveSettings();
                }, () => this.currentModel === m.id);
            });
        });

        this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });
        
        // --- SOURCE ---
        this.createSection('source', 'Source', (content) => {
            this.createDropdownItem(content, 'Note', () => this.currentSource = 'note', () => this.currentSource === 'note');
            this.createDropdownItem(content, 'Internet', () => this.currentSource = 'internet', () => this.currentSource === 'internet');
        });
        
        this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });
        
        // --- FORMAT ---
        this.createSection('format', 'Format', (content) => {
            this.createDropdownItem(content, 'Better Visuals', () => {
                this.currentFormat = 'visuals';
                this.selectedTemplatePath = null; 
            }, () => this.currentFormat === 'visuals');
            
            this.createDropdownItem(content, 'Better Understanding', () => {
                this.currentFormat = 'understanding';
                this.selectedTemplatePath = null; 
            }, () => this.currentFormat === 'understanding');
            
            this.createDropdownItem(content, 'Brief Information', () => {
                this.currentFormat = 'brief';
                this.selectedTemplatePath = null; 
            }, () => this.currentFormat === 'brief');
        });

        this.dropdownElement.createEl('hr', { cls: 'gemini-dropdown-divider' });

        // --- TEMPLATES ---
        this.createSection('templates', 'Templates', (content) => {
            this.createDropdownItem(content, 'None', () => {
                this.selectedTemplatePath = null;
                this.currentFormat = 'visuals'; 
            }, () => this.selectedTemplatePath === null);
            
            const templates = Array.isArray(this.plugin.settings.keywordTemplates) ? this.plugin.settings.keywordTemplates : [];
            templates.forEach(entry => {
                if (!entry || !entry.keyword) return;
                this.createDropdownItem(content, entry.keyword, () => {
                    this.selectedTemplatePath = entry.templatePath;
                    this.currentFormat = 'none'; 
                }, () => this.selectedTemplatePath === entry.templatePath);
            });
        });
    }

    createDropdownItem(container, label, onClick, isSelected) {
        const item = container.createDiv({ cls: 'gemini-dropdown-item' });
        item.createSpan({ text: label });
        
        const checkIcon = item.createDiv({ cls: 'gemini-check-icon' });
        setIcon(checkIcon, 'check');
        if (isSelected()) checkIcon.classList.add('is-selected');
        
        item.onclick = (e) => { 
            e.stopPropagation(); 
            onClick(); 
            this.renderDropdown(); 
        };
    }

    async handleSend() {
        const userQuery = this.inputField.value.trim();
        if (!userQuery) return;
        const { apiKey, temperature } = this.plugin.settings;
        const modelId = this.currentModel || this.plugin.settings.modelId;
        const activeFile = this.app.workspace.getActiveFile();
        
        if (!apiKey) { new Notice("API Key missing!"); return; }

        let templateContext = "";
        
        if (this.selectedTemplatePath) {
            let path = this.selectedTemplatePath;
            if (!path.endsWith('.md')) path += '.md'; 

            const tFile = this.app.vault.getAbstractFileByPath(path);
            if (tFile instanceof TFile) {
                templateContext = `\n\n=== START OF REQUIRED TEMPLATE FORMAT ===\n${await this.app.vault.read(tFile)}\n=== END OF REQUIRED TEMPLATE FORMAT ===\n\nCRITICAL RULE: You MUST structure your final answer using the EXACT headings, bullet points, and style shown in the required template above. Do not deviate.`;
            } else {
                this.appendMessage('bot', `⚠️ **Error:** Could not find template file at \`${path}\`. Please check the path in settings.`);
                return; 
            }
        }

        await this.appendMessage('user', userQuery);
        this.inputField.value = '';
        this.inputField.style.height = 'auto';

        try {
            const noteContent = activeFile ? await this.app.vault.read(activeFile) : "";
            const response = await this.callGemini(userQuery, noteContent + templateContext, apiKey.trim(), modelId, this.currentSource, this.currentFormat, temperature);
            await this.appendMessage('bot', response);
        } catch (err) { await this.appendMessage('bot', `❌ Error: ${err.message}`); }
    }

    async appendMessage(role, text, shouldSave = true) {
        const activeFile = this.app.workspace.getActiveFile();
        const row = this.chatHistory.createDiv({ cls: `gemini-msg-row ${role}` });
        const iconContainer = row.createDiv({ cls: 'gemini-icon' });
        setIcon(iconContainer, role === 'user' ? 'user' : 'bot');
        const bubble = row.createDiv({ cls: 'gemini-bubble' });
        
        if (shouldSave && activeFile && this.plugin.settings.enableHistory) {
            if (!this.plugin.settings.noteHistories) this.plugin.settings.noteHistories = {};
            if (!this.plugin.settings.noteHistories[activeFile.path]) this.plugin.settings.noteHistories[activeFile.path] = [];
            
            this.plugin.settings.noteHistories[activeFile.path].push({ role, text, timestamp: Date.now() });
            
            if (this.plugin.settings.historyLimitType === 'queries') {
                const limit = parseInt(this.plugin.settings.historyLimitValue) || 7;
                while (this.plugin.settings.noteHistories[activeFile.path].length > limit * 2) { 
                    this.plugin.settings.noteHistories[activeFile.path].shift(); 
                }
            }
            await this.plugin.saveSettings();
        }
        
        let holdTimer;
        const startHold = () => { holdTimer = window.setTimeout(() => { navigator.clipboard.writeText(text); new Notice("Copied!"); bubble.style.transform = "scale(0.95)"; setTimeout(() => bubble.style.transform = "scale(1)", 100); }, 600); };
        const cancelHold = () => window.clearTimeout(holdTimer);
        bubble.addEventListener('pointerdown', startHold);
        bubble.addEventListener('pointerup', cancelHold);
        bubble.addEventListener('pointerleave', cancelHold);
        bubble.addEventListener('contextmenu', (e) => e.preventDefault());

        await MarkdownRenderer.render(this.app, text, bubble, '/', this);
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }

    async callGemini(query, context, apiKey, modelId, source, format, temp) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
        const safeTemp = parseFloat(temp) || 1.0;
        
        let sourceInstr = "";
        if (source === 'note') {
            sourceInstr = `STRICT INSTRUCTION: You are an assistant analyzing a specific note. Answer ONLY based on the note content provided below. If the information is not present in the note, explicitly state: "I cannot find that in this note." Do NOT use any outside knowledge.`;
            if (safeTemp < 0.9) sourceInstr += " Use the note as a primary reference point but be helpful.";
        } else {
            sourceInstr = `INSTRUCTION: You are an AI assistant. The user has selected 'Internet' as the source. You SHOULD use your general knowledge and internet data to provide a complete and accurate answer. The provided note content is for BACKGROUND CONTEXT ONLY. If the answer is not in the note, answer it using the internet.`;
            if (safeTemp >= 0.9) sourceInstr += " Provide a pure internet-based solution.";
        }
        
        let formatInstr = "";
        if (format === 'visuals') formatInstr = "FORMAT: Use bold headings, tables, and lists.";
        else if (format === 'understanding') formatInstr = "FORMAT: Deep analogies and concepts.";
        else if (format === 'brief') formatInstr = "FORMAT: Extremely concise.";
        else if (format === 'none') formatInstr = "FORMAT: You are in TEMPLATE MODE. Ignore standard visual rules and strictly mirror the layout of the provided template.";

        const prompt = `${sourceInstr}\n${formatInstr}\n\nLATEX: Use $inline$ and $$display$$.\n\nCONTEXT (NOTE AND SELECTED TEMPLATE):\n${context}\n\nQUESTION:\n${query}`;

        try {
            const response = await requestUrl({ 
                url: url, 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    contents: [{ parts: [{ text: prompt }] }], 
                    generationConfig: { temperature: safeTemp } 
                }), 
                throw: false 
            });

            if (response.status !== 200) {
                let errorData = "Unknown API Error";
                if (response.json && response.json.error && response.json.error.message) {
                    errorData = response.json.error.message;
                } else if (response.text) {
                    errorData = response.text;
                }
                return `Error ${response.status}: ${errorData}`;
            }
            
            if (response.json && response.json.candidates && response.json.candidates.length > 0) {
                const candidate = response.json.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    return candidate.content.parts[0].text;
                }
            }
            return "Error: Gemini API returned an empty response. This might be due to safety filters.";
        } catch (e) {
            return `Connection failed: ${e.message}. Make sure your internet is on.`;
        }
    }

    async clearHistory() {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && this.plugin.settings.noteHistories) { 
            delete this.plugin.settings.noteHistories[activeFile.path]; 
            await this.plugin.saveSettings(); 
            this.chatHistory.empty(); 
            new Notice("History cleared."); 
        }
    }
}

module.exports = class GeminiPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        this.registerView(VIEW_TYPE_GEMINI, (leaf) => new GeminiView(leaf, this));
        this.addRibbonIcon('bot', 'Open Gemini', () => this.activateView('right'));
        this.addCommand({ id: 'open-gemini-right', name: 'Open Gemini in right panel', callback: () => this.activateWithSelection('right') });
        this.addCommand({ id: 'open-gemini-left', name: 'Open Gemini in left panel', callback: () => this.activateWithSelection('left') });
        this.addCommand({ id: 'clear-gemini-chat', name: 'Clear Gemini chat history', callback: () => { const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_GEMINI); if (leaves.length > 0) (leaves[0].view).clearHistory(); }});
        this.addSettingTab(new GeminiSettingTab(this.app, this));
    }
    
    cleanExpiredHistory(path) {
        if (!this.settings || this.settings.historyLimitType !== 'days' || !this.settings.noteHistories || !this.settings.noteHistories[path]) return;
        const limitValue = parseInt(this.settings.historyLimitValue) || 7;
        const expiryMs = limitValue * 24 * 60 * 60 * 1000;
        const now = Date.now();
        this.settings.noteHistories[path] = this.settings.noteHistories[path].filter(msg => (now - msg.timestamp) < expiryMs);
    }

    activateWithSelection(side) { const activeView = this.app.workspace.getActiveViewOfType(MarkdownView); this.activateView(side, activeView ? activeView.editor.getSelection() : ''); }
    
    async activateView(side, initialText) {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_GEMINI)[0];
        if (!leaf) { 
            leaf = side === 'left' ? workspace.getLeftLeaf(false) : workspace.getRightLeaf(false); 
            await leaf.setViewState({ type: VIEW_TYPE_GEMINI, active: true }); 
        }
        workspace.revealLeaf(leaf);
        if (initialText && leaf.view instanceof GeminiView) { 
            leaf.view.inputField.value = initialText; 
            leaf.view.inputField.focus(); 
            leaf.view.inputField.dispatchEvent(new Event('input')); 
        }
    }

    async loadSettings() { 
        const loadedData = await this.loadData() || {};
        this.settings = Object.assign({ 
            apiKey: '', 
            modelId: 'gemini-2.5-flash', 
            noteHistories: {}, 
            enableHistory: false, 
            historyLimitType: 'days', 
            historyLimitValue: 7, 
            temperature: 1.0, 
            keywordTemplates: [] 
        }, loadedData); 
    }

    async saveSettings() { await this.saveData(this.settings); }
};

class GeminiSettingTab extends PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    display() {
        const { containerEl } = this; containerEl.empty();
        containerEl.createEl('h2', { text: 'Gemini Settings' });
        
        new Setting(containerEl).setName('API Key').addText(text => text.setValue(this.plugin.settings.apiKey || '').onChange(async (v) => { this.plugin.settings.apiKey = v.trim(); await this.plugin.saveSettings(); }));
        new Setting(containerEl)
            .setName('Model')
            .addDropdown(dropdown => dropdown
                .addOption('gemini-3.1-pro-preview', 'Gemini 3.1 Pro (Advanced Thinking)')
                .addOption('gemini-3-flash-preview', 'Gemini 3 Flash (Fast & Frontier)')
                .addOption('gemini-3.1-flash-lite-preview', 'Gemini 3.1 Flash-Lite (High Volume)')
                .addOption('gemini-2.5-pro', 'Gemini 2.5 Pro (Balanced)')
                .addOption('gemini-2.5-flash', 'Gemini 2.5 Flash (Default)')
                .addOption('gemini-2.5-flash-lite', 'Gemini 2.5 Flash-Lite (Lightweight)')
                .setValue(this.plugin.settings.modelId || 'gemini-2.5-flash')
                .onChange(async (v) => { 
                    this.plugin.settings.modelId = v; 
                    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_GEMINI);
                    if(leaves.length > 0) {
                        leaves[0].view.currentModel = v;
                    }
                    await this.plugin.saveSettings(); 
                })
            );

        containerEl.createEl('h3', { text: 'AI Behavior' });
        
        const safeTemp = Number(this.plugin.settings.temperature) || 1.0;
        new Setting(containerEl).setName('Temperature').addSlider(slider => slider.setLimits(0.5, 1, 0.1).setValue(safeTemp).onChange(async (v) => { 
            this.plugin.settings.temperature = v; 
            tempDisplay.innerText = Number(v).toFixed(1); 
            await this.plugin.saveSettings(); 
        }));
        const tempDisplay = containerEl.createSpan({ text: safeTemp.toFixed(1) });
        tempDisplay.style.marginLeft = "10px";
        tempDisplay.style.fontWeight = "bold";

        containerEl.createEl('h3', { text: 'History Settings' });
        new Setting(containerEl).setName('Enable Chat History').addToggle(toggle => toggle.setValue(this.plugin.settings.enableHistory || false).onChange(async (v) => { this.plugin.settings.enableHistory = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Retention Limit').addDropdown(dropdown => dropdown.addOption('days', 'Days').addOption('queries', 'Queries').setValue(this.plugin.settings.historyLimitType || 'days').onChange(async (v) => { this.plugin.settings.historyLimitType = v; await this.plugin.saveSettings(); }));
        new Setting(containerEl).setName('Limit Value').addText(text => text.setValue(String(this.plugin.settings.historyLimitValue || 7)).onChange(async (v) => { this.plugin.settings.historyLimitValue = parseInt(v) || 0; await this.plugin.saveSettings(); }));

        containerEl.createEl('h3', { text: 'Template Configuration' });
        new Setting(containerEl).addButton(btn => btn.setButtonText("Add Template").onClick(async () => {
            if (!this.plugin.settings.keywordTemplates) this.plugin.settings.keywordTemplates = [];
            this.plugin.settings.keywordTemplates.push({ keyword: "", templatePath: "" });
            await this.plugin.saveSettings();
            this.display();
        }));

        const templates = Array.isArray(this.plugin.settings.keywordTemplates) ? this.plugin.settings.keywordTemplates : [];
        templates.forEach((entry, index) => {
            new Setting(containerEl)
                .addText(text => text.setPlaceholder("Display Name").setValue(entry.keyword || '').onChange(async (v) => { entry.keyword = v; await this.plugin.saveSettings(); }))
                .addText(text => text.setPlaceholder("File Path").setValue(entry.templatePath || '').onChange(async (v) => { entry.templatePath = v; await this.plugin.saveSettings(); }))
                .addButton(btn => btn.setIcon("trash").onClick(async () => {
                    this.plugin.settings.keywordTemplates.splice(index, 1);
                    await this.plugin.saveSettings();
                    this.display();
                }));
        });
    }
}