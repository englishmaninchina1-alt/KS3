package com.wordlab.ks3;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;

/**
 * Thin native shell around the WordLab KS3 web app.
 *
 * The site is the product: this activity keeps the learner on ks3.freebuff.page,
 * renders it at the same scale Chrome would, and fills the one real gap in
 * Android WebView (no Web Speech API) with a native TextToSpeech bridge.
 */
public class MainActivity extends Activity {

  private static final String TAG = "WordLab";
  private static final String START_URL = "https://ks3.freebuff.page/";
  private static final String SITE_HOST = "ks3.freebuff.page";
  private static final String SPEECH_DONE_JS =
      "window.__wordlabTtsDone && window.__wordlabTtsDone();";
  private static final String SPEECH_ERROR_JS =
      "window.__wordlabTtsError && window.__wordlabTtsError();";
  private static final String NO_SERVICE_WORKER_JS =
      "/* WordLab: the shell is injected natively, so the site worker is disabled. */\n";
  private static final int MIC_REQUEST = 4101;

  private WebView web;
  private LinearLayout errorPanel;
  private TextToSpeech tts;
  private boolean ttsReady;
  private String pendingText;
  private float pendingRate = 1f;
  private float pendingPitch = 1f;
  private PermissionRequest pendingMic;
  private String shimJs = "";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    getWindow().setStatusBarColor(Color.parseColor("#4C1D95"));
    getWindow().setNavigationBarColor(Color.parseColor("#F7F3FF"));

    shimJs = readAsset("tts_shim.js");

    FrameLayout root = new FrameLayout(this);
    root.setBackgroundColor(Color.parseColor("#F7F3FF"));

    web = new WebView(this);
    configureWebView();
    root.addView(web, new FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    errorPanel = buildOfflinePanel();
    errorPanel.setVisibility(View.GONE);
    root.addView(errorPanel, new FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    setContentView(root);
    startTts();

    if (savedInstanceState != null) {
      web.restoreState(savedInstanceState);
    } else {
      web.loadUrl(START_URL);
    }
  }

  private void configureWebView() {
    WebSettings settings = web.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setDatabaseEnabled(true);
    settings.setAllowFileAccess(false);
    settings.setAllowContentAccess(false);
    settings.setMediaPlaybackRequiresUserGesture(false);
    settings.setJavaScriptCanOpenWindowsAutomatically(false);

    // Render exactly like Chrome on Android: honour the page's viewport meta tag
    // and never fit-to-width, which shrank the whole layout on wide tablets and
    // in split screen. Text zoom is pinned to 100% so a device-wide font scale
    // cannot break the designed layout.
    settings.setUseWideViewPort(true);
    settings.setLoadWithOverviewMode(false);
    settings.setTextZoom(100);
    web.setInitialScale(0);
    settings.setSupportZoom(false);
    settings.setBuiltInZoomControls(false);
    settings.setDisplayZoomControls(false);

    // The site is a light, violet-and-cream design; the Android "force dark"
    // transform would invert it and make text unreadable.
    if (Build.VERSION.SDK_INT >= 33) {
      settings.setAlgorithmicDarkeningAllowed(false);
    } else if (Build.VERSION.SDK_INT >= 29) {
      settings.setForceDark(WebSettings.FORCE_DARK_OFF);
    }

    settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    settings.setUserAgentString(settings.getUserAgentString() + " WordLabAndroid/1.1");

    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);

    web.setBackgroundColor(Color.parseColor("#F7F3FF"));
    web.setOverScrollMode(View.OVER_SCROLL_NEVER);
    web.addJavascriptInterface(new TtsBridge(), "WordLabTTS");
    web.setWebViewClient(new SiteClient());
    web.setWebChromeClient(new SiteChrome());
  }

  /** Reads the injected script from res/raw. */
  private String readAsset(String name) {
    try {
      int id = getResources().getIdentifier(name, "raw", getPackageName());
      if (id == 0) return "";
      InputStream in = getResources().openRawResource(id);
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      byte[] buffer = new byte[4096];
      int read;
      while ((read = in.read(buffer)) > 0) out.write(buffer, 0, read);
      in.close();
      return new String(out.toByteArray(), "UTF-8");
    } catch (Exception e) {
      Log.w(TAG, "Could not read " + name, e);
      return "";
    }
  }

  private String fetchHtml(String url) {
    HttpURLConnection connection = null;
    try {
      connection = (HttpURLConnection) new URL(url).openConnection();
      connection.setConnectTimeout(15000);
      connection.setReadTimeout(20000);
      connection.setInstanceFollowRedirects(true);
      connection.setRequestProperty("Accept", "text/html,application/xhtml+xml");
      connection.setRequestProperty("Accept-Encoding", "gzip");
      connection.setRequestProperty("Cache-Control", "no-cache");
      int code = connection.getResponseCode();
      if (code < 200 || code >= 300) return null;
      InputStream in = connection.getInputStream();
      String encoding = connection.getContentEncoding();
      if (encoding != null && encoding.toLowerCase(Locale.ENGLISH).contains("gzip")) {
        in = new GZIPInputStream(in);
      }
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      byte[] buffer = new byte[8192];
      int read;
      while ((read = in.read(buffer)) > 0) out.write(buffer, 0, read);
      in.close();
      return new String(out.toByteArray(), "UTF-8");
    } catch (Exception e) {
      Log.w(TAG, "Could not fetch " + url, e);
      return null;
    } finally {
      if (connection != null) connection.disconnect();
    }
  }

  private final class SiteClient extends WebViewClient {

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
      Uri uri = request.getUrl();
      String scheme = uri.getScheme() == null ? "" : uri.getScheme();
      String host = uri.getHost() == null ? "" : uri.getHost();
      boolean isWeb = "https".equals(scheme) || "http".equals(scheme);
      if (isWeb && (SITE_HOST.equals(host) || host.endsWith("." + SITE_HOST))) {
        return false;
      }
      try {
        startActivity(new Intent(Intent.ACTION_VIEW, uri));
      } catch (ActivityNotFoundException ignored) {
        // Nothing on the device can open this link; staying put is fine.
      }
      return true;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
      Uri uri = request.getUrl();
      if (!SITE_HOST.equals(uri.getHost())) return null;
      String path = uri.getPath() == null ? "/" : uri.getPath();

      // A service worker would answer navigations itself, bypassing the shim
      // injection below — which silently removed all speech on the second launch.
      // The app does not need offline caching, so the worker is stubbed out.
      if ("/sw.js".equals(path)) {
        return new WebResourceResponse("application/javascript", "utf-8",
            new ByteArrayInputStream(NO_SERVICE_WORKER_JS.getBytes()));
      }

      if (shimJs.isEmpty() || !"GET".equals(request.getMethod())) return null;
      if (!"/".equals(path) && !"/index.html".equals(path)) return null;

      String html = fetchHtml(uri.toString());
      if (html == null) return null;

      String script = "<script>" + shimJs + "</script>";
      Matcher head = Pattern.compile("(?i)<head[^>]*>").matcher(html);
      if (head.find()) {
        html = head.replaceFirst(Matcher.quoteReplacement(head.group() + script));
      } else {
        html = script + html;
      }
      return new WebResourceResponse("text/html", "utf-8",
          new ByteArrayInputStream(html.getBytes()));
    }

    @Override
    public void onPageFinished(WebView view, String url) {
      if (errorPanel != null && errorPanel.getVisibility() == View.VISIBLE) {
        errorPanel.setVisibility(View.GONE);
      }
    }

    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
      if (request.isForMainFrame() && errorPanel != null) {
        errorPanel.setVisibility(View.VISIBLE);
      }
    }
  }

  private final class SiteChrome extends WebChromeClient {
    @Override
    public void onPermissionRequest(final PermissionRequest request) {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          boolean wantsAudio = false;
          for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) wantsAudio = true;
          }
          if (!wantsAudio) {
            request.deny();
            return;
          }
          if (checkSelfPermission(android.Manifest.permission.RECORD_AUDIO)
              == PackageManager.PERMISSION_GRANTED) {
            request.grant(request.getResources());
          } else {
            pendingMic = request;
            requestPermissions(
                new String[] { android.Manifest.permission.RECORD_AUDIO }, MIC_REQUEST);
          }
        }
      });
    }
  }

  @Override
  public void onRequestPermissionsResult(int code, String[] permissions, int[] results) {
    if (code != MIC_REQUEST) {
      super.onRequestPermissionsResult(code, permissions, results);
      return;
    }
    PermissionRequest request = pendingMic;
    pendingMic = null;
    if (request == null) return;
    if (results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED) {
      request.grant(request.getResources());
    } else {
      request.deny();
    }
  }

  private void startTts() {
    tts = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
      @Override
      public void onInit(int status) {
        if (tts == null) return;
        if (status != TextToSpeech.SUCCESS) {
          Log.w(TAG, "TextToSpeech failed to initialise: " + status);
          return;
        }

        // Speech must go out on the media stream, otherwise some devices play
        // it into a muted/voice-call route and the learner hears nothing.
        tts.setAudioAttributes(new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build());

        Locale uk = new Locale("en", "GB");
        int result = tts.setLanguage(uk);
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
          tts.setLanguage(Locale.ENGLISH);
        }

        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
          @Override
          public void onStart(String utteranceId) {
          }

          @Override
          public void onDone(String utteranceId) {
            runOnUiThread(new Runnable() {
              @Override
              public void run() {
                if (web != null) web.evaluateJavascript(SPEECH_DONE_JS, null);
              }
            });
          }

          @Override
          public void onError(String utteranceId) {
            Log.w(TAG, "Speech failed for " + utteranceId);
            runOnUiThread(new Runnable() {
              @Override
              public void run() {
                if (web != null) web.evaluateJavascript(SPEECH_ERROR_JS, null);
              }
            });
          }
        });

        ttsReady = true;

        // A tap that arrives before the engine finished loading should still be
        // heard, not dropped.
        String queued = pendingText;
        pendingText = null;
        if (queued != null) {
          speakNow(queued, pendingRate, pendingPitch);
        }
      }
    });
  }

  private void speakNow(String text, float rate, float pitch) {
    if (tts == null || !ttsReady) {
      pendingText = text;
      pendingRate = rate;
      pendingPitch = pitch;
      return;
    }
    tts.setSpeechRate(Math.max(0.4f, Math.min(2.0f, rate)));
    tts.setPitch(Math.max(0.5f, Math.min(2.0f, pitch)));
    tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "wordlab");
  }

  /** Exposed to the page as window.WordLabTTS. */
  private final class TtsBridge {

    @JavascriptInterface
    public String voices() {
      return "[{\"voiceURI\":\"wordlab-tts-gb\",\"name\":\"Android text to speech\","
          + "\"lang\":\"en-GB\",\"localService\":true,\"default\":true}]";
    }

    @JavascriptInterface
    public void speak(final String text, final float rate, final float pitch) {
      if (text == null || text.trim().isEmpty()) return;
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          speakNow(text, rate, pitch);
        }
      });
    }

    @JavascriptInterface
    public void stop() {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          pendingText = null;
          if (tts != null) tts.stop();
        }
      });
    }
  }

  private LinearLayout buildOfflinePanel() {
    LinearLayout box = new LinearLayout(this);
    box.setOrientation(LinearLayout.VERTICAL);
    box.setGravity(Gravity.CENTER);
    box.setBackgroundColor(Color.parseColor("#F7F3FF"));
    box.setPadding(64, 64, 64, 64);

    TextView title = new TextView(this);
    title.setText("WordLab needs the internet");
    title.setTextSize(20f);
    title.setTextColor(Color.parseColor("#2A1A4A"));
    title.setGravity(Gravity.CENTER);

    TextView body = new TextView(this);
    body.setText("Check your connection and try again. Your words and XP stay saved on this device.");
    body.setTextSize(15f);
    body.setTextColor(Color.parseColor("#4B4560"));
    body.setGravity(Gravity.CENTER);
    body.setPadding(0, 16, 0, 32);

    Button retry = new Button(this);
    retry.setText("Try again");
    retry.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        errorPanel.setVisibility(View.GONE);
        web.reload();
      }
    });

    box.addView(title);
    box.addView(body);
    box.addView(retry);
    return box;
  }

  @Override
  public void onBackPressed() {
    if (web != null && web.canGoBack()) {
      web.goBack();
      return;
    }
    super.onBackPressed();
  }

  @Override
  protected void onPause() {
    if (web != null) web.onPause();
    if (tts != null) tts.stop();
    super.onPause();
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (web != null) web.onResume();
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    if (web != null) web.saveState(outState);
    super.onSaveInstanceState(outState);
  }

  @Override
  protected void onDestroy() {
    if (tts != null) {
      tts.stop();
      tts.shutdown();
      tts = null;
    }
    if (web != null) {
      web.destroy();
      web = null;
    }
    super.onDestroy();
  }
}
