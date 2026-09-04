'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase, mediaUrl } from '@/lib/supabaseClient';
import { MenaEditor, PagesEditor } from '@/components/admin/Editors';
import './admin.css';

/* ----------------------------------------------------------------- config ---- */
// One config drives list + edit + validate + save for every content type.
// `tx` marks a bilingual resource (parent row + en/ar rows in a translations table).
const RESOURCES = [
  { key: 'articles', label: 'Voices', icon: '📝', table: 'articles', tx: 'article_translations', fk: 'article_id', order: 'published_date', titleTx: 'title',
    shared: [
      { k: 'slug', label: 'URL slug', type: 'text', required: true, hint: 'lowercase-with-dashes (used in the page URL)' },
      { k: 'cover_image', label: 'Cover image', type: 'image' },
      { k: 'category_slugs', label: 'Categories', type: 'categories' },
      { k: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
      { k: 'featured', label: 'Featured on Voices', type: 'bool' },
      { k: 'read_time', label: 'Read time (min, blank = auto)', type: 'number' },
      { k: 'published_date', label: 'Published date', type: 'date' },
    ],
    translated: [
      { k: 'title', label: 'Title', type: 'text', required: true },
      { k: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { k: 'content', label: 'Content', type: 'rich' },
      { k: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
    ] },
  { key: 'team', label: 'Team', icon: '👥', table: 'team_members', titleField: 'name',
    shared: [
      { k: 'name', label: 'Name', type: 'text', required: true },
      { k: 'role', label: 'Role', type: 'text' },
      { k: 'eyebrow', label: 'Modal role label', type: 'text' },
      { k: 'bio', label: 'Biography', type: 'textarea' },
      { k: 'image', label: 'Photo', type: 'image' },
      { k: 'email', label: 'Email', type: 'text' },
      { k: 'linkedin', label: 'LinkedIn', type: 'url' },
      { k: 'twitter', label: 'Twitter', type: 'url' },
      { k: 'instagram', label: 'Instagram', type: 'url' },
      { k: 'behance', label: 'Behance', type: 'url' },
      { k: 'founder_link', label: 'Show founder-bio link', type: 'bool' },
    ] },
  { key: 'founders', label: 'Founders', icon: '💡', table: 'founders', tx: 'founder_translations', fk: 'founder_id', titleTx: 'name',
    shared: [{ k: 'image', label: 'Photo', type: 'image' }],
    translated: [
      { k: 'name', label: 'Name', type: 'text', required: true },
      { k: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { k: 'subtitle', label: 'Subtitle', type: 'text' },
      { k: 'intro', label: 'Intro / quote', type: 'textarea' },
      { k: 'full_bio', label: 'Full biography', type: 'rich' },
      { k: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
    ] },
  { key: 'podcast', label: 'Podcast', icon: '🎙️', table: 'podcast_episodes', tx: 'podcast_translations', fk: 'episode_id', titleTx: 'title',
    shared: [
      { k: 'youtube_url', label: 'YouTube URL', type: 'url' },
      { k: 'published_date', label: 'Published date', type: 'date' },
      { k: 'featured', label: 'Featured', type: 'bool' },
    ],
    translated: [
      { k: 'title', label: 'Title', type: 'text', required: true },
      { k: 'description', label: 'Description', type: 'textarea' },
      { k: 'tag', label: 'Tag', type: 'text' },
    ] },
];

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
const estReadTime = (html) => Math.max(1, Math.round(String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
const LANGS = [['en', 'English'], ['ar', 'العربية']];

/* --------------------------------------------------------------- widgets ---- */
function RichText({ initial, onChange, dir }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.innerHTML = initial || ''; }, []); // set once
  const cmd = (c, v) => { document.execCommand(c, false, v); if (ref.current) onChange(ref.current.innerHTML); };
  const link = () => { const u = prompt('Link URL:'); if (u) cmd('createLink', u); };
  const B = ({ c, v, label }) => (
    <button type="button" title={label} onMouseDown={(e) => e.preventDefault()} onClick={() => cmd(c, v)}>{label}</button>
  );
  return (
    <div>
      <div className="rt-toolbar">
        <B c="bold" label="B" /><B c="italic" label="I" />
        <B c="formatBlock" v="h2" label="H2" /><B c="formatBlock" v="h3" label="H3" />
        <B c="formatBlock" v="p" label="¶" />
        <B c="insertUnorderedList" label="•" /><B c="insertOrderedList" label="1." />
        <button type="button" title="Link" onMouseDown={(e) => e.preventDefault()} onClick={link}>🔗</button>
        <B c="removeFormat" label="⌫" />
      </div>
      <div className="rt-area" dir={dir} contentEditable ref={ref} suppressContentEditableWarning
        onInput={() => onChange(ref.current.innerHTML)} />
    </div>
  );
}

function ImageUpload({ value, onChange, onToast }) {
  const [busy, setBusy] = useState(false);
  const pick = () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = async () => {
      const file = inp.files[0]; if (!file) return;
      if (file.size > 6 * 1024 * 1024) { onToast('Image too large (max 6MB).', 'err'); return; }
      setBusy(true);
      const key = `uploads/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${file.name.split('.').pop().toLowerCase()}`;
      const { error } = await supabase.storage.from('media').upload(key, file, { upsert: true, contentType: file.type });
      setBusy(false);
      if (error) { onToast('Upload failed: ' + error.message, 'err'); return; }
      onChange(key); onToast('Image uploaded.', 'ok');
    };
    inp.click();
  };
  return (
    <div className="img-field">
      {value ? <img className="img-preview" src={mediaUrl(value)} alt="" /> : <div className="img-preview" />}
      <div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={pick} disabled={busy}>
          {busy ? <span className="cadmin-spinner" /> : (value ? 'Change image' : 'Upload image')}
        </button>
        {value && <button type="button" className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => onChange('')}>Remove</button>}
      </div>
    </div>
  );
}

function Field({ f, value, onChange, err, categories, onToast }) {
  const id = 'f_' + f.k;
  const wrap = (inner) => (
    <div className={'field' + (err ? ' field-err' : '')}>
      <label htmlFor={id}>{f.label}{f.required && ' *'}</label>
      {inner}
      {f.hint && <div className="hint">{f.hint}</div>}
      {err && <div className="err-text">{err}</div>}
    </div>
  );
  if (f.type === 'textarea') return wrap(<textarea id={id} dir={f._dir} value={value || ''} onChange={(e) => onChange(e.target.value)} />);
  if (f.type === 'rich') return wrap(<RichText initial={value} dir={f._dir} onChange={onChange} />);
  if (f.type === 'bool') return (
    <div className="field"><label className="switch"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label></div>
  );
  if (f.type === 'image') return wrap(<ImageUpload value={value} onChange={onChange} onToast={onToast} />);
  if (f.type === 'select') return wrap(
    <select id={id} value={value || f.options[0]} onChange={(e) => onChange(e.target.value)}>
      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (f.type === 'number') return wrap(<input id={id} type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />);
  if (f.type === 'date') return wrap(<input id={id} type="date" value={value || ''} onChange={(e) => onChange(e.target.value || null)} />);
  if (f.type === 'url') return wrap(<input id={id} type="url" value={value || ''} onChange={(e) => onChange(e.target.value)} />);
  if (f.type === 'tags') return wrap(<input id={id} type="text" value={Array.isArray(value) ? value.join(', ') : (value || '')}
    onChange={(e) => onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} />);
  if (f.type === 'categories') return wrap(
    <div className="checks">
      {categories.map((c) => {
        const on = (value || []).includes(c.slug);
        return <label key={c.slug}><input type="checkbox" checked={on}
          onChange={() => onChange(on ? value.filter((s) => s !== c.slug) : [...(value || []), c.slug])} /> {c.label_en}</label>;
      })}
      {!categories.length && <span className="hint">No categories yet.</span>}
    </div>
  );
  return wrap(<input id={id} type="text" dir={f._dir} value={value || ''} onChange={(e) => onChange(e.target.value)} />);
}

/* --------------------------------------------------------------- data ops --- */
async function loadList(res) {
  const q = supabase.from(res.table).select('*');
  const { data: parents, error } = await q.order(res.order || (res.table === 'partners' || res.table === 'team_members' || res.table === 'founders' || res.table === 'podcast_episodes' ? 'sort' : 'id'), { ascending: res.order ? false : true });
  if (error) throw error;
  let txByFk = {};
  if (res.tx) {
    const { data: tx } = await supabase.from(res.tx).select('*');
    for (const r of tx || []) (txByFk[r[res.fk]] ??= {})[r.lang] = r;
  }
  return (parents || []).map((p) => ({ parent: p, tx: txByFk[p.id] || { en: {}, ar: {} } }));
}

/* ------------------------------------------------------------------ views ---- */
function ListView({ res, rows, categories, onNew, onEdit, onDelete }) {
  const [q, setQ] = useState('');
  const title = (row) => res.tx ? (row.tx.en?.[res.titleTx] || '(untitled)') : (row.parent[res.titleField] || '(untitled)');
  const filtered = rows.filter((r) => title(r).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="cadmin-toolbar">
        <div className="cadmin-search"><input placeholder={`Search ${res.label}…`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={onNew}>+ New</button>
      </div>
      {!filtered.length && <div className="cadmin-empty">Nothing here yet. Click “New”.</div>}
      <div className="cadmin-list">
        {filtered.map((row) => {
          const img = row.parent.cover_image || row.parent.image || row.parent.logo;
          return (
            <div className="cadmin-item" key={row.parent.id}>
              {('cover_image' in row.parent || 'image' in row.parent || 'logo' in row.parent)
                ? (img ? <img className="cadmin-item-thumb" src={mediaUrl(img)} alt="" /> : <div className="cadmin-item-thumb" />) : null}
              <div className="cadmin-item-main">
                <div className="cadmin-item-title">{title(row)}</div>
                <div className="cadmin-item-sub">
                  {row.parent.status && <span className={'badge ' + (row.parent.status === 'published' ? 'badge-pub' : 'badge-draft')}>{row.parent.status}</span>}
                  {row.parent.featured && <span className="badge badge-feat">featured</span>}
                  {row.parent.published_date && <span>{row.parent.published_date}</span>}
                  {res.tx && <span>{row.tx.ar?.[res.titleTx] ? 'EN + AR' : 'EN only'}</span>}
                </div>
              </div>
              <div className="cadmin-item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(row)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(row)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditView({ res, row, categories, onCancel, onSaved, onToast }) {
  const [parent, setParent] = useState(() => ({ ...row.parent }));
  const [tx, setTx] = useState(() => ({ en: { ...row.tx.en }, ar: { ...row.tx.ar } }));
  const [lang, setLang] = useState('en');
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);

  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const setP = (k, v) => { setParent((p) => ({ ...p, [k]: v })); mark(); };
  const setT = (l, k, v) => { setTx((t) => ({ ...t, [l]: { ...t[l], [k]: v } })); mark(); };

  const validate = () => {
    const e = {};
    for (const f of res.shared) if (f.required && !parent[f.k]) e['s_' + f.k] = 'Required';
    if (res.tx) for (const f of res.translated) if (f.required && !tx.en[f.k]) e['en_' + f.k] = 'Required (English)';
    setErrs(e); return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) { onToast('Please fix the highlighted fields.', 'err'); return; }
    setSaving(true);
    try {
      const p = { ...parent };
      if (res.key === 'articles') {
        if (!p.slug) p.slug = slugify(tx.en.title);
        if (p.read_time == null || p.read_time === '') p.read_time = estReadTime(tx.en.content);
      }
      // sort for new simple/list rows
      if (p.id == null && ('sort' in (res.shared.find(() => false) || {}) || res.table !== 'articles')) p.sort = p.sort ?? Date.now() % 100000;
      const { data: saved, error } = await supabase.from(res.table).upsert(p).select().single();
      if (error) throw error;
      if (res.tx) {
        const rows = [];
        for (const [l] of LANGS) {
          const t = tx[l];
          if (l === 'ar' && !t?.[res.titleTx]) continue; // skip empty AR
          rows.push({ [res.fk]: saved.id, lang: l, ...cleanTx(res, t), ...(res.key === 'articles' ? { ar_edited: l === 'ar' } : {}) });
        }
        if (rows.length) { const { error: e2 } = await supabase.from(res.tx).upsert(rows, { onConflict: `${res.fk},lang` }); if (e2) throw e2; }
      }
      onToast('Saved.', 'ok'); setDirty(false); onSaved();
    } catch (e) { onToast('Save failed: ' + e.message, 'err'); } finally { setSaving(false); }
  };

  const isNew = row.parent.id == null;
  return (
    <div className="card">
      <div className="editor-head">
        <h3>{isNew ? 'New' : 'Edit'} {res.label.replace(/s$/, '')}</h3>
        <div className="row" style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => { if (!dirty || confirm('Discard unsaved changes?')) onCancel(); }}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <span className="cadmin-spinner" /> : 'Save'}</button>
        </div>
      </div>

      {res.shared.map((f) => (
        <Field key={f.k} f={f} value={parent[f.k]} err={errs['s_' + f.k]} categories={categories} onToast={onToast}
          onChange={(v) => setP(f.k, v)} />
      ))}

      {res.tx && (
        <>
          <div className="tabs">
            {LANGS.map(([l, lbl]) => <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{lbl}</button>)}
          </div>
          {LANGS.map(([l]) => l === lang && (
            <div key={l}>
              {res.translated.map((f) => (
                <Field key={f.k} f={{ ...f, _dir: l === 'ar' ? 'rtl' : 'ltr' }} value={tx[l][f.k]} err={l === 'en' ? errs['en_' + f.k] : null}
                  categories={categories} onToast={onToast} onChange={(v) => setT(l, f.k, v)} />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
function cleanTx(res, t) {
  const o = {};
  for (const f of res.translated) o[f.k] = f.type === 'tags' ? (t[f.k] || []) : (t[f.k] ?? (f.type === 'tags' ? [] : ''));
  return o;
}

/* ------------------------------------------------------------------ login ---- */
function Login({ onIn }) {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) setErr(error.message); else onIn();
  };
  return (
    <div className="cadmin-login">
      <form className="cadmin-login-card" onSubmit={submit}>
        <h1>CHIFAA</h1><p>Admin panel</p>
        <div className="field"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></div>
        <div className="field"><input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" /></div>
        {err && <div className="err-text" style={{ marginBottom: 10 }}>{err}</div>}
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>{busy ? <span className="cadmin-spinner" /> : 'Log in'}</button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------- main ---- */
export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [resKey, setResKey] = useState('articles');
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // {parent,tx} or null
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const [dark, setDark] = useState(false);
  const [publishing, setPublishing] = useState(false);
  // Localhost-only read-only preview (?demo) for visual QA. No-op on the real
  // domain, and RLS still blocks all writes, so it exposes nothing non-public.
  const [demo] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo') && location.hostname === 'localhost');
  const res = RESOURCES.find((r) => r.key === resKey);

  const showToast = useCallback((msg, kind) => { setToast({ msg, kind }); setTimeout(() => setToast(null), 3200); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Supabase re-validates the token when the tab regains focus and fires
    // SIGNED_IN / TOKEN_REFRESHED with a *fresh* session object. Only update
    // state when the logged-in user actually changes — otherwise the new object
    // reference re-runs the data effect below and wipes the list / open edit form
    // (this looked like the page "reloading" on every tab switch).
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession((prev) => (prev && s && prev.user?.id === s.user?.id ? prev : s));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Admin has its own theme; strip the site's dark-mode class so dark-theme.css
  // (inlined globally) doesn't bleed into the admin and hide text.
  useEffect(() => {
    document.body.classList.remove('dark-mode');
    setDark(localStorage.getItem('chifaa_admin_theme') === 'dark');
    // Load Font Awesome (same version the About page uses) so the social-link
    // preview pills in the Pages editor show their real brand icons.
    const FA_ID = 'cadmin-fa';
    if (!document.getElementById(FA_ID)) {
      const l = document.createElement('link');
      l.id = FA_ID; l.rel = 'stylesheet';
      l.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/all.min.css';
      document.head.appendChild(l);
    }
  }, []);
  const toggleTheme = () => setDark((d) => { const n = !d; try { localStorage.setItem('chifaa_admin_theme', n ? 'dark' : 'light'); } catch (e) { } return n; });
  const shellCls = 'cadmin' + (dark ? ' cadmin-dark' : '');
  const publish = async () => {
    setPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish');
      if (error) throw error;
      showToast(data?.message || 'Deploy started — live in ~1-2 minutes.', 'ok');
    } catch (e) {
      showToast('Publish failed: ' + (e.message || e), 'err');
    } finally { setPublishing(false); }
  };

  const refresh = useCallback(async () => {
    if (!res) return;
    setRows(null); setEditing(null);
    try { setRows(await loadList(res)); } catch (e) { showToast('Load failed: ' + e.message, 'err'); setRows([]); }
  }, [res, showToast]);

  useEffect(() => {
    if (!(session || demo)) return;
    if (res) refresh();
    supabase.from('categories').select('*').order('sort').then(({ data }) => setCategories(data || []));
  }, [session, resKey]); // eslint-disable-line

  const del = async (row) => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    const { error } = await supabase.from(res.table).delete().eq('id', row.parent.id);
    if (error) showToast('Delete failed: ' + error.message, 'err'); else { showToast('Deleted.', 'ok'); refresh(); }
  };
  const newRow = () => setEditing({ parent: {}, tx: { en: {}, ar: {} } });

  if (session === undefined && !demo) return <div className={shellCls}><div className="cadmin-loading">Loading…</div></div>;
  if (!session && !demo) return <div className={shellCls}><Login onIn={() => { }} /></div>;

  return (
    <div className={shellCls}>
      <div className="cadmin-shell">
        <aside className="cadmin-side">
          <div className="cadmin-brand">CHIFAA</div>
          <nav className="cadmin-nav">
            {RESOURCES.map((r) => (
              <button key={r.key} className={resKey === r.key ? 'active' : ''} onClick={() => { setResKey(r.key); setEditing(null); }}>
                <span className="ico">{r.icon}</span> {r.label}
              </button>
            ))}
            <button className={resKey === 'mena' ? 'active' : ''} onClick={() => { setResKey('mena'); setEditing(null); }}><span className="ico">🌍</span> MENA data</button>
            <button className={resKey === 'pages' ? 'active' : ''} onClick={() => { setResKey('pages'); setEditing(null); }}><span className="ico">📄</span> Pages</button>
          </nav>
          <div className="cadmin-side-foot">
            <small>{session?.user?.email || 'Preview mode'}</small>
            <button className="btn btn-ghost btn-sm" onClick={() => supabase.auth.signOut()}>Log out</button>
          </div>
        </aside>
        <main className="cadmin-main">
          <header className="cadmin-top">
            <h2>{res ? res.label : (resKey === 'mena' ? 'MENA data' : 'Pages')}</h2>
            <div className="row">
              <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title="Toggle admin theme">{dark ? '☀️' : '🌙'}</button>
              <button className="btn btn-publish" onClick={publish} disabled={publishing}>{publishing ? <span className="cadmin-spinner" /> : 'Publish to site'}</button>
            </div>
          </header>
          <div className="cadmin-body">
            <div className="view-anim" key={resKey + (editing ? '-edit' : '-list')}>
              {resKey === 'mena' ? <MenaEditor onToast={showToast} />
                : resKey === 'pages' ? <PagesEditor onToast={showToast} />
                  : editing ? <EditView res={res} row={editing} categories={categories} onCancel={() => setEditing(null)} onSaved={refresh} onToast={showToast} />
                    : rows === null ? <div className="cadmin-loading">Loading…</div>
                      : <ListView res={res} rows={rows} categories={categories} onNew={newRow} onEdit={setEditing} onDelete={del} />}
            </div>
          </div>
        </main>
      </div>
      {toast && <div className={'cadmin-toast show ' + (toast.kind || '')}>{toast.msg}</div>}
    </div>
  );
}
