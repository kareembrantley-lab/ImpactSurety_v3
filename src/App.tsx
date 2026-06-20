import React, { useState } from "react";

/* =====================================================================
   IMPACT SURETY — single-page marketing site (Website Prompt v1.5)
   Owner is the hero; advisor is the most-prepared guide; the demo FactBook
   is the centerpiece. M3 arc: brace -> work -> why -> exhale -> ask.
   The Demo FactBook is embedded; the hero CTA scrolls to it.
   Demo content equals the engine-derived demo_factbook.json (validated).
   ===================================================================== */

const LABEL = "Illustrative example — fictional company. Not a real verification.";
const CALENDAR_URL = "https://calendar.app.google/cNchrTCDrX5XrEpL9";
const LIMITS =
  "Census means provided records, not reality. We verify 100% of the records you provide and the sources you authorize — establishing their completeness, consistency, and traceability to source. We are not a fraud examination and not an assurance opinion. Stating this limit is the boundary that makes everything inside it checkable.";
const GRADE_GLOSS =
  "An evidence grade rates how well the evidence backs a fact — it grades the proof, never your business.";

const gradeChip: Record<string, string> = {
  A: "bg-blue-950 text-white", B: "bg-blue-800 text-white",
  C: "bg-slate-600 text-white", D: "bg-slate-400 text-white",
  E: "bg-white text-slate-500 border border-dashed border-slate-400",
};

/* ---------------- Demo FactBook content (= demo_factbook.json) ---------------- */
const partA = [
  { id:"P6", grade:"B", recoverable:true, fact:"One operating account went unreconciled to the general ledger for three months; the variance is traced and quantified.", figure:"$83,400 unreconciled", area:"ORS area 1 — Proof of cash", threshold:"Proof-of-cash variance > 0.05% / month",
    source:{ label:"Bank statement — Account ••4471 · Jul–Sep 2024", lines:["GL cash (1010) balance, 9/30/24 .......... 1,204,338.10","Bank statement closing, 9/30/24 .......... 1,287,742.55","Unreconciled difference .......................... 83,404.45","Reconciliation last completed ................ 6/30/24"] } },
  { id:"P7", grade:"C", recoverable:false, fact:"Three manual top-side journal entries posted within three days of year-end shifted roughly $210,000 of income into the earlier period.", figure:"≈ $210,000 moved", area:"ORS area 5 — Period-end entries", threshold:"Unsupported period-end entries (Grade C/D cluster)",
    source:{ label:"GL journal — JE-1188 / JE-1190 / JE-1192 · Dec 29–31, 2024", lines:["JE-1188 12/29/24  Cr Revenue 92,000   memo: (none)","JE-1190 12/30/24  Cr Revenue 64,500   memo: (none)","JE-1192 12/31/24  Cr Revenue 53,500   memo: (none)","Supporting documentation ............... not attached"] } },
  { id:"P13", grade:"B", recoverable:false, fact:"Accrued bonuses and deferred service revenue are debt-like but do not appear in the company’s net-debt summary.", figure:"$785,000 debt-like", area:"ORS area 11 — Debt-like items bridge", threshold:"Debt-like items omitted from net-debt view",
    source:{ label:"GL accounts 2300 / 2400 · Mar 2025; management net-debt schedule", lines:["Accrued bonuses (2300), 3/31/25 ........ 420,000.00","Deferred service revenue (2400) ........ 365,000.00","Management net-debt schedule ........... neither line included"] } },
  { id:"P11", grade:"A", recoverable:false, fact:"Working capital swings more than 12% month-to-month with summer cooling demand; a seasonal peg is required to read it.", figure:"+14.8% largest swing", area:"ORS area 10 — Seasonal working capital", threshold:"Seasonal working-capital peg required",
    source:{ label:"36-month monthly balance sheet; AR / AP / inventory roll-forward", lines:["Net working capital, Jan 2024 ........... 1,910,220","Net working capital, Jul 2024 ........... 2,664,880  (+39.5% vs Jan)","Largest month-over-month swing ......... +14.8%  (May→Jun 2024)"] } },
  { id:"A-clean", grade:"A", recoverable:false, clean:true, fact:"Payroll taxes were remitted on time and tie to the filed returns for all twenty-four months.", figure:"Clean — 24 / 24 months", area:"ORS area 13 — Payroll tax", threshold:"—",
    source:{ label:"Form 941 filings Q1 2023–Q4 2024; payroll register; bank debits", lines:["2023 Q1–Q4 941s ......... filed, tied to register","2024 Q1–Q4 941s ......... filed, tied to register","Late deposits ............... none identified"] } },
];
const partB = [
  { id:"P1", grade:"A", recoverable:true, fact:"Invoice #4471 from Cascade Supply was paid twice, six days apart.", figure:"$18,240", area:"ORS area 16 — Duplicate payments", threshold:"Duplicate ≥ 0.1% of annual spend",
    source:{ label:"AP payments PMT-2207 & PMT-2261 · Aug 2024", lines:["PMT-2207 8/12/24  Cascade Supply  inv #4471 .... 18,240.00","PMT-2261 8/18/24  Cascade Supply  inv #4471 .... 18,240.00","Same invoice #, same amount, 6 days apart"] } },
  { id:"P2", grade:"A", recoverable:true, fact:"A vendor credit memo from Pacific Parts was issued but never applied to a later invoice.", figure:"$14,500", area:"ORS area 16 — Unapplied credits", threshold:"Unapplied credits ≥ $10,000",
    source:{ label:"Credit memo CM-0934 · Feb 2024", lines:["CM-0934 2/09/24  Pacific Parts  credit ......... 14,500.00","Pacific Parts invoices Mar–Dec 2024 ........... no offset applied","Open credit balance carried .................... 14,500.00"] } },
  { id:"P3", grade:"B", recoverable:false, fact:"The dispatch-software contract renews automatically each year with a 7% price escalator.", figure:"$96,000 / yr", area:"ORS area 19 — Auto-renewing commitments", threshold:"Auto-renewing commitments ≥ 5% of annual spend",
    source:{ label:"FieldRoute SaaS agreement §6.2, §6.4", lines:["§6.2  Auto-renews for successive 12-month terms unless","       cancelled 90 days prior","§6.4  Annual price increase of 7%","Current annual value .......................... 96,000.00"] } },
  { id:"P4", grade:"A", recoverable:false, fact:"One customer, Cascade Regional Hospitals, is about 28% of trailing-twelve-month revenue.", figure:"≈ 28% · $3.9M", area:"ORS area 3 / 19 — Customer concentration", threshold:"Concentration ≥ 20%",
    source:{ label:"AR invoices + revenue roll-up by customer · TTM to Mar 2025", lines:["Cascade Regional Hospitals, TTM revenue ...... 3,912,400","Total TTM revenue ............................. 13,980,000","Share ......................................... 27.98%"] } },
  { id:"P5", grade:"B", recoverable:false, fact:"A signed equipment-lease obligation has no matching entry in the ledger or payables — an unrecorded payable.", figure:"$3,100 / mo", area:"ORS area 19 vs 11 — Commitment-to-ledger gap", threshold:"Unrecorded payable (commitment-to-ledger gap)",
    source:{ label:"Komatsu lift lease · 36-month term", lines:["Lease ........... 3,100.00 / mo, 36-month term, signed 4/2024","GL search ....... no recurring 3,100 entry","AP register ..... no Komatsu payable found"] } },
  { id:"P8", grade:"B", recoverable:false, fact:"A “consulting” vendor paid $7,500 monthly is the owner’s spouse; no contract is on file.", figure:"$90,000 / yr", area:"ORS area 7 / 16 — Related-party flows", threshold:"Related-party flows of any size",
    source:{ label:"AP vendor “Lakeside Advisory” · payment stream", lines:["Lakeside Advisory .... 7,500.00 / mo, 24 of 24 months","Vendor TIN ........... matches owner-household record","Contract on file ..... none"] } },
  { id:"P9", grade:"B", recoverable:false, fact:"Three service vehicles past useful life show no repair-and-maintenance spend for eighteen months.", figure:"3 vehicles · 18 mo", area:"ORS area 22 (LMM) — Deferred maintenance", threshold:"Facilities / capital deferred-maintenance fact",
    source:{ label:"Fixed-asset register + R&M detail by vehicle · Oct 2023–Mar 2025", lines:["Unit 12  VIN ••7741  in service 2009  R&M 18 mo ... 0.00","Unit 19  VIN ••2208  in service 2010  R&M 18 mo ... 0.00","Unit 24  VIN ••9015  in service 2011  R&M 18 mo ... 0.00"] } },
  { id:"P10", grade:"B", recoverable:false, fact:"Four contractors paid a fixed monthly amount for more than six months follow a full-time work pattern; classification is shown as filed.", figure:"4 contractors", area:"ORS area 12 / 23 — Labor classification", threshold:"Classification facts as filed",
    source:{ label:"1099 payment detail · trailing 12 months", lines:["4 payees  fixed 5,200–6,800 / mo  8–12 consecutive months","Paid via AP, issued 1099-NEC","Classification as filed ........ independent contractor"] } },
];
const partCD = [
  { id:"P12", grade:"B", recoverable:false, fact:"A material customer contract requires the customer’s written consent before a change of control.", figure:"Consent required", area:"ORS area 32 (Part D) — Change-of-control consent", threshold:"Consent-to-sell held by a non-signing party",
    source:{ label:"Cascade Regional Hospitals MSA §14.3", lines:["§14.3  Written consent required for any change of control","Counterparty ..... Cascade Regional Hospitals (≈28% of revenue)","Consent on file .. none requested"] } },
  { id:"CD-clean", grade:"A", recoverable:false, clean:true, fact:"The capitalization table reconciles to 100% of the issuance documents; ownership is fully accounted.", figure:"Clean — 100%", area:"ORS area 29 (Part D) — Cap table", threshold:"—",
    source:{ label:"Operating agreement + membership-unit ledger", lines:["Units issued per ledger ......... 10,000","Units per issuance documents .... 10,000","Reconciled ...................... 100%"] } },
];
const gradeE = [
  { id:"E1", reason:"R1 — sale confidentiality", fact:"access logs and training records were not collected.", area:"ORS area 25–26 (Part C)" },
  { id:"E2", reason:"R4 — consent withheld", fact:"communications-metadata analysis for owner-dependence was not run.", area:"ORS area 26 (Part C)" },
  { id:"E3", reason:"R5 — third party declined", fact:"the landlord declined to confirm lease terms on the related-party building.", area:"ORS area 22 (Part B)" },
];
const indexLines = [
  ["P1","Duplicate vendor payment","$18,240"],["P2","Unapplied vendor credit","$14,500"],
  ["P3","Auto-renewing contract, 7% escalator","$96,000 / yr"],["P4","Customer concentration","≈ 28%"],
  ["P5","Unrecorded lease commitment","$3,100 / mo"],["P6","Bank account unreconciled three months","$83,400"],
  ["P7","Unsupported year-end top-side entries","≈ $210,000"],["P8","Related-party consulting payments","$90,000 / yr"],
  ["P9","Deferred maintenance, three vehicles","—"],["P10","Four contractors on a full-time pattern, as filed","—"],
  ["P11","Seasonal working-capital swing","> 12% MoM"],["P12","Change-of-control consent in a material contract","—"],
  ["P13","Debt-like items absent from net-debt view","$785,000"],
];
const TABS = [{key:"cover",label:"Cover"},{key:"A",label:"Financial Record"},{key:"B",label:"Quality of Spend"},{key:"CD",label:"Operations & Governance"},{key:"index",label:"Disclosed Conditions"}];

function Chevron({ open }: { open: boolean }) {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform duration-200 ${open?"rotate-90":""}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>);
}
function FactRow({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button onClick={() => setOpen(o=>!o)} className="w-full flex items-start gap-3 py-4 text-left group">
        <span className={`mt-0.5 inline-flex items-center justify-center text-xs font-semibold rounded-sm w-7 h-7 font-mono ${gradeChip[item.grade]}`}>{item.grade}</span>
        <span className="flex-1">
          <span className="text-[15px] leading-snug text-slate-900">{item.fact}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-slate-700">{item.figure}</span><span className="text-slate-300">·</span><span>{item.area}</span>
            {item.recoverable && <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-medium">Recoverable — your call</span>}
            {item.clean && <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 text-[11px] font-medium">No condition — verified clean</span>}
          </span>
        </span>
        <span className="text-amber-700 group-hover:text-amber-800 mt-1 flex items-center gap-1 text-xs font-medium"><span className="hidden sm:inline">{open?"Hide source":"Tap to source"}</span><Chevron open={open} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open?"max-h-96 opacity-100":"max-h-0 opacity-0"}`}>
        <div className="mb-4 ml-10 rounded-md border border-slate-200 bg-slate-900 text-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-700 px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Source · {item.source.label}
          </div>
          <pre className="px-3 py-3 text-[12px] leading-relaxed font-mono whitespace-pre-wrap text-slate-100">{item.source.lines.join("\n")}</pre>
          {item.threshold !== "—" && <div className="border-t border-slate-700 px-3 py-2 text-[11px] text-slate-400">Trips: {item.threshold}</div>}
          {item.recoverable && <div className="border-t border-slate-700 px-3 py-2 text-[11px] text-amber-300">Eligible for recovery — owner-directed, separate. The standard reports it; it never acts on it.</div>}
        </div>
      </div>
    </div>
  );
}
function ScopeLine() {
  return (<div className="mb-5 flex items-start gap-3 rounded-md border border-slate-200 bg-stone-50 px-4 py-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-slate-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><div className="text-sm text-slate-600"><span className="font-medium text-slate-800">Scope is the owner’s choice.</span> What’s assessed, and what’s disclosed, is set by the seller — disclosed first, on their terms.<span className="ml-2 inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Owner controls scope &amp; release · illustrative</span></div></div>);
}
function DemoFactBook() {
  const [tab, setTab] = useState("cover");
  const [showGloss, setShowGloss] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-[12px] text-amber-900">{LABEL}</div>
      <div className="px-5 sm:px-7 pb-8">
        <header className="flex items-center justify-between border-b border-slate-200 py-5">
          <div><div className="text-[13px] font-semibold tracking-[0.2em] text-blue-950">IMPACT SURETY</div><div className="text-xs text-slate-500">The FactBook · verified facts, graded and sourced</div></div>
          <button onClick={()=>setShowGloss(g=>!g)} className="text-xs text-slate-500 hover:text-blue-900 underline decoration-dotted underline-offset-4">What the grades mean</button>
        </header>
        {showGloss && (<div className="mt-3 rounded-md border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-600">{GRADE_GLOSS}<dl className="mt-3 space-y-1.5">{[["A","Third-party confirmed — independently re-checkable"],["B","Third-party documented — not independently re-confirmed"],["C","System of record — internally generated, consistency-tested"],["D","Management representation — asserted, minimal support"],["E","Not assessed — deliberately not gathered, reason-coded"]].map(([g,m])=>(<div key={g} className="flex items-center gap-2 text-[12px]"><span className={`inline-flex items-center justify-center w-6 h-5 rounded-sm font-mono text-[11px] ${(gradeChip as any)[g]}`}>{g}</span><span className="text-slate-600">{m}</span></div>))}</dl></div>)}
        <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">{TABS.map(t=>(<button key={t.key} onClick={()=>setTab(t.key)} className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab===t.key?"border-amber-700 text-blue-950":"border-transparent text-slate-500 hover:text-slate-800"}`}>{t.label}</button>))}</nav>

        {tab==="cover" && (<section className="pt-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-amber-700">FactBook · illustrative</div>
          <h3 className="mt-1 text-2xl sm:text-3xl font-semibold text-blue-950">Northwind HVAC Services, LLC</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">Here is everything a buyer’s accountant will go looking for — already found, already sourced.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Mark</div><div className="mt-1 text-sm font-medium text-blue-950">Evidence-Complete (Part A)</div><div className="text-sm font-medium text-blue-950">Spend-Complete (Part B)</div><div className="text-xs text-slate-500">Parts C–D scoped</div></div>
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Assessed Coverage</div><div className="mt-1 font-mono text-2xl text-blue-950">86%</div><div className="text-xs text-slate-500">the share of the records in scope that we verified</div></div>
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Disclosed conditions</div><div className="mt-1 font-mono text-2xl text-blue-950">13</div><div className="text-xs text-slate-500">counted and evidenced · not rated</div></div>
          </div>
          <div className="mt-3 rounded-md border border-slate-200 p-4"><div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-wider text-slate-400">Readiness Score · Part A (Readiness Core)</div><div className="font-mono text-sm text-blue-950">91 / 100</div></div><div className="mt-2 h-2 w-full rounded-full bg-slate-200"><div className="h-2 rounded-full bg-blue-800" style={{width:"91%"}} /></div><div className="mt-1.5 text-xs text-slate-500">Completeness of the verified record — distance to Evidence-Complete. Not a rating of the business.</div></div>
          <div className="mt-6 rounded-md border-l-2 border-slate-300 bg-stone-50 px-4 py-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">The limit that makes this checkable</div><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{LIMITS}</p><p className="mt-2 text-xs text-slate-500">Census means every record you give us — not a sample.</p></div>
        </section>)}
        {tab==="A" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Part A — Financial Record</h3><p className="mt-1 text-sm text-slate-500">Verified facts, each graded by how well the evidence backs it. Tap any row to open its source.</p><div className="mt-4">{partA.map(it=><FactRow key={it.id} item={it} />)}</div></section>)}
        {tab==="B" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Part B — Quality of Spend</h3><p className="mt-1 text-sm text-slate-500">Where a fact is plainly recoverable, it is tagged. The standard reports it; recovery is owner-directed and handled separately — that gap is the wall.</p><div className="mt-4">{partB.map(it=><FactRow key={it.id} item={it} />)}</div></section>)}
        {tab==="CD" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Parts C & D — Operations & Governance</h3><p className="mt-1 mb-4 text-sm text-slate-500">What was assessed, and — honestly — what was not.</p><ScopeLine /><div>{partCD.map(it=><FactRow key={it.id} item={it} />)}</div><h4 className="mt-7 text-sm font-semibold uppercase tracking-wider text-slate-500">Not assessed</h4><p className="mt-1 text-sm text-slate-500">Shown so the absence of a condition is never mistaken for the absence of a fact.</p><div className="mt-3 space-y-2">{gradeE.map(e=>(<div key={e.id} className="flex items-start gap-3 rounded-md border border-dashed border-slate-300 bg-white px-4 py-3"><span className={`mt-0.5 inline-flex items-center justify-center text-xs font-semibold rounded-sm w-7 h-7 font-mono ${gradeChip.E}`}>E</span><div><div className="text-[15px] text-slate-700">Not assessed — {e.fact}</div><div className="mt-1 text-xs text-slate-500">{e.reason} · {e.area}</div></div></div>))}</div></section>)}
        {tab==="index" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Disclosed-Conditions Index</h3><p className="mt-1 text-sm italic text-slate-600">Conditions are counted and evidenced, never rated. Whether any condition matters is the reader’s judgment.</p><div className="mt-4 overflow-hidden rounded-md border border-slate-200">{indexLines.map((row,i)=>(<div key={row[0]} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${i%2?"bg-stone-50":"bg-white"}`}><span className="w-9 shrink-0 font-mono text-xs text-slate-400">{row[0]}</span><span className="flex-1 text-slate-700">{row[1]}</span><span className="font-mono text-xs text-slate-500">{row[2]}</span></div>))}</div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className="font-medium text-slate-600">Grade-E schedule</span><span className="font-mono">Not assessed: R1×1, R4×1, R5×1</span></div><div className="mt-9 rounded-md bg-blue-950 px-6 py-7 text-center text-white"><p className="mx-auto max-w-lg text-[17px] leading-relaxed">This is the record a buyer’s accountant would rebuild — already built, already sourced. There is nothing here left to find.</p><a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-blue-950 hover:bg-stone-100 transition-colors">See where your facts stand</a><p className="mt-3 text-xs text-blue-200">No pressure. One look is all it takes to start.</p></div></section>)}
      </div>
    </div>
  );
}

/* ---------------- Site chrome ---------------- */
const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };

function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">{children}</div>; }


/* ---------------- The published Standard (ORS v2.4) ---------------- */
function StdH({ n, children }: { n: string, children: React.ReactNode }) { return <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-blue-950">{n}. {children}</h3>; }
function StandardSection() {
  const principles = ["Facts, not opinions","Census, not sampling","Source-linked","Published, not proprietary","Earned, not purchased"];
  const grades = [
    ["A","Third-party confirmed","Bank deposits & statements (direct feed); IRS transcripts; executed contracts; public lien/litigation/license records","Independently confirmable"],
    ["B","Third-party documented","Filed tax returns as provided; payroll, processor & lessor statements; merchant/POS settlement","Documented externally; not independently re-confirmed"],
    ["C","System of record","GL entries, accounting reports, internal POS, inventory & CRM","Internally generated; consistency-tested vs A/B"],
    ["D","Management representation","Owner statements & estimates not yet supported by documents","Disclosed as unverified; flagged for the reader's diligence"],
    ["E","Not assessed","Evidence deliberately not gathered, reason-coded R1–R5","Item-level, visible, never retroactive"],
  ];
  const limits = [
    "Census means provided records, not reality — full-population verification covers 100% of the records provided and the sources authorized; it cannot establish that the record is the whole of reality.",
    "What the methodology structurally narrows — Grade A bank-direct evidence and three-way reconciliation make many misstatements arithmetically visible.",
    "What remains outside any records-based method — revenue never deposited, a parallel undisclosed entity, collusive schemes documented with genuine-looking paper, oral commitments, future events.",
    "This is not a fraud examination and not assurance — no deliverable expresses an opinion or provides assurance; the Reliance Framework defines the supported path for legal weight.",
  ];
  const parts = [
    ["Part A — Financial Record","areas 1–15","Proof of cash, revenue, margins, adjustments, related-party, working capital, debt, payroll, tax, contracts, legal"],
    ["Part B — Spend Record (Quality of Spend)","areas 16–24","Vendor & payables forensics, owner-related spend, acquisition cost, commitment inventory, technology, insurance, facilities, labor, contingencies"],
    ["Part C — Operational Record","areas 25–28","Procedure coverage, owner-time & dependence, systems & automation, key-relationship transferability"],
    ["Part D — Governance Record","areas 29–32","Corporate record, authority & controls presence, related-party governance, transaction-governance readiness"],
  ];
  const marks = ["Evidence-Complete (A)","Spend-Complete (B)","Operations-Documented (C)","Governance-Complete (D)","Transaction-Grade (all four current)"];
  const readiness = [["Evidence quality","40","Dollar-weighted share of figures at Grade A/B, scaled to the 85% floor"],["Scope completeness","30","Scope areas fully populated, 2 points each"],["Reconciliation integrity","30","Banded by aggregate unreconciled variance as a share of revenue"]];
  const thresholds = [
    "Duplicate or contract-variance payments ≥ 0.1% of annual spend; unapplied credits ≥ $10,000",
    "Auto-renewing commitments ≥ 5% of annual spend; any take-or-pay obligation",
    "Vendor concentration — any single vendor ≥ 20% of spend; related-party flows of any size",
    "Owner-related spend candidates ≥ 10% of unadjusted earnings; owner-sourced relationships ≥ 30% of revenue",
    "Enterprise SOP coverage below 60%; any core workflow with zero documented procedure; any system with a single administrator",
    "Any cap-table entry without a matching issuance document; any consent-to-sell held by a non-signing party",
  ];
  const charter = ["No purchase of outcomes","No referrer influence","Separation of issuance from sales","Published, versioned criteria","Factual appeals only","Revocation where evidence is false or incomplete","Independence of the record"];

  return (
    <section id="standard" className="scroll-mt-20 border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <Eyebrow>The published standard</Eyebrow>
        <h2 className="mt-3 text-3xl font-semibold text-blue-950">The Open Readiness Standard</h2>
        <p className="mt-1 text-sm text-slate-500">Version 2.4 — Public Draft for Comment · issued by Impact Surety, the Standard Issuer</p>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">Don’t take our word for it. This is the method we verify against — open to read, cite, and apply. Every material fact about a business — what it earns, what it spends, how it runs, and how it is governed — is verified against source evidence across the entire population of records, graded for evidence quality, disclosed without judgment, and traceable from any reported number, clause, or procedure back to the document that supports it.</p>

        <StdH n="1">Principles</StdH>
        <div className="mt-2 flex flex-wrap gap-2">{principles.map(p=>(<span key={p} className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700">{p}</span>))}</div>

        <StdH n="3">The Evidence Grade Scale (A–E)</StdH>
        <p className="mt-1 text-sm text-slate-500">The grade describes the independence and reliability of the source — nothing more. No grade is a judgment: Grade D is not an accusation and Grade A is not an endorsement.</p>
        <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-300 text-[11px] uppercase tracking-wider text-slate-400"><th className="py-2 pr-3">Grade</th><th className="py-2 pr-3">Source class</th><th className="py-2 pr-3">Examples</th><th className="py-2">Reader treatment</th></tr></thead><tbody>{grades.map(([g,sc,ex,rt])=>(<tr key={g} className="border-b border-slate-100 align-top"><td className="py-2 pr-3"><span className={`inline-flex items-center justify-center w-7 h-6 rounded-sm font-mono text-[11px] ${(gradeChip as any)[g]}`}>{g}</span></td><td className="py-2 pr-3 font-medium text-slate-800">{sc}</td><td className="py-2 pr-3 text-slate-600">{ex}</td><td className="py-2 text-slate-600">{rt}</td></tr>))}</tbody></table></div>
        <p className="mt-2 text-xs text-slate-500">Lowest-grade rule: a derived figure carries the grade of its weakest material input. Dollar-weighted coverage is reported in aggregate. Grade E is item-level, visible, reason-coded (R1–R5), and never retroactive.</p>

        <StdH n="4">Limits of the Standard</StdH>
        <ul className="mt-2 space-y-2">{limits.map((l,i)=>(<li key={i} className="text-sm leading-relaxed text-slate-600">{l}</li>))}</ul>
        <p className="mt-2 text-xs italic text-slate-500">Stating these limits is not a hedge; it is the boundary that makes everything inside it checkable.</p>

        <StdH n="5–6">The four Parts &amp; 32 scope areas</StdH>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{parts.map(([t,a,d])=>(<div key={t} className="rounded-md border border-slate-200 p-4"><div className="flex items-baseline justify-between"><div className="text-sm font-semibold text-blue-950">{t}</div><div className="font-mono text-[11px] text-slate-400">{a}</div></div><p className="mt-1 text-sm text-slate-600">{d}</p></div>))}</div>

        <StdH n="9">Conformance &amp; module marks</StdH>
        <div className="mt-2 flex flex-wrap gap-2">{marks.map(m=>(<span key={m} className="rounded-sm bg-stone-100 px-2.5 py-1 font-mono text-[12px] text-slate-700">{m}</span>))}</div>
        <p className="mt-2 text-xs text-slate-500">Two tiers: Readiness Core (Part A) and Transaction Grade (Parts A–D). Marks attest the process, not the outcome — a business can be Evidence-Complete and still carry many disclosed conditions.</p>

        <StdH n="7">The Readiness Score (Tier I — Readiness Core)</StdH>
        <p className="mt-1 text-sm text-slate-500">A 0–100 score measuring how close the factual record is to the Evidence-Complete state — computed, not judged, and always shown beside its Assessed Coverage %.</p>
        <div className="mt-3 overflow-hidden rounded-md border border-slate-200">{readiness.map(([c,p,how],i)=>(<div key={c} className={`flex items-start gap-3 px-4 py-2.5 text-sm ${i%2?"bg-stone-50":"bg-white"}`}><span className="font-mono text-xs text-slate-400 w-8 shrink-0">{p}</span><span className="font-medium text-slate-800 w-40 shrink-0">{c}</span><span className="text-slate-600">{how}</span></div>))}</div>
        <div className="mt-3 rounded-md border-l-2 border-amber-700 bg-stone-50 px-4 py-3 text-sm text-slate-600"><span className="font-medium text-slate-800">Wall note.</span> The Readiness Score is a record-completeness metric — never a rating of the business. It is not the LeakFinder severity score or Diligence-Exposure Index, which live across the independence wall in a separate, broker-paid report and never appear in the FactBook. The standard issues facts, evidence grades, and a record-completeness score; it never issues a verdict on the business.</div>

        <StdH n="8">Disclosed-Conditions Index — thresholds</StdH>
        <p className="mt-1 text-sm text-slate-500">Mechanical, published thresholds, reported descriptively — counted and evidenced, never rated.</p>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2">{thresholds.map((t,i)=>(<li key={i} className="text-sm text-slate-600">• {t}</li>))}</ul>

        <StdH n="11">Reliance Framework</StdH>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">Because no deliverable is an assurance opinion, reliance routes through the party who owns the facts — the seller. The supported path is a seller completeness representation in the purchase agreement, keyed to the file, supported by the Issuer’s Verification Certificate (which attests process conformity, never the business), backed by E&amp;O coverage and a revocation rule. Lenders and insurers may recognize the standard in their own guidelines.</p>

        <div className="mt-8 rounded-md bg-blue-950 px-6 py-5 text-white">
          <div className="text-sm font-semibold uppercase tracking-wider">Governance Charter</div>
          <p className="mt-1 text-sm text-blue-100">The independence the mark depends on — and the reason a broker can route to us without fear.</p>
          <div className="mt-3 flex flex-wrap gap-2">{charter.map(c=>(<span key={c} className="rounded-full border border-blue-700 px-3 py-1 text-[13px] text-blue-50">{c}</span>))}</div>
        </div>

        <p className="mt-6 text-xs text-slate-400">© 2026 · This standard may be freely read, cited, quoted, and applied with attribution. Public Draft for Comment — comments welcome.</p>
      </div>
    </section>
  );
}

export default function Site() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="text-[13px] font-semibold tracking-[0.2em] text-blue-950">IMPACT SURETY</div>
          <nav className="flex items-center gap-5 text-sm text-slate-600">
            <button onClick={()=>scrollTo("demo")} className="hover:text-blue-900">Sample FactBook</button>
            <button onClick={()=>scrollTo("standard")} className="hover:text-blue-900">The Standard</button>
            <button onClick={()=>scrollTo("advisors")} className="hover:text-blue-900">For advisors</button>
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-3 py-1.5 text-white hover:bg-blue-900">Book a look</a>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-14">
        <Eyebrow>Sell on verified facts, not faith</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl font-semibold leading-[1.1] text-blue-950">
          In diligence, a buyer’s accountant rebuilds your numbers — and discounts everything they can’t trace.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Impact Surety verifies the facts of your business against a published standard before you list — so when that moment comes, there’s nothing left for them to find.
        </p>
        <p className="mt-4 text-xl font-medium text-blue-900">You walk in already believed.</p>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          We verify the records you provide against a published standard, and we say exactly where that ends. You decide what’s verified and what’s disclosed — disclosed first, on your terms.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={()=>scrollTo("demo")} className="rounded-md bg-blue-950 px-6 py-3 text-white font-medium hover:bg-blue-900 transition-colors">See a sample FactBook</button>
          <button onClick={()=>scrollTo("advisors")} className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:border-slate-400 transition-colors">I’m an advisor</button>
          <button onClick={()=>scrollTo("standard")} className="px-2 py-3 font-medium text-blue-900 hover:text-blue-700 underline decoration-dotted underline-offset-4">Read the published standard →</button>
        </div>
      </section>

      {/* problem */}
      <section className="border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <Eyebrow>The week-eleven retrade</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-2 md:items-center">
            <p className="text-2xl font-medium leading-snug text-blue-950">The deal you counted as closed starts coming undone — over a fact you couldn’t prove fast enough.</p>
            <p className="text-[15px] leading-relaxed text-slate-600">It’s week eleven. The letter of intent is signed and the deal is in your plans — and the buyer’s accountant asks for one more thing you can’t prove on demand. A number you knew was right becomes a discount, taken after your leverage is gone. The villain isn’t your business. It’s the late, unverified fact.</p>
          </div>
        </div>
      </section>

      {/* three products */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-3 text-3xl font-semibold text-blue-950">Truth you can check. Action on the checkable. Independent where it counts.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["FactBook + Certification","The verified factual record of your business — graded against a published standard and linked to source. The proof, before anyone asks for it."],
            ["Clawback","Where waste is a provable fact — a duplicate, an unapplied credit — we recover it, at your direction. The standard finds it; recovery is separate."],
            ["SpendSentry","Keeps the record current after close — monitoring and preventing waste as you run leaner."],
          ].map(([t,d])=>(
            <div key={t} className="rounded-xl border border-slate-200 p-6">
              <div className="text-lg font-semibold text-blue-950">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">Working with a broker or M&amp;A advisor? <span className="text-slate-700">We work alongside them, never instead of them.</span></p>
      </section>

      {/* demo (centerpiece) */}
      <section id="demo" className="scroll-mt-20 border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>See the work</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-blue-950">A sample FactBook</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">Tap any fact to open the record behind it — the invoice, the bank line, the clause. This is what a buyer’s accountant would otherwise rebuild from scratch.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl"><DemoFactBook /></div>
        </div>
      </section>

      {/* why this exists (founder's why — after the work, before the exhale) */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>Why this exists</Eyebrow>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">I grew up in Bethlehem, Pennsylvania as the steel mills went down. When the company failed, the pension system protected the men at the top and abandoned the ones who had done the actual work — people who did everything they were told, disbelieved and discarded by a system built that way. I’ve spent my career since giving smaller companies the tools the largest ones keep for themselves.</p>
          <p className="mt-5 border-l-2 border-amber-700 pl-4 text-lg font-medium leading-snug text-blue-950">I built Impact Surety so the business you gave your life to doesn’t have to fight to be believed at the one moment it matters most — when you sell it.</p>
        </div>
      </section>

      {/* what this changes (exhale) */}
      <section className="border-y border-slate-200 bg-blue-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center">
          <p className="mx-auto max-w-2xl text-2xl sm:text-3xl font-medium leading-snug">When the facts are already proven and sourced, diligence stops being an exam you brace for. There’s nothing left to discover, because you disclosed it first, on your terms.</p>
          <p className="mt-5 text-xl text-blue-100">You go to market believed.</p>
          <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-blue-300">We verify 100% of the records you provide against a published standard, and we say exactly where that ends — not a fraud examination, not an assurance opinion. Stating the limit is what makes everything inside it checkable.</p>
        </div>
      </section>

      {/* for advisors */}
      <section id="advisors" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-14">
        <Eyebrow>For brokers & M&amp;A advisors</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-blue-950">Be the most-prepared person in the room — and keep the relationship.</h2>
        <div className="mt-5 grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>The deal you counted as closed can come undone in week eleven of diligence — and the listing you lose is often the one where a better-prepared advisor walked in with something you didn’t have.</p>
            <p>Impact Surety surfaces what the buyer’s accountant will find, before you list — so the deal you counted on holds, the standard carries the hard findings, and you keep the relationship. You’re the one who showed up certain.</p>
            <p className="text-slate-700">The advisor’s hardening tool — the LeakFinder report (severity, recommended handling, a Diligence-Exposure Index) — is yours. The relationship and the value stay with you after the FactBook closes.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-stone-50 p-6">
            <div className="text-sm font-semibold uppercase tracking-wider text-blue-950">What we will never do</div>
            <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
              <li>We never contact your buyer.</li>
              <li>We never solicit your seller.</li>
              <li>We take no success fee, and we don’t market businesses.</li>
              <li>We hold no license to represent either side.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">We can’t become your competitor — that’s the point. You control disclosure; the seller decides what is put forward, and to whom.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-900">See it on one of your deals</a>
              <button onClick={()=>scrollTo("demo")} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400">Sample to forward</button>
            </div>
            <p className="mt-2 text-xs text-slate-500">Your cost, under NDA, no strings.</p>
          </div>
        </div>
      </section>

      {/* the published standard */}
      <StandardSection />

      {/* data handling */}
      <section className="border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <Eyebrow>How your data is handled</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div className="text-[15px] leading-relaxed text-slate-600">
              <p>Under NDA. De-identified on arrival with Microsoft Presidio, run locally; analysis on anonymized data only; the raw copy is destroyed after.</p>
              <p className="mt-3 font-medium text-slate-800">Your identity is protected throughout, and engaging us creates no external signal that your business is for sale.</p>
              <p className="mt-3 text-sm text-slate-500">We describe what we do. We make no certified or attested claim — the description is the thing you can check.</p>
            </div>
            <div className="space-y-3">
              {[
                ["Who sees my raw files?","De-identified on arrival via Presidio, run locally; analysis is on anonymized data; access is limited; the raw copy is destroyed after."],
                ["Where does my data live?","Processed privately, and not shared with third parties."],
                ["What if something goes wrong?","We work NDA-first and tell you plainly what we do and don’t do; we make no assurance claim."],
              ].map(([q,a])=>(
                <div key={q} className="rounded-md border border-slate-200 bg-white p-4"><div className="text-sm font-medium text-blue-950">{q}</div><p className="mt-1 text-sm text-slate-600">{a}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-16 text-center">
        <h2 className="text-3xl font-semibold text-blue-950">See where your facts stand.</h2>
        <p className="mt-3 text-[15px] text-slate-600">No pressure. One look is all it takes to start.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={()=>scrollTo("demo")} className="rounded-md bg-blue-950 px-6 py-3 font-medium text-white hover:bg-blue-900">See a sample FactBook</button>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:border-slate-400">Book a conversation</a>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center">
        <p className="text-sm text-slate-600">We verify facts and conclude nothing. Advisory, not a reliance opinion.</p>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">Census means provided records, not reality — we verify the records you provide and the sources you authorize, and we are not a fraud examination or an assurance opinion.</p>
        <p className="mt-3 text-[11px] text-slate-400">© Impact Surety · Be sure. · [contact details to be added before field use]</p>
      </footer>
    </div>
  );
}
