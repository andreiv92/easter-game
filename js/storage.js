/**
 * storage.js – Gestionare LocalStorage
 * Scoruri, setări și statistici pentru Easter Egg Catcher
 */
(function (global) {
    'use strict';

    var STORAGE_KEY = 'easterEggCatcher_v1';

    /** Structura implicită a datelor salvate */
    var defaultData = {
        highScore:   0,
        lastScore:   0,
        settings: {
            sound: true,
            music: false,
            lang:  'ro'
        },
        stats: {
            totalEggsCaught: 0,
            maxLevel:        1,
            totalTimePlayed: 0,  // în secunde
            gamesPlayed:     0
        }
    };

    /** Citește datele din LocalStorage (sau returnează valorile implicite) */
    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return JSON.parse(JSON.stringify(defaultData));
            var data = JSON.parse(raw);
            // Asigurăm că toate câmpurile există (upgrade versiune)
            data.settings = Object.assign({}, defaultData.settings,  data.settings  || {});
            data.stats    = Object.assign({}, defaultData.stats,     data.stats     || {});
            if (typeof data.highScore !== 'number') data.highScore = 0;
            if (typeof data.lastScore !== 'number') data.lastScore = 0;
            return data;
        } catch (e) {
            console.warn('[Storage] Eroare la citire:', e);
            return JSON.parse(JSON.stringify(defaultData));
        }
    }

    /** Salvează datele în LocalStorage */
    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[Storage] Eroare la salvare:', e);
        }
    }

    /** Returnează high score-ul salvat */
    function getHighScore() {
        return load().highScore;
    }

    /**
     * Actualizează high score dacă scorul curent e mai mare.
     * @returns {boolean} true dacă s-a bătut recordul
     */
    function updateHighScore(score) {
        var data = load();
        if (score > data.highScore) {
            data.highScore = score;
            save(data);
            return true;
        }
        return false;
    }

    /** Salvează ultimul scor */
    function saveLastScore(score) {
        var data = load();
        data.lastScore = score;
        save(data);
    }

    /** Returnează setările salvate */
    function getSettings() {
        return load().settings;
    }

    /** Salvează setările */
    function saveSettings(settings) {
        var data = load();
        data.settings = Object.assign({}, data.settings, settings);
        save(data);
    }

    /** Returnează statisticile */
    function getStats() {
        return load().stats;
    }

    /**
     * Actualizează statisticile după o rundă.
     * @param {object} roundStats - { eggsCaught, maxLevel, timePlayed }
     */
    function updateStats(roundStats) {
        var data = load();
        data.stats.totalEggsCaught += (roundStats.eggsCaught || 0);
        data.stats.gamesPlayed     += 1;
        data.stats.totalTimePlayed += (roundStats.timePlayed || 0);
        if ((roundStats.maxLevel || 1) > data.stats.maxLevel) {
            data.stats.maxLevel = roundStats.maxLevel;
        }
        save(data);
    }

    /** Resetează toate statisticile (nu și high score-ul) */
    function resetStats() {
        var data = load();
        data.stats = JSON.parse(JSON.stringify(defaultData.stats));
        save(data);
    }

    /** Resetează totul */
    function resetAll() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }

    /* Export public */
    global.Storage = {
        getHighScore:    getHighScore,
        updateHighScore: updateHighScore,
        saveLastScore:   saveLastScore,
        getSettings:     getSettings,
        saveSettings:    saveSettings,
        getStats:        getStats,
        updateStats:     updateStats,
        resetStats:      resetStats,
        resetAll:        resetAll,
        load:            load
    };

}(window));
