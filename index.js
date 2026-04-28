// --- APPLICATION STATE ---
const FoxApp = {
    user: {
        xp: parseInt(localStorage.getItem('fox_xp')) || 0,
        level: localStorage.getItem('fox_level') || 'Beginner',
        uiLang: localStorage.getItem('fox_ui_lang') || 'en',
        targetLang: 'English',
        streak: 3
    },
    
    // Mock Data for Curriculum
    curriculum: [
        { id: 1, title: "The First Hello", type: "Speaking", xp: 50, icon: "🎙️", locked: false },
        { id: 2, title: "Daily Rituals", type: "Vocabulary", xp: 40, icon: "☕", locked: false },
        { id: 3, title: "Sentence Structure", type: "Grammar", xp: 60, icon: "🏗️", locked: true },
        { id: 4, title: "The Coffee Shop", type: "Scenario", xp: 100, icon: "🥐", locked: true }
    ],

    init() {
        this.applySettings();
        this.renderLanguageSwitcher();
        this.updateXPUI(0);
        this.setupEventListeners();
    },

    // --- NAVIGATION & TABS ---
    switchTab(tabId) {
        const contentArea = document.getElementById('tab-content');
        
        // Update Nav UI
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-nav', 'text-white'));
        document.getElementById(`nav-${tabId}`).classList.add('active-nav');

        // Animate Out
        contentArea.classList.add('fade-out');

        setTimeout(() => {
            contentArea.innerHTML = '';
            
            if (tabId === 'home') {
                location.reload(); // Simplest way to return to dashboard
            } else if (tabId === 'curriculum') {
                this.renderCurriculum();
            } else if (tabId === 'lab') {
                this.renderLab();
            }

            contentArea.classList.remove('fade-out');
            contentArea.classList.add('fade-in');
        }, 300);
    },

    // --- RENDER ENGINES ---
    renderCurriculum() {
        const container = document.getElementById('tab-content');
        let html = `
            <div class="mb-10">
                <h2 class="text-3xl font-black mb-2">Learning Path</h2>
                <p class="text-gray-500">Master ${this.user.targetLang} step-by-step.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        `;

        this.curriculum.forEach(lesson => {
            html += `
                <div class="glass p-6 flex items-center justify-between ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-fox-orange/50'}" 
                     onclick="${lesson.locked ? '' : `FoxApp.openActivity('${lesson.type.toLowerCase()}')`}">
                    <div class="flex items-center gap-5">
                        <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">${lesson.icon}</div>
                        <div>
                            <h4 class="font-bold">${lesson.title}</h4>
                            <p class="text-xs text-gray-500 uppercase font-black tracking-widest">${lesson.type} • ${lesson.xp} XP</p>
                        </div>
                    </div>
                    ${lesson.locked ? '<i class="fas fa-lock text-gray-600"></i>' : '<i class="fas fa-chevron-right text-fox-orange"></i>'}
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    },

    renderLab() {
        const container = document.getElementById('tab-content');
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                <div class="glass p-8 flex flex-col">
                    <h2 class="text-2xl font-black mb-6">AI Translation Lab</h2>
                    <textarea id="lab-input" placeholder="Type anything here to translate and analyze..." 
                              class="w-full flex-1 bg-transparent border-none outline-none text-xl resize-none"></textarea>
                    <button onclick="FoxApp.runLabAnalysis()" class="fox-gradient w-full py-4 rounded-2xl font-bold mt-4">Analyze with Professor Fox</button>
                </div>
                <div id="lab-result" class="glass p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                    <div class="text-5xl mb-4 text-white/10">🧪</div>
                    <p class="text-gray-500">Enter text on the left to start the experiment.</p>
                </div>
            </div>
        `;
    },

    // --- APP LOGIC ---
    updateXPUI(amount) {
        this.user.xp += amount;
        localStorage.setItem('fox_xp', this.user.xp);
        
        const bar = document.getElementById('xp-bar');
        const display = document.getElementById('xp-display');
        const levelDisplay = document.getElementById('user-display-level');
        
        const currentLevel = Math.floor(this.user.xp / 500) + 1;
        const progress = ((this.user.xp % 500) / 500) * 100;

        bar.style.width = `${progress}%`;
        display.innerText = `${this.user.xp.toLocaleString()} XP`;
        levelDisplay.innerText = `Level ${currentLevel}`;

        if (amount > 0) {
            bar.parentElement.classList.add('xp-update-flash');
            setTimeout(() => bar.parentElement.classList.remove('xp-update-flash'), 600);
        }
    },

    runLabAnalysis() {
        const input = document.getElementById('lab-input').value;
        const result = document.getElementById('lab-result');
        if (!input) return;

        result.innerHTML = `<div class="skeleton w-full h-full rounded-2xl"></div>`;
        
        setTimeout(() => {
            result.innerHTML = `
                <div class="text-left w-full animate-fade-in">
                    <div class="flex items-center gap-2 mb-6 text-fox-orange">
                        <i class="fas fa-microchip"></i>
                        <span class="text-[10px] font-black uppercase tracking-widest">AI Analysis Complete</span>
                    </div>
                    <h3 class="text-lg font-bold mb-2">Translation</h3>
                    <p class="text-gray-300 mb-6 bg-white/5 p-4 rounded-xl">This is where the simulated AI would provide the translation into ${this.user.targetLang}.</p>
                    <h3 class="text-lg font-bold mb-2">Key Vocabulary</h3>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-fox-orange/10 rounded-full text-xs text-fox-orange">Nuance: 85%</span>
                        <span class="px-3 py-1 bg-green-500/10 rounded-full text-xs text-green-500">Grammar: Perfect</span>
                    </div>
                </div>
            `;
            this.updateXPUI(15);
        }, 1500);
    },

    openActivity(type) {
        // This function was partially in your HTML, keeping it for the Speaking lab
        openActivity(type); 
    },

    applySettings() {
        document.body.dir = this.user.uiLang === 'ar' ? 'rtl' : 'ltr';
    },

    renderLanguageSwitcher() {
        // Reuse your logic but make it dynamic
        const langs = {
            'English': '🇺🇸', 'French': '🇫🇷', 'German': '🇩🇪', 'Spanish': '🇪🇸', 'Arabic': '🇸🇦'
        };
        const container = document.getElementById('lang-switcher');
        if (container) {
            container.innerHTML = Object.entries(langs).map(([name, flag]) => `
                <button onclick="FoxApp.setTargetLang('${name}')" 
                        class="w-10 h-10 rounded-xl flex items-center justify-center transition-all ${this.user.targetLang === name ? 'bg-fox-orange text-white' : 'text-gray-500 hover:text-white'}">
                    ${flag}
                </button>
            `).join('');
        }
    },

    setTargetLang(lang) {
        this.user.targetLang = lang;
        document.getElementById('target-display').innerText = lang;
        this.renderLanguageSwitcher();
    },

    setupEventListeners() {
        // Listen for "Enter" key in the Tailor input
        const tailorInput = document.getElementById('tailor-input');
        if (tailorInput) {
            tailorInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    analyzeText();
                }
            });
        }
    }
};

// Override the global switchTab from the HTML with our advanced one
window.switchTab = (id) => FoxApp.switchTab(id);

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => FoxApp.init());
