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
      {records.map((record) => <button type="button" role="tab" aria-selected={record.id === selected?.id} className={record.id === selected?.id ? 'is-active' : ''} key={record.id} onClick={() => { setSelectedId(record.id); setChecked([]); }}>{record.title}</button>)}
    </div>
    {selected ? <div className="admission-guide-content"><div><p className="eyebrow">SOURCE-BACKED GUIDANCE</p><h3>{selected.title}</h3><p>{selected.summary}</p>{selected.highlights ? <ul className="content-list">{selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}<p className="status-note">This is historical public guidance and is not confirmation of 2026–27 eligibility, thresholds or deadlines. Confirm the current cycle with ECU Admissions.</p><a className="text-link" href={selected.sourceUrls[0]} target="_blank" rel="noreferrer">Read the official source -&gt;</a></div><aside className="document-checklist"><p className="eyebrow">DOCUMENT CHECKLIST</p>{documents.length ? <><p>Use this checklist for preparation only. Do not upload documents here.</p>{documents.map((document) => <label key={document}><input type="checkbox" checked={checked.includes(document)} onChange={() => toggleDocument(document)} />{document}</label>)}<small>{checked.length} of {documents.length} preparation items checked</small></> : <p>The source summary does not provide a complete document list for this certificate. Confirm requirements with ECU Admissions.</p>}</aside></div> : null}
  </div>;
}
