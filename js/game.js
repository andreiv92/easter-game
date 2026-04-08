/**
 * game.js – Logica principală a jocului Easter Egg Catcher
 * Gestionează gameplay, player, ouă, power-ups, niveluri, coliziuni
 */
(function (global) {
    'use strict';

    /* ── Constante ── */
    var LEVEL_SCORE_STEP  = 200;  // puncte necesare pentru un nivel nou
    var INITIAL_LIVES     = 3;
    var BASE_SPEED        = 120;  // px/secundă
    var SPEED_INCREMENT   = 25;   // px/s per nivel suplimentar
    var SPAWN_INTERVAL    = 1800; // ms între ouă (nivel 1)
    var SPAWN_DECREMENT   = 120;  // ms reducere per nivel
    var MIN_SPAWN         = 500;  // ms minim între ouă
    var POWERUP_CHANCE    = 0.06; // 6% șansă de power-up la fiecare spawn
    var MAX_EGGS_ON_SCREEN = 12;

    /* Tipuri de ouă */
    var EGG_TYPES = [
        { type: 'red',     emoji: '🥚', color: 'red',    points: 10,  weight: 30, bad: false },
        { type: 'blue',    emoji: '🥚', color: 'blue',   points: 10,  weight: 30, bad: false },
        { type: 'green',   emoji: '🥚', color: 'green',  points: 10,  weight: 25, bad: false },
        { type: 'yellow',  emoji: '🥚', color: 'yellow', points: 10,  weight: 20, bad: false },
        { type: 'glitter', emoji: '✨', color: 'glitter',points: 25,  weight: 12, bad: false },
        { type: 'golden',  emoji: '⭐', color: 'golden', points: 50,  weight: 5,  bad: false },
        { type: 'bad',     emoji: '🖤', color: 'bad',    points: -20, weight: 15, bad: true  }
    ];

    /* Tipuri de power-ups */
    var POWERUP_TYPES = [
        { type: 'magnet',  emoji: '🧲', name: 'Magnet',        duration: 5000  },
        { type: 'shield',  emoji: '🛡️', name: 'Scut',          duration: 10000 },
        { type: 'double',  emoji: '2️⃣', name: 'Puncte Duble',  duration: 8000  },
        { type: 'life',    emoji: '❤️', name: 'Viață Extra',   duration: 0     }
    ];

    /* ── Traduceri ── */
    var translations = {
        ro: {
            btnStart:             '🐣 Începe Jocul',
            btnStats:             '📊 Statistici',
            btnSettings:          '⚙️ Setări',
            subtitle:             'Prinde ouăle de Paște! 🥚✨',
            howToPlay:            'Cum se joacă:',
            instrColoredEggs:     '🥚 Prinde ouăle colorate → <strong>10 pct</strong>',
            instrGlitterEggs:     '✨ Ouă cu glitter → <strong>25 pct</strong>',
            instrGoldenEggs:      '⭐ Ouă aurii → <strong>50 pct</strong>',
            instrBadEggs:         '🖤 Evită ouăle stricate → <strong>-20 pct</strong>',
            instrLives:           '❤️ Ai 3 vieți — nu lăsa ouăle bune să cadă!',
            hudScoreLabel:        'Scor',
            hudHighScoreLabel:    'High Score',
            hudLivesLabel:        'Vieți',
            hudLevelLabel:        'Nivel ',
            pauseTitle:           '⏸️ Pauză',
            btnResume:            '▶️ Continuă',
            btnQuit:              '🏠 Meniu',
            levelUpMsg:           'Bravo! Continuă tot așa! 🥚',
            newHighscoreBanner:   '🏆 Nou Record! 🏆',
            goScoreLabel:         'Scor Final',
            goHighScoreLabel:     'High Score',
            goLevelLabel:         'Nivel Maxim',
            goEggsLabel:          'Ouă Prinse',
            goTimeLabel:          'Timp',
            btnPlayAgain:         '🔄 Joacă din Nou',
            btnGotoMenu:          '🏠 Meniu Principal',
            statsTitle:           '📊 Statisticile Tale',
            statHighScoreLabel:   'High Score',
            statEggsLabel:        'Total Ouă Prinse',
            statLevelLabel:       'Cel Mai Mare Nivel',
            statTimeLabel:        'Timp Total Jucat',
            statGamesLabel:       'Partide Jucate',
            statLastLabel:        'Ultimul Scor',
            btnResetStats:        '🗑️ Resetează Statistici',
            btnStatsBack:         '← Înapoi',
            settingsTitle:        '⚙️ Setări',
            labelSound:           '🔊 Efecte Sonore',
            labelMusic:           '🎵 Muzică Fundal',
            labelLang:            '🌐 Limbă',
            btnSettingsClose:     '✅ Salvează'
        },
        en: {
            btnStart:             '🐣 Start Game',
            btnStats:             '📊 Statistics',
            btnSettings:          '⚙️ Settings',
            subtitle:             'Catch the Easter eggs! 🥚✨',
            howToPlay:            'How to play:',
            instrColoredEggs:     '🥚 Catch colored eggs → <strong>10 pts</strong>',
            instrGlitterEggs:     '✨ Glitter eggs → <strong>25 pts</strong>',
            instrGoldenEggs:      '⭐ Golden eggs → <strong>50 pts</strong>',
            instrBadEggs:         '🖤 Avoid rotten eggs → <strong>-20 pts</strong>',
            instrLives:           '❤️ You have 3 lives — don\'t let good eggs fall!',
            hudScoreLabel:        'Score',
            hudHighScoreLabel:    'High Score',
            hudLivesLabel:        'Lives',
            hudLevelLabel:        'Level ',
            pauseTitle:           '⏸️ Pause',
            btnResume:            '▶️ Resume',
            btnQuit:              '🏠 Menu',
            levelUpMsg:           'Great! Keep going! 🥚',
            newHighscoreBanner:   '🏆 New Record! 🏆',
            goScoreLabel:         'Final Score',
            goHighScoreLabel:     'High Score',
            goLevelLabel:         'Max Level',
            goEggsLabel:          'Eggs Caught',
            goTimeLabel:          'Time',
            btnPlayAgain:         '🔄 Play Again',
            btnGotoMenu:          '🏠 Main Menu',
            statsTitle:           '📊 Your Statistics',
            statHighScoreLabel:   'High Score',
            statEggsLabel:        'Total Eggs Caught',
            statLevelLabel:       'Highest Level',
            statTimeLabel:        'Total Time Played',
            statGamesLabel:       'Games Played',
            statLastLabel:        'Last Score',
            btnResetStats:        '🗑️ Reset Statistics',
            btnStatsBack:         '← Back',
            settingsTitle:        '⚙️ Settings',
            labelSound:           '🔊 Sound Effects',
            labelMusic:           '🎵 Background Music',
            labelLang:            '🌐 Language',
            btnSettingsClose:     '✅ Save'
        }
    };

    /** Aplică traducerile limbii selectate pe toate elementele cu data-i18n */
    function applyLanguage(lang) {
        var t = translations[lang] || translations['ro'];
        var elements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < elements.length; i++) {
            var key = elements[i].getAttribute('data-i18n');
            if (t[key] !== undefined) {
                elements[i].textContent = t[key];
            }
        }
        // Elementele cu markup HTML în traducere (instrucțiuni cu <strong>)
        var htmlElements = document.querySelectorAll('[data-i18n-html]');
        for (var j = 0; j < htmlElements.length; j++) {
            var htmlKey = htmlElements[j].getAttribute('data-i18n-html');
            if (t[htmlKey] !== undefined) {
                htmlElements[j].innerHTML = t[htmlKey];
            }
        }
    }



    /* ── Referințe DOM ── */
    var dom = {};

    /* ── Input ── */
    var keys = { left: false, right: false };
    var touchStartX = null;
    var isDragging  = false;

    /* ── Stare joc ── */
    var state = {};

    /* ── Timer-e ── */
    var spawnTimer   = null;
    var lastTime     = null;
    var rafId        = null;

    /** Inițializare aplicație – rulează o singură dată la DOMContentLoaded */
    function init() {
        cacheDom();
        bindMenuEvents();
        loadInitialUI();
        // Inițializare audio la primul click/touch (cerință browser)
        document.addEventListener('click',     Audio.init, { once: true });
        document.addEventListener('touchstart', Audio.init, { once: true });
    }

    /** Cacheaza referintele DOM pentru performanță */
    function cacheDom() {
        dom = {
            screens: {
                menu:     document.getElementById('screen-menu'),
                game:     document.getElementById('screen-game'),
                gameover: document.getElementById('screen-gameover'),
                stats:    document.getElementById('screen-stats')
            },
            menu: {
                highscore: document.getElementById('menu-highscore'),
                btnStart:  document.getElementById('btn-start'),
                btnStats:  document.getElementById('btn-stats'),
                btnSettings: document.getElementById('btn-settings')
            },
            hud: {
                score:     document.getElementById('hud-score'),
                highscore: document.getElementById('hud-highscore'),
                lives:     document.getElementById('hud-lives'),
                level:     document.getElementById('hud-level'),
                progFill:  document.getElementById('level-progress-fill')
            },
            powerupIndicator: document.getElementById('powerup-indicator'),
            powerupIcon:      document.getElementById('powerup-icon'),
            powerupName:      document.getElementById('powerup-name'),
            powerupTimerFill: document.getElementById('powerup-timer-fill'),
            btnPause:         document.getElementById('btn-pause'),
            pauseOverlay:     document.getElementById('pause-overlay'),
            btnResume:        document.getElementById('btn-resume'),
            btnQuit:          document.getElementById('btn-quit'),
            levelUpOverlay:   document.getElementById('level-up-overlay'),
            newLevelNum:      document.getElementById('new-level-num'),
            gameArea:         document.getElementById('game-area'),
            eggsContainer:    document.getElementById('eggs-container'),
            effectsContainer: document.getElementById('effects-container'),
            player:           document.getElementById('player'),
            playerBody:       document.getElementById('player-body'),
            go: {
                score:     document.getElementById('go-score'),
                highscore: document.getElementById('go-highscore'),
                level:     document.getElementById('go-level'),
                eggs:      document.getElementById('go-eggs'),
                time:      document.getElementById('go-time'),
                banner:    document.getElementById('new-highscore-banner'),
                btnAgain:  document.getElementById('btn-play-again'),
                btnMenu:   document.getElementById('btn-goto-menu')
            },
            stats: {
                highscore: document.getElementById('stat-highscore'),
                eggs:      document.getElementById('stat-eggs'),
                level:     document.getElementById('stat-level'),
                time:      document.getElementById('stat-time'),
                games:     document.getElementById('stat-games'),
                last:      document.getElementById('stat-last')
            },
            btnStatsBack:    document.getElementById('btn-stats-back'),
            btnResetStats:   document.getElementById('btn-reset-stats'),
            modalSettings:   document.getElementById('modal-settings'),
            toggleSound:     document.getElementById('toggle-sound'),
            toggleMusic:     document.getElementById('toggle-music'),
            selectLang:      document.getElementById('select-lang'),
            btnSettingsClose:document.getElementById('btn-settings-close')
        };
    }

    /** Încarcă valorile inițiale în UI din Storage */
    function loadInitialUI() {
        var settings  = Storage.getSettings();
        dom.menu.highscore.textContent = Storage.getHighScore();
        dom.hud.highscore.textContent  = Storage.getHighScore();
        dom.toggleSound.checked = settings.sound;
        dom.toggleMusic.checked = settings.music;
        dom.selectLang.value    = settings.lang || 'ro';
        Audio.setEnabled(settings.sound);
        Audio.setMusicEnabled(settings.music);
        applyLanguage(settings.lang || 'ro');
    }

    /* ── Navigare ecrane ── */
    function showScreen(name) {
        Object.keys(dom.screens).forEach(function (k) {
            dom.screens[k].classList.remove('active');
        });
        dom.screens[name].classList.add('active');
    }

    /* ── Bind evenimente meniu/UI ── */
    function bindMenuEvents() {
        // Meniu principal
        dom.menu.btnStart.addEventListener('click', function () {
            Audio.playClick();
            startGame();
        });
        dom.menu.btnStats.addEventListener('click', function () {
            Audio.playClick();
            showStats();
            showScreen('stats');
        });
        dom.menu.btnSettings.addEventListener('click', function () {
            Audio.playClick();
            dom.modalSettings.classList.remove('hidden');
        });

        // Pauzà
        dom.btnPause.addEventListener('click', function () {
            Audio.playClick();
            togglePause();
        });
        dom.btnResume.addEventListener('click', function () {
            Audio.playClick();
            togglePause();
        });
        dom.btnQuit.addEventListener('click', function () {
            Audio.playClick();
            endGame(true);
        });

        // Game over
        dom.go.btnAgain.addEventListener('click', function () {
            Audio.playClick();
            startGame();
        });
        dom.go.btnMenu.addEventListener('click', function () {
            Audio.playClick();
            showScreen('menu');
            dom.menu.highscore.textContent = Storage.getHighScore();
        });

        // Statistici
        dom.btnStatsBack.addEventListener('click', function () {
            Audio.playClick();
            showScreen('menu');
        });
        dom.btnResetStats.addEventListener('click', function () {
            var lang = Storage.getSettings().lang;
            var msg  = lang === 'en'
                ? 'Are you sure you want to reset your statistics?'
                : 'Ești sigur că vrei să resetezi statisticile?';
            if (confirm(msg)) {
                Storage.resetStats();
                showStats();
            }
        });

        // Setări
        dom.btnSettingsClose.addEventListener('click', function () {
            Audio.playClick();
            var settings = {
                sound: dom.toggleSound.checked,
                music: dom.toggleMusic.checked,
                lang:  dom.selectLang.value
            };
            Storage.saveSettings(settings);
            Audio.init();
            Audio.setEnabled(settings.sound);
            Audio.setMusicEnabled(settings.music);
            applyLanguage(settings.lang);
            dom.modalSettings.classList.add('hidden');
        });

        // Input keyboard
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup',   onKeyUp);

        // Touch controls
        dom.gameArea.addEventListener('touchstart', onTouchStart, { passive: true });
        dom.gameArea.addEventListener('touchmove',  onTouchMove,  { passive: false });
        dom.gameArea.addEventListener('touchend',   onTouchEnd,   { passive: true });

        // Mouse drag
        dom.gameArea.addEventListener('mousedown',  onMouseDown);
        document.addEventListener('mousemove',      onMouseMove);
        document.addEventListener('mouseup',        onMouseUp);
    }

    /* ── Input handlers ── */
    function onKeyDown(e) {
        if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
            if (state.running) togglePause();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
    }
    function onKeyUp(e) {
        if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keys.left  = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    }

    function onTouchStart(e) {
        if (!state.running || state.paused) return;
        touchStartX = e.touches[0].clientX;
    }
    function onTouchMove(e) {
        if (!state.running || state.paused || touchStartX === null) return;
        e.preventDefault();
        var dx = e.touches[0].clientX - touchStartX;
        touchStartX = e.touches[0].clientX;
        var areaW = dom.gameArea.clientWidth;
        var halfW = getPlayerHalfWidth();
        state.playerX = Math.max(halfW, Math.min(areaW - halfW, state.playerX + dx));
        updatePlayerDOM();
    }
    function onTouchEnd() { touchStartX = null; }

    function onMouseDown(e) {
        if (!state.running || state.paused) return;
        isDragging = true;
        var areaW = dom.gameArea.clientWidth;
        var halfW = getPlayerHalfWidth();
        var rect  = dom.gameArea.getBoundingClientRect();
        state.playerX = Math.max(halfW, Math.min(areaW - halfW, e.clientX - rect.left));
        updatePlayerDOM();
        dom.player.style.cursor = 'grabbing';
    }
    function onMouseMove(e) {
        if (!state.running || state.paused || !isDragging) return;
        var areaW = dom.gameArea.clientWidth;
        var halfW = getPlayerHalfWidth();
        var rect  = dom.gameArea.getBoundingClientRect();
        state.playerX = Math.max(halfW, Math.min(areaW - halfW, e.clientX - rect.left));
        updatePlayerDOM();
    }
    function onMouseUp() {
        isDragging = false;
        if (dom.player) dom.player.style.cursor = 'grab';
    }

    function getPlayerHalfWidth() {
        return (dom.player.offsetWidth || 70) / 2;
    }

    /* ── Pornire joc ── */
    function startGame() {
        // Oprire joc curent dacă există
        stopGameLoop();
        clearEggs();

        // Resetare stare
        state = {
            running:     true,
            paused:      false,
            levelingUp:  false,
            score:       0,
            highScore:   Storage.getHighScore(),
            lives:       INITIAL_LIVES,
            level:       1,
            maxLevel:    1,
            eggsCaught:  0,
            startTime:   Date.now(),
            playerX:     0,          // px de la stânga (inițializat la update)
            playerSpeed: 320,        // px/s
            eggs:        [],          // obiecte ou active
            powerups:    [],          // obiecte power-up active
            activePowerup: null,      // { type, endTime, totalDuration }
            lastSpawnTime: 0,
            spawnInterval: SPAWN_INTERVAL,
            currentSpeed:  BASE_SPEED,
            levelScore:    0          // scor în nivelul curent
        };

        // Centrăm playerul
        var areaW = dom.gameArea.clientWidth;
        state.playerX = areaW / 2;
        updatePlayerDOM();

        showScreen('game');
        updateHUD();
        dom.pauseOverlay.classList.add('hidden');
        dom.levelUpOverlay.classList.add('hidden');
        dom.powerupIndicator.classList.add('hidden');

        Audio.startMusic();

        lastTime = null;
        rafId = requestAnimationFrame(gameLoop);
    }

    /* ── Game loop principal ── */
    function gameLoop(timestamp) {
        if (!state.running) return;
        if (state.paused || state.levelingUp) {
            rafId = requestAnimationFrame(gameLoop);
            return;
        }

        if (!lastTime) lastTime = timestamp;
        var dt = Math.min((timestamp - lastTime) / 1000, 0.1); // secunde, max 100ms
        lastTime = timestamp;

        updatePlayer(dt);
        spawnEggs(timestamp);
        updateEggs(dt);
        updatePowerup(timestamp);
        checkCollisions();

        rafId = requestAnimationFrame(gameLoop);
    }

    /* ── Update player ── */
    function updatePlayer(dt) {
        var areaW = dom.gameArea.clientWidth;
        var halfW = getPlayerHalfWidth();
        var moved = false;
        var direction = 0;

        if (keys.left) {
            state.playerX -= state.playerSpeed * dt;
            direction = -1;
            moved = true;
        }
        if (keys.right) {
            state.playerX += state.playerSpeed * dt;
            direction = 1;
            moved = true;
        }

        state.playerX = Math.max(halfW, Math.min(areaW - halfW, state.playerX));
        updatePlayerDOM();

        // Animație direcție
        if (direction === -1) {
            dom.player.classList.add('moving-left');
            dom.player.classList.remove('moving-right');
        } else if (direction === 1) {
            dom.player.classList.add('moving-right');
            dom.player.classList.remove('moving-left');
        } else if (!moved) {
            dom.player.classList.remove('moving-left', 'moving-right');
        }

        // Magnet – atrage ouăle
        if (state.activePowerup && state.activePowerup.type === 'magnet') {
            state.eggs.forEach(function (egg) {
                var dx = state.playerX - egg.x;
                egg.x += dx * dt * 4; // atracție
            });
        }
    }

    function updatePlayerDOM() {
        dom.player.style.left = state.playerX + 'px';
    }

    /* ── Spawn ouă ── */
    function spawnEggs(timestamp) {
        if (timestamp - state.lastSpawnTime < state.spawnInterval) return;
        if (state.eggs.length + state.powerups.length >= MAX_EGGS_ON_SCREEN) return;

        state.lastSpawnTime = timestamp;

        // Șansă power-up
        if (Math.random() < POWERUP_CHANCE) {
            spawnPowerup();
        } else {
            spawnEgg();
        }
    }

    function spawnEgg() {
        var areaW = dom.gameArea.clientWidth;
        var type  = pickEggType();
        var x     = randomBetween(30, areaW - 30);

        var el = document.createElement('div');
        el.className = 'egg egg-' + type.color;
        el.innerHTML = '<span class="egg-icon">' + type.emoji + '</span>' +
                       '<span class="egg-label">' + (type.bad ? '-20' : '+' + type.points) + '</span>';
        el.style.left = x + 'px';
        el.style.top  = '-50px';
        dom.eggsContainer.appendChild(el);

        var eggObj = {
            el:     el,
            x:      x,
            y:      -50,
            type:   type.type,
            points: type.points,
            bad:    type.bad,
            speed:  state.currentSpeed + randomBetween(-20, 20),
            caught: false
        };
        state.eggs.push(eggObj);
    }

    function spawnPowerup() {
        var areaW  = dom.gameArea.clientWidth;
        var puType = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
        var x      = randomBetween(30, areaW - 30);

        var el = document.createElement('div');
        el.className = 'powerup powerup-' + puType.type;
        el.textContent = puType.emoji;
        el.style.left = x + 'px';
        el.style.top  = '-50px';
        dom.eggsContainer.appendChild(el);

        state.powerups.push({
            el:     el,
            x:      x,
            y:      -50,
            type:   puType.type,
            emoji:  puType.emoji,
            name:   puType.name,
            duration: puType.duration,
            speed:  state.currentSpeed * 0.75,
            caught: false
        });
    }

    function pickEggType() {
        // Ajustăm greutatea ouălor stricate în funcție de nivel
        var weights = EGG_TYPES.map(function (t) {
            if (t.bad) return Math.min(t.weight + (state.level - 1) * 3, 40);
            return t.weight;
        });
        var total = weights.reduce(function (s, w) { return s + w; }, 0);
        var r = Math.random() * total;
        var acc = 0;
        for (var i = 0; i < EGG_TYPES.length; i++) {
            acc += weights[i];
            if (r <= acc) return EGG_TYPES[i];
        }
        return EGG_TYPES[0];
    }

    /* ── Update ouă ── */
    function updateEggs(dt) {
        var areaH   = dom.gameArea.clientHeight;
        var toRemove = [];

        state.eggs.forEach(function (egg) {
            if (egg.caught) { toRemove.push(egg); return; }
            egg.y += egg.speed * dt;
            egg.el.style.top = egg.y + 'px';
            egg.el.style.left = egg.x + 'px';

            // Ou a căzut pe jos
            if (egg.y > areaH) {
                if (!egg.bad) {
                    // Ou bun ratat – pierdere viată
                    loseLife();
                }
                removeEgg(egg);
                toRemove.push(egg);
            }
        });

        // Actualizăm și power-up-urile
        state.powerups.forEach(function (pu) {
            if (pu.caught) { toRemove.push(pu); return; }
            pu.y += pu.speed * dt;
            pu.el.style.top  = pu.y + 'px';
            pu.el.style.left = pu.x + 'px';
            if (pu.y > areaH) {
                removeEggEl(pu.el);
                toRemove.push(pu);
            }
        });

        // Curăță lista
        state.eggs    = state.eggs.filter(function (e) { return !toRemove.includes(e); });
        state.powerups = state.powerups.filter(function (p) { return !toRemove.includes(p); });
    }

    /* ── Coliziuni ── */
    function checkCollisions() {
        var playerRect = dom.player.getBoundingClientRect();
        var gameRect   = dom.gameArea.getBoundingClientRect();

        // Zona de prindere (coșul + puțin deasupra)
        var catchLeft   = playerRect.left   - gameRect.left  - 10;
        var catchRight  = playerRect.right  - gameRect.left  + 10;
        var catchTop    = playerRect.top    - gameRect.top   - 20;
        var catchBottom = playerRect.bottom - gameRect.top;

        // Ouă
        state.eggs.forEach(function (egg) {
            if (egg.caught) return;
            var ex = egg.x;
            var ey = egg.y;
            if (ex >= catchLeft && ex <= catchRight && ey >= catchTop && ey <= catchBottom) {
                catchEgg(egg);
            }
        });

        // Power-ups
        state.powerups.forEach(function (pu) {
            if (pu.caught) return;
            var px = pu.x;
            var py = pu.y;
            if (px >= catchLeft && px <= catchRight && py >= catchTop && py <= catchBottom) {
                catchPowerup(pu);
            }
        });
    }

    function catchEgg(egg) {
        egg.caught = true;

        // Scut activ – ignorăm ouăle stricate
        if (egg.bad && state.activePowerup && state.activePowerup.type === 'shield') {
            showScorePopup(egg.x, egg.y, '🛡️');
            removeEgg(egg);
            return;
        }

        var pts = egg.points;
        if (state.activePowerup && state.activePowerup.type === 'double' && !egg.bad) {
            pts *= 2;
        }

        addScore(pts, egg.x, egg.y, !egg.bad);

        if (!egg.bad) {
            state.eggsCaught++;
            // Animație player
            dom.player.classList.remove('catching');
            void dom.player.offsetWidth; // reflow
            dom.player.classList.add('catching');
            setTimeout(function () { dom.player.classList.remove('catching'); }, 300);

            // Confetti
            spawnConfetti(egg.x, egg.y, egg.type);

            // Sunet
            if (egg.type === 'golden')  Audio.playGoldenCatch();
            else if (egg.type === 'glitter') Audio.playGlitterCatch();
            else                        Audio.playCatch();
        } else {
            // Ou stricat
            Audio.playBadEgg();
            shakeScreen();
        }

        removeEgg(egg);
    }

    function catchPowerup(pu) {
        pu.caught = true;
        Audio.playPowerUp();

        if (pu.type === 'life') {
            state.lives = Math.min(state.lives + 1, 5);
            updateHUD();
            showScorePopup(pu.x, pu.y, '❤️ +1', true);
        } else {
            activatePowerup(pu);
        }
        spawnConfetti(pu.x, pu.y, 'golden');
        removeEggEl(pu.el);
    }

    /* ── Power-ups ── */
    function activatePowerup(pu) {
        state.activePowerup = {
            type:          pu.type,
            emoji:         pu.emoji,
            name:          pu.name,
            endTime:       Date.now() + pu.duration,
            totalDuration: pu.duration
        };
        dom.powerupIcon.textContent = pu.emoji;
        dom.powerupName.textContent = pu.name;
        dom.powerupIndicator.classList.remove('hidden');
        dom.powerupTimerFill.style.width = '100%';
    }

    function updatePowerup(timestamp) {
        if (!state.activePowerup) return;
        var now  = Date.now();
        var left = state.activePowerup.endTime - now;
        if (left <= 0) {
            state.activePowerup = null;
            dom.powerupIndicator.classList.add('hidden');
            return;
        }
        var pct = (left / state.activePowerup.totalDuration) * 100;
        dom.powerupTimerFill.style.width = pct + '%';
    }

    /* ── Scor și vieți ── */
    function addScore(pts, x, y, positive) {
        state.score += pts;
        if (state.score < 0) state.score = 0;

        showScorePopup(x, y, (pts > 0 ? '+' : '') + pts, positive !== false);

        // Verificare nivel nou
        checkLevelUp();
        updateHUD();
    }

    function checkLevelUp() {
        var newLevel = Math.floor(state.score / LEVEL_SCORE_STEP) + 1;
        if (newLevel > state.level) {
            state.level = newLevel;
            if (newLevel > state.maxLevel) state.maxLevel = newLevel;
            // Crește dificultatea
            state.currentSpeed   = BASE_SPEED   + (state.level - 1) * SPEED_INCREMENT;
            state.spawnInterval  = Math.max(MIN_SPAWN, SPAWN_INTERVAL - (state.level - 1) * SPAWN_DECREMENT);
            Audio.playLevelUp();
            showLevelUpOverlay();
        }
    }

    function showLevelUpOverlay() {
        dom.newLevelNum.textContent = state.level;
        dom.levelUpOverlay.classList.remove('hidden');
        state.levelingUp = true;
        spawnLevelParticles();
        setTimeout(function () {
            dom.levelUpOverlay.classList.add('hidden');
            state.levelingUp = false;
            lastTime = null; // evităm un delta-time mare la reluare
        }, 2000);
    }

    function loseLife() {
        state.lives--;
        Audio.playLifeLost();
        shakeScreen();
        updateHUD();

        if (state.lives <= 0) {
            endGame(false);
        }
    }

    /* ── HUD ── */
    function updateHUD() {
        dom.hud.score.textContent     = state.score;
        dom.hud.highscore.textContent = Math.max(state.score, state.highScore);
        dom.hud.level.textContent     = state.level;
        dom.hud.lives.textContent     = '❤️'.repeat(Math.max(0, state.lives));

        // Bară progres nivel
        var levelBase  = (state.level - 1) * LEVEL_SCORE_STEP;
        var levelEnd   = state.level * LEVEL_SCORE_STEP;
        var pct        = ((state.score - levelBase) / (levelEnd - levelBase)) * 100;
        dom.hud.progFill.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    /* ── Efecte vizuale ── */
    function showScorePopup(x, y, text, positive) {
        var el = document.createElement('div');
        el.className = 'score-popup ' + (positive !== false ? 'positive' : 'negative');
        el.textContent = text;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        dom.effectsContainer.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1000);
    }

    function spawnConfetti(x, y, type) {
        var colors = {
            red:     ['#FF6B6B','#FF8FAB'],
            blue:    ['#6BB5FF','#4488FF'],
            green:   ['#6BFF6B','#44BB44'],
            yellow:  ['#FFD700','#FFEE44'],
            glitter: ['#FFEE44','#FFFFFF','#FFB800'],
            golden:  ['#FFD700','#FF8C00','#FFF8DC'],
            bad:     ['#888','#555'],
            default: ['#FFB7C5','#B5EAD7','#FFEAA0','#C7DCFF']
        };
        var palette = colors[type] || colors['default'];
        for (var i = 0; i < 10; i++) {
            var el  = document.createElement('div');
            el.className = 'confetti-piece';
            var size  = randomBetween(6, 12);
            var angle = randomBetween(0, 360);
            var dist  = randomBetween(20, 60);
            el.style.width  = size + 'px';
            el.style.height = size + 'px';
            el.style.background = palette[Math.floor(Math.random() * palette.length)];
            el.style.left = (x + Math.cos(angle * Math.PI / 180) * dist) + 'px';
            el.style.top  = (y + Math.sin(angle * Math.PI / 180) * dist) + 'px';
            el.style.animationDuration = randomBetween(400, 700) + 'ms';
            dom.effectsContainer.appendChild(el);
            setTimeout(function (e) { if (e.parentNode) e.parentNode.removeChild(e); }, 700, el);
        }
    }

    function spawnLevelParticles() {
        var emojis = ['🥚','🌸','✨','🌷','🐣','⭐'];
        for (var i = 0; i < 20; i++) {
            var el = document.createElement('div');
            el.className = 'level-particle';
            var startX = randomBetween(10, window.innerWidth - 10);
            var startY = randomBetween(10, window.innerHeight - 10);
            var dx = randomBetween(-150, 150);
            var dy = randomBetween(-200, -50);
            var dr = randomBetween(-360, 360) + 'deg';
            el.style.left = startX + 'px';
            el.style.top  = startY + 'px';
            el.style.setProperty('--dx', dx + 'px');
            el.style.setProperty('--dy', dy + 'px');
            el.style.setProperty('--dr', dr);
            el.style.animationDelay    = randomBetween(0, 500) + 'ms';
            el.style.animationDuration = randomBetween(1000, 1800) + 'ms';
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            document.body.appendChild(el);
            setTimeout(function (e) { if (e.parentNode) e.parentNode.removeChild(e); }, 2500, el);
        }
    }

    function shakeScreen() {
        var s = dom.screens.game;
        s.classList.add('shaking');
        s.classList.remove('life-lost');
        void s.offsetWidth;
        s.classList.add('life-lost');
        setTimeout(function () {
            s.classList.remove('shaking', 'life-lost');
        }, 500);
    }

    /* ── Pauză ── */
    function togglePause() {
        if (!state.running) return;
        state.paused = !state.paused;
        dom.pauseOverlay.classList.toggle('hidden', !state.paused);
        dom.btnPause.textContent = state.paused ? '▶️' : '⏸️';
        if (state.paused) {
            Audio.stopMusic();
        } else {
            Audio.startMusic();
            lastTime = null; // resetăm dt pentru a evita jump
        }
    }

    /* ── Terminare joc ── */
    function endGame(quit) {
        state.running = false;
        stopGameLoop();

        var timePlayed = Math.floor((Date.now() - state.startTime) / 1000);
        var isNewHigh  = Storage.updateHighScore(state.score);
        Storage.saveLastScore(state.score);
        Storage.updateStats({
            eggsCaught: state.eggsCaught,
            maxLevel:   state.maxLevel,
            timePlayed: timePlayed
        });

        Audio.stopMusic();
        if (!quit) Audio.playGameOver();

        if (!quit) {
            // Ecran game over
            dom.go.score.textContent     = state.score;
            dom.go.highscore.textContent = Storage.getHighScore();
            dom.go.level.textContent     = state.maxLevel;
            dom.go.eggs.textContent      = state.eggsCaught;
            dom.go.time.textContent      = formatTime(timePlayed);
            dom.go.banner.classList.toggle('hidden', !isNewHigh);
            showScreen('gameover');
        } else {
            showScreen('menu');
            dom.menu.highscore.textContent = Storage.getHighScore();
        }
        clearEggs();
    }

    /* ── Helper: oprire loop ── */
    function stopGameLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        lastTime = null;
    }

    function clearEggs() {
        if (dom.eggsContainer) dom.eggsContainer.innerHTML = '';
        if (dom.effectsContainer) dom.effectsContainer.innerHTML = '';
        if (state) {
            state.eggs    = [];
            state.powerups = [];
        }
    }

    function removeEgg(egg) {
        removeEggEl(egg.el);
    }

    function removeEggEl(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    /* ── Statistici ── */
    function showStats() {
        var s   = Storage.getStats();
        var hs  = Storage.getHighScore();
        var ld  = Storage.load();
        dom.stats.highscore.textContent = hs;
        dom.stats.eggs.textContent      = s.totalEggsCaught;
        dom.stats.level.textContent     = s.maxLevel;
        dom.stats.time.textContent      = formatTime(s.totalTimePlayed);
        dom.stats.games.textContent     = s.gamesPlayed;
        dom.stats.last.textContent      = ld.lastScore || 0;
    }

    /* ── Helpers ── */
    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function formatTime(seconds) {
        if (seconds < 60)   return seconds + 's';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ' + (seconds % 60) + 's';
        return Math.floor(seconds / 3600) + 'h ' + Math.floor((seconds % 3600) / 60) + 'm';
    }

    /* ── DOMContentLoaded ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}(window));
