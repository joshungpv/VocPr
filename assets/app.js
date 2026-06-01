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
    knownWords: [], // List of normalized word strings (t1 lowercase) marked as memorized

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
    preferredTestSize: 20,

    // Multilingual Config
    langConfig: {
        l1: 'English',
        l2: 'Vietnamese',
        uiLang: 'vi', // 'en' | 'vi'
        ignoreBase: false,
        skipKnown: true, // Default: skip known words when studying flashcards
        autoPronounce: false, // Default: don't auto-pronounce to avoid unexpected sound
        pendingL1: '',
        pendingL2: ''
    },

    // Import Review State
    pendingVocab: [], // [{ t1, t2, status: 'new' | 'update' | 'skip' }]
    reviewDisplayCount: 50,

    // Adaptive Viewport Mode
    viewportMode: 'web' // 'web' | 'mobile'
};

const I18N_STRINGS = {
    en: {
        ready: "Ready?",
        choose_test_size: "Choose the number of questions to start the test.",
        all: "All",
        learn_new: "Learn New",
        start_test: "Start Test",
        manage_vocab: "Manage Vocabulary",
        import_desc: "Enter language names and paste 2 columns from Excel/Sheets:",
        lang_1: "Language 1",
        lang_2: "Language 2",
        export_excel: "Export Excel",
        add_insert: "Add (Insert)",
        review_count: "You have {n} words to review!",
        review_desc: "These are words you answered incorrectly in the previous test.",
        memorized: "Memorized",
        review_now: "Review Now",
        learning_stats: "Learning Statistics",
        clear_history: "Clear History",
        no_history: "No test data available yet.",
        score_percent: "Score (%)",
        home: "Home",
        word_progress: "Word {n} / {m}",
        flip_to: "Flip to {lang}",
        back: "Back",
        next: "Next",
        submit: "Submit",
        matching_prompt: "Match the corresponding pairs",
        enter_answer: "Enter answer...",
        matching_done: "✨ Matching complete! Click \"Next\"",
        mascot_cheer: "Great job!",
        mascot_error: "Wrong!",
        mascot_warn: "Time to study, friend!",
        go_home: "Go Home",
        try_again: "Try Again",
        result_great: "Excellent!",
        result_try_harder: "Need to try harder!",
        result_desc: "You answered correctly {n} / {m} questions.",

        // Import Review
        import_review_title: "Review Changes",
        import_review_desc: "Please review the data before final import. {n} words total.",
        col_word: "Word",
        col_meaning: "Meaning",
        col_status: "Status",
        status_new: "New",
        status_update: "Update",
        status_skip: "Skip",
        confirm: "Confirm Import",
        cancel: "Cancel",

        // Factory Reset
        factory_reset: "Factory Reset",
        reset_confirm: "WARNING: This will delete ALL custom vocabulary, history, and settings. The app will return to its initial default state (with sample vocabulary). Proceed?",
        ignore_base_vocab: "Ignore default vocabulary",
        no_vocab_warning: "No vocabulary found. Please add new words or check your settings.",
        no_vocab_test_warning: "No valid vocabulary to start the test.",
        import_placeholder: "Example:\napple: quả táo\nbanana - quả chuối\ncherry | quả anh đào",
        import_help: "Supported formats: Tab, Colon (:), Dash (-), Pipe (|)",

        // Flashcard known words keys
        stats_known: "Memorized",
        skip_known_vocab: "Skip memorized words while learning",
        reset_known: "Reset memorized",
        reset_known_confirm: "Are you sure you want to relearn all words marked as 'Memorized'?",
        mark_known: "I know this word",
        mascot_cheer_known: "Excellent! One less word to study!",
        learn_complete_all: "Wow! You have mastered the entire vocabulary pool! Let's take a test! 🎉",
        auto_pronounce: "Auto-pronounce root word while learning"
    },
    vi: {
        ready: "Sẵn sàng chưa?",
        choose_test_size: "Chọn số lượng câu hỏi để bắt đầu bài kiểm tra.",
        all: "Tất cả",
        learn_new: "Học từ mới",
        start_test: "Bắt đầu Test",
        manage_vocab: "Quản lý từ vựng",
        import_desc: "Nhập tên ngôn ngữ và dán 2 cột từ Excel/Sheets:",
        lang_1: "Ngôn ngữ 1",
        lang_2: "Ngôn ngữ 2",
        export_excel: "Xuất Excel",
        add_insert: "Thêm (Insert)",
        review_count: "Bạn có {n} từ cần ôn lại!",
        review_desc: "Đây là những từ bạn đã trả lời sai ở bài test trước.",
        memorized: "Đã nhớ",
        review_now: "Ôn ngay",
        learning_stats: "Thống kê học tập",
        clear_history: "Xóa lịch sử",
        no_history: "Chưa có dữ liệu bài test nào.",
        score_percent: "Điểm số (%)",
        home: "Trang chủ",
        word_progress: "Từ {n} / {m}",
        flip_to: "Lật sang {lang}",
        back: "Quay lại",
        next: "Tiếp theo",
        submit: "Nộp bài",
        matching_prompt: "Ghép các cặp từ tương ứng",
        enter_answer: "Nhập đáp án...",
        matching_done: "✨ Đã ghép xong! Bấm \"Tiếp theo\"",
        mascot_cheer: "Giỏi quá!",
        mascot_error: "Sai rồi!",
        mascot_warn: "Ôn bài đi bạn ơi!",
        go_home: "Về trang chủ",
        try_again: "Làm lại bài khác",
        result_great: "Tuyệt vời!",
        result_try_harder: "Cần cố gắng hơn!",
        result_desc: "Bạn đã trả lời đúng {n} / {m} câu.",

        // Import Review
        import_review_title: "Kiểm tra dữ liệu",
        import_review_desc: "Vui lòng xem lại dữ liệu trước khi lưu chính thức. Tổng cộng {n} dòng.",
        col_word: "Từ gốc",
        col_meaning: "Nghĩa",
        col_status: "Trạng thái",
        status_new: "Mới",
        status_update: "Cập nhật",
        status_skip: "Bỏ qua",
        confirm: "Xác nhận Lưu",
        cancel: "Hủy bỏ",

        // Factory Reset
        factory_reset: "Xóa sạch dữ liệu (Reset)",
        reset_confirm: "CẢNH BÁO: Hành động này sẽ xóa TOÀN BỘ từ vựng bạn đã thêm, lịch sử và cài đặt. Ứng dụng sẽ quay về trạng thái mặc định ban đầu (có từ vựng mẫu). Bạn có chắc chắn không?",
        ignore_base_vocab: "Bỏ qua từ vựng mặc định",
        no_vocab_warning: "Không có từ vựng nào để học. Vui lòng thêm từ mới hoặc kiểm tra cài đặt.",
        no_vocab_test_warning: "Không có từ vựng nào hợp lệ để bắt đầu bài kiểm tra.",
        import_placeholder: "Ví dụ:\napple: quả táo\nbanana - quả chuối\ncherry | quả anh đào",
        import_help: "Định dạng hỗ trợ: Tab, Dấu hai chấm (:), Gạch ngang (-), Dấu gạch đứng (|)",

        // Flashcard known words keys
        stats_known: "Đã thuộc",
        skip_known_vocab: "Bỏ qua từ vựng đã nhớ khi học",
        reset_known: "Reset từ đã thuộc",
        reset_known_confirm: "Bạn có chắc chắn muốn học lại từ đầu tất cả các từ đã đánh dấu 'Đã thuộc' không?",
        mark_known: "Đã thuộc từ này",
        mascot_cheer_known: "Xuất sắc! Bớt đi một từ cần học rồi nhé!",
        learn_complete_all: "Wow! Bạn đã chinh phục toàn bộ kho từ vựng này rồi! Hãy bắt đầu làm bài test nhé! 🎉",
        auto_pronounce: "Tự động phát âm từ gốc khi học"
    }
};

/**
 * i18n Translation Helper
 */
function t(key, params = {}) {
    const lang = currentState.langConfig.uiLang || 'vi';
    let str = I18N_STRINGS[lang][key] || key;

    // Simple param replacement
    for (const p in params) {
        str = str.replace(`{${p}}`, params[p]);
    }
    return str;
}

/**
 * Toggle UI Language
 */
function toggleUILang() {
    const current = currentState.langConfig.uiLang || 'vi';
    const next = current === 'vi' ? 'en' : 'vi';
    currentState.langConfig.uiLang = next;

    // Persist
    localStorage.setItem('vocab_lang_config', JSON.stringify(currentState.langConfig));

    // Update UI button text if it exists (in index.html)
    const btnLang = document.getElementById('btn-lang');
    if (btnLang) btnLang.textContent = next.toUpperCase();

    render();
}
window.toggleUILang = toggleUILang;

/**
 * Toggle between Web Mode and Mobile Mode
 */
function toggleViewportMode() {
    const next = currentState.viewportMode === 'web' ? 'mobile' : 'web';
    currentState.viewportMode = next;

    // Persist
    localStorage.setItem('vocab_viewport_mode', next);

    applyViewportMode(next);
}
window.toggleViewportMode = toggleViewportMode;

/**
 * Apply viewport mode to DOM and Meta
 */
function applyViewportMode(mode) {
    const isMobile = mode === 'mobile';

    // Update Body Class
    if (isMobile) {
        document.body.classList.add('is-mobile-mode');
    } else {
        document.body.classList.remove('is-mobile-mode');
    }

    // Update Meta Viewport
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        if (isMobile) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        } else {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
    }

    // Update Button Icon
    const btnViewport = document.getElementById('btn-viewport-mode');
    if (btnViewport) {
        const icon = btnViewport.querySelector('i');
        if (icon) {
            icon.className = isMobile ? 'fa-solid fa-mobile-screen-button text-indigo-600' : 'fa-solid fa-globe';
        }
    }
}

/**
 * Helper to migrate legacy en/vi objects to t1/t2
 */
function migrateLegacyData(item) {
    if (item.en !== undefined && item.t1 === undefined) {
        const newItem = {
            ...item,
            t1: item.en,
            t2: item.vi
        };
        delete newItem.en;
        delete newItem.vi;
        return newItem;
    }
    return item;
}

/**
 * Initialize the app
 */
function init() {
    if (window.VOCAB_DATA) {
        // Load Language Config
        const savedConfig = localStorage.getItem('vocab_lang_config');
        if (savedConfig) {
            try {
                // Merge with default config to preserve new keys like ignoreBase
                currentState.langConfig = { ...currentState.langConfig, ...JSON.parse(savedConfig) };
                // Ensure uiLang exists
                if (!currentState.langConfig.uiLang) {
                    const isVi = navigator.language.startsWith('vi');
                    currentState.langConfig.uiLang = isVi ? 'vi' : 'en';
                }
            } catch (e) {
                console.error("Failed to parse lang config", e);
            }
        } else {
            // New user: detect browser language
            const isVi = navigator.language.startsWith('vi');
            currentState.langConfig.uiLang = isVi ? 'vi' : 'en';
        }

        // Deduplicate and merge VOCAB_DATA with custom_vocab
        const vocabMap = new Map();

        // Add base vocab first if not ignored
        if (!currentState.langConfig.ignoreBase) {
            window.VOCAB_DATA.forEach(item => {
                const migrated = migrateLegacyData(item);
                vocabMap.set(migrated.t1.toLowerCase().trim(), migrated);
            });
        }

        // Load custom vocab and override/merge
        const customVocabRaw = localStorage.getItem('custom_vocab');
        if (customVocabRaw) {
            try {
                let customVocab = JSON.parse(customVocabRaw);

                // RUNTIME MIGRATION
                let needsReSave = false;
                customVocab = customVocab.map(item => {
                    if (item.en && !item.t1) {
                        needsReSave = true;
                        return migrateLegacyData(item);
                    }
                    return item;
                });

                if (needsReSave) {
                    localStorage.setItem('custom_vocab', JSON.stringify(customVocab));
                    console.log("Custom vocab migrated to new schema.");
                }

                customVocab.forEach(item => {
                    vocabMap.set(item.t1.toLowerCase().trim(), { ...item });
                });
            } catch (e) {
                console.error("Failed to parse/migrate custom_vocab", e);
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

        // Load known words from localStorage
        const savedKnown = localStorage.getItem('vocab_known_words');
        if (savedKnown) {
            try {
                currentState.knownWords = JSON.parse(savedKnown);
            } catch (e) {
                console.error("Failed to parse saved known words", e);
                currentState.knownWords = [];
            }
        } else {
            currentState.knownWords = [];
        }

        // Init Dark Mode
        if (localStorage.getItem('vocab_theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }

        // Init Streak
        updateStreak();

        // Init UI Lang Button
        const btnLang = document.getElementById('btn-lang');
        if (btnLang) btnLang.textContent = (currentState.langConfig.uiLang || 'vi').toUpperCase();

        // Init Viewport Mode
        const savedViewport = localStorage.getItem('vocab_viewport_mode');
        if (savedViewport) {
            currentState.viewportMode = savedViewport;
        }
        applyViewportMode(currentState.viewportMode);

        // Thiết lập tính năng kéo thả cho Mascot
        setupMascotDraggable();
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

function factoryReset() {
    if (confirm(t('reset_confirm'))) {
        localStorage.clear();
        // Clear in-memory state to prevent leakage before reload completes
        currentState.vocab = [];
        currentState.history = [];
        currentState.incorrectWords = [];
        currentState.knownWords = [];

        // Force immediate clean reload
        window.location.href = window.location.pathname;
    }
}
window.factoryReset = factoryReset;

function toggleIgnoreBase(checked) {
    currentState.langConfig.ignoreBase = checked;
    localStorage.setItem('vocab_lang_config', JSON.stringify(currentState.langConfig));
    // Re-initialize to reflect changes without full reload if possible, 
    // but reload is safer to ensure all state is consistent
    window.location.reload();
}
window.toggleIgnoreBase = toggleIgnoreBase;

function saveKnownWords() {
    localStorage.setItem('vocab_known_words', JSON.stringify(currentState.knownWords));
}

function toggleSkipKnown(checked) {
    currentState.langConfig.skipKnown = checked;
    localStorage.setItem('vocab_lang_config', JSON.stringify(currentState.langConfig));
    render();
}
window.toggleSkipKnown = toggleSkipKnown;

function resetKnownWords() {
    if (confirm(t('reset_known_confirm'))) {
        currentState.knownWords = [];
        localStorage.removeItem('vocab_known_words');
        triggerMascot('cheer', t('mascot_cheer'));
        render();
    }
}
window.resetKnownWords = resetKnownWords;

function getActiveLearnVocab() {
    if (currentState.langConfig.skipKnown) {
        return currentState.vocab.filter(w => !currentState.knownWords.includes(w.t1.toLowerCase().trim()));
    }
    return currentState.vocab;
}

function markAsKnown(wordT1) {
    const normT1 = wordT1.toLowerCase().trim();
    if (!currentState.knownWords.includes(normT1)) {
        currentState.knownWords.push(normT1);
        saveKnownWords();
    }

    // Kích hoạt Mascot cổ vũ
    triggerMascot('cheer', t('mascot_cheer_known'));

    // Chuyển slide mượt mà hoặc hoàn thành học tập
    const activeVocab = getActiveLearnVocab();
    if (activeVocab.length === 0) {
        alert(t('learn_complete_all'));
        switchMode('home');
    } else {
        // Tự động chuyển tiếp
        if (currentState.currentIndex >= activeVocab.length) {
            currentState.currentIndex = Math.max(0, activeVocab.length - 1);
        }
        currentState.isFlipped = false;
        render();
    }
}
window.markAsKnown = markAsKnown;

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

    if (!pool || pool.length === 0) {
        alert(t('no_vocab_test_warning'));
        switchMode('home');
        return;
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
    const direction = Math.random() > 0.5 ? 't1-t2' : 't2-t1';

    const q = {
        wordId: word.id,
        type: type,
        direction: direction,
        prompt: direction === 't1-t2' ? word.t1 : word.t2,
        correct: direction === 't1-t2' ? word.t2 : word.t1
    };

    if (type === 'mcq') {
        let distractors = pool
            .filter(w => w.id !== word.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => direction === 't1-t2' ? w.t2 : w.t1);

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
            left: direction === 't1-t2' ? w.t1 : w.t2,
            right: direction === 't1-t2' ? w.t2 : w.t1
        }));

        // Pre-shuffle columns for the UI
        q.shuffledLeft = shuffle(q.pairs.map(p => ({ id: p.id, val: p.left })));
        q.shuffledRight = shuffle(q.pairs.map(p => ({ id: p.id, val: p.right })));
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
    } else if (currentState.mode === 'import_review') {
        renderImportReview(mainContent);
    } else {
        renderHome(mainContent);
    }

    // After render hooks
    if (currentState.mode === 'test') {
        focusInput();
    } else if (currentState.mode === 'home') {
        if (currentState.history.length > 0) setTimeout(renderChart, 50);
        setupDragAndDrop();
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
                label: t('score_percent'),
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
                <h2 class="text-3xl font-black text-slate-700 dark:text-slate-100">${t('ready')}</h2>
                <div class="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-graduation-cap text-indigo-500"></i>
                    <span>${t('stats_known')}: ${currentState.knownWords.length} / ${currentState.vocab.length} từ (${Math.round((currentState.knownWords.length / (currentState.vocab.length || 1)) * 100)}%)</span>
                </div>
                <p class="text-slate-500 dark:text-slate-400 mt-2 mb-6 font-medium">${t('choose_test_size')}</p>
                
                <div class="flex justify-center gap-3 mb-8 flex-wrap">
                    ${[10, 20, 50, 'all'].map(size => `
                        <button onclick="setTestSize('${size}')" 
                            class="px-5 py-2.5 rounded-2xl font-bold transition-all border-2 
                            ${currentState.preferredTestSize == size
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500'}">
                            ${size === 'all' ? `<i class="fa-solid fa-infinity"></i> ${t('all')}` : size}
                        </button>
                    `).join('')}
                </div>

                <div class="flex justify-center gap-4">
                     <button onclick="switchMode('learn')" class="px-8 py-3 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-600 rounded-2xl font-bold shadow-sm hover:scale-105 transition"><i class="fa-solid fa-book-open"></i> ${t('learn_new')}</button>
                     <button onclick="startNewTest()" class="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-105 hover:bg-emerald-600 transition"><i class="fa-solid fa-play"></i> ${t('start_test')}</button>
                </div>
            </div>

            <!-- Import Vocab UI -->
            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 glassmorphism">
                <h3 class="font-bold text-lg text-slate-700 dark:text-slate-200 mb-2"><i class="fa-solid fa-database text-indigo-500"></i> ${t('manage_vocab')}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${t('import_desc')}</p>
                
                <div class="flex gap-4 mb-4">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase tracking-wider">${t('lang_1')}</label>
                        <input id="l1-name-input" type="text" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl focus:border-indigo-500 outline-none transition dark:text-white" placeholder="Ví dụ: English" value="${currentState.langConfig.l1}">
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase tracking-wider">${t('lang_2')}</label>
                        <input id="l2-name-input" type="text" class="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-xl focus:border-indigo-500 outline-none transition dark:text-white" placeholder="Ví dụ: Vietnamese" value="${currentState.langConfig.l2}">
                    </div>
                </div>

                <div class="flex items-center gap-2 mb-4 ml-1">
                    <input type="checkbox" id="ignore-base-checkbox" onchange="window.toggleIgnoreBase(this.checked)" ${currentState.langConfig.ignoreBase ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="ignore-base-checkbox" class="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">${t('ignore_base_vocab')}</label>
                </div>

                <div class="flex items-center gap-2 mb-4 ml-1">
                    <input type="checkbox" id="skip-known-checkbox" onchange="window.toggleSkipKnown(this.checked)" ${currentState.langConfig.skipKnown ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="skip-known-checkbox" class="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">${t('skip_known_vocab')}</label>
                </div>

                <div class="flex items-center gap-2 mb-4 ml-1">
                    <input type="checkbox" id="auto-pronounce-checkbox" onchange="window.toggleAutoPronounce(this.checked)" ${currentState.langConfig.autoPronounce ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="auto-pronounce-checkbox" class="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">${t('auto_pronounce')}</label>
                </div>

                <textarea id="vocab-import-input" class="w-full h-32 p-4 border-2 border-slate-100 dark:border-slate-600 bg-transparent dark:text-white rounded-2xl mb-1 focus:border-indigo-500 outline-none transition resize-y" placeholder="${t('import_placeholder')}"></textarea>
                <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-4 ml-1 uppercase tracking-tighter">${t('import_help')}</p>
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div class="flex gap-2 flex-wrap">
                        <input type="file" id="excel-upload" accept=".xlsx, .xls, .csv" class="hidden" onchange="window.handleFileUpload(event)">
                        <button onclick="document.getElementById('excel-upload').click()" class="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-amber-100 dark:border-amber-800/50" title="Upload Excel/CSV"><i class="fa-solid fa-file-import"></i> Upload Excel</button>
                        <button onclick="window.exportVocabToExcel()" class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-emerald-100 dark:border-emerald-800/50" title="${t('export_excel')}"><i class="fa-solid fa-file-excel"></i> ${t('export_excel')}</button>
                        <button onclick="window.resetKnownWords()" class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-indigo-100 dark:border-indigo-800/50" title="${t('reset_known')}"><i class="fa-solid fa-arrows-rotate"></i> ${t('reset_known')}</button>
                        <button onclick="window.factoryReset()" class="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl font-bold hover:scale-105 transition shadow-sm text-sm border border-slate-200 dark:border-slate-600" title="${t('factory_reset')}"><i class="fa-solid fa-trash-can"></i> ${t('factory_reset')}</button>
                    </div>
                    <button onclick="window.importVocab()" class="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition shadow-md ml-auto"><i class="fa-solid fa-plus"></i> ${t('add_insert')}</button>
                </div>
                <span id="import-msg" class="text-sm font-bold text-red-500 block mt-2"></span>
            </div>

            ${currentState.incorrectWords.length > 0 ? `
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200 dark:border-amber-700/50 p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center justify-between glassmorphism">
                    <div>
                        <h4 class="font-bold text-amber-800 dark:text-amber-400 text-lg"><i class="fa-solid fa-triangle-exclamation"></i> ${t('review_count', { n: currentState.incorrectWords.length })}</h4>
                        <p class="text-amber-700 dark:text-amber-500 text-sm">${t('review_desc')}</p>
                    </div>
                    <div class="flex gap-3 w-full md:w-auto">
                        <button onclick="window.clearReviewHistory()" class="flex-1 md:flex-none bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl font-bold shadow hover:scale-105 transition"><i class="fa-solid fa-check"></i> ${t('memorized')}</button>
                        <button onclick="startNewTest(true)" class="flex-1 md:flex-none bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition"><i class="fa-solid fa-bolt"></i> ${t('review_now')}</button>
                    </div>
                </div>
            ` : ''}

            <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700 glassmorphism">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-lg text-slate-700 dark:text-slate-200"><i class="fa-solid fa-chart-line text-indigo-500"></i> ${t('learning_stats')}</h3>
                    <button onclick="window.clearRecentHistory()" class="text-xs font-bold text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-trash-can"></i> ${t('clear_history')}</button>
                </div>
                ${currentState.history.length === 0 ? `<p class="text-slate-400 italic text-center py-8">${t('no_history')}</p>` : `
                    <div class="h-64 w-full">
                        <canvas id="historyChart"></canvas>
                    </div>
                `}
            </div>
        </div>
    `;

    // Trigger mascot warn if there are words to review
    if (currentState.incorrectWords.length > 0) {
        setTimeout(() => triggerMascot('warn', t('mascot_warn')), 500);
    }
}

function renderLearnMode(container) {
    const activeVocab = getActiveLearnVocab();

    if (!activeVocab || activeVocab.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 glassmorphism animate-fade-in">
                <i class="fa-solid fa-folder-open text-6xl text-slate-200 mb-4 block"></i>
                <p class="text-slate-500 dark:text-slate-400 font-medium">${t('no_vocab_warning')}</p>
                <button onclick="switchMode('home')" class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:scale-105 transition">${t('go_home')}</button>
            </div>
        `;
        return;
    }

    // Ensure currentIndex is in valid range
    if (currentState.currentIndex >= activeVocab.length) {
        currentState.currentIndex = Math.max(0, activeVocab.length - 1);
    }

    const word = activeVocab[currentState.currentIndex];
    container.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-8">
                <button onclick="switchMode('home')" class="text-slate-400 hover:text-indigo-600 font-bold transition flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    ${t('home')}
                </button>
                <div class="text-slate-500 font-medium bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                    ${t('word_progress', { n: currentState.currentIndex + 1, m: activeVocab.length })}
                </div>
                <div class="w-20"></div> <!-- Spacer for symmetry -->
            </div>

            <div id="flashcard" onclick="flipCard()" class="perspective-1000 w-full max-w-lg md:max-w-2xl h-80 md:h-96 cursor-pointer relative z-10 group">
                <div class="relative w-full h-full duration-500 preserve-3d transition-transform ${currentState.isFlipped ? 'rotate-y-180' : ''}">
                    <div class="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border-2 border-indigo-50 dark:border-slate-700 flex flex-col items-center justify-center p-10 text-center glassmorphism group-hover:-translate-y-2 transition-transform">
                        <h3 class="text-4xl md:text-6xl font-black text-slate-800 dark:text-slate-100 leading-tight">${word.t1}</h3>
                        <!-- Pronunciation Button for L1 (Root word) -->
                        <button onclick="event.stopPropagation(); window.speakWord('${word.t1.replace(/'/g, "\\'")}', currentState.langConfig.l1)" 
                            class="mt-4 w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-400 rounded-full transition-transform active:scale-95 shadow-sm"
                            title="Nghe phát âm">
                            <i class="fa-solid fa-volume-high text-base"></i>
                        </button>
                        <div class="absolute bottom-6 text-xs text-slate-400 uppercase tracking-widest font-bold"><i class="fa-solid fa-hand-pointer"></i> ${t('flip_to', { lang: currentState.langConfig.l2 })}</div>
                    </div>
                    <div class="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center rotate-y-180">
                        <h3 class="text-3xl md:text-5xl font-bold text-white leading-relaxed">${word.t2}</h3>
                        <!-- Pronunciation Button for L2 (Meaning) -->
                        <button onclick="event.stopPropagation(); window.speakWord('${word.t2.replace(/'/g, "\\'")}', currentState.langConfig.l2)" 
                            class="mt-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-transform active:scale-95 shadow-sm"
                            title="Nghe nghĩa dịch">
                            <i class="fa-solid fa-volume-high text-base"></i>
                        </button>
                        <div class="absolute bottom-6 text-xs text-indigo-200 uppercase tracking-widest font-bold">${word.t1}</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-6 mt-12 flex-wrap justify-center animate-fade-in">
                <!-- Nút Trở lại -->
                <button onclick="prevWord()" class="p-5 bg-white dark:bg-slate-700 rounded-2xl shadow hover:bg-slate-50 dark:hover:bg-slate-600 transition border border-slate-200 dark:border-slate-600 active:scale-90" title="${t('back')}">
                    <svg class="w-8 h-8 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                <!-- Nút ĐÃ THUỘC (THÊM MỚI) -->
                <button onclick="window.markAsKnown('${word.t1.replace(/'/g, "\\'")}')" class="px-6 md:px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition active:scale-95 flex items-center gap-2" title="${t('mark_known')}">
                    <i class="fa-solid fa-circle-check text-xl"></i>
                    <span>${t('mark_known')}</span>
                </button>
                
                <!-- Nút Tiếp theo -->
                <button onclick="nextWord()" class="p-5 bg-indigo-600 rounded-2xl shadow-xl hover:bg-indigo-700 transition active:scale-90" title="${t('next')}">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    `;

    // Auto-pronounce Root Word L1 when drawing card (if enabled)
    if (currentState.langConfig.autoPronounce && !currentState.isFlipped) {
        if (window.lastSpokenWordId !== word.id) {
            window.lastSpokenWordId = word.id;
            setTimeout(() => {
                const activeVocabCheck = getActiveLearnVocab();
                if (currentState.mode === 'learn' &&
                    currentState.currentIndex < activeVocabCheck.length &&
                    activeVocabCheck[currentState.currentIndex].id === word.id &&
                    !currentState.isFlipped) {
                    window.speakWord(word.t1, currentState.langConfig.l1);
                }
            }, 200);
        }
    }

    // Auto-pronounce Meaning L2 when flipped (if enabled)
    if (currentState.langConfig.autoPronounce && currentState.isFlipped) {
        if (window.lastSpokenFlipId !== word.id) {
            window.lastSpokenFlipId = word.id;
            setTimeout(() => {
                const activeVocabCheck = getActiveLearnVocab();
                if (currentState.mode === 'learn' &&
                    currentState.currentIndex < activeVocabCheck.length &&
                    activeVocabCheck[currentState.currentIndex].id === word.id &&
                    currentState.isFlipped) {
                    window.speakWord(word.t2, currentState.langConfig.l2);
                }
            }, 200);
        }
    }
}

function renderTestMode(container) {
    const q = currentState.testQuestions[currentState.currentIndex];

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 glassmorphism relative overflow-hidden">
            <!-- Progress Bar Background (Subtle) -->
            <div class="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300" style="width: ${(currentState.currentIndex / currentState.testQuestions.length) * 100}%"></div>
            
            <div class="flex justify-between items-center mb-8 relative z-10">
                <button onclick="switchMode('home')" class="text-slate-400 hover:text-indigo-600 font-bold transition flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> ${t('home')}
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
                <button onclick="prevQuestion()" class="text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-0 transition" ${currentState.currentIndex === 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i> ${t('back')}</button>
                <button onclick="nextQuestion()" class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none transition">
                    ${currentState.currentIndex === currentState.testQuestions.length - 1 ? `<i class="fa-solid fa-paper-plane"></i> ${t('submit')}` : `${t('next')} <i class="fa-solid fa-chevron-right"></i>`}
                </button>
            </div>
        </div>
    `;
}

function renderQuestionType(q) {
    if (q.type === 'written') {
        return `
            <input type="text" id="written-answer" placeholder="${t('enter_answer')}" 
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
                    <span class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">${t('matching_done')}</span>
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
                triggerMascot('cheer', t('mascot_cheer'));
            }
        } else {
            // Sai!
            triggerMascot('error', t('mascot_error'));
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
            triggerMascot('cheer', t('result_great'));
        }, 300);
    } else if (currentState.finalScore < 50) {
        setTimeout(() => triggerMascot('warn', t('result_try_harder')), 300);
    }

    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 text-center glassmorphism">
            <div class="mb-6 animate-bounce">
                <span class="text-7xl drop-shadow-lg">${currentState.finalScore >= 80 ? '🏆' : currentState.finalScore >= 50 ? '👏' : '📚'}</span>
            </div>
            <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2 drop-shadow-sm">${currentState.finalScore}%</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-10 text-lg">${t('result_desc', { n: Math.round(currentState.finalScore * currentState.testQuestions.length / 100), m: currentState.testQuestions.length })}</p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="switchMode('home')" class="py-4 px-8 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:scale-105 transition"><i class="fa-solid fa-house"></i> ${t('go_home')}</button>
                <button onclick="startNewTest()" class="py-4 px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl font-bold hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none transition"><i class="fa-solid fa-rotate-right"></i> ${t('try_again')}</button>
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
        // Keyboard shortcut for speech synthesis (v or s keys)
        if (e.key === 'v' || e.key === 's') {
            e.preventDefault();
            const activeVocab = getActiveLearnVocab();
            const word = activeVocab[currentState.currentIndex];
            if (word) {
                if (currentState.isFlipped) {
                    window.speakWord(word.t2, currentState.langConfig.l2);
                } else {
                    window.speakWord(word.t1, currentState.langConfig.l1);
                }
            }
        }
    }
    if (currentState.mode === 'test' && e.key === 'Enter') {
        nextQuestion();
    }
});

// Helper for learn mode
function flipCard() { currentState.isFlipped = !currentState.isFlipped; render(); }
function nextWord() {
    const activeVocab = getActiveLearnVocab();
    if (currentState.currentIndex < activeVocab.length - 1) {
        currentState.currentIndex++;
        currentState.isFlipped = false;
        window.lastSpokenFlipId = null; // Reset translation flip spoken cache
        render();
    }
}
function prevWord() {
    if (currentState.currentIndex > 0) {
        currentState.currentIndex--;
        currentState.isFlipped = false;
        window.lastSpokenFlipId = null; // Reset translation flip spoken cache
        render();
    }
}

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

function parseVocabData(rawData) {
    const lines = rawData.split('\n');
    const results = [];
    const processedThisTime = new Set();

    // Delimiter priority: Tab > Colon > Dash (with spaces) > Pipe
    // Regex explanation:
    // \t : Tab
    // \s*[:|]\s* : Colon or Pipe with optional surrounding spaces
    // \s+-\s+ : Dash with at least one space on both sides
    const delimiterRegex = /\t|\s*[:|]\s*|\s+-\s+/;

    for (let line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Try to find the best delimiter
        let parts = [];
        if (line.includes('\t')) {
            parts = line.split('\t');
        } else {
            // Split by the first occurrence of any supported delimiter
            const match = line.match(delimiterRegex);
            if (match) {
                const sep = match[0];
                const firstIdx = line.indexOf(sep);
                parts = [
                    line.substring(0, firstIdx),
                    line.substring(firstIdx + sep.length)
                ];
            }
        }

        if (parts.length >= 2) {
            const t1Word = parts[0].trim();
            const t2Word = parts[1].trim();

            if (!t1Word || !t2Word) continue;

            const t1Lower = t1Word.toLowerCase();

            if (processedThisTime.has(t1Lower)) {
                results.push({ t1: t1Word, t2: t2Word, status: 'skip' });
                continue;
            }
            processedThisTime.add(t1Lower);

            const existingWord = currentState.vocab.find(w => w.t1.toLowerCase().trim() === t1Lower);

            if (existingWord) {
                const currentMeanings = existingWord.t2.split(',').map(m => normalize(m));
                const inputMeanings = t2Word.split(',').map(m => m.trim());
                const newMeanings = inputMeanings.filter(nm => !currentMeanings.includes(normalize(nm)));

                if (newMeanings.length > 0) {
                    results.push({ t1: t1Word, t2: t2Word, status: 'update' });
                } else {
                    results.push({ t1: t1Word, t2: t2Word, status: 'skip' });
                }
            } else {
                results.push({ t1: t1Word, t2: t2Word, status: 'new' });
            }
        }
    }
    return results;
}

function importVocab() {
    const input = document.getElementById('vocab-import-input');
    const l1Input = document.getElementById('l1-name-input');
    const l2Input = document.getElementById('l2-name-input');
    const msg = document.getElementById('import-msg');

    if (!input || !input.value.trim()) return;

    // Capture pending language names
    currentState.langConfig.pendingL1 = l1Input.value.trim() || "L1";
    currentState.langConfig.pendingL2 = l2Input.value.trim() || "L2";

    const rawData = input.value;
    const parsed = parseVocabData(rawData);

    if (parsed.length === 0) {
        if (msg) {
            msg.textContent = "Không tìm thấy dữ liệu hợp lệ (cần ít nhất 2 cột phân cách bằng Tab).";
            setTimeout(() => msg.textContent = "", 3000);
        }
        return;
    }

    currentState.pendingVocab = parsed;
    switchMode('import_review');
}

function confirmImport() {
    let existingCustom = [];
    try {
        const saved = localStorage.getItem('custom_vocab');
        if (saved) existingCustom = JSON.parse(saved);
    } catch (e) { }

    let addedCount = 0;
    let updatedCount = 0;

    currentState.pendingVocab.forEach(item => {
        if (item.status === 'skip') return;

        const t1Lower = item.t1.toLowerCase().trim();
        const existingWord = currentState.vocab.find(w => w.t1.toLowerCase().trim() === t1Lower);

        if (item.status === 'update' && existingWord) {
            const currentMeanings = existingWord.t2.split(',').map(m => normalize(m));
            const inputMeanings = item.t2.split(',').map(m => m.trim());
            const newMeanings = inputMeanings.filter(nm => !currentMeanings.includes(normalize(nm)));

            const finalT2 = existingWord.t2 + ', ' + newMeanings.join(', ');

            const customIndex = existingCustom.findIndex(w => w.t1.toLowerCase().trim() === t1Lower);
            if (customIndex !== -1) {
                existingCustom[customIndex].t2 = finalT2;
            } else {
                existingCustom.push({ t1: existingWord.t1, t2: finalT2 });
            }
            updatedCount++;
        } else if (item.status === 'new') {
            existingCustom.push({ t1: item.t1, t2: item.t2 });
            addedCount++;
        }
    });

    if (addedCount > 0 || updatedCount > 0) {
        localStorage.setItem('custom_vocab', JSON.stringify(existingCustom));
        // Update language names
        currentState.langConfig.l1 = currentState.langConfig.pendingL1;
        currentState.langConfig.l2 = currentState.langConfig.pendingL2;
        localStorage.setItem('vocab_lang_config', JSON.stringify(currentState.langConfig));

        init();
        const input = document.getElementById('vocab-import-input');
        if (input) input.value = '';

        switchMode('home');
        const successMsg = currentState.langConfig.uiLang === 'vi'
            ? `Thành công! Đã thêm ${addedCount} và cập nhật ${updatedCount}.`
            : `Success! Added ${addedCount} and updated ${updatedCount}.`;
        alert(successMsg);
    } else {
        switchMode('home');
    }
}

function renderImportReview(container) {
    const n = currentState.pendingVocab.length;
    container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 glassmorphism flex flex-col h-[80vh] animate-slide-up">
            <div class="mb-6">
                <h2 class="text-2xl font-black text-slate-700 dark:text-slate-100">${t('import_review_title')}</h2>
                <p class="text-slate-500 dark:text-slate-400 mt-1">${t('import_review_desc', { n })}</p>
            </div>

            <div id="review-table-container" class="flex-1 overflow-y-auto border border-slate-100 dark:border-slate-700 rounded-2xl mb-6 relative bg-slate-50/30 dark:bg-slate-900/30">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-slate-50 dark:bg-slate-900 z-20">
                        <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                            <th class="px-4 py-3">${t('col_word')}</th>
                            <th class="px-4 py-3">${t('col_meaning')}</th>
                            <th class="px-4 py-3 w-24 text-center">${t('col_status')}</th>
                        </tr>
                    </thead>
                    <tbody id="review-table-body">
                        <!-- Rows will be injected here -->
                    </tbody>
                </table>
            </div>

            <div class="flex gap-4 justify-end">
                <button onclick="switchMode('home')" class="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition">${t('cancel')}</button>
                <button onclick="window.confirmImport()" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition active:scale-95">${t('confirm')}</button>
            </div>
        </div>
    `;

    // Reset display count
    currentState.reviewDisplayCount = 50;
    renderReviewTableOnly();

    // Infinite Scroll
    const tableContainer = document.getElementById('review-table-container');
    tableContainer.onscroll = () => {
        if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 20) {
            if (currentState.reviewDisplayCount < currentState.pendingVocab.length) {
                currentState.reviewDisplayCount += 50;
                renderReviewTableOnly();
            }
        }
    };
}

function renderReviewTableOnly() {
    const tbody = document.getElementById('review-table-body');
    if (!tbody) return;

    const data = currentState.pendingVocab.slice(0, currentState.reviewDisplayCount);
    tbody.innerHTML = data.map(item => {
        let statusClass = '';
        let statusLabel = '';
        if (item.status === 'new') {
            statusClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
            statusLabel = t('status_new');
        } else if (item.status === 'update') {
            statusClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
            statusLabel = t('status_update');
        } else {
            statusClass = 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
            statusLabel = t('status_skip');
        }

        return `
            <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/50 transition">
                <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-200 text-sm">${item.t1}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">${item.t2}</td>
                <td class="px-4 py-3 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${statusClass}">${statusLabel}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function exportVocabToExcel() {
    if (currentState.vocab.length === 0) {
        alert("Không có dữ liệu từ vựng để xuất!");
        return;
    }

    const config = currentState.langConfig;
    // Create TSV content
    const header = `${config.l1}\t${config.l2}\n`;
    const rows = currentState.vocab.map(w => `${w.t1}\t${w.t2}`).join('\n');
    const tsvContent = header + rows;

    // Create a Blob and trigger download
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tu_vung_${config.l1}_${config.l2}.tsv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert to array of arrays (header: 1)
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            let tsvContent = "";
            rows.forEach(row => {
                if (row && row.length >= 2) {
                    const t1 = row[0] ? String(row[0]).trim() : "";
                    const t2 = row[1] ? String(row[1]).trim() : "";
                    if (t1 && t2) {
                        tsvContent += `${t1}\t${t2}\n`;
                    }
                }
            });

            if (tsvContent) {
                const input = document.getElementById('vocab-import-input');
                if (input) {
                    input.value = tsvContent;
                    // Auto-trigger import review
                    importVocab();
                }
            } else {
                alert("Không tìm thấy dữ liệu hợp lệ trong file (cần ít nhất 2 cột).");
            }
        } catch (err) {
            console.error("Excel processing failed", err);
            alert("Lỗi khi xử lý file. Vui lòng kiểm tra định dạng.");
        }
    };
    reader.readAsArrayBuffer(file);
    // Reset input so the same file can be uploaded again if needed
    event.target.value = '';
}

function setupDragAndDrop() {
    const textarea = document.getElementById('vocab-import-input');
    if (!textarea) return;

    const preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    textarea.addEventListener('dragover', (e) => {
        preventDefault(e);
        textarea.classList.add('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-900/20');
    });

    textarea.addEventListener('dragleave', (e) => {
        preventDefault(e);
        textarea.classList.remove('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-900/20');
    });

    textarea.addEventListener('drop', (e) => {
        preventDefault(e);
        textarea.classList.remove('border-indigo-500', 'bg-indigo-50/50', 'dark:bg-indigo-900/20');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const ext = file.name.split('.').pop().toLowerCase();
            if (['xlsx', 'xls', 'csv'].includes(ext)) {
                const event = { target: { files: [file] } };
                handleFileUpload(event);
            } else {
                const reader = new FileReader();
                reader.onload = (rev) => {
                    textarea.value = rev.target.result;
                    importVocab();
                };
                reader.readAsText(file);
            }
        }
    });
}

/**
 * Thiết lập tính năng kéo thả (Drag and Drop) cho Mascot và lưu vị trí
 */
function setupMascotDraggable() {
    const container = document.getElementById('mascot-container');
    const mascot = document.getElementById('mascot');
    if (!container || !mascot) return;

    // Thay đổi con trỏ chuột sang grab để gợi ý có thể kéo di chuyển
    mascot.style.cursor = 'grab';

    // Khôi phục vị trí đã lưu từ localStorage
    const savedPos = localStorage.getItem('mascot_position');
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            // Giới hạn trong viewport để tránh trôi ra ngoài màn hình
            const maxLeft = window.innerWidth - (container.offsetWidth || 96);
            const maxTop = window.innerHeight - (container.offsetHeight || 96);
            const left = Math.max(0, Math.min(pos.left, maxLeft));
            const top = Math.max(0, Math.min(pos.top, maxTop));

            container.style.bottom = 'auto';
            container.style.right = 'auto';
            container.style.left = left + 'px';
            container.style.top = top + 'px';
        } catch (e) {
            console.error("Lỗi khôi phục vị trí mascot:", e);
        }
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onStart = (e) => {
        // Tránh drag nếu click trúng nút bấm con bên trong nếu có
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

        let clientX, clientY;
        if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            e.preventDefault(); // Ngăn trình duyệt kéo ảnh mặc định
            clientX = e.clientX;
            clientY = e.clientY;
        }

        isDragging = true;
        mascot.style.cursor = 'grabbing';

        const rect = container.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        startX = clientX;
        startY = clientY;

        // Vô hiệu hóa hiệu ứng chuyển cảnh của CSS transition trong khi kéo để di chuyển mượt mà
        container.style.transition = 'none';

        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        } else {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
        }
    };

    const onMove = (e) => {
        if (!isDragging) return;

        let clientX, clientY;
        if (e.type === 'touchmove') {
            e.preventDefault(); // Chặn cuộn trang trên mobile khi đang kéo mascot
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        const containerWidth = container.offsetWidth || 96;
        const containerHeight = container.offsetHeight || 96;

        // Giới hạn di chuyển trong viewport màn hình
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - containerWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - containerHeight));

        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.left = newLeft + 'px';
        container.style.top = newTop + 'px';
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        mascot.style.cursor = 'grab';

        // Bật lại transition CSS mặc định
        container.style.transition = '';

        if (e.type === 'touchend') {
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        } else {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
        }

        // Lưu vị trí cuối cùng vào localStorage
        const rect = container.getBoundingClientRect();
        localStorage.setItem('mascot_position', JSON.stringify({
            left: rect.left,
            top: rect.top
        }));
    };

    mascot.addEventListener('mousedown', onStart);
    mascot.addEventListener('touchstart', onStart, { passive: false });

    // Tự động kiểm tra giữ mascot trong viewport khi resize màn hình
    window.addEventListener('resize', () => {
        if (!container.style.left) return;

        const rect = container.getBoundingClientRect();
        const containerWidth = container.offsetWidth || 96;
        const containerHeight = container.offsetHeight || 96;

        const newLeft = Math.max(0, Math.min(rect.left, window.innerWidth - containerWidth));
        const newTop = Math.max(0, Math.min(rect.top, window.innerHeight - containerHeight));

        container.style.left = newLeft + 'px';
        container.style.top = newTop + 'px';
    });
}

/**
 * Map language name to BCP-47 code for Web Speech synthesis
 */
function getLangCode(langName) {
    if (!langName) return 'en-US';
    const lower = langName.toLowerCase().trim();
    if (lower.includes('en') || lower.includes('anh')) return 'en-US';
    if (lower.includes('vi') || lower.includes('việt')) return 'vi-VN';
    if (lower.includes('ja') || lower.includes('nhật')) return 'ja-JP';
    if (lower.includes('ko') || lower.includes('hàn')) return 'ko-KR';
    if (lower.includes('zh') || lower.includes('trung') || lower.includes('cn')) return 'zh-CN';
    if (lower.includes('fr') || lower.includes('pháp')) return 'fr-FR';
    if (lower.includes('de') || lower.includes('đức') || lower.includes('ger')) return 'de-DE';
    if (lower.includes('es') || lower.includes('tây')) return 'es-ES';
    if (lower.includes('ru') || lower.includes('nga')) return 'ru-RU';
    return 'en-US'; // Default English
}

/**
 * Pronounce word using Web Speech API SpeechSynthesis
 */
function speakWord(text, langName) {
    if (!('speechSynthesis' in window)) {
        console.warn('Trình duyệt không hỗ trợ Web Speech API.');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text) return;

    // Clean parentheses
    let cleanText = text.replace(/\(.*?\)/g, '').trim();
    if (!cleanText) cleanText = text;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLangCode(langName);
    utterance.rate = 0.95;

    window.speechSynthesis.speak(utterance);
}

function toggleAutoPronounce(checked) {
    currentState.langConfig.autoPronounce = checked;
    localStorage.setItem('vocab_lang_config', JSON.stringify(currentState.langConfig));
}

// Ensure global access
window.getLangCode = getLangCode;
window.speakWord = speakWord;
window.toggleAutoPronounce = toggleAutoPronounce;
window.clearReviewHistory = clearReviewHistory;
window.clearRecentHistory = clearRecentHistory;
window.importVocab = importVocab;
window.confirmImport = confirmImport;
window.exportVocabToExcel = exportVocabToExcel;
window.handleFileUpload = handleFileUpload;

window.onload = () => {
    init();
    render();
    updateNavButtons(currentState.mode);
};
