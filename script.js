// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    updateProgressUI();
});

// --- DARK MODE ---
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('dark-mode-toggle');
    if(btn) btn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleDarkMode() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    document.getElementById('dark-mode-toggle').innerText = target === 'dark' ? '☀️' : '🌙';
}

// --- QUIZ SYSTEM ---
function checkAnswer(btn, isCorrect, sectionId) {
    const parent = btn.parentElement;
    const options = parent.querySelectorAll('.quiz-option');
    
    options.forEach(opt => opt.disabled = true); // Lock options
    
    if (isCorrect) {
        btn.classList.add('correct');
        saveProgress(sectionId);
    } else {
        btn.classList.add('wrong');
    }
    
    // Show hidden explanation if it exists
    const explanation = parent.querySelector('.explanation');
    if (explanation) explanation.classList.remove('hidden');
}

// --- PROGRESS TRACKING ---
function saveProgress(id) {
    let progress = JSON.parse(localStorage.getItem('linguaProgress') || '{}');
    progress[id] = true;
    localStorage.setItem('linguaProgress', JSON.stringify(progress));
    updateProgressUI();
}

function updateProgressUI() {
    const progress = JSON.parse(localStorage.getItem('linguaProgress') || '{}');
    const count = Object.keys(progress).length;
    const badge = document.getElementById('progress-badge');
    if(badge) badge.innerText = `Completed: ${count} Lessons`;
}

// --- READING SECTION ---
function toggleAnswer(id) {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
}

// --- AUDIO PLAYER ---
function toggleTranscript(id) {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
}