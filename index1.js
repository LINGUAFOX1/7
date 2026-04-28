// --- DATABASE: Lessons, Quizzes, and Practice ---
const content = {
    lessons: {
        vocab: [
            { id: 'v1', title: 'Greetings', type: 'Vocabulary', 
              words: [
                  {word: 'Hello', meaning: 'A common greeting', ex: 'Hello, how are you?'},
                  {word: 'Goodbye', meaning: 'Said when leaving', ex: 'Goodbye! See you tomorrow.'}
              ] 
            },
            { id: 'v2', title: 'Daily Activities', type: 'Vocabulary', 
              words: [
                  {word: 'Brush', meaning: 'Cleaning teeth', ex: 'I brush my teeth twice a day.'},
                  {word: 'Shower', meaning: 'Washing your body', ex: 'I take a shower in the morning.'}
              ] 
            }
        ],
        grammar: [
            { id: 'g1', title: 'Present Simple', type: 'Grammar',
              rule: 'Use for habits and facts.',
              formula: 'Subject + Base Verb (+s for he/she/it)',
              examples: ['I play football.', 'She eats apples.'],
              mistake: 'He go to school (Wrong) -> He goes to school (Right)'
            },
            { id: 'g2', title: 'Present Continuous', type: 'Grammar',
              rule: 'Actions happening right now.',
              formula: 'Subject + am/is/are + Verb + ing',
              examples: ['They are playing.', 'I am studying.'],
              mistake: 'I working (Wrong) -> I am working (Right)'
            }
        ]
    },
    quizzes: [
        { lessonId: 'g1', question: 'She ___ (work) in a bank.', options: ['work', 'works', 'working'], answer: 1, explanation: 'For she/he/it in Present Simple, we add -s.' },
        { lessonId: 'g2', question: 'They ____ (eat) dinner now.', options: ['is eating', 'eat', 'are eating'], answer: 2, explanation: 'Present Continuous uses am/is/are + ing.' }
    ]
};

// --- STATE MANAGEMENT ---
let progress = JSON.parse(localStorage.getItem('linguistProgress')) || {};

// --- CORE FUNCTIONS ---
function init() {
    showSection('home');
    updateProgressUI();
}

function showSection(section) {
    const main = document.getElementById('main-content');
    if (section === 'home') renderHome(main);
    else if (section === 'lessons') renderLessonsList(main);
    else if (section === 'quizzes') renderQuizzesList(main);
    else if (section === 'practice') renderPractice(main);
}

// --- RENDERING VIEWS ---
function renderHome(container) {
    const completedCount = Object.keys(progress).length;
    container.innerHTML = `
        <h1>Welcome back! 👋</h1>
        <div class="card">
            <h3>Daily Suggestion</h3>
            <p>Today, you should practice <b>Present Simple</b> to improve your basics.</p>
            <button class="btn" onclick="showGrammar('g1')">Start Now</button>
        </div>
        <div class="lesson-grid">
            <div class="card"><h3>${completedCount}</h3><p>Lessons Completed</p></div>
            <div class="card"><h3>${content.quizzes.length}</h3><p>Available Quizzes</p></div>
        </div>
    `;
}

function renderLessonsList(container) {
    let html = `<h1>English Lessons</h1><div class="lesson-grid">`;
    content.lessons.grammar.forEach(l => {
        html += `<div class="card">
            <span class="badge">${l.type}</span>
            <h3>${l.title}</h3>
            <button class="btn" onclick="showGrammar('${l.id}')">Study Rule</button>
        </div>`;
    });
    content.lessons.vocab.forEach(l => {
        html += `<div class="card">
            <span class="badge">${l.type}</span>
            <h3>${l.title}</h3>
            <button class="btn" onclick="showVocab('${l.id}')">Learn Words</button>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

function showGrammar(id) {
    const lesson = content.lessons.grammar.find(l => l.id === id);
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <button onclick="showSection('lessons')">← Back</button>
        <div class="card">
            <h1>${lesson.title}</h1>
            <p><b>Rule:</b> ${lesson.rule}</p>
            <p><b>Formula:</b> <code>${lesson.formula}</code></p>
            <hr>
            <h4>Examples:</h4>
            <ul>${lesson.examples.map(ex => `<li>${ex} <i class="fas fa-volume-up" onclick="speak('${ex}')"></i></li>`).join('')}</ul>
            <div style="background: #fff3cd; padding: 10px; margin-top: 15px;">
                <b>Common Mistake:</b> ${lesson.mistake}
            </div>
            <button class="btn" style="margin-top:20px" onclick="markComplete('${id}')">Mark as Completed</button>
        </div>
    `;
}

function showVocab(id) {
    const lesson = content.lessons.vocab.find(l => l.id === id);
    const main = document.getElementById('main-content');
    let wordsHtml = lesson.words.map(w => `
        <div class="card">
            <h3>${w.word} <i class="fas fa-volume-up" onclick="speak('${w.word}')" style="cursor:pointer; color:var(--primary)"></i></h3>
            <p><i>${w.meaning}</i></p>
            <p>Example: "${w.ex}"</p>
        </div>
    `).join('');
    
    main.innerHTML = `
        <button onclick="showSection('lessons')">← Back</button>
        <h1>${lesson.title} Vocabulary</h1>
        ${wordsHtml}
        <button class="btn" onclick="markComplete('${id}')">Finish Lesson</button>
    `;
}

function renderQuizzesList(container) {
    container.innerHTML = `<h1>Interactive Quizzes</h1>`;
    content.quizzes.forEach((q, index) => {
        container.innerHTML += `
            <div class="card">
                <h3>Quiz ${index + 1}</h3>
                <p>${q.question}</p>
                <div id="q-${index}">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option" onclick="checkAnswer(${index}, ${i})">${opt}</button>
                    `).join('')}
                </div>
                <div id="feedback-${index}" style="margin-top:10px; font-weight:bold"></div>
            </div>
        `;
    });
}

function checkAnswer(qIdx, choiceIdx) {
    const quiz = content.quizzes[qIdx];
    const feedback = document.getElementById(`feedback-${qIdx}`);
    const options = document.getElementById(`q-${qIdx}`).getElementsByTagName('button');

    if (choiceIdx === quiz.answer) {
        options[choiceIdx].classList.add('correct');
        feedback.innerHTML = `<span style="color:green">Correct! ✅</span> ${quiz.explanation}`;
    } else {
        options[choiceIdx].classList.add('wrong');
        feedback.innerHTML = `<span style="color:red">Try again! ❌</span>`;
    }
}

function renderPractice(container) {
    container.innerHTML = `
        <h1>Daily Practice</h1>
        <div class="card">
            <h3>Flashcards</h3>
            <div class="flashcard-container" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
                <div class="flashcard">
                    <div class="card-front">Apple</div>
                    <div class="card-back">A red fruit</div>
                </div>
            </div>
            <p style="text-align:center">Click to flip!</p>
        </div>
        <div class="card">
            <h3>Correct the Mistake</h3>
            <p>Sentence: "He <b>don't</b> like milk."</p>
            <input type="text" id="practice-input" placeholder="Type correct sentence...">
            <button class="btn" onclick="checkPractice()">Check</button>
            <p id="practice-msg"></p>
        </div>
    `;
}

// --- UTILITIES ---
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function markComplete(id) {
    progress[id] = true;
    localStorage.setItem('linguistProgress', JSON.stringify(progress));
    updateProgressUI();
    alert("Lesson marked as completed!");
}

function updateProgressUI() {
    const total = content.lessons.grammar.length + content.lessons.vocab.length;
    const completed = Object.keys(progress).length;
    const percent = (completed / total) * 100;
    document.getElementById('total-progress').style.width = percent + '%';
}

function toggleDarkMode() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    } else {
        body.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

function checkPractice() {
    const val = document.getElementById('practice-input').value.toLowerCase();
    const msg = document.getElementById('practice-msg');
    if (val.includes("doesn't")) {
        msg.innerHTML = "Correct! ✅"; msg.style.color = "green";
    } else {
        msg.innerHTML = "Try again. Hint: use 'doesn't'"; msg.style.color = "red";
    }
}

// Initialize App
init();