# How to restore the pre-Supabase site (rollback)

The current live CHIFAA site is fully backed up before the Supabase migration.
If anything goes wrong, you can return to exactly today's site.

## What is backed up

1. **Git tag `pre-supabase`** — the entire codebase (legacy `www/` + `chifaa-next/`)
   exactly as it was on 2026-08-05, commit `d5060ee`.
2. **Archive** — `C:\Users\abena\Desktop\chifaa-backups\finalchifaa-pre-supabase-20260805.tgz`
   (62 MB; the whole project incl. `admin-config.php`, minus regenerable deps/builds).
3. **Live server content** — *do this once via WinSCP* (see below). The live OVH
   `www/data/*.json` may contain admin edits newer than the repo, so grab it.

### One-time: back up the live server (WinSCP, ~2 min)

1. Open WinSCP, connect to OVH (`sftp.cluster100.hosting.ovh.net`, user `chifaaz`).
2. Select **everything in your current web root** (the folder with `index.html`,
   `data/`, `admin/`, `assets/`, ...).
3. Drag it to a local folder, e.g. `C:\Users\abena\Desktop\chifaa-backups\ovh-live-20260805\`.
4. Done — that folder is the exact running site, your instant rollback.

## How to restore

### Fast rollback (put the old site back on OVH)
- Re-upload the contents of your WinSCP backup folder
  (`chifaa-backups\ovh-live-*`) to the OVH web root, overwriting. The old site is
  live again in minutes. It has **zero dependency on Supabase** — safe even if the
  Supabase project is paused or deleted.

### Rebuild the old site from the repo (if you don't have the WinSCP copy)
```
cd C:\Users\abena\Desktop\finalchifaa
git checkout pre-supabase
cd chifaa-next
npm ci
npm run build        # regenerates chifaa-next/out/ from the pre-migration data
```
Then upload `chifaa-next/out/` contents to the OVH web root (see `DEPLOY-OVH.md`).

### Restore the whole project folder from the archive
```
cd C:\Users\abena\Desktop
tar -xzf chifaa-backups\finalchifaa-pre-supabase-20260805.tgz
```

## After the migration
The new pipeline also keeps the last several deploys as GitHub Actions artifacts,
so any post-migration deploy can be rolled back to the previous one without
touching this pre-Supabase baseline.
