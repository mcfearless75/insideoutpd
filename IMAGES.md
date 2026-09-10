# Images

The `/images/` folder is referenced by the site but is currently **empty** — this Claude Code session could not download binary files (`curl` is blocked by this sandbox's security policy). Until real photos are added, `<img>` tags will show broken-image icons (alt text still renders correctly for SEO/accessibility).

## What's needed

Seven files, saved into `/images/` with these exact names (the HTML already points at these paths):

| Filename | Used on | Source (original Wix site) |
|---|---|---|
| `hero.jpg` | Homepage hero background | `https://static.wixstatic.com/media/ea26fd_e142fd7bcd8c46219312b22e8a91bb3c~mv2_d_4000_2447_s_4_2.jpeg` |
| `about.jpg` | Homepage "About Us" | `https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg` |
| `work-1.jpg` | Gallery / services | `https://static.wixstatic.com/media/83a797_6c5bcb64f47341bf8c90d49a7539a52a~mv2.jpg` |
| `work-2.jpg` | Gallery / services | `https://static.wixstatic.com/media/83a797_7a3b2feb9ee64824869c8f5c8349e7f9~mv2.jpg` |
| `work-3.jpg` | Gallery (spare) | `https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg` |
| `work-4.jpg` | Gallery / services | `https://static.wixstatic.com/media/ea26fd_6173fa4ccf7f4b65a32b446808474886~mv2_d_4033_4480_s_4_2.jpg` |
| `work-5.jpg` | Gallery / services | `https://static.wixstatic.com/media/83a797_879e8b43b24e4ababaa99353714abbba~mv2.jpg` |

**These Wix URLs stop working once the Wix plan is cancelled — grab them first.**

## How to download them

From a terminal with normal internet access (your own machine, or a Claude Code session where `curl` isn't blocked), run from the project root:

```bash
mkdir -p images
curl -L -o images/hero.jpg "https://static.wixstatic.com/media/ea26fd_e142fd7bcd8c46219312b22e8a91bb3c~mv2_d_4000_2447_s_4_2.jpeg"
curl -L -o images/about.jpg "https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg"
curl -L -o images/work-1.jpg "https://static.wixstatic.com/media/83a797_6c5bcb64f47341bf8c90d49a7539a52a~mv2.jpg"
curl -L -o images/work-2.jpg "https://static.wixstatic.com/media/83a797_7a3b2feb9ee64824869c8f5c8349e7f9~mv2.jpg"
curl -L -o images/work-3.jpg "https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg"
curl -L -o images/work-4.jpg "https://static.wixstatic.com/media/ea26fd_6173fa4ccf7f4b65a32b446808474886~mv2_d_4033_4480_s_4_2.jpg"
curl -L -o images/work-5.jpg "https://static.wixstatic.com/media/83a797_879e8b43b24e4ababaa99353714abbba~mv2.jpg"
ls -lh images/
```

All files should be well over 50KB. If any come back tiny, download that one manually from the live site (`https://paulmc1803.wixsite.com/insideout`) and save it into `/images/` under the matching filename.

## Recommended: also add these before going live

- **Better/larger project photos** — the Wix originals are decent but a proper photoshoot of finished jobs (before/after pairs) will do far more for conversions and for Google's image search than the current set.
- **`favicon.ico`** at the project root — referenced by every page's `<link rel="icon">` but not yet created (see Known Issue #4 in `CLAUDE.md`).
- Keep photos under ~300KB each where possible (resize/compress) — page speed is a Google ranking factor.
