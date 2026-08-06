# CHIFAA — Go-Live Runbook

Everything is built and committed locally. These are the final credentialed steps
to make publishing work end-to-end. Do them in order. Nothing here touches the
live OVH site until **Step 4**.

## Step 1 — Push the code to GitHub

The repo `Gassouma12/chifaa` will be replaced with the clean tree (as you asked).
From `C:\Users\abena\Desktop\finalchifaa`:

```bash
git remote add origin https://github.com/Gassouma12/chifaa.git
git push --force origin main
git push origin pre-supabase
```

(When prompted, authenticate as **Gassouma12**. This just uploads code — a build
runs as a *check* but does NOT deploy to OVH.)

## Step 2 — Set GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add these 7 (values are the ones you already have):

| Secret name | Value |
|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rgptwhksojbxwcnezokf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase **publishable** key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE` | your Supabase **secret** key (`sb_secret_…`) |
| `SFTP_HOST` | `sftp.cluster100.hosting.ovh.net` |
| `SFTP_USER` | `chifaaz` |
| `SFTP_PASSWORD` | your OVH SFTP password |
| `SFTP_REMOTE_DIR` | your OVH web-root path (see Step 4) |

## Step 3 — Deploy the "publish" Edge Function (makes the admin's Publish button work)

Needs the Supabase CLI + a Supabase access token from
https://supabase.com/dashboard/account/tokens

```bash
npm i -g supabase
supabase login                       # paste your access token
cd C:\Users\abena\Desktop\finalchifaa
supabase functions deploy publish --project-ref rgptwhksojbxwcnezokf
supabase secrets set GH_REPO=Gassouma12/chifaa GH_TOKEN=<your github token> --project-ref rgptwhksojbxwcnezokf
```

## Step 4 — First go-live (the cutover)

**Confirm the web-root path first.** In WinSCP, note the folder that holds the
live `index.html` (most likely `www`). Set `SFTP_REMOTE_DIR` (Step 2) to that path
— e.g. `www` or `/www`.

Then deploy manually the first time:
- GitHub repo → **Actions → "Build & Deploy CHIFAA" → Run workflow** → set
  **deploy_to_ovh = true** → Run.
- Watch it: it translates → builds from Supabase → SFTP-uploads to OVH.
- Visit your domain and click through (nav, an article, language, dark mode).

After this, **Maha just clicks "Publish to site" in the admin** and the same
pipeline runs automatically (~1–2 min to go live).

## Rollback (if anything looks wrong)

- Fast: re-upload your WinSCP backup (`chifaa-backups\ovh-live-*`) to the web root.
- Or `git checkout pre-supabase` + old build. Full details in `RESTORE.md`.

## Notes

- A plain `git push` later = build check only. Deploy happens only via the admin
  Publish button or a manual "Run workflow (deploy_to_ovh=true)".
- New articles are auto-translated to Arabic on publish (only new/changed ones;
  hand-edited Arabic is never overwritten).
