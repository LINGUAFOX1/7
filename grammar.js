// --- GRAMMAR DATA (Extracted from Murphy's English Grammar in Use) ---
const grammarData = [
    {
        id: 1,
        title: "Present Continuous",
        structure: "am/is/are + -ing",
        description: "Use for actions happening now, at the time of speaking, or for temporary situations.",
        examples: ["I am driving to work.", "Please don't make so much noise. I'm trying to work."],
        quiz: [
            { q: "Please be quiet. I ___ to concentrate.", a: ["try", "am trying", "tried"], correct: 1 },
            { q: "Look! It ___ anymore. Let's go out.", a: ["isn't raining", "doesn't rain", "not rain"], correct: 0 },
            { q: "What's all that noise? What ___?", a: ["happens", "is happening", "happening"], correct: 1 }
        ]
    },
    {
        id: 2,
        title: "Present Simple",
        structure: "Verb / Verb + -s",
        description: "Use for things in general, things that happen repeatedly, or facts that are true in general.",
        examples: ["Nurses look after patients.", "The earth goes round the sun."],
        quiz: [
            { q: "The cafe ___ at 7:30 every morning.", a: ["open", "is opening", "opens"], correct: 2 },
            { q: "Rice ___ in cold climates.", a: ["doesn't grow", "isn't growing", "not grow"], correct: 0 },
            { q: "What ___ for a living?", a: ["do you do", "are you doing", "you do"], correct: 0 }
        ]
    }
];

// --- APP STATE ---
const state = {
    uiLang: localStorage.getItem('uiLang') || 'en',
    level: localStorage.getItem('level') || 'Beginner',
    targetLang: 'English',
    xp: parseInt(localStorage.getItem('fox_xp')) || 1240,
    currentQuiz: null,
    quizStep: 0,
    languages: {
        'English': { flag: '🇺🇸', code: 'en-US' },
        'French': { flag: '🇫🇷', code: 'fr-FR' },
        'Arabic': { flag: '🇸🇦', code: 'ar-SA' }
    },
    strings: {
        en: { welcome: "Morning, Scholar!", levelPrefix: "Level: " },
        fr: { welcome: "Bonjour, l'élève !", levelPrefix: "Niveau : " },
        ar: { welcome: "صباح الخير، يا باحث!", levelPrefix: "المستوى: " }
    }
};

// --- CORE ENGINE ---
function init() {
    if (!localStorage.getItem('uiLang')) {
        document.getElementById('setup-modal').classList.remove('hidden');
    } else {
        startApp();
    }
}

function saveSetup() {
    state.uiLang = document.getElementById('ui-lang-select').value;
    state.level = document.getElementById('ui-level-select').value;
    localStorage.setItem('uiLang', state.uiLang);
    localStorage.setItem('level', state.level);
    document.getElementById('setup-modal').classList.add('hidden');
    startApp();
}

function startApp() {
    document.getElementById('app-container').classList.remove('hidden');
    applyUISettings();
    renderLanguageSwitcher();
    updateXP(0);
}

function applyUISettings() {
    document.body.dir = state.uiLang === 'ar' ? 'rtl' : 'ltr';
    const s = state.strings[state.uiLang];
    document.getElementById('welcome-text').innerText = s.welcome;
}

function updateXP(amount) {
    state.xp += amount;
    localStorage.setItem('fox_xp', state.xp);
    const bar = document.getElementById('xp-bar');
    const display = document.getElementById('xp-display');
    const levelDisplay = document.getElementById('user-display-level');
    
    const progress = (state.xp % 1000) / 10;
    bar.style.width = `${progress}%`;
    display.innerText = `${state.xp.toLocaleString()} XP`;
    levelDisplay.innerText = `Level ${Math.floor(state.xp/1000) + 1}`;
}

// --- GRAMMAR & QUIZ SYSTEM ---

function openActivity(type) {
    const overlay = document.getElementById('activity-overlay');
    const content = document.getElementById('activity-content');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (type === 'grammar') {
        renderGrammarList();
    } else if (type === 'speaking') {
        content.innerHTML = `<div class="text-center"><h2 class="text-3xl font-black">Speaking Lab</h2><p class="mt-4 text-gray-400">Coming Soon!</p></div>`;
    }
}

function renderGrammarList() {
    const content = document.getElementById('activity-content');
    let html = `
        <h2 class="text-4xl font-black mb-8">The Structural Forge</h2>
        <div class="grid gap-4">
            ${grammarData.map(unit => `
                <div onclick="showLesson(${unit.id})" class="glass p-6 cursor-pointer hover:border-fox-orange transition-all flex justify-between items-center group">
                    <div>
                        <h4 class="text-xl font-bold">Unit ${unit.id}: ${unit.title}</h4>
                        <p class="text-sm text-gray-500">${unit.structure}</p>
                    </div>
                    <i class="fas fa-chevron-right group-hover:translate-x-2 transition-transform"></i>
                </div>
            `).join('')}
        </div>
    `;
    content.innerHTML = html;
}

function showLesson(id) {
    const unit = grammarData.find(u => u.id === id);
    const content = document.getElementById('activity-content');
    content.innerHTML = `
        <div class="max-w-2xl mx-auto animate-fade-in">
            <button onclick="renderGrammarList()" class="text-fox-orange font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-arrow-left"></i> Back to Units
            </button>
            <h2 class="text-5xl font-black mb-4">${unit.title}</h2>
            <div class="bg-white/5 rounded-3xl p-8 border border-white/5 mb-8">
                <p class="text-xl text-gray-300 mb-6 leading-relaxed">${unit.description}</p>
                <div class="space-y-3">
                    ${unit.examples.map(ex => `<p class="italic text-fox-orange">" ${ex} "</p>`).join('')}
                </div>
            </div>
            <button onclick="startQuiz(${unit.id})" class="w-full fox-gradient py-5 rounded-2xl font-black text-xl shadow-xl shadow-fox-orange/20 hover:brightness-110">
                Start Unit Quiz
            </button>
        </div>
    `;
}

function startQuiz(unitId) {
    state.currentQuiz = grammarData.find(u => u.id === unitId);
    state.quizStep = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const unit = state.currentQuiz;
    const step = state.quizStep;
    const question = unit.quiz[step];
    const content = document.getElementById('activity-content');

    content.innerHTML = `
        <div class="max-w-2xl mx-auto text-center animate-fade-in">
            <p class="text-gray-500 font-bold uppercase tracking-widest mb-2">Question ${step + 1} of ${unit.quiz.length}</p>
            <div class="h-2 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
                <div class="h-full fox-gradient transition-all" style="width: ${((step + 1) / unit.quiz.length) * 100}%"></div>
            </div>
            <h3 class="text-3xl font-bold mb-10 text-white">${question.q}</h3>
            <div class="grid gap-4">
                ${question.a.map((option, idx) => `
                    <button onclick="checkAnswer(${idx}, ${question.correct})" 
                            class="quiz-option p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-fox-orange transition-all font-bold text-lg">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function checkAnswer(selected, correct) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(btn => btn.disabled = true);