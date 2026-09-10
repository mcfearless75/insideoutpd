# Inside Out PD — website

Static HTML/CSS/JS site for **Inside Out PD**, a home renovation, extension and building
specialist based in Birkenhead, serving the Wirral. Built for GitHub Pages with the custom
domain `insideoutpd.com`.

No build step, no framework, no dependencies — just static files.

## Structure

```
index.html       Homepage
services.html     Full services list (renovations, extensions, roofing, plastering, joinery, brickwork)
gallery.html      Project gallery with filtering
contact.html      Contact form (Formspree) + map + FAQs
404.html          Custom not-found page
css/style.css     Single shared stylesheet
js/main.js        Mobile nav, gallery filter, contact-form handling — no dependencies
images/           Site photos (see IMAGES.md — currently needs populating)
CNAME             GitHub Pages custom domain config
robots.txt        Crawler rules (explicitly allows AI/answer-engine bots)
sitemap.xml       XML sitemap for search engines
llms.txt          Plain-text business summary for AI assistants / answer engines (GEO)
```

## SEO / GEO / AI optimisation built in

- Unique, keyword-relevant `<title>` and meta description per page
- Canonical URLs, Open Graph + Twitter Card tags, `geo.*` meta tags
- `LocalBusiness`/`GeneralContractor` JSON-LD with full NAP, service area and opening hours
- `FAQPage`, `BreadcrumbList`, `Service`/`ItemList`, `ImageGallery` and `ContactPage` structured data
- Semantic HTML5 (`header`/`main`/`section`/`footer`/`address`), skip link, labelled form fields
- `robots.txt` explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- `llms.txt` — a plain-language business summary for AI assistants and answer engines (GEO)
- `sitemap.xml` covering all four pages
- No render-blocking third-party fonts/scripts; lazy-loaded below-the-fold images — fast Core Web Vitals
- Local ("GEO") content: named service areas across the Wirral (Birkenhead, Wallasey, Bebington, Heswall, West Kirby, Hoylake, Prenton, Oxton, New Brighton, Bromborough)

See `CLAUDE.md` for the full deployment runbook (GitHub Pages, DNS, HTTPS, Google Search Console).

## Updating the site

```bash
git add .
git commit -m "Brief description of what changed"
git push
```

GitHub Pages redeploys automatically within ~60 seconds of a push to `main`.

## Known follow-ups

See "KNOWN ISSUES TO FLAG TO USER" in `CLAUDE.md`, plus `IMAGES.md` for the current state of
`/images/`.
