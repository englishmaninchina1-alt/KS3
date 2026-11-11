"""Render the WordLab KS3 app icons (PNG) from the same design as public/favicon.svg.

Run with: python3 scripts/generate_icons.py
Requires Pillow. Output is written to public/ so Vite copies it into dist/.
"""

from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"

START = (0x7C, 0x3A, 0xED)
END = (0xEC, 0x48, 0x99)


def gradient(size: int) -> Image.Image:
    """Diagonal violet -> pink gradient, matching the SVG linearGradient."""
    image = Image.new("RGB", (size, size))
    pixels = image.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            pixels[x, y] = tuple(
                round(START[channel] + (END[channel] - START[channel]) * t) for channel in range(3)
            )
    return image


def letter_w(size: int, radius_ratio: float) -> Image.Image:
    """Rounded tile with the white W stroke from the favicon."""
    scale = 4  # supersample, then downscale for smooth edges
    canvas = size * scale
    image = gradient(canvas).convert("RGBA")

    mask = Image.new("L", (canvas, canvas), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, canvas - 1, canvas - 1), radius=round(canvas * radius_ratio), fill=255
    )
    image.putalpha(mask)

    # The W lives inside the 80% safe zone so maskable cropping stays clean.
    points = [(16, 44), (24, 20), (32, 36), (40, 20), (48, 44)]
    stroke = round(6 * canvas / 64)
    ImageDraw.Draw(image).line(
        [(round(x * canvas / 64), round(y * canvas / 64)) for x, y in points],
        fill=(255, 255, 255, 255),
        width=stroke,
        joint="curve",
    )
    for x, y in (points[0], points[-1]):
        px, py = round(x * canvas / 64), round(y * canvas / 64)
        ImageDraw.Draw(image).ellipse(
            (px - stroke // 2, py - stroke // 2, px + stroke // 2, py + stroke // 2),
            fill=(255, 255, 255, 255),
        )

    return image.resize((size, size), Image.LANCZOS)


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)

    letter_w(192, 0.25).save(PUBLIC / "icon-192.png")
    letter_w(512, 0.25).save(PUBLIC / "icon-512.png")

    # Maskable icons are cropped to a circle by the launcher: keep the W small.
    letter_w(512, 0.0).resize((512, 512), Image.LANCZOS).save(PUBLIC / "icon-maskable-512.png")

    # iOS applies its own rounded corners, so ship a full square.
    letter_w(180, 0.0).save(PUBLIC / "apple-touch-icon.png")

    for name in ("icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"):
        path = PUBLIC / name
        print(f"{name}: {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
