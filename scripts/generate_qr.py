"""Render the two install QR codes shown in the app's "Put WordLab on your phone" dialog.

Run with: python3 scripts/generate_qr.py --verify   (needs `pip install segno`)
The Android code downloads the signed APK directly; the iOS code opens the site
with a platform hint, because iPhone installs go through Safari's "Add to Home
Screen" rather than a downloadable file.
"""

import io
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import segno

PUBLIC = Path(__file__).resolve().parent.parent / "public"

SITE = "https://ks3.freebuff.page/"
APK = f"{SITE}wordlab-android.apk"
DARK = "#4c1d95"

CODES = {
    "qr-android.svg": APK,
    "qr-ios.svg": f"{SITE}?install=ios",
}


def decode_png(source) -> str | None:
    try:
        import zxingcpp
        from PIL import Image
    except ImportError:
        return None
    found = zxingcpp.read_barcodes(Image.open(source))
    return found[0].text if found else None


def decode_svg(path: Path) -> str | None:
    """Rasterise the shipped SVG so the check covers the file we actually serve."""
    converter = shutil.which("rsvg-convert")
    if not converter:
        return None
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "code.png"
        subprocess.run(
            [converter, "-w", "600", "-o", str(png), str(path)],
            check=True,
            capture_output=True,
        )
        return decode_png(png)


def main() -> int:
    verify = "--verify" in sys.argv
    failures = 0

    for name, url in CODES.items():
        qr = segno.make(url, error="m")
        qr.save(
            PUBLIC / name,
            kind="svg",
            scale=8,
            border=2,
            dark=DARK,
            light="#ffffff",
            xmldecl=False,
            svgclass=None,
            lineclass=None,
        )
        print(f"{name}: {url} -> {len(qr.matrix)}x{len(qr.matrix)} modules")

        if not verify:
            continue

        decoded = decode_svg(PUBLIC / name)
        if decoded is None:
            buffer = io.BytesIO()
            qr.save(buffer, kind="png", scale=8, border=2)
            buffer.seek(0)
            decoded = decode_png(buffer)
        ok = decoded == url
        failures += 0 if ok else 1
        print(f"  {'OK' if ok else 'MISMATCH'}: decoded {decoded!r}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
