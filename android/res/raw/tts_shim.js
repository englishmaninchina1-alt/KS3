/*
 * Android WebView has no Web Speech API, so the pronunciation studio would
 * silently lose its audio. This shim is injected into the page's <head> before
 * the app bundle runs and exposes a speechSynthesis-compatible facade backed by
 * the native TextToSpeech engine (via the WordLabTTS JavaScript interface).
 */
(function () {
  /*
   * Older builds let the site's service worker take over navigations, which
   * bypassed this injection and left the app with no speech at all. Drop any
   * registration left behind before doing anything else.
   */
  if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
    navigator.serviceWorker.getRegistrations().then(function (list) {
      list.forEach(function (registration) {
        registration.unregister();
      });
    }).catch(function () {});
  }

  if (!window.WordLabTTS) return;

  var current = null;

  function Utterance(text) {
    this.text = String(text == null ? '' : text);
    this.lang = 'en-GB';
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
    this.onstart = null;
    this.onpause = null;
    this.onresume = null;
    this.onboundary = null;
  }
  Utterance.prototype.addEventListener = function () {};
  Utterance.prototype.removeEventListener = function () {};
  Utterance.prototype.dispatchEvent = function () { return true; };

  var synth = {
    speaking: false,
    pending: false,
    paused: false,
    onvoiceschanged: null,

    getVoices: function () {
      try {
        return JSON.parse(window.WordLabTTS.voices()) || [];
      } catch (e) {
        return [];
      }
    },

    speak: function (utterance) {
      if (!utterance) return;
      if (current && typeof current.onend === 'function') {
        try { current.onend({ type: 'end' }); } catch (e) {}
      }
      current = utterance;
      this.speaking = true;
      this.paused = false;
      if (typeof utterance.onstart === 'function') {
        try { utterance.onstart({ type: 'start' }); } catch (e) {}
      }
      try {
        window.WordLabTTS.speak(
          String(utterance.text || ''),
          Number(utterance.rate) || 1,
          Number(utterance.pitch) || 1
        );
      } catch (e) {
        window.__wordlabTtsError();
      }
    },

    cancel: function () {
      current = null;
      this.speaking = false;
      this.paused = false;
      try { window.WordLabTTS.stop(); } catch (e) {}
    },

    pause: function () { this.paused = true; },
    resume: function () { this.paused = false; },
    addEventListener: function () {},
    removeEventListener: function () {}
  };

  /* Called by MainActivity when the native engine finishes or fails. */
  window.__wordlabTtsDone = function () {
    var finished = current;
    current = null;
    synth.speaking = false;
    if (finished && typeof finished.onend === 'function') {
      try { finished.onend({ type: 'end' }); } catch (e) {}
    }
  };

  window.__wordlabTtsError = function () {
    var failed = current;
    current = null;
    synth.speaking = false;
    if (failed && typeof failed.onerror === 'function') {
      try { failed.onerror({ type: 'error', error: 'tts-failed' }); } catch (e) {}
    }
  };

  try {
    Object.defineProperty(window, 'speechSynthesis', {
      value: synth,
      configurable: true,
      writable: true
    });
  } catch (e) {
    window.speechSynthesis = synth;
  }

  if (!window.SpeechSynthesisUtterance) {
    window.SpeechSynthesisUtterance = Utterance;
  }
})();
