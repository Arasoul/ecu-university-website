'use client';

import { useEffect, useMemo, useState } from 'react';

export default function AdmissionsGuide({ records }) {
  const [selectedId, setSelectedId] = useState(records[0]?.id);
  const [checked, setChecked] = useState([]);
  const selected = useMemo(() => records.find((record) => record.id === selectedId) || records[0], [records, selectedId]);
  const documents = selected?.documents || [];
  const steps = ['Review the certificate guidance and linked official source.', 'Prepare the listed documents for confirmation with ECU Admissions.', 'Confirm current eligibility, deadlines and any faculty-specific requirements.', 'Use the authorized ECU admissions portal to submit or continue an application.'];
  const faqs = [
    ['Are these requirements current?', 'They are historical public guidance. Confirm the current intake rules, thresholds and deadlines with ECU Admissions.'],
    ['Can I upload documents here?', 'No. This checklist is local preparation support only. Use ECU’s authorized admissions process.'],
    ['Does this page confirm admission?', 'No. It does not make eligibility or admission decisions.'],
  ];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`ecu-admission-checklist-${selected?.id}`);
      setChecked(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.warn('Unable to restore the admissions checklist from local storage.', error);
      setChecked([]);
    }
  }, [selected?.id]);

  const toggleDocument = (document) => {
    setChecked((current) => {
      const next = current.includes(document) ? current.filter((item) => item !== document) : [...current, document];
      window.localStorage.setItem(`ecu-admission-checklist-${selected.id}`, JSON.stringify(next));
      return next;
    });
  };
  const resetChecklist = () => {
    setChecked([]);
    window.localStorage.removeItem(`ecu-admission-checklist-${selected.id}`);
  };

  return <div className="admissions-guide">
    <div className="admission-tabs" role="tablist" aria-label="Certificate pathways">
      {records.map((record, index) => <button id={`admission-tab-${record.id}`} type="button" role="tab" aria-controls="admission-panel" tabIndex={record.id === selected?.id ? 0 : -1} aria-selected={record.id === selected?.id} className={record.id === selected?.id ? 'is-active' : ''} key={record.id} onClick={() => { setSelectedId(record.id); }} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') { event.preventDefault(); const direction = event.key === 'End' ? records.length - 1 : event.key === 'Home' ? 0 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index - 1 + records.length) % records.length : (index + 1) % records.length; const next = records[direction]; setSelectedId(next.id); document.getElementById(`admission-tab-${next.id}`)?.focus(); } }}>{record.title}</button>)}
    </div>
    {selected ? <div id="admission-panel" className="admission-guide-content" role="tabpanel" aria-labelledby={`admission-tab-${selected.id}`}><div><p className="eyebrow">SOURCE-BACKED GUIDANCE</p><h3>{selected.title}</h3><p>{selected.summary}</p>{selected.highlights ? <ul className="content-list">{selected.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}<p className="status-note">This is historical public guidance and is not confirmation of 2026–27 eligibility, thresholds or deadlines. Confirm the current cycle with ECU Admissions.</p><a className="text-link" href={selected.sourceUrls[0]} target="_blank" rel="noreferrer">Read the official source -&gt;</a></div><aside className="document-checklist"><p className="eyebrow">DOCUMENT CHECKLIST</p>{documents.length ? <><p>Saved only in this browser for preparation. Do not upload documents here.</p>{documents.map((document) => <label key={document}><input type="checkbox" checked={checked.includes(document)} onChange={() => toggleDocument(document)} />{document}</label>)}<small>{checked.length} of {documents.length} preparation items checked</small><button type="button" className="text-link checklist-reset" onClick={resetChecklist}>Reset this checklist</button></> : <p>The source summary does not provide a complete document list for this certificate. Confirm requirements with ECU Admissions.</p>}</aside></div> : null}
    <section className="admissions-next-steps"><div><p className="eyebrow">APPLICATION STEPS</p><ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol></div><div><p className="eyebrow">FAQ</p>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
  </div>;
}
