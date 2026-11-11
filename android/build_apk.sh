#!/usr/bin/env bash
# Builds wordlab-android.apk without Gradle: aapt2 -> javac -> d8 -> zipalign -> apksigner.
# Requires a JDK (JAVA_HOME) and an Android SDK (ANDROID_HOME) with platform 34 and build-tools 34.0.0.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SDK="${ANDROID_HOME:-$HOME/tools/sdk}"
JDK="${JAVA_HOME:-$HOME/tools/jdk}"
BUILD_TOOLS="$SDK/build-tools/34.0.0"
PLATFORM="$SDK/platforms/android-34/android.jar"
OUT="$ROOT/../public/wordlab-android.apk"
KEYSTORE="$ROOT/wordlab.jks"
STOREPASS="wordlab"

export PATH="$JDK/bin:$PATH"

for tool in aapt2 d8 apksigner zipalign; do
  [ -x "$BUILD_TOOLS/$tool" ] || { echo "missing $BUILD_TOOLS/$tool" >&2; exit 1; }
done
[ -f "$PLATFORM" ] || { echo "missing $PLATFORM" >&2; exit 1; }

WORK="$ROOT/build"
rm -rf "$WORK"
mkdir -p "$WORK/res" "$WORK/gen" "$WORK/classes" "$WORK/dex"

"$BUILD_TOOLS/aapt2" compile --dir "$ROOT/res" -o "$WORK/res.zip"
"$BUILD_TOOLS/aapt2" link \
  -o "$WORK/base.apk" \
  -I "$PLATFORM" \
  --manifest "$ROOT/AndroidManifest.xml" \
  "$WORK/res.zip" \
  --java "$WORK/gen" \
  --min-sdk-version 23 \
  --target-sdk-version 34

javac -source 8 -target 8 -Xlint:-options -encoding UTF-8 \
  -classpath "$PLATFORM" \
  -d "$WORK/classes" \
  $(find "$WORK/gen" "$ROOT/src" -name '*.java')

find "$WORK/classes" -name '*.class' > "$WORK/classes.txt"
# shellcheck disable=SC2046
"$BUILD_TOOLS/d8" --release --lib "$PLATFORM" --min-api 23 \
  --output "$WORK/dex" $(cat "$WORK/classes.txt")

cp "$WORK/base.apk" "$WORK/unsigned.apk"
(cd "$WORK/dex" && zip -q "$WORK/unsigned.apk" classes.dex)
"$BUILD_TOOLS/zipalign" -f 4 "$WORK/unsigned.apk" "$WORK/aligned.apk"

if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -keystore "$KEYSTORE" -storepass "$STOREPASS" -keypass "$STOREPASS" \
    -alias wordlab -keyalg RSA -keysize 2048 -validity 10950 \
    -dname "CN=WordLab KS3, OU=WordLab, O=WordLab, L=London, C=GB"
fi

"$BUILD_TOOLS/apksigner" sign \
  --ks "$KEYSTORE" --ks-pass "pass:$STOREPASS" --key-pass "pass:$STOREPASS" \
  --min-sdk-version 23 \
  --out "$OUT" "$WORK/aligned.apk"

"$BUILD_TOOLS/apksigner" verify --print-certs "$OUT" | head -4
rm -rf "$WORK"
ls -lh "$OUT"
