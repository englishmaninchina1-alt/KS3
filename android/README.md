# WordLab KS3 — Android app

A thin native shell (`com.wordlab.ks3`) that opens <https://ks3.freebuff.page> in a
WebView. The web app is the product; the shell exists to give it a home-screen icon,
a proper back stack and the two things Android WebView lacks:

- **Speech** — WebView has no Web Speech API, so `res/raw/tts_shim.js` is injected
  into the page `<head>` before the bundle runs. It presents a
  `speechSynthesis`-compatible facade backed by Android's TextToSpeech engine
  (British English voice when installed), exposed as `window.WordLabTTS`.
- **Microphone** — `RECORD_AUDIO` plus a `WebChromeClient` permission grant, so the
  pronunciation studio's recorder works.

Local storage, cookies and the service worker all persist normally, so XP, profiles
and progress behave as they do in Chrome.

## Build

The build is Gradle-free; `build_apk.sh` drives `aapt2 → javac → d8 → zipalign →
apksigner` and writes `public/wordlab-android.apk`.

Requirements: JDK 17 (`JAVA_HOME`) and Android SDK (`ANDROID_HOME`) with
`platforms;android-34` and `build-tools;34.0.0`.

```bash
JAVA_HOME=~/tools/jdk ANDROID_HOME=~/tools/sdk ./android/build_apk.sh
```

`android/wordlab.jks` holds the self-signed release key. Its store/key password is
`wordlab` — that is a fixed passphrase for update compatibility, not a secret, and
it must keep being used so later builds install over earlier ones instead of
failing with `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

## Versioning

Bump `android:versionCode` / `android:versionName` in `AndroidManifest.xml` for each
release — `aapt2` reads them from the manifest, so that is the single place to
change. Android refuses to install a build whose versionCode is not higher than
the installed one.
