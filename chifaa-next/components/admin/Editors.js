'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase, mediaUrl } from '@/lib/supabaseClient';

/* ============================================================== MENA data ==== */
const MENA_GROUPS = [
  ['womens_health', "Women's Health", [['femalePopShare', 'Female pop. share'], ['lifeExpectancy', 'Life expectancy'], ['maternalMortality', 'Maternal mortality'], ['literacyRate', 'Literacy rate']]],
  ['chronic_disease', 'Chronic Disease', [['diabetesPrevalence', 'Diabetes prevalence'], ['cardiovascularRate', 'Cardiovascular rate'], ['obesityRate', 'Obesity rate']]],
  ['cervical_cancer', 'Cervical Cancer', [['incidenceRate', 'Incidence rate'], ['mortalityRate', 'Mortality rate'], ['hpvVacCoverage', 'HPV vaccine coverage'], ['screeningCoverage', 'Screening coverage']]],
];

export function MenaEditor({ onToast }) {
  const [rows, setRows] = useState(null);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setSel(null); setRows(null);
    const { data: mh } = await supabase.from('mena_health').select('*').order('sort');
    const { data: tr } = await supabase.from('mena_translations').select('*');
    const nm = {}; for (const t of tr || []) (nm[t.country_id] ??= {})[t.lang] = t.country;
    setRows((mh || []).map((m) => ({ mh: { ...m }, en: nm[m.country_id]?.en || '', ar: nm[m.country_id]?.ar || '' })));
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStat = (g, f, v) => setSel((s) => ({ ...s, mh: { ...s.mh, [g]: { ...(s.mh[g] || {}), [f]: v } } }));
  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('mena_health').update({
        womens_health: sel.mh.womens_health, chronic_disease: sel.mh.chronic_disease, cervical_cancer: sel.mh.cervical_cancer,
      }).eq('country_id', sel.mh.country_id);
      if (error) throw error;
      const { error: e2 } = await supabase.from('mena_translations').upsert(
        [{ country_id: sel.mh.country_id, lang: 'en', country: sel.en }, { country_id: sel.mh.country_id, lang: 'ar', country: sel.ar }],
        { onConflict: 'country_id,lang' });
      if (e2) throw e2;
      onToast('Saved.', 'ok'); load();
    } catch (e) { onToast('Save failed: ' + e.message, 'err'); } finally { setSaving(false); }
  };

  if (rows === null) return <div className="cadmin-loading">Loading…</div>;
  if (sel) return (
    <div className="card">
      <div className="editor-head">
        <h3><img src={`https://flagcdn.com/h24/${(sel.mh.iso2 || '').toLowerCase()}.png`} alt="" style={{ height: 20, marginInlineEnd: 8, verticalAlign: '-3px', borderRadius: 3 }} />{sel.en || sel.mh.country_id}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setSel(null)}>Back</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <span className="cadmin-spinner" /> : 'Save'}</button>
        </div>
      </div>
      <div className="grid-2">
        <div className="field"><label>Country name (English)</label><input value={sel.en} onChange={(e) => setSel((s) => ({ ...s, en: e.target.value }))} /></div>
        <div className="field"><label>Country name (Arabic)</label><input dir="rtl" value={sel.ar} onChange={(e) => setSel((s) => ({ ...s, ar: e.target.value }))} /></div>
      </div>
      {MENA_GROUPS.map(([g, label, fields]) => (
        <div key={g}>
          <div className="section-label">{label}</div>
          <div className="grid-3">
            {fields.map(([f, flabel]) => (
              <div className="field" key={f}><label>{flabel}</label>
                <input value={sel.mh[g]?.[f] ?? ''} onChange={(e) => setStat(g, f, e.target.value)} /></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const filtered = rows.filter((r) => (r.en || r.mh.country_id).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="cadmin-toolbar"><div className="cadmin-search"><input placeholder="Search countries…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <div className="cadmin-list">
        {filtered.map((r) => (
          <div className="cadmin-item" key={r.mh.country_id}>
            <img className="cadmin-item-thumb" style={{ objectFit: 'contain', background: 'var(--rose-tint)', padding: 4 }} src={`https://flagcdn.com/h40/${(r.mh.iso2 || '').toLowerCase()}.png`} alt={r.mh.iso2} />
            <div className="cadmin-item-main">
              <div className="cadmin-item-title">{r.en || r.mh.country_id}</div>
              <div className="cadmin-item-sub"><span className="badge badge-soft">{r.mh.iso2}</span><span dir="rtl">{r.ar}</span></div>
            </div>
            <div className="cadmin-item-actions"><button className="btn btn-ghost btn-sm" onClick={() => setSel(r)}>Edit</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== Pages ==== */
const LANGS = [['en', 'English'], ['ar', 'العربية']];

export function PagesEditor({ onToast }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('en');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setData(null);
    const { data: rows } = await supabase.from('site_content').select('*');
    const m = {}; for (const r of rows || []) m[`${r.key}_${r.lang}`] = r.data || {};
    setData(m);
  }, []);
  useEffect(() => { load(); }, [load]);

  const get = (key, l) => (data[`${key}_${l}`] || {});
  const setF = (key, l, f, v) => setData((d) => ({ ...d, [`${key}_${l}`]: { ...(d[`${key}_${l}`] || {}), [f]: v } }));
  const save = async (key, langs) => {
    setSaving(true);
    try {
      const rows = langs.map((l) => ({ key, lang: l, data: get(key, l) }));
      const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key,lang' });
      if (error) throw error;
      onToast('Saved.', 'ok');
    } catch (e) { onToast('Save failed: ' + e.message, 'err'); } finally { setSaving(false); }
  };

  if (data === null) return <div className="cadmin-loading">Loading…</div>;
  const PAGES = [['home', 'Home'], ['about', 'About'], ['contact', 'Contact'], ['ai_companion', 'AI Companion'], ['author', 'Author']];
  const bilingual = page === 'about' || page === 'author';
  const SaveBtn = ({ langs }) => <button className="btn btn-primary" disabled={saving} onClick={() => save(page, langs)}>{saving ? <span className="cadmin-spinner" /> : 'Save'}</button>;

  return (
    <div>
      <div className="cadmin-toolbar">
        <div className="tabs" style={{ margin: 0 }}>
          {PAGES.map(([k, l]) => <button key={k} className={page === k ? 'active' : ''} onClick={() => setPage(k)}>{l}</button>)}
        </div>
      </div>
      <div className="card">
        <div className="editor-head">
          <h3>{PAGES.find((p) => p[0] === page)[1]}</h3>
          <SaveBtn langs={bilingual ? ['en', 'ar'] : ['en']} />
        </div>

        {bilingual && (
          <div className="tabs">{LANGS.map(([l, lbl]) => <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{lbl}</button>)}</div>
        )}
        {(() => {
          const L = bilingual ? lang : 'en'; const d = get(page, L); const dir = L === 'ar' ? 'rtl' : 'ltr';
          if (page === 'home') return <div className="field"><label>YouTube video URL</label><input value={d.videoUrl || ''} onChange={(e) => setF(page, L, 'videoUrl', e.target.value)} /></div>;
          if (page === 'contact') return (<>
            <div className="grid-2">
              <div className="field"><label>Email</label><input value={d.email || ''} onChange={(e) => setF(page, L, 'email', e.target.value)} /></div>
              <div className="field"><label>Phone</label><input value={d.phone || ''} onChange={(e) => setF(page, L, 'phone', e.target.value)} /></div>
            </div>
            <div className="field"><label>Address</label><textarea value={d.address || ''} onChange={(e) => setF(page, L, 'address', e.target.value)} /></div>
          </>);
          if (page === 'ai_companion') return (<>
            <div className="field"><label>Title</label><input value={d.title || ''} onChange={(e) => setF(page, L, 'title', e.target.value)} /></div>
            <div className="field"><label>Description</label><textarea value={d.description || ''} onChange={(e) => setF(page, L, 'description', e.target.value)} /></div>
          </>);
          if (page === 'author') return (<>
            <div className="field"><label>Name</label><input dir={dir} value={d.name || ''} onChange={(e) => setF(page, L, 'name', e.target.value)} /></div>
            <div className="field"><label>Role / title</label><input dir={dir} value={d.role || ''} onChange={(e) => setF(page, L, 'role', e.target.value)} /></div>
            <div className="field"><label>Photo path</label><input value={d.image || ''} onChange={(e) => setF(page, L, 'image', e.target.value)} />
              {d.image && <img className="img-preview" style={{ marginTop: 10 }} src={mediaUrl(d.image)} alt="" />}</div>
          </>);
          // about
          return <AboutFields d={d} dir={dir} onField={(f, v) => setF(page, L, f, v)} />;
        })()}
      </div>
    </div>
  );
}

function AboutFields({ d, dir, onField }) {
  const paras = d.paragraphs || [];
  const socials = d.socialLinks || [];
  const setPara = (i, v) => onField('paragraphs', paras.map((p, j) => (j === i ? v : p)));
  const setSocial = (i, k, v) => onField('socialLinks', socials.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  return (<>
    <div className="field"><label>Title</label><input dir={dir} value={d.title || ''} onChange={(e) => onField('title', e.target.value)} /></div>
    <div className="section-label">Paragraphs</div>
    {paras.map((p, i) => (
      <div className="field" key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <textarea dir={dir} value={p} onChange={(e) => setPara(i, e.target.value)} />
        <button className="btn btn-danger btn-sm" onClick={() => onField('paragraphs', paras.filter((_, j) => j !== i))}>✕</button>
      </div>
    ))}
    <button className="btn btn-ghost btn-sm" onClick={() => onField('paragraphs', [...paras, ''])}>+ Add paragraph</button>
    <div className="section-label">Social links</div>
    {socials.map((s, i) => (
      <div className="grid-2" key={i} style={{ marginBottom: 10 }}>
        <input placeholder="Name" value={s.name || ''} onChange={(e) => setSocial(i, 'name', e.target.value)} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="URL" value={s.url || ''} onChange={(e) => setSocial(i, 'url', e.target.value)} />
          <button className="btn btn-danger btn-sm" onClick={() => onField('socialLinks', socials.filter((_, j) => j !== i))}>✕</button>
        </div>
        <input placeholder="Icon class" value={s.icon || ''} onChange={(e) => setSocial(i, 'icon', e.target.value)} />
        <input placeholder="CSS class" value={s.class || ''} onChange={(e) => setSocial(i, 'class', e.target.value)} />
      </div>
    ))}
    <button className="btn btn-ghost btn-sm" onClick={() => onField('socialLinks', [...socials, { name: '', url: '', icon: '', class: '' }])}>+ Add link</button>
  </>);
}
