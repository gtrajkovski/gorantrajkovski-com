"""Generate favicon set from headshot. Crops to square (face-centered), produces multiple sizes."""
import os
from PIL import Image, ImageOps

SRC = r"C:\TALLwebsite\gorantrajkovski-com\assets\img\portrait\headshot.jpg"
OUT = r"C:\TALLwebsite\gorantrajkovski-com\assets\img\favicon"
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC).convert("RGB")
w, h = img.size
print(f"Source: {w}x{h}")

# Crop to square — favor upper portion where face usually is
# Face is roughly in upper 60% of a typical headshot
side = min(w, h)
left = (w - side) // 2
# Bias upward by 10% of the difference, so we don't cut off the head
top = max(0, (h - side) // 2 - int(0.1 * (h - side)))
img_sq = img.crop((left, top, left + side, top + side))
print(f"Cropped to square: {img_sq.size}")

# Sizes to generate
sizes = [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (48, "favicon-48x48.png"),
    (96, "favicon-96x96.png"),
    (180, "apple-touch-icon.png"),
    (192, "android-chrome-192x192.png"),
    (512, "android-chrome-512x512.png"),
]
for size, name in sizes:
    out = img_sq.resize((size, size), Image.LANCZOS)
    out.save(os.path.join(OUT, name), optimize=True)
    print(f"  -> {name}")

# Build multi-resolution favicon.ico
ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64)]
img_sq.save(os.path.join(r"C:\TALLwebsite\gorantrajkovski-com", "favicon.ico"),
            format="ICO", sizes=ico_sizes)
print("  -> favicon.ico (root, multi-resolution)")

# Site manifest
manifest = '''{
  "name": "Goran Trajkovski",
  "short_name": "Goran T",
  "icons": [
    { "src": "/assets/img/favicon/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/img/favicon/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#0E0E0C",
  "background_color": "#FAFAF5",
  "display": "standalone"
}'''
with open(os.path.join(r"C:\TALLwebsite\gorantrajkovski-com", "site.webmanifest"), "w", encoding="utf-8") as f:
    f.write(manifest)
print("  -> site.webmanifest")
print("\nDone.")
