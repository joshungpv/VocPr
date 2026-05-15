/**
 * VocPr — Vocabulary Practice
 * Copyright (c) 2026 hungpv
 * Licensed under the MIT License
 */

// Application State
let currentState = {
    mode: 'home', // 'home' | 'learn' | 'test' | 'result'
    vocab: [],
    currentIndex: 0,
    isFlipped: false,

    // Test State
    testQuestions: [],
    userAnswers: [],
    incorrectWords: [], // IDs of words missed in last test
    history: [],

    // Matching Interaction State
    matchingState: {
        selected: null, // { side: 'left'|'right', val: string, id: number }
        matchedIds: [], // IDs of pairs correctly matched
        errorId: null   // ID to show error effect
    },

    // Preferences
    preferredTestSize: 20
};

/**
 * Initialize the app
 */
function init() {
    if (window.VOCAB_DATA) {
        // Deduplicate and merge VOCAB_DATA with custom_vocab
        const vocabMap = new Map();
        
        // Add base vocab first
        window.VOCAB_DATA.forEach(item => {
            vocabMap.set(item.en.toLowerCase().trim(), { ...item });
        });

        // Load custom vocab and override/merge
        const customVocabRaw = localStorage.getItem('custom_vocab');
        if (customVocabRaw) {
            try {
                const customVocab = JSON.parse(customVocabRaw);
                customVocab.forEach(item => {
                    vocabMap.set(item.en.toLowerCase().trim(), { ...item });
                });
            } catch (e) {
                console.error("Failed to parse custom_vocab", e);
            }
        }

        // Add ID to each word for tracking
        currentState.vocab = Array.from(vocabMap.values()).map((item, index) => ({ ...item, id: index }));

        console.log(`Loaded ${currentState.vocab.length} words.`);

        // Load history from localStorage
        const savedHistory = localStorage.getItem('vocab_history');
        if (savedHistory) currentState.history = JSON.parse(savedHistory);

        // Load last incorrect words
        const savedIncorrect = localStorage.getItem('last_incorrect_ids');
        if (savedIncorrect) currentState.incorrectWords = JSON.parse(savedIncorrect);
        
        // Init Dark Mode
        if (localStorage.getItem('vocab_theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
        
        // Init Streak
        updateStreak();
    } else {
        console.error("VOCAB_DATA not found!");
    }
}

/**
 * Gamification & Global Utilities
 */
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('vocab_theme', isDark ? 'dark' : 'light');
}
window.toggleDarkMode = toggleDarkMode;

function updateStreak() {
    const today = new Date().toLocaleDateString('vi-VN');
    let streak = parseInt(localStorage.getItem('vocab_streak') || '0');
    const lastActive = localStorage.getItem('vocab_last_active');
    
    if (lastActive !== today) {
        // If not visited today, check if visited yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActive === yesterday.toLocaleDateString('vi-VN')) {
            streak++;
        } else if (lastActive) {
            streak = 1; // broke streak
        } else {
            streak = 1; // first time
        }
        localStorage.setItem('vocab_last_active', today);
        localStorage.setItem('vocab_streak', streak);
    }
    
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = streak;
}

function triggerMascot(type, message = '') {
    const mascot = document.getElementById('mascot');
    const bubble = document.getElementById('mascot-bubble');
    if (!mascot) return;
    
    // Reset animation
    mascot.className = 'filter drop-shadow-xl select-none cursor-pointer hover:scale-110 transition-transform origin-bottom';
    void mascot.offsetWidth; // trigger reflow
    
    if (type === 'cheer') mascot.classList.add('mascot-cheer');
    if (type === 'warn') mascot.classList.add('mascot-warn');
    if (type === 'error') mascot.classList.add('mascot-error');
    
    if (message && bubble) {
        bubble.textContent = message;
        bubble.classList.remove('opacity-0');
        setTimeout(() => bubble.classList.add('opacity-0'), 2000);
    }
}

/**
 * Switch between app modes
 */
function switchMode(mode) {
    // Add fade-out effect before switching (optional, but for now we just animate the incoming content)
    const container = document.getElementById('main-content');
    container.classList.remove('animate-fade-in');
    void container.offsetWidth; // Trigger reflow

    currentState.mode = mode;
    currentState.currentIndex = 0;
    currentState.isFlipped = false;

    updateNavButtons(mode);

    if (mode === 'test') {
        startNewTest();
    } else {
        render();
    }
}

/**
 * Update Navigation Button Styles
 */
function updateNavButtons(mode) {
    const btnLearn = document.getElementById('btn-learn');
    const btnTest = document.getElementById('btn-test');
    if (!btnLearn || !btnTest) return;

    const activeClasses = ['bg-indigo-600', 'text-white', 'shadow-lg'];
    const inactiveClasses = ['bg-white', 'text-slate-700', 'shadow', 'shadow-indigo-100', 'border-slate-200'];

    if (mode === 'learn') {
        btnLearn.classList.add(...activeClasses);
        btnLearn.classList.remove(...inactiveClasses);
        btnTest.classList.add(...inactiveClasses);
        btnTest.classList.remove(...activeClasses);
    } else if (mode === 'test') {
        btnTest.classList.add(...activeClasses);
        btnTest.classList.remove(...inactiveClasses);
        btnLearn.classList.add(...inactiveClasses);
        btnLearn.classList.remove(...activeClasses);
    } else {
        // Home or Result mode
        btnLearn.classList.remove(...activeClasses);
        btnLearn.classList.add(...inactiveClasses);
        btnTest.classList.remove(...activeClasses);
        btnTest.classList.add(...inactiveClasses);
    }
}

function normalize(str) {
    if (!str) return "";
    let clean = str.replace(/\(.*?\)/g, ''); // Remove parentheses
    return clean.toLowerCase().trim();
}

/**
 * Check answer logic
 */
function checkAnswer(userAnswer, correctMeaning) {
    const normUser = normalize(userAnswer);
    const meanings = correctMeaning.split(',').map(m => normalize(m));
    return meanings.includes(normUser);
}

/**
 * Fisher-Yates Shuffle
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * START TEST Logic
 */
function startNewTest(onlyIncorrect = false) {
    let pool = currentState.vocab;

    if (onlyIncorrect && currentState.incorrectWords.length > 0) {
        pool = currentState.vocab.filter(w => currentState.incorrectWords.includes(w.id));
    }

    const shuffledPool = shuffle([...pool]);
    
    // Use preferred size, capped by available words
    let requestedSize = currentState.preferredTestSize;
    if (requestedSize === 'all') requestedSize = shuffledPool.length;
    
    const testSize = Math.min(requestedSize, shuffledPool.length);
    const testSet = shuffledPool.slice(0, testSize);

    currentState.testQuestions = testSet.map(word => generateQuestion(word, pool));
    currentState.userAnswers = new Array(testSize).fill(null);
    currentState.currentIndex = 0;
    currentState.mode = 'test';

    render();
}

function generateQuestion(word, pool) {
    const types = ['written', 'mcq', 'matching'];
    const type = types[Math.floor(Math.random() * types.length)];
    const direction = Math.random() > 0.5 ? 'en-vi' : 'vi-en';

    const q = {
        wordId: word.id,
        type: type,
        direction: direction,
        prompt: direction === 'en-vi' ? word.en : word.vi,
        correct: direction === 'en-vi' ? word.vi : word.en
    };

    if (type === 'mcq') {
        let distractors = pool
            .filter(w => w.id !== word.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => direction === 'en-vi' ? w.vi : w.en);

        q.options = shuffle([q.correct, ...distractors]);
    }

    if (type === 'matching') {
        q.prompt = "Ghép các cặp từ tương ứng";
        // For matching, we take 5 pairs (including current one)
        let others = pool
            .filter(w => w.id !== word.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        const set = [word, ...others];
        q.pairs = set.map(w => ({
            id: w.id,
            left: direction === 'en-vi' ? w.en : w.vi,
            right: direction === 'en-vi' ? w.vi : w.en
        }));

        // Pre-shuffle columns for the UI
        q.shuffledLeft = shuffle(q.pairs.map(p => ({id: p.id, val: p.left})));
        q.shuffledRight = shuffle(q.pairs.map(p => ({id: p.id, val: p.right})));
    }

    return q;
}

/**
 * RENDER Logic
 */
function render() {
    const mainContent = document.getElementById('main-content');
    
    // Apply animation class
    mainContent.classList.remove('animate-fade-in');
    void mainContent.offsetWidth; // Trigger reflow
    mainContent.classList.add('animate-fade-in');

    if (currentState.mode === 'learn') {
        renderLearnMode(mainContent);
    } else if (currentState.mode === 'test') {
        renderTestMode(mainContent);
    } else if (currentState.mode === 'result') {
        renderResultMode(mainContent);
    } else {
        renderHome(mainContent);
    }

    // After render hooks
    if (currentState.mode === 'test') {
        focusInput();
    } else if (currentState.mode === 'home' && currentState.history.length > 0) {
        setTimeout(renderChart, 50);
    }
}

let historyChartInstance = null;
function renderChart() {
    const canvas = document.getElementById('historyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Reverse to show oldest to newest left to right
    const data = [...currentState.history].slice(0, 10).reverse(); 
    
    if (historyChartInstance) historyChartInstance.destroy();
    
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? '#334155' : '#f1f5f9';
    
    historyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: 'Điểm số (%)',
                data: data.map(d => d.score),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                x: { ticks: { color: textColor }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderHome(container) {
    container.innerHTML = `
        <div class="flex flex-col gap-6">
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 text-center glassmorphism">
                <h2 class="text-3xl font-black text-slate-700 dark:text-slate-100">Sẵn sàng chưa?</h2>
                <p class="text-slate-500 dark:text-slate-400 mt-2 mb-6 font-medium">Chọn số lượng câu hỏi để bắt đầu bài kiểm tra.</p>
                
                <div class="flex justify-center gap-3 mb-8 flex-wrap">
                    ${[10, 20, 50, 'all'].map(size => `
                        <button onclick="setTestSize('${size}')" 
                            class="px-5 py-2.5 rounded-2xl font-bold transition-all border-2 
                            ${currentState.preferredTestSize == size 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'}">
                            ${size === 'all' ? '<i class="fa-solid fa-infinity"></i> Tất cả' : size}
                        </button>
                    `).join('')}
                </div>

                <div class="flex justify-center gap-4">
                     <button onclick="switchMode('learn')" class="px-8 py-3 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-600 rounded-2xl font-bold shadow-sm hover:scale-105 transition"><i class="fa-solid fa-book-open"></i> Học từ mới</button>
                     <button onclick="startNewTest()" class="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-105 hover:bg-emerald-600 transition"><i class="fa-solid fa-play"></i> Bắt đầu Test</button>
                </div>
            </div>

            <!-- Import Vocab UI -->
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 glassmorphism">
                <h3 class="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2"><i class="fa-solid fa-database text-indigo-500"></i> Quản lý từ vựng</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Copy 2 cột (Tiếng Anh, Tiếng Việt) từ Excel/Sheets và dán vào ô bên dưới để thêm:</p>
                <textarea id="vocab-import-input" class="w-full h-32 p-4 border-2 border-slate-100 dark:border-slate-600 bg-transparent dark:text-white rounded-2xl mb-4 focus:border-indigo-500 outline-none transition resize-y" placeholder="Ví dụ:&#10;apple&#9;quả táo&#10;banana&#9;quả chuối"></textarea>
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div class="flex gap-2">
                        <button onclick="window.resetDefaultVocab()" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-red-100 dark:border-red-800/50" title="Khôi phục mặc định"><i class="fa-solid fa-rotate-left"></i> Khôi phục</button>
                        <button onclick="window.exportVocabToExcel()" class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-emerald-100 dark:border-emerald-800/50" title="Xuất ra Excel"><i class="fa-solid fa-file-excel"></i> Xuất Excel</button>
                    </div>
                    <button onclick="window.importVocab()" class="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition shadow-md ml-auto"><i class="fa-solid fa-plus"></i> Thêm (Insert)</button>
                </div>
                <span id="import-msg" class="text-sm font-bold text-red-500 block mt-2"></span>
            </div>

            ${currentState.incorrectWords.length > 0 ? `
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-700/50 p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center justify-between glassmorphism">
                    <div>
                        <h4 class="font-bold text-amber-800 dark:text-amber-400 text-lg"><i class="fa-solid fa-triangle-exclamation"></i> Bạn có ${currentState.incorrectWords.length} từ cần ôn lại!</h4>
                        <p class="text-amber-700 dark:text-amber-500 text-sm">Đây là những từ bạn đã trả lời sai ở bài test trước.</p>
                    </div>
                    <div class="flex gap-3 w-full md:w-auto">
                        <button onclick="window.clearReviewHistory()" class="flex-1 md:flex-none bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-bold shadow hover:scale-105 transition"><i class="fa-solid fa-check"></i> Đã nhớ</button>
                        <button onclick="startNewTest(true)" class="flex-1 md:flex-none bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition"><i class="fa-solid fa-bolt"></i> Ôn ngay</button>
                    </div>
                </div>
            ` : ''}

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 glassmorphism">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-lg text-slate-700 dark:text-slate-200"><i class="fa-solid fa-chart-line text-indigo-500"></i> Thống kê học tập</h3>
                    <button onclick="window.clearRecentHistory()" class="text-xs font-bold text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-trash-can"></i> Xóa lịch sử</button>
                </div>
                ${currentState.history.length === 0 ? '<p class="text-slate-400 italic text-center py-8">Chưa có dữ liệu bài test nào.</p>' : `
                    <div class="h-64 w-full">
                        <canvas id="historyChart"></canvas>
                    </div>
                `}
            </div>
        </div>
    `;
    
    // Trigger mascot warn if there are words to review
    if (currentState.incorrectWords.length > 0) {
        setTimeout(() => triggerMascot('warn', 'Ôn bài đi bạn ơi!'), 500);
    }
}

function renderLearnMode(container) {
    const word = currentState.vocab[currentState.currentIndex];
    container.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-8">
                <button onclick="switchMode('home')" class="text-slate-400 hover:text-indigo-600 font-bold transition flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Trang chủ
                </button>
                <div class="text-slate-500 font-medium bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm">
                    Từ ${currentState.currentIndex + 1} / ${currentState.vocab.length}
                </div>
                <div class="w-20"></div> <!-- Spacer for symmetry -->
            </div>

            <div id="flashcard" onclick="flipCard()" class="perspective-1000 w-full max-w-lg md:max-w-2xl h-80 md:h-96 cursor-pointer relative z-10 group">
                <div class="relative w-full h-full duration-500 preserve-3d transition-transform ${currentState.isFlipped ? 'rotate-y-180' : ''}">
                    <div class="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border-2 border-indigo-50 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center glassmorphism group-hover:-translate-y-2 transition-transform">
                        <h3 class="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-100 leading-tight">${word.en}</h3>
                        <div class="absolute bottom-6 text-xs text-slate-400 uppercase tracking-widest font-bold"><i class="fa-solid fa-hand-pointer"></i> Lật thẻ</div>
                    </div>
                    <div class="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center rotate-y-180">
                        <h3 class="text-3xl md:text-5xl font-bold text-white leading-relaxed">${word.vi}</h3>
                        <div class="absolute bottom-6 text-xs text-indigo-200 uppercase tracking-widest font-bold">${word.en}</div>
                    </div>
                </div>
            </div>

            <div class="flex gap-6 mt-12">
                <button onclick="prevWord()" class="p-5 bg-white rounded-2xl shadow hover:bg-slate-50 transition border border-slate-200 active:scale-90">
                    <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button onclick="nextWord()" class="p-5 bg-indigo-600 rounded-2xl shadow-xl hover:bg-indigo-700 transition active:scale-90">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    `;
}

function renderTestMode(container) {
    const q = currentState.testQuestions[currentState.currentIndex];

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 glassmorphism relative overflow-hidden">
            <!-- Progress Bar Background (Subtle) -->
            <div class="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300" style="width: ${(currentState.currentIndex / currentState.testQuestions.length) * 100}%"></div>
            
            <div class="flex justify-between items-center mb-8 relative z-10">
                <button onclick="switchMode('home')" class="text-slate-400 hover:text-indigo-600 font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Trang chủ
                </button>
                <span class="px-4 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-bold shadow-inner">
                    <i class="fa-solid fa-flag-checkered text-indigo-500"></i> ${currentState.currentIndex + 1} / ${currentState.testQuestions.length}
                </span>
            </div>

            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">${q.prompt}</h3>

            <div id="question-area" class="space-y-4">
                ${renderQuestionType(q)}
            </div>

            <div class="mt-12 flex justify-between items-center">
                <button onclick="prevQuestion()" class="text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-0 transition" ${currentState.currentIndex === 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i> Quay lại</button>
                <button onclick="nextQuestion()" class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none transition">
                    ${currentState.currentIndex === currentState.testQuestions.length - 1 ? '<i class="fa-solid fa-paper-plane"></i> Nộp bài' : 'Tiếp theo <i class="fa-solid fa-chevron-right"></i>'}
                </button>
            </div>
        </div>
    `;
}

function renderQuestionType(q) {
    if (q.type === 'written') {
        return `
            <input type="text" id="written-answer" placeholder="Nhập đáp án..." 
                class="w-full p-4 text-center text-xl font-semibold border-2 border-slate-200 dark:border-slate-600 bg-transparent dark:text-white rounded-2xl focus:border-indigo-500 outline-none transition"
                value="${currentState.userAnswers[currentState.currentIndex] || ''}"
                oninput="saveAnswer(this.value)"
                autofocus>
        `;
    } else if (q.type === 'mcq') {
        return q.options.map(opt => `
            <button onclick="saveAnswer('${opt}')" 
                class="w-full p-4 text-left text-lg font-medium border-2 rounded-2xl transition dark:text-slate-200 
                ${currentState.userAnswers[currentState.currentIndex] === opt 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'}">
                ${opt}
            </button>
        `).join('');
    } else if (q.type === 'matching') {
        const ms = currentState.matchingState;
        return `
            <div class="grid grid-cols-2 gap-4 mt-4">
                <!-- Cột Trái -->
                <div class="space-y-3">
                    ${q.shuffledLeft.map(item => {
                        const isSelected = ms.selected?.side === 'left' && ms.selected?.id === item.id;
                        const isMatched = ms.matchedIds.includes(item.id);
                        const isError = ms.errorId === item.id;
                        return `
                            <div onclick="handleMatchingClick('left', '${item.val}', ${item.id})" 
                                class="matching-card border-2 border-slate-100 rounded-2xl bg-white shadow-sm
                                ${isSelected ? 'selected' : ''} 
                                ${isMatched ? 'matched' : ''} 
                                ${isError ? 'error' : ''}">
                                ${item.val}
                            </div>
                        `;
                    }).join('')}
                </div>
                <!-- Cột Phải -->
                <div class="space-y-3">
                    ${q.shuffledRight.map(item => {
                        const isSelected = ms.selected?.side === 'right' && ms.selected?.id === item.id;
                        const isMatched = ms.matchedIds.includes(item.id);
                        const isError = ms.errorId === item.id;
                        return `
                            <div onclick="handleMatchingClick('right', '${item.val}', ${item.id})" 
                                class="matching-card border-2 border-slate-100 rounded-2xl bg-white shadow-sm
                                ${isSelected ? 'selected' : ''} 
                                ${isMatched ? 'matched' : ''} 
                                ${isError ? 'error' : ''}">
                                ${item.val}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ${ms.matchedIds.length === 5 ? `
                <div class="mt-6 text-center animate-bounce">
                    <span class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">✨ Đã ghép xong! Bấm "Tiếp theo"</span>
                </div>
            ` : ''}
        `;
    }
}

/**
 * MATCHING LOGIC
 */
function handleMatchingClick(side, val, id) {
    const ms = currentState.matchingState;
    
    // Nếu đã matched rồi thì thôi
    if (ms.matchedIds.includes(id)) return;

    if (!ms.selected) {
        // Chưa chọn gì cả
        ms.selected = { side, val, id };
    } else if (ms.selected.side === side) {
        // Chọn lại cùng một bên -> Đổi selection
        ms.selected = { side, val, id };
    } else {
        // Chọn khác bên -> Kiểm tra match
        if (ms.selected.id === id) {
            // Khớp!
            ms.matchedIds.push(id);
            ms.selected = null;
            
            // Nếu đã ghép xong tất cả 5 cặp
            if (ms.matchedIds.length === 5) {
                saveAnswer(true); // Đánh dấu là đúng
                triggerMascot('cheer', 'Giỏi quá!');
            }
        } else {
            // Sai!
            triggerMascot('error', 'Sai rồi!');
            const firstId = ms.selected.id;
            const secondId = id;
            ms.errorId = firstId; // Hiệu ứng rung cho cả 2? Ở đây demo rung cái đầu
            ms.selected = null;
            
            setTimeout(() => {
                ms.errorId = null;
                render();
            }, 400);
        }
    }
    render();
}

/**
 * ACTIONS
 */
function saveAnswer(val) {
    currentState.userAnswers[currentState.currentIndex] = val;
    if (currentState.testQuestions[currentState.currentIndex].type !== 'written') {
        render(); // Re-render for MCQ/Matching to show selection
    }
}

// Focus handling for written inputs
function focusInput() {
    const input = document.getElementById('written-answer');
    if (input) {
        input.focus();
        // Move cursor to end
        const val = input.value;
        input.value = '';
        input.value = val;
    }
}

function nextQuestion() {
    // Reset matching state for next question
    currentState.matchingState = { selected: null, matchedIds: [], errorId: null };
    
    if (currentState.currentIndex < currentState.testQuestions.length - 1) {
        currentState.currentIndex++;
        render();
    } else {
        submitTest();
    }
}

function prevQuestion() {
    if (currentState.currentIndex > 0) {
        currentState.currentIndex--;
        render();
    }
}

function submitTest() {
    let score = 0;
    const missedIds = [];

    currentState.testQuestions.forEach((q, idx) => {
        const userAns = currentState.userAnswers[idx];
        let isCorrect = false;

        if (q.type === 'matching') {
            isCorrect = userAns === true;
        } else {
            isCorrect = checkAnswer(userAns || "", q.correct);
        }

        if (isCorrect) {
            score++;
        } else {
            missedIds.push(q.wordId);
        }
    });

    const finalPercent = Math.round((score / currentState.testQuestions.length) * 100);

    // Save to history
    const entry = {
        date: new Date().toLocaleDateString('vi-VN'),
        score: finalPercent
    };
    currentState.history.unshift(entry);
    localStorage.setItem('vocab_history', JSON.stringify(currentState.history.slice(0, 10)));

    // Save missed words
    currentState.incorrectWords = [...new Set([...missedIds])];
    localStorage.setItem('last_incorrect_ids', JSON.stringify(currentState.incorrectWords));

    currentState.mode = 'result';
    currentState.finalScore = finalPercent;
    render();
}

function renderResultMode(container) {
    // Trigger confetti if pass
    if (currentState.finalScore >= 50 && window.confetti) {
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
            });
            triggerMascot('cheer', 'Tuyệt vời!');
        }, 300);
    } else if (currentState.finalScore < 50) {
        setTimeout(() => triggerMascot('warn', 'Cần cố gắng hơn!'), 300);
    }

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 text-center glassmorphism">
            <div class="mb-6 animate-bounce">
                <span class="text-7xl drop-shadow-lg">${currentState.finalScore >= 80 ? '🏆' : currentState.finalScore >= 50 ? '👏' : '📚'}</span>
            </div>
            <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2 drop-shadow-sm">${currentState.finalScore}%</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-10 text-lg">Bạn đã trả lời đúng <span class="font-bold text-slate-700 dark:text-slate-200">${Math.round(currentState.finalScore * currentState.testQuestions.length / 100)} / ${currentState.testQuestions.length}</span> câu.</p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="switchMode('home')" class="py-4 px-8 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:scale-105 transition"><i class="fa-solid fa-house"></i> Về trang chủ</button>
                <button onclick="startNewTest()" class="py-4 px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-bold hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none transition"><i class="fa-solid fa-rotate-right"></i> Làm lại bài khác</button>
            </div>
        </div>
    `;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (currentState.mode === 'learn') {
        if (e.key === 'ArrowRight') nextWord();
        if (e.key === 'ArrowLeft') prevWord();
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            flipCard();
        }
    }
    if (currentState.mode === 'test' && e.key === 'Enter') {
        nextQuestion();
    }
});

// Helper for learn mode
function flipCard() { currentState.isFlipped = !currentState.isFlipped; render(); }
function nextWord() { if (currentState.currentIndex < currentState.vocab.length - 1) { currentState.currentIndex++; currentState.isFlipped = false; render(); } }
function prevWord() { if (currentState.currentIndex > 0) { currentState.currentIndex--; currentState.isFlipped = false; render(); } }

function setTestSize(size) {
    currentState.preferredTestSize = size === 'all' ? 'all' : parseInt(size);
    render();
}

function clearReviewHistory() {
    console.log("Attempting to clear review history...");
    if (confirm('Bạn có chắc muốn xóa lịch sử ôn tập không?')) {
        currentState.incorrectWords = [];
        localStorage.removeItem('last_incorrect_ids');
        console.log("History cleared. Re-rendering...");
        render();
    }
}

function clearRecentHistory() {
    console.log("Attempting to clear recent history...");
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử bài test không?')) {
        currentState.history = [];
        localStorage.removeItem('vocab_history');
        console.log("Recent history cleared. Re-rendering...");
        render();
    }
}

function importVocab() {
    const input = document.getElementById('vocab-import-input');
    const msg = document.getElementById('import-msg');
    if (!input || !input.value.trim()) return;

    const rawData = input.value;
    const lines = rawData.split('\n');
    
    let existingCustom = [];
    try {
        const saved = localStorage.getItem('custom_vocab');
        if (saved) existingCustom = JSON.parse(saved);
    } catch(e) {}

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Tạo tập hợp các từ đã xử lý trong cùng 1 lần paste để tránh trùng lặp nội bộ
    const processedThisTime = new Set();
    
    for (let line of lines) {
        if (!line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length >= 2) {
            const enWord = parts[0].trim();
            const viWord = parts[1].trim();
            const enLower = enWord.toLowerCase();
            
            // Bỏ qua nếu từ tiếng Anh trùng lặp trong cùng khối dữ liệu paste
            if (processedThisTime.has(enLower)) {
                skippedCount++;
                continue;
            }
            processedThisTime.add(enLower);
            
            // Tìm xem từ đã có trong currentState chưa
            const existingWord = currentState.vocab.find(w => w.en.toLowerCase().trim() === enLower);
            
            if (existingWord) {
                // Kiểm tra xem nghĩa mới đã có trong nghĩa cũ chưa
                const currentMeanings = existingWord.vi.split(',').map(m => normalize(m));
                const inputMeanings = viWord.split(',').map(m => m.trim());
                
                // Lọc những nghĩa thực sự mới
                const newMeanings = inputMeanings.filter(nm => !currentMeanings.includes(normalize(nm)));
                
                if (newMeanings.length > 0) {
                    // Cập nhật nghĩa
                    const finalVi = existingWord.vi + ', ' + newMeanings.join(', ');
                    
                    // Cập nhật vào existingCustom
                    const customIndex = existingCustom.findIndex(w => w.en.toLowerCase().trim() === enLower);
                    if (customIndex !== -1) {
                        existingCustom[customIndex].vi = finalVi;
                    } else {
                        // Từ gốc ở VOCAB_DATA, lưu vào custom_vocab để override
                        existingCustom.push({ en: existingWord.en, vi: finalVi });
                    }
                    
                    // Tạm cập nhật vào currentState để xử lý liền mạch
                    existingWord.vi = finalVi;
                    updatedCount++;
                } else {
                    skippedCount++;
                }
            } else {
                // Chưa tồn tại -> Thêm mới
                existingCustom.push({ en: enWord, vi: viWord });
                // Cập nhật tạm để chống trùng lặp
                currentState.vocab.push({ en: enWord, vi: viWord, id: -1 });
                addedCount++;
            }
        }
    }

    if (addedCount > 0 || updatedCount > 0) {
        localStorage.setItem('custom_vocab', JSON.stringify(existingCustom));
        input.value = '';
        init();
        render();
        alert(`Kết quả import:\n- Thêm mới: ${addedCount} từ\n- Cập nhật nghĩa: ${updatedCount} từ\n- Đã có sẵn (bỏ qua): ${skippedCount} từ`);
    } else {
        if (skippedCount > 0) {
            input.value = '';
            alert(`Kết quả import:\n- Bỏ qua: ${skippedCount} từ (đã có sẵn và không có nghĩa mới).`);
        } else if (msg) {
            msg.textContent = "Không tìm thấy dữ liệu hợp lệ (cần 2 cột phân cách bằng Tab).";
            setTimeout(() => msg.textContent = "", 3000);
        }
    }
}

function resetDefaultVocab() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ từ vựng đã thêm/chỉnh sửa và khôi phục về mặc định? Hành động này không thể hoàn tác!")) {
        localStorage.removeItem('custom_vocab');
        init();
        render();
        alert("Đã khôi phục từ vựng về trạng thái mặc định!");
    }
}

function exportVocabToExcel() {
    if (currentState.vocab.length === 0) {
        alert("Không có dữ liệu từ vựng để xuất!");
        return;
    }
    
    // Create TSV content
    const header = "Tiếng Anh\tTiếng Việt\n";
    const rows = currentState.vocab.map(w => `${w.en}\t${w.vi}`).join('\n');
    const tsvContent = header + rows;
    
    // Create a Blob and trigger download
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "tu_vung_hien_tai.tsv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Ensure global access
window.clearReviewHistory = clearReviewHistory;
window.clearRecentHistory = clearRecentHistory;
window.importVocab = importVocab;
window.resetDefaultVocab = resetDefaultVocab;
window.exportVocabToExcel = exportVocabToExcel;

window.onload = () => { 
    init(); 
    render(); 
    updateNavButtons(currentState.mode);
};
