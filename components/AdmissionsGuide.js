'use client';

import { useMemo, useState } from 'react';

export default function AdmissionsGuide({ records }) {
  const [selectedId, setSelectedId] = useState(records[0]?.id);
  const [checked, setChecked] = useState([]);
  const selected = useMemo(() => records.find((record) => record.id === selectedId) || records[0], [records, selectedId]);
  const documents = selected?.documents || [];

  const toggleDocument = (document) => {
    setChecked((current) => current.includes(document) ? current.filter((item) => item !== document) : [...current, document]);
  };

  return <div className="admissions-guide">
    <div className="admission-tabs" role="tablist" aria-label="Certificate pathways">
      {records.map((record, index) => <button id={`admission-tab-${record.id}`} type="button" role="tab" aria-controls="admission-panel" tabIndex={record.id === selected?.id ? 0 : -1} aria-selected={record.id === selected?.id} className={record.id === selected?.id ? 'is-active' : ''} key={record.id} onClick={() => { setSelectedId(record.id); setChecked([]); }} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); const next = records[(index + 1) % records.length]; setSelectedId(next.id); document.getElementById(`admission-tab-${next.id}`)?.focus(); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); const previous = records[(index - 1 + records.length) % records.length]; setSelectedId(previous.id); document.getElementById(`admission-tab-${previous.id}`)?.focus(); } }}>{record.title}</button>)}
    </div>
    {selected ? <div id="admission-panel" className="admission-guide-content" role="tabpanel" aria-labelledby={`admission-tab-${selected.id}`}><div><p className="eyebrow">SOURCE-BACKED GUIDANCE</p><h3>{selected.title}</h3><p>{selected.summary}</p>{selected.highlights ? <ul className="content-list">{selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}<p className="status-note">This is historical public guidance and is not confirmation of 2026–27 eligibility, thresholds or deadlines. Confirm the current cycle with ECU Admissions.</p><a className="text-link" href={selected.sourceUrls[0]} target="_blank" rel="noreferrer">Read the official source -&gt;</a></div><aside className="document-checklist"><p className="eyebrow">DOCUMENT CHECKLIST</p>{documents.length ? <><p>Use this checklist for preparation only. Do not upload documents here.</p>{documents.map((document) => <label key={document}><input type="checkbox" checked={checked.includes(document)} onChange={() => toggleDocument(document)} />{document}</label>)}<small>{checked.length} of {documents.length} preparation items checked</small></> : <p>The source summary does not provide a complete document list for this certificate. Confirm requirements with ECU Admissions.</p>}</aside></div> : null}
  </div>;
}
