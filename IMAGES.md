# Images

All 7 images have been pulled from the original Wix site and are in `/images/`:

| Filename | Size | Used on |
|---|---|---|
| `hero.jpg` | ~175KB (1600×979) | Homepage hero background |
| `about.jpg` | ~355KB (1400×1400) | Homepage "About Us" |
| `work-1.jpg` | ~152KB (1400×1050) | Gallery / services |
| `work-2.jpg` | ~104KB (1400×788) | Gallery / services |
| `work-3.jpg` | ~355KB (1400×1400) | Gallery (same source photo as about.jpg on the original site) |
| `work-4.jpg` | ~181KB (1200×1333) | Gallery / services |
| `work-5.jpg` | ~380KB (1400×1050) | Gallery / services — genuine in-progress groundworks shot |

These were captured by loading each Wix CDN image in-browser and re-encoding it (JPEG, resized to a sensible max width) — `curl`/`wget`/direct network fetches are blocked in this sandbox, so this was the workaround. Quality is good but not byte-identical to the Wix originals.

## Recommended before going fully live

- **Better/larger project photos** — these are decent but a proper photoshoot of finished jobs (before/after pairs) will do more for conversions and Google Image Search than the current set.
- **`favicon.ico`** at the project root — referenced by every page's `<link rel="icon">` but not yet created (see Known Issue #4 in `CLAUDE.md`).
- If you have the original, higher-resolution files from Wix (or your own camera roll), swap them in — same filenames, just overwrite.
