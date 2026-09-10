# CLAUDE.md — Inside Out PD Website Deployment

## Project
Static HTML website for **Inside Out PD** (insideoutpd.com).
Goal: get the site live on GitHub Pages with the custom domain attached and HTTPS enforced.

## Stack
- Pure HTML/CSS/JS — no build step, no Node, no bundler
- Hosted on GitHub Pages (free, static)
- Contact form via Formspree
- Custom domain: `insideoutpd.com`

---

## YOUR JOB: Run through the phases below in order.

Stop and ask the user only when a phase explicitly requires their input.
Do not ask for anything not listed. Run everything else autonomously.

---

## PHASE 0 — Preflight checks

Run these before anything else:

```bash
git --version
gh --version
curl --version
```

If `gh` is missing, install it:
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh -y

# Windows (winget)
winget install --id GitHub.cli
```

Check GitHub auth status:
```bash
gh auth status
```

If not authenticated:
```bash
gh auth login
```
Choose: GitHub.com → HTTPS → Login with a web browser. Follow the prompts.
Wait for the user to complete auth, then continue.

---

## PHASE 1 — Prepare the project directory

The site files should already be in this directory (unpacked from `insideoutpd-ghpages.zip`).
Verify the structure is correct:

```bash
ls -la
```

Expected files at root:
- `index.html`
- `services.html`
- `gallery.html`
- `contact.html`
- `404.html`
- `CNAME`
- `robots.txt`
- `sitemap.xml`
- `IMAGES.md`
- `README.md`
- `css/style.css`
- `js/main.js`
- `images/` (directory — may be empty)

If the zip hasn't been unpacked yet, unpack it:
```bash
unzip insideoutpd-ghpages.zip
cd insideoutpd
```

Verify CNAME contains the correct domain:
```bash
cat CNAME
```
Should output: `insideoutpd.com`
If it doesn't, write it:
```bash
echo "insideoutpd.com" > CNAME
```

---

## PHASE 2 — Download images from Wix CDN

**Do this before cancelling the Wix plan. These URLs stop working once Wix is cancelled.**

Create the images directory if it doesn't exist:
```bash
mkdir -p images
```

Download all images:
```bash
curl -L -o images/hero.jpg "https://static.wixstatic.com/media/ea26fd_e142fd7bcd8c46219312b22e8a91bb3c~mv2_d_4000_2447_s_4_2.jpeg"
curl -L -o images/about.jpg "https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg"
curl -L -o images/work-1.jpg "https://static.wixstatic.com/media/83a797_6c5bcb64f47341bf8c90d49a7539a52a~mv2.jpg"
curl -L -o images/work-2.jpg "https://static.wixstatic.com/media/83a797_7a3b2feb9ee64824869c8f5c8349e7f9~mv2.jpg"
curl -L -o images/work-3.jpg "https://static.wixstatic.com/media/83a797_a9852df920b24aa7a840edd6f25299ff~mv2.jpg"
curl -L -o images/work-4.jpg "https://static.wixstatic.com/media/ea26fd_6173fa4ccf7f4b65a32b446808474886~mv2_d_4033_4480_s_4_2.jpg"
curl -L -o images/work-5.jpg "https://static.wixstatic.com/media/83a797_879e8b43b24e4ababaa99353714abbba~mv2.jpg"
```

Verify downloads:
```bash
ls -lh images/
```

All files should be >50KB. If any are tiny (a few bytes), the URL failed — try downloading that one manually and dropping it in `/images/`.

---

## PHASE 3 — Formspree setup

**STOP — USER ACTION REQUIRED**

Tell the user:
> To receive contact form submissions by email, you need a free Formspree account.
> 1. Go to https://formspree.io and sign up (free tier is fine)
> 2. Click "New Form", name it "Inside Out PD Contact"
> 3. Copy the Form ID — it looks like: `xqkgpbzd` (8 characters)
> 4. Paste it here so I can update contact.html

Once the user provides the Form ID, update `contact.html`:
```bash
# Replace YOUR_FORMSPREE_ID with the actual ID the user provided
# Example: if ID is xqkgpbzd
FORMSPREE_ID="PASTE_ID_HERE"
sed -i "s/YOUR_FORMSPREE_ID/$FORMSPREE_ID/g" contact.html
```

Verify the replacement worked:
```bash
grep "formspree.io" contact.html
```

Should show the URL with the real ID, not `YOUR_FORMSPREE_ID`.

If the user hasn't set up Formspree yet and wants to come back to it later, that's fine — the site will still work, the form just won't submit. Continue to Phase 4 and update it after deployment.

---

## PHASE 4 — Initialise git and create GitHub repo

Get the GitHub username:
```bash
gh api user --jq '.login'
```

Store it for later steps.

Initialise git:
```bash
git init
git add .
git commit -m "Initial build — Inside Out PD website"
```

Create the GitHub repo (public, so GitHub Pages works on free tier):
```bash
gh repo create insideoutpd --public --source=. --remote=origin --push
```

This creates the repo, sets `origin`, and pushes in one step.

Verify the push:
```bash
git log --oneline -3
git remote -v
```

Confirm on GitHub:
```bash
gh repo view insideoutpd --web
```

---

## PHASE 5 — Enable GitHub Pages

Get the repo owner (GitHub username):
```bash
OWNER=$(gh api user --jq '.login')
echo "Owner: $OWNER"
```

Enable GitHub Pages via the API — deploy from the `main` branch root:
```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/$OWNER/insideoutpd/pages \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

If you get a 409 (Pages already enabled), skip and continue.

Wait 30 seconds for Pages to initialise, then check the status:
```bash
sleep 30
gh api /repos/$OWNER/insideoutpd/pages --jq '{status: .status, url: .html_url}'
```

Status should be `built` or `building`. If `errored`, check:
```bash
gh api /repos/$OWNER/insideoutpd/pages --jq '.'
```

---

## PHASE 6 — Attach the custom domain

Set the custom domain on the Pages config:
```bash
OWNER=$(gh api user --jq '.login')

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/$OWNER/insideoutpd/pages \
  -f "cname=insideoutpd.com"
```

Verify:
```bash
gh api /repos/$OWNER/insideoutpd/pages --jq '{cname: .cname, status: .status}'
```

Should return `"cname": "insideoutpd.com"`.

Also confirm the CNAME file is in the repo root (it should already be there from Phase 1):
```bash
cat CNAME
```

---

## PHASE 7 — DNS configuration

**STOP — USER ACTION REQUIRED**

Tell the user the following. They need to log into their domain registrar (wherever they registered `insideoutpd.com`) and add these DNS records exactly:

---

### DNS records to add at your registrar

**A records** (for the apex domain `insideoutpd.com`):

| Type | Name | Value              | TTL  |
|------|------|--------------------|------|
| A    | @    | 185.199.108.153    | 3600 |
| A    | @    | 185.199.109.153    | 3600 |
| A    | @    | 185.199.110.153    | 3600 |
| A    | @    | 185.199.111.153    | 3600 |

**CNAME record** (for `www` redirect):

| Type  | Name | Value                             | TTL  |
|-------|------|-----------------------------------|------|
| CNAME | www  | YOUR_GITHUB_USERNAME.github.io    | 3600 |

Replace `YOUR_GITHUB_USERNAME` with the actual GitHub username.

**Important:** If the registrar has a `@` CAA record, that's fine — leave it. If there's an existing A record pointing to Wix (e.g. `185.230.x.x`), delete the Wix one and add the four GitHub ones above.

---

Tell the user: DNS propagation takes between 10 minutes and 48 hours depending on the registrar and TTL. Once they've added the records, come back to Phase 8.

---

## PHASE 8 — Verify DNS and enforce HTTPS

Check if DNS has propagated:
```bash
dig insideoutpd.com +short
```

Should return the four GitHub IPs:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Also check www:
```bash
dig www.insideoutpd.com +short
```

Should return the GitHub Pages domain.

If dig doesn't show the right IPs yet, propagation hasn't completed. Try again in 15–30 minutes. Don't force HTTPS until DNS is confirmed.

Once DNS is confirmed, enforce HTTPS via the API:
```bash
OWNER=$(gh api user --jq '.login')

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/$OWNER/insideoutpd/pages \
  -f "https_enforced=true"
```

Note: GitHub can only issue the SSL certificate once DNS is pointing at them. If this call returns an error saying the cert isn't ready, wait another 15 minutes and retry.

---

## PHASE 9 — Final verification

Run a full check:

```bash
# 1. Check Pages status and URL
OWNER=$(gh api user --jq '.login')
gh api /repos/$OWNER/insideoutpd/pages --jq '{status: .status, url: .html_url, cname: .cname, https_enforced: .https_enforced}'

# 2. HTTP response check (once DNS propagates)
curl -I https://www.insideoutpd.com 2>/dev/null | head -5

# 3. Confirm redirect: www → apex or apex → www
curl -I http://insideoutpd.com 2>/dev/null | grep -i location
```

Expected:
- Pages status: `built`
- HTTPS returns `200 OK`
- HTTP redirects to HTTPS (`301` with `location: https://`)

Check the live site in browser:
```bash
open https://www.insideoutpd.com
# or on Linux:
xdg-open https://www.insideoutpd.com
```

---

## PHASE 10 — Submit to Google

Once live, submit the sitemap to Google Search Console:

Tell the user:
> 1. Go to https://search.google.com/search-console
> 2. Add property → URL prefix → `https://www.insideoutpd.com`
> 3. Verify ownership (HTML file method is easiest — download the file, add to the repo root, commit and push)
> 4. Once verified, go to Sitemaps → add `https://www.insideoutpd.com/sitemap.xml`

If the user provides a Google verification HTML filename (e.g. `google1234abcd.html`), create and push it:
```bash
VERIFY_FILE="google1234abcd.html"  # replace with actual filename
echo "google-site-verification: $VERIFY_FILE" > $VERIFY_FILE
git add $VERIFY_FILE
git commit -m "Add Google Search Console verification"
git push
```

---

## ONGOING — How to update the site

Any time changes are needed:

```bash
# Make your edits to HTML/CSS/JS files, then:
git add .
git commit -m "Brief description of what changed"
git push
```

GitHub Pages auto-deploys on every push to `main`. Changes go live within ~60 seconds.

To add new gallery photos:
1. Drop image files into the `/images/` folder
2. Add a `gallery-page-item` block to `gallery.html` (copy an existing one, update src and alt)
3. Commit and push

---

## REFERENCE — Key details

| Item               | Value                                  |
|--------------------|----------------------------------------|
| Domain             | insideoutpd.com                        |
| Repo name          | insideoutpd                            |
| Branch             | main                                   |
| Pages source       | / (root)                               |
| Contact email      | info@insideoutpd.com                   |
| Phone              | +44 7542 846353                        |
| Formspree form     | Update contact.html action URL         |
| Images location    | /images/ (local) — see IMAGES.md       |

## KNOWN ISSUES TO FLAG TO USER

1. **Postcode** — site shows `Birkenhead CH1 2AB` but CH1 is Chester. Birkenhead is CH41/CH42. Ask user to confirm correct postcode and update the JSON-LD in `index.html` (search for "CH41 2AB").

2. **Third testimonial** — attributed to "Wirral Homeowner" as a placeholder. Replace with a real client name when available (`index.html`, third `.testimonial-card`).

3. **About stats** — values like "6+ Core Services" and "5★" are accurate. If the user wants to add years in business or number of projects completed, update the `.about-stats` grid in `index.html`.

4. **Favicon** — no favicon set. If the user has a logo file, a favicon can be generated from it and added.
