// Supabase Edge Function: "publish"
// Called by the admin "Publish to site" button. Verifies the caller is a logged-in
// admin, then triggers the GitHub Actions deploy (repository_dispatch) using a
// GitHub token kept as a function secret (never exposed to the browser).
//
// Deploy:  supabase functions deploy publish --project-ref rgptwhksojbxwcnezokf
// Secrets: supabase secrets set GH_TOKEN=<pat> GH_REPO=Gassouma12/chifaa
//          (SUPABASE_URL + SUPABASE_ANON_KEY are provided automatically.)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  // supabase-js's functions.invoke also sends x-client-info / x-supabase-api-version;
  // omitting them makes the browser block the request ("Failed to send a request").
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info, x-supabase-api-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!token) return json({ error: 'unauthorized' }, 401);

  // Verify the token belongs to a real Supabase user (the admin).
  const supaUrl = Deno.env.get('SUPABASE_URL')!;
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const userRes = await fetch(`${supaUrl}/auth/v1/user`, {
    headers: { apikey: anon, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return json({ error: 'unauthorized' }, 401);

  // Fire the GitHub Actions deploy.
  const gh = Deno.env.get('GH_TOKEN');
  const repo = Deno.env.get('GH_REPO');
  if (!gh || !repo) return json({ error: 'server not configured (GH_TOKEN/GH_REPO)' }, 500);

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${gh}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'chifaa-admin',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ event_type: 'publish' }),
  });
  if (!res.ok) return json({ error: 'deploy trigger failed', detail: await res.text() }, 502);
  return json({ ok: true, message: 'Deploy started. Your changes will be live in ~1-2 minutes.' });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
