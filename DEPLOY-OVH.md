# Deploying to OVH via WinSCP

## What to upload

The upload-ready site is the **contents of `chifaa-next/out/`** (not the
`out` folder itself, what's inside it).

It contains real files named exactly like the old site (`index.html`,
`about.html`, `founder.html`, `article.html`, `admin/`, …), so every existing
link, bookmark, and Google result keeps working. New additions over the old
`www/`:

- `articles/<slug>.html`, pre-rendered article pages (the SEO upgrade)
- `sitemap.xml`, `robots.txt`
- `_next/`, small framework files used by one redirect page
- `.htaccess`, same rules as before (HTTPS redirect, no directory listing)

## Step by step

1. **Open WinSCP** and connect to your OVH hosting with the same
   SFTP/FTP credentials you've used before.

2. **Back up first.** Select everything inside your current remote web root
   (the folder holding `index.html`, `css/`, `js/`, `data/`, `admin/`, …) and
   download a copy to your PC. This is your rollback if anything looks wrong
   after the upload.

3. **Open the local build folder.** In WinSCP's local (left-hand) pane,
   navigate to `chifaa-next\out` on this PC.

4. **Upload.** Select everything *inside* `out\` (not the `out` folder
   itself) and upload it into the same remote folder as step 2, overwriting
   existing files when prompted.

5. **Upload `admin-config.php` to the right place.** This file lives at the
   repo root (`admin-config.php`, next to the `www\` and `chifaa-next\`
   folders on this PC) and must go to your **FTP home directory**, the
   folder that *contains* your web root, never inside it. This keeps the
   admin password out of anything a browser can request directly.
   - If your OVH web root is `/`, put it one level up, in whatever your SFTP
     login lands you in before you enter the web folder.
   - If unsure, ask OVH support or check your hosting control panel for
     where the web root maps to on disk.

6. **Verify.** Visit your domain and click through: homepage, Founders,
   Team, an article, the language toggle, dark mode. Then go to
   `https://your-domain/admin/admin.html`, log in with the password from
   `admin-config.php`, make a small edit, and click **Save All Changes** to
   confirm it writes through.

7. **Clean up (optional).** Old files that no longer exist in the new build
   are harmless if left behind, but you can delete leftovers via WinSCP once
   you've confirmed the new site works.

8. **Submit the sitemap.** In Google Search Console, submit
   `https://your-domain/sitemap.xml` so the new pre-rendered article pages
   get crawled.

## About the admin panel fix

The admin panel had a real bug (not a hosting issue): the login form checked
the password entirely in the browser and never told the server, so the
server's save endpoint always rejected saves with "Failed to save files."
This happened locally *and* would have happened on OVH too. It's fixed now,
the login form calls the server properly.

Locally, testing the admin panel does still need PHP running (a plain
static file server like `python -m http.server` can't execute `api.php`).
OVH's shared hosting runs PHP by default, so no extra setup is needed there.

Credentials live in `admin-config.php`, outside the web root. To change the
admin password later, edit that file directly via WinSCP, no redeploy
needed.

## Domain note

SEO tags and the sitemap are generated with `https://chifaa.org` as the site
URL. If the real domain differs, update `SITE_URL` in
`chifaa-next/app/layout.js`, `BASE` in `chifaa-next/app/sitemap.js`, and the
sitemap URL in `chifaa-next/app/robots.js`, then rebuild before uploading.

## Updating content later

- **Instant, no rebuild:** the admin panel edits `data/*.json` on the
  server, and pages re-render from those files in the browser, visitors see
  admin edits immediately, exactly like before. New articles are authored in
  English and published under Maha Jouini by default.
- **Arabic translation of articles:** articles are written in English; a
  script auto-translates any new/changed article into Arabic. After adding or
  editing articles, run it once, then rebuild:

  ```
  cd chifaa-next
  npm run translate     # fills data/blog_ar.json (only new/changed articles)
  npm run build
  ```

  `npm run translate` uses a free translation service (no API key) and only
  touches articles whose English text changed since the last run, so existing
  Arabic stays intact. Review `www/data/blog_ar.json` if you want to polish the
  machine translation by hand before building.
- **For search engines:** crawlers see the content baked in at build time.
  After meaningful content changes (new article, edited bios), rebuild and
  re-upload so the pre-rendered HTML matches:

  ```
  cd chifaa-next
  npm run build
  ```

  Then upload the new `out/` contents. Only changed files need uploading,
  WinSCP's synchronize feature (Commands > Synchronize) works well for this.

## Testing locally before you deploy

Two things to preview on this PC, matching what will run on OVH:

**The site itself** (static export):
```
python -m http.server 5544 --directory chifaa-next/out
```
Open http://localhost:5544/index.html

**The admin panel** (needs PHP, so use PHP's built-in server against the
legacy `www/` folder, which the admin scripts are edited in directly):
```
php -S localhost:5555 -t www
```
Open http://localhost:5555/admin/admin.html
