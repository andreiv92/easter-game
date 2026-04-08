/**
 * audio.js – Efecte sonore generate procedural cu Web Audio API
 * Easter Egg Catcher
 */
(function (global) {
    'use strict';

    var ctx = null;
    var enabled = true;
    var musicEnabled = false;
    var musicNode = null;
    var musicGain = null;

    /** Inițializează AudioContext (lazy, la primul interact utilizator) */
    function init() {
        if (ctx) {
            if (ctx.state === 'suspended') ctx.resume();
            return;
        }
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            ctx = new AudioCtx();
        } catch (e) {
            console.warn('[Audio] Nu se poate inițializa AudioContext:', e);
        }
    }

    /** Helper – redă un oscillator simplu */
    function playTone(frequency, type, duration, gainValue, startDelay, endGain) {
        if (!enabled || !ctx) return;
        try {
            var osc  = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(frequency, ctx.currentTime + (startDelay || 0));
            gain.gain.setValueAtTime(gainValue || 0.3, ctx.currentTime + (startDelay || 0));
            gain.gain.exponentialRampToValueAtTime(
                endGain || 0.001,
                ctx.currentTime + (startDelay || 0) + duration
            );
            osc.start(ctx.currentTime + (startDelay || 0));
            osc.stop(ctx.currentTime  + (startDelay || 0) + duration);
        } catch (e) { /* silently ignore */ }
    }

    /** Helper – efect noise (burst de zgomot alb) */
    function playNoise(duration, gainValue, startDelay) {
        if (!enabled || !ctx) return;
        try {
            var bufSize  = ctx.sampleRate * duration;
            var buffer   = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            var data     = buffer.getChannelData(0);
            for (var i = 0; i < bufSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            var source = ctx.createBufferSource();
            source.buffer = buffer;
            var gain = ctx.createGain();
            gain.gain.setValueAtTime(gainValue || 0.2, ctx.currentTime + (startDelay || 0));
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (startDelay || 0) + duration);
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start(ctx.currentTime + (startDelay || 0));
        } catch (e) { /* silently ignore */ }
    }

    // ── Sunete de joc ──

    /** Prinderea unui ou normal */
    function playCatch() {
        init();
        playTone(440, 'sine',     0.08, 0.25);
        playTone(660, 'sine',     0.12, 0.2,  0.06);
        playTone(880, 'triangle', 0.1,  0.15, 0.14);
    }

    /** Prinderea oului auriu */
    function playGoldenCatch() {
        init();
        var notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        for (var i = 0; i < notes.length; i++) {
            playTone(notes[i], 'sine', 0.18, 0.25, i * 0.07);
        }
        playNoise(0.15, 0.05, 0.1);
    }

    /** Ou stricat prins (sunet negativ) */
    function playBadEgg() {
        init();
        playTone(220, 'sawtooth', 0.12, 0.3);
        playTone(180, 'sawtooth', 0.15, 0.25, 0.08);
        playTone(150, 'square',   0.1,  0.2,  0.18);
        playNoise(0.1, 0.1);
    }

    /** Ou bun căzut pe jos (pierdere viață) */
    function playLifeLost() {
        init();
        playTone(400, 'sine',  0.15, 0.3);
        playTone(300, 'sine',  0.2,  0.3,  0.12);
        playTone(200, 'sine',  0.25, 0.3,  0.28);
        playNoise(0.2, 0.12, 0.1);
    }

    /** Level up */
    function playLevelUp() {
        init();
        var melody = [523, 659, 784, 1047, 1319]; // C E G C E
        for (var i = 0; i < melody.length; i++) {
            playTone(melody[i], 'sine', 0.2, 0.3, i * 0.1);
        }
        // Chord final
        playTone(1047, 'triangle', 0.4, 0.3, melody.length * 0.1);
        playTone(1319, 'triangle', 0.4, 0.2, melody.length * 0.1);
    }

    /** Game over */
    function playGameOver() {
        init();
        var notes = [523, 415, 330, 262]; // C E3 E3 C4 descrescător
        for (var i = 0; i < notes.length; i++) {
            playTone(notes[i], 'sine', 0.3, 0.3, i * 0.18);
        }
        playNoise(0.2, 0.08, 0.6);
    }

    /** Power-up colectat */
    function playPowerUp() {
        init();
        playTone(659, 'sine',     0.08, 0.3);
        playTone(784, 'sine',     0.08, 0.28, 0.07);
        playTone(1047, 'triangle',0.15, 0.25, 0.14);
    }

    /** Ou cu glitter */
    function playGlitterCatch() {
        init();
        playTone(528, 'sine',     0.1,  0.25);
        playTone(792, 'triangle', 0.12, 0.2, 0.08);
        playNoise(0.08, 0.05, 0.04);
    }

    /** Click UI */
    function playClick() {
        init();
        playTone(800, 'sine', 0.06, 0.15);
    }

    // ── Muzică de fundal (simplă, procedurală) ──

    function startMusic() {
        if (!musicEnabled) return;
        init();
        if (!ctx) return;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        stopMusic();
        try {
            musicGain = ctx.createGain();
            musicGain.gain.setValueAtTime(0.06, ctx.currentTime);
            musicGain.connect(ctx.destination);

            var scale = [261, 294, 330, 349, 392, 440, 494, 523];
            var melody = [4, 4, 5, 5, 6, 6, 5, 0, 3, 3, 4, 4, 5, 5, 4, 0,
                          2, 2, 3, 3, 4, 4, 3, 0, 4, 4, 5, 5, 6, 6, 5, 0];
            var bpm = 120;
            var beatDur = 60 / bpm;
            var totalDuration = melody.length * beatDur;

            function scheduleNote(index) {
                var loop = Math.floor(index / melody.length);
                var pos  = index % melody.length;
                var freq = scale[melody[pos]];
                var time = ctx.currentTime + pos * beatDur + loop * totalDuration;
                var osc  = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);
                var g = ctx.createGain();
                g.gain.setValueAtTime(0.8, time);
                g.gain.exponentialRampToValueAtTime(0.001, time + beatDur * 0.85);
                osc.connect(g);
                g.connect(musicGain);
                osc.start(time);
                osc.stop(time + beatDur);
            }

            // Planifică prima trecere
            for (var i = 0; i < melody.length; i++) {
                scheduleNote(i);
            }

            // Repetă cu setTimeout
            musicNode = setInterval(function () {
                for (var j = 0; j < melody.length; j++) {
                    scheduleNote(j);
                }
            }, totalDuration * 1000);
        } catch (e) {
            console.warn('[Audio] Eroare muzică:', e);
        }
    }

    function stopMusic() {
        if (musicNode) {
            clearInterval(musicNode);
            musicNode = null;
        }
        if (musicGain) {
            try {
                musicGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            } catch (e) {}
            musicGain = null;
        }
    }

    /** Setează starea sunetelor (on/off) */
    function setEnabled(val) {
        enabled = !!val;
        if (!enabled) stopMusic();
    }

    /** Setează starea muzicii (on/off) */
    function setMusicEnabled(val) {
        musicEnabled = !!val;
        if (!musicEnabled) {
            stopMusic();
        }
    }

    function isEnabled()      { return enabled; }
    function isMusicEnabled() { return musicEnabled; }

    /* Export public */
    global.Audio = {
        init:            init,
        playCatch:       playCatch,
        playGoldenCatch: playGoldenCatch,
        playGlitterCatch:playGlitterCatch,
        playBadEgg:      playBadEgg,
        playLifeLost:    playLifeLost,
        playLevelUp:     playLevelUp,
        playGameOver:    playGameOver,
        playPowerUp:     playPowerUp,
        playClick:       playClick,
        startMusic:      startMusic,
        stopMusic:       stopMusic,
        setEnabled:      setEnabled,
        setMusicEnabled: setMusicEnabled,
        isEnabled:       isEnabled,
        isMusicEnabled:  isMusicEnabled
    };

}(window));
