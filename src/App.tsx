import React, { useState, useEffect } from "react";

// IMPACT SURETY, single-page marketing site
// Owner is the hero; advisor is the most-prepared guide; the demo FactBook is the centerpiece.

const LABEL = "Illustrative example. Fictional company. Not a real verification.";
const CALENDAR_URL = "https://calendar.app.google/cNchrTCDrX5XrEpL9";
const LIMITS = "Census means provided records, not reality. We verify 100% of the records you provide and the sources you authorize, establishing their completeness, consistency, and traceability to source. We are not a fraud examination and not an assurance opinion. Stating this limit is the boundary that makes everything inside it checkable.";
const GRADE_GLOSS = "An evidence grade rates how well the evidence backs a fact. It grades the proof, never your business.";

const gradeChip: Record<string, string> = {
  A: "bg-blue-950 text-white", B: "bg-blue-800 text-white",
  C: "bg-slate-600 text-white", D: "bg-slate-400 text-white",
  E: "bg-white text-slate-500 border border-dashed border-slate-400",
};

/* ---------------- Demo FactBook content ---------------- */
const partA = [
  { id:"P6", grade:"B", recoverable:true, fact:"One operating account went unreconciled to the general ledger for three months; the variance is traced and quantified.", figure:"$83,400 unreconciled", area:"ORS area 1, Proof of cash", threshold:"Proof-of-cash variance > 0.05% per month",
    source:{ label:"Bank statement, Account ••4471, Jul to Sep 2024", lines:["GL cash (1010) balance, 9/30/24 .......... 1,204,338.10","Bank statement closing, 9/30/24 .......... 1,287,742.55","Unreconciled difference .......................... 83,404.45","Reconciliation last completed ................ 6/30/24"] } },
  { id:"P7", grade:"C", recoverable:false, fact:"Three manual top-side journal entries posted within three days of year-end shifted roughly $210,000 of income into the earlier period.", figure:"≈ $210,000 moved", area:"ORS area 5, Period-end entries", threshold:"Unsupported period-end entries (Grade C/D cluster)",
    source:{ label:"GL journal, JE-1188 / JE-1190 / JE-1192, Dec 29 to 31, 2024", lines:["JE-1188 12/29/24  Cr Revenue 92,000   memo: (none)","JE-1190 12/30/24  Cr Revenue 64,500   memo: (none)","JE-1192 12/31/24  Cr Revenue 53,500   memo: (none)","Supporting documentation ............... not attached"] } },
  { id:"P13", grade:"B", recoverable:false, fact:"Accrued bonuses and deferred service revenue are debt-like but do not appear in the company's net-debt summary.", figure:"$785,000 debt-like", area:"ORS area 11, Debt-like items bridge", threshold:"Debt-like items omitted from net-debt view",
    source:{ label:"GL accounts 2300 / 2400, Mar 2025; management net-debt schedule", lines:["Accrued bonuses (2300), 3/31/25 ........ 420,000.00","Deferred service revenue (2400) ........ 365,000.00","Management net-debt schedule ........... neither line included"] } },
  { id:"P11", grade:"A", recoverable:false, fact:"Working capital swings more than 12% month-to-month with summer cooling demand; a seasonal peg is required to read it.", figure:"+14.8% largest swing", area:"ORS area 10, Seasonal working capital", threshold:"Seasonal working-capital peg required",
    source:{ label:"36-month monthly balance sheet; AR / AP / inventory roll-forward", lines:["Net working capital, Jan 2024 ........... 1,910,220","Net working capital, Jul 2024 ........... 2,664,880  (+39.5% vs Jan)","Largest month-over-month swing ......... +14.8%  (May to Jun 2024)"] } },
  { id:"A-clean", grade:"A", recoverable:false, clean:true, fact:"Payroll taxes were remitted on time and tie to the filed returns for all twenty-four months.", figure:"Clean, 24 of 24 months", area:"ORS area 13, Payroll tax", threshold:"None",
    source:{ label:"Form 941 filings Q1 2023 to Q4 2024; payroll register; bank debits", lines:["2023 Q1 to Q4 941s ......... filed, tied to register","2024 Q1 to Q4 941s ......... filed, tied to register","Late deposits ............... none identified"] } },
];
const partB = [
  { id:"P1", grade:"A", recoverable:true, fact:"Invoice #4471 from Cascade Supply was paid twice, six days apart.", figure:"$18,240", area:"ORS area 16, Duplicate payments", threshold:"Duplicate >= 0.1% of annual spend",
    source:{ label:"AP payments PMT-2207 & PMT-2261, Aug 2024", lines:["PMT-2207 8/12/24  Cascade Supply  inv #4471 .... 18,240.00","PMT-2261 8/18/24  Cascade Supply  inv #4471 .... 18,240.00","Same invoice #, same amount, 6 days apart"] } },
  { id:"P2", grade:"A", recoverable:true, fact:"A vendor credit memo from Pacific Parts was issued but never applied to a later invoice.", figure:"$14,500", area:"ORS area 16, Unapplied credits", threshold:"Unapplied credits >= $10,000",
    source:{ label:"Credit memo CM-0934, Feb 2024", lines:["CM-0934 2/09/24  Pacific Parts  credit ......... 14,500.00","Pacific Parts invoices Mar to Dec 2024 ........... no offset applied","Open credit balance carried .................... 14,500.00"] } },
  { id:"P3", grade:"B", recoverable:false, fact:"The dispatch-software contract renews automatically each year with a 7% price escalator.", figure:"$96,000 / yr", area:"ORS area 19, Auto-renewing commitments", threshold:"Auto-renewing commitments >= 5% of annual spend",
    source:{ label:"FieldRoute SaaS agreement Section 6.2, 6.4", lines:["Sec 6.2  Auto-renews for successive 12-month terms unless","       cancelled 90 days prior","Sec 6.4  Annual price increase of 7%","Current annual value .......................... 96,000.00"] } },
  { id:"P4", grade:"A", recoverable:false, fact:"One customer, Cascade Regional Hospitals, is about 28% of trailing-twelve-month revenue.", figure:"~ 28%, $3.9M", area:"ORS area 3 and 19, Customer concentration", threshold:"Concentration >= 20%",
    source:{ label:"AR invoices + revenue roll-up by customer, TTM to Mar 2025", lines:["Cascade Regional Hospitals, TTM revenue ...... 3,912,400","Total TTM revenue ............................. 13,980,000","Share ......................................... 27.98%"] } },
  { id:"P5", grade:"B", recoverable:false, fact:"A signed equipment-lease obligation has no matching entry in the ledger or payables, an unrecorded payable.", figure:"$3,100 / mo", area:"ORS area 19 vs 11, Commitment-to-ledger gap", threshold:"Unrecorded payable (commitment-to-ledger gap)",
    source:{ label:"Komatsu lift lease, 36-month term", lines:["Lease ........... 3,100.00 / mo, 36-month term, signed 4/2024","GL search ....... no recurring 3,100 entry","AP register ..... no Komatsu payable found"] } },
  { id:"P8", grade:"B", recoverable:false, fact:"A consulting vendor paid $7,500 monthly is the owner's spouse; no contract is on file.", figure:"$90,000 / yr", area:"ORS area 7 and 16, Related-party flows", threshold:"Related-party flows of any size",
    source:{ label:"AP vendor 'Lakeside Advisory', payment stream", lines:["Lakeside Advisory .... 7,500.00 / mo, 24 of 24 months","Vendor TIN ........... matches owner-household record","Contract on file ..... none"] } },
  { id:"P9", grade:"B", recoverable:false, fact:"Three service vehicles past useful life show no repair-and-maintenance spend for eighteen months.", figure:"3 vehicles, 18 mo", area:"ORS area 22 (LMM), Deferred maintenance", threshold:"Facilities / capital deferred-maintenance fact",
    source:{ label:"Fixed-asset register + R&M detail by vehicle, Oct 2023 to Mar 2025", lines:["Unit 12  VIN ••7741  in service 2009  R&M 18 mo ... 0.00","Unit 19  VIN ••2208  in service 2010  R&M 18 mo ... 0.00","Unit 24  VIN ••9015  in service 2011  R&M 18 mo ... 0.00"] } },
  { id:"P10", grade:"B", recoverable:false, fact:"Four contractors paid a fixed monthly amount for more than six months follow a full-time work pattern; classification is shown as filed.", figure:"4 contractors", area:"ORS area 12 and 23, Labor classification", threshold:"Classification facts as filed",
    source:{ label:"1099 payment detail, trailing 12 months", lines:["4 payees  fixed 5,200-6,800 / mo  8-12 consecutive months","Paid via AP, issued 1099-NEC","Classification as filed ........ independent contractor"] } },
];
const partCD = [
  { id:"P12", grade:"B", recoverable:false, fact:"A material customer contract requires the customer's written consent before a change of control.", figure:"Consent required", area:"ORS area 32 (Part D), Change-of-control consent", threshold:"Consent-to-sell held by a non-signing party",
    source:{ label:"Cascade Regional Hospitals MSA Section 14.3", lines:["Sec 14.3  Written consent required for any change of control","Counterparty ..... Cascade Regional Hospitals (~28% of revenue)","Consent on file .. none requested"] } },
  { id:"CD-clean", grade:"A", recoverable:false, clean:true, fact:"The capitalization table reconciles to 100% of the issuance documents; ownership is fully accounted.", figure:"Clean, 100%", area:"ORS area 29 (Part D), Cap table", threshold:"None",
    source:{ label:"Operating agreement + membership-unit ledger", lines:["Units issued per ledger ......... 10,000","Units per issuance documents .... 10,000","Reconciled ...................... 100%"] } },
];
const gradeE = [
  { id:"E1", reason:"R1: sale confidentiality", fact:"access logs and training records were not collected.", area:"ORS area 25 and 26 (Part C)" },
  { id:"E2", reason:"R4: consent withheld", fact:"communications-metadata analysis for owner-dependence was not run.", area:"ORS area 26 (Part C)" },
  { id:"E3", reason:"R5: third party declined", fact:"the landlord declined to confirm lease terms on the related-party building.", area:"ORS area 22 (Part B)" },
];
const indexLines = [
  ["P1","Duplicate vendor payment","$18,240"],["P2","Unapplied vendor credit","$14,500"],
  ["P3","Auto-renewing contract, 7% escalator","$96,000 / yr"],["P4","Customer concentration","~ 28%"],
  ["P5","Unrecorded lease commitment","$3,100 / mo"],["P6","Bank account unreconciled three months","$83,400"],
  ["P7","Unsupported year-end top-side entries","~ $210,000"],["P8","Related-party consulting payments","$90,000 / yr"],
  ["P9","Deferred maintenance, three vehicles","None"],["P10","Four contractors on a full-time pattern, as filed","None"],
  ["P11","Seasonal working-capital swing","> 12% MoM"],["P12","Change-of-control consent in a material contract","None"],
  ["P13","Debt-like items absent from net-debt view","$785,000"],
];
const TABS = [{key:"cover",label:"Cover"},{key:"A",label:"Financial Record"},{key:"B",label:"Quality of Spend"},{key:"CD",label:"Operations and Governance"},{key:"index",label:"Disclosed Conditions"}];

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
            {item.recoverable && <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-medium">Recoverable: your call</span>}
            {item.clean && <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 text-[11px] font-medium">No condition: verified clean</span>}
          </span>
        </span>
        <span className="text-amber-700 group-hover:text-amber-800 mt-1 flex items-center gap-1 text-xs font-medium"><span className="hidden sm:inline">{open?"Hide source":"Tap to source"}</span><Chevron open={open} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open?"max-h-96 opacity-100":"max-h-0 opacity-0"}`}>
        <div className="mb-4 ml-10 rounded-md border border-slate-200 bg-slate-900 text-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-700 px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Source: {item.source.label}
          </div>
          <pre className="px-3 py-3 text-[12px] leading-relaxed font-mono whitespace-pre-wrap text-slate-100">{item.source.lines.join("\n")}</pre>
          {item.threshold !== "None" && item.threshold !== "—" && <div className="border-t border-slate-700 px-3 py-2 text-[11px] text-slate-400">Trips: {item.threshold}</div>}
          {item.recoverable && <div className="border-t border-slate-700 px-3 py-2 text-[11px] text-amber-300">Eligible for recovery: owner-directed, separate. The standard reports it; it never acts on it.</div>}
        </div>
      </div>
    </div>
  );
}

function ScopeLine() {
  return (<div className="mb-5 flex items-start gap-3 rounded-md border border-slate-200 bg-stone-50 px-4 py-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-slate-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><div className="text-sm text-slate-600"><span className="font-medium text-slate-800">Scope is the owner's choice.</span> What's assessed, and what's disclosed, is set by the seller, disclosed first, on their terms.<span className="ml-2 inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">Owner controls scope and release, illustrative</span></div></div>);
}

function DemoFactBook() {
  const [tab, setTab] = useState("cover");
  const [showGloss, setShowGloss] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-16 max-w-3xl mx-auto">
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-[12px] text-amber-900">{LABEL}</div>
      <div className="px-5 sm:px-7 pb-8">
        <header className="flex items-center justify-between border-b border-slate-200 py-5">
          <div><div className="text-[13px] font-semibold tracking-[0.2em] text-blue-950">IMPACT SURETY</div><div className="text-xs text-slate-500">The FactBook: verified facts, graded and sourced</div></div>
          <button onClick={()=>setShowGloss(g=>!g)} className="text-xs text-slate-500 hover:text-blue-900 underline decoration-dotted underline-offset-4">What the grades mean</button>
        </header>
        {showGloss && (<div className="mt-3 rounded-md border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-600">{GRADE_GLOSS}<dl className="mt-3 space-y-1.5">{[["A","Third-party confirmed: independently re-checkable"],["B","Third-party documented: not independently re-confirmed"],["C","System of record: internally generated, consistency-tested"],["D","Management representation: asserted, minimal support"],["E","Not assessed: deliberately not gathered, reason-coded"]].map(([g,m])=>(<div key={g} className="flex items-center gap-2 text-[12px]"><span className={`inline-flex items-center justify-center w-6 h-5 rounded-sm font-mono text-[11px] ${gradeChip[g]}`}>{g}</span><span className="text-slate-600">{m}</span></div>))}</dl></div>)}
        <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px">{TABS.map(t=>(<button key={t.key} onClick={()=>setTab(t.key)} className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab===t.key?"border-amber-700 text-blue-950":"border-transparent text-slate-500 hover:text-slate-800"}`}>{t.label}</button>))}</nav>

        {tab==="cover" && (<section className="pt-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-amber-700">FactBook, illustrative</div>
          <h3 className="mt-1 text-2xl sm:text-3xl font-semibold text-blue-950">Northwind HVAC Services, LLC</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">Here is everything a buyer's accountant will go looking for: already found, already sourced.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Mark</div><div className="mt-1 text-sm font-medium text-blue-950">Evidence-Complete (Part A)</div><div className="text-sm font-medium text-blue-950">Spend-Complete (Part B)</div><div className="text-xs text-slate-500">Parts C and D scoped</div></div>
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Assessed Coverage</div><div className="mt-1 font-mono text-2xl text-blue-950">86%</div><div className="text-xs text-slate-500">the share of the records in scope that we verified</div></div>
            <div className="rounded-md border border-slate-200 p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">Disclosed conditions</div><div className="mt-1 font-mono text-2xl text-blue-950">13</div><div className="text-xs text-slate-500">counted and evidenced, not rated</div></div>
          </div>
          <div className="mt-3 rounded-md border border-slate-200 p-4"><div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-wider text-slate-400">Readiness Score</div><div className="font-mono text-sm text-blue-950">91 / 100</div></div><div className="mt-2 h-2 w-full rounded-full bg-slate-200"><div className="h-2 rounded-full bg-blue-800" style={{width:"91%"}} /></div><div className="mt-1.5 text-xs text-slate-500">Completeness of the verified record, distance to Evidence-Complete. Not a rating of the business.</div></div>
          <div className="mt-6 rounded-md border-l-2 border-slate-300 bg-stone-50 px-4 py-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">The limit that makes this checkable</div><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{LIMITS}</p><p className="mt-2 text-xs text-slate-500">Census means every record you give us, not a sample.</p></div>
        </section>)}
        {tab==="A" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Part A, Financial Record</h3><p className="mt-1 text-sm text-slate-500">Verified facts, each graded by how well the evidence backs it. Tap any row to open its source.</p><div className="mt-4">{partA.map(it=><FactRow key={it.id} item={it} />)}</div></section>)}
        {tab==="B" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Part B, Quality of Spend</h3><p className="mt-1 text-sm text-slate-500">Where a fact is plainly recoverable, it is tagged. The standard reports it; recovery is owner-directed and handled separately. That gap is the wall.</p><div className="mt-4">{partB.map(it=><FactRow key={it.id} item={it} />)}</div></section>)}
        {tab==="CD" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Parts C and D, Operations and Governance</h3><p className="mt-1 mb-4 text-sm text-slate-500">What was assessed, and honestly, what was not.</p><ScopeLine /><div>{partCD.map(it=><FactRow key={it.id} item={it} />)}</div><h4 className="mt-7 text-sm font-semibold uppercase tracking-wider text-slate-500">Not assessed</h4><p className="mt-1 text-sm text-slate-500">Shown so the absence of a condition is never mistaken for the absence of a fact.</p><div className="mt-3 space-y-2">{gradeE.map(e=>(<div key={e.id} className="flex items-start gap-3 rounded-md border border-dashed border-slate-300 bg-white px-4 py-3"><span className={`mt-0.5 inline-flex items-center justify-center text-xs font-semibold rounded-sm w-7 h-7 font-mono ${gradeChip.E}`}>E</span><div><div className="text-[15px] text-slate-700">Not assessed: {e.fact}</div><div className="mt-1 text-xs text-slate-500">{e.reason} · {e.area}</div></div></div>))}</div></section>)}
        {tab==="index" && (<section className="pt-6"><h3 className="text-lg font-semibold text-blue-950">Disclosed Conditions Index</h3><p className="mt-1 text-sm italic text-slate-600">Conditions are counted and evidenced, never rated. Whether any condition matters is the reader's judgment.</p><div className="mt-4 overflow-hidden rounded-md border border-slate-200">{indexLines.map((row,i)=>(<div key={row[0]} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${i%2?"bg-stone-50":"bg-white"}`}><span className="w-9 shrink-0 font-mono text-xs text-slate-400">{row[0]}</span><span className="flex-1 text-slate-700">{row[1]}</span><span className="font-mono text-xs text-slate-500">{row[2]}</span></div>))}</div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className="font-medium text-slate-600">Grade-E schedule</span><span className="font-mono">Not assessed: R1×1, R4×1, R5×1</span></div><div className="mt-9 rounded-md bg-blue-950 px-6 py-7 text-center text-white"><p className="mx-auto max-w-lg text-[17px] leading-relaxed">This is the record a buyer's accountant would rebuild: already built, already sourced. There is nothing here left to find.</p><a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-blue-950 hover:bg-stone-100 transition-colors">See where your facts stand</a><p className="mt-3 text-xs text-blue-200">No pressure. One look is all it takes to start.</p></div></section>)}
      </div>
    </div>
  );
}

/* ---------------- Site chrome ---------------- */
function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">{children}</div>; }


/* ---------------- The Header ---------------- */
function NavHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <a href="#/" className="text-[13px] font-semibold tracking-[0.2em] text-blue-950">IMPACT SURETY</a>
        <nav className="hidden md:flex items-center gap-5 text-sm text-slate-600">
          <a href="#/factbook" className="hover:text-blue-900">Sample FactBook</a>
          <a href="#/standard" className="hover:text-blue-900">The Standard</a>
          <a href="#/#openrecord" className="hover:text-blue-900">OpenRecord</a>
          <a href="#/#advisors" className="hover:text-blue-900">For advisors</a>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-3 py-1.5 text-white hover:bg-blue-900">Book a look</a>
        </nav>
        <nav className="md:hidden">
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-3 py-1.5 text-sm text-white hover:bg-blue-900">Book a look</a>
        </nav>
      </div>
    </header>
  );
}

/* ---------------- Section: The published Standard Full Page ---------------- */
function StdH({ n, children }: { n: string, children: React.ReactNode }) { return <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-2">{n}. {children}</h3>; }

function AccordionPart({ title, areas, details }: { title: string, areas: string, details: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-slate-200 overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full bg-white flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors">
        <div>
          <div className="text-sm font-semibold text-blue-950">{title}</div>
          <div className="font-mono text-[11px] text-slate-500 mt-0.5">{areas}</div>
        </div>
        <Chevron open={open} />
      </button>
      <div className={`transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-4 bg-stone-50 border-t border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">{details}</p>
        </div>
      </div>
    </div>
  );
}

function StandardPage() {
  const principles = ["Facts, not opinions","Census, not sampling","Source-linked","Published, not proprietary","Earned, not purchased"];
  const grades = [
    ["A","Third-party confirmed","Bank deposits and statements (direct feed); IRS transcripts; executed contracts; public lien/litigation/license records","Independently confirmable"],
    ["B","Third-party documented","Filed tax returns as provided; payroll, processor and lessor statements; merchant/POS settlement","Documented externally; not independently re-confirmed"],
    ["C","System of record","GL entries, accounting reports, internal POS, inventory and CRM","Internally generated; consistency-tested vs A/B"],
    ["D","Management representation","Owner statements and estimates not yet supported by documents","Disclosed as unverified; flagged for the reader's diligence"],
    ["E","Not assessed","Evidence deliberately not gathered, reason-coded R1 to R5","Item-level, visible, never retroactive"],
  ];
  const limits = [
    "Census means provided records, not reality. Full-population verification covers 100% of the records provided and the sources authorized; it cannot establish that the record is the whole of reality.",
    "What the methodology structurally narrows. Grade A bank-direct evidence and three-way reconciliation make many misstatements arithmetically visible.",
    "What remains outside any records-based method. Revenue never deposited, a parallel undisclosed entity, collusive schemes documented with genuine-looking paper, oral commitments, future events.",
    "This is not a fraud examination and not assurance. No deliverable expresses an opinion or provides assurance; the Reliance Framework defines the supported path for legal weight.",
  ];
  const parts = [
    ["Part A, Financial Record","areas 1 to 15","proof of cash, revenue composition, customer concentration, gross margin, earnings adjustments, owner compensation and perquisites, related-party transactions, receivables payables and cutoff, inventory, working capital, debt and debt-like items, payroll and workforce, tax, contracts and leases, legal and licensing."],
    ["Part B, Spend Record (Quality of Spend)","areas 16 to 24","vendor and payables forensics, owner-related spend, acquisition cost and attribution, commitment inventory, technology and subscriptions, insurance and risk, facilities and capital, labor and benefits, off-balance-sheet and contingent items."],
    ["Part C, Operational Record","areas 25 to 28","procedure inventory and coverage, owner-time and dependence, systems and automation, key-relationship transferability."],
    ["Part D, Governance Record","areas 29 to 32","corporate record completeness, authority and controls presence, related-party governance, transaction-governance readiness."],
  ];
  const marks = ["Evidence-Complete (A)","Spend-Complete (B)","Operations-Documented (C)","Governance-Complete (D)","Transaction-Grade (all four current)"];
  const readiness = [["Evidence quality","40","Dollar-weighted share of figures at Grade A/B, scaled to the 85% floor"],["Scope completeness","30","All 32 scope areas (four Parts) fully populated"],["Reconciliation integrity","30","Banded by aggregate unreconciled variance as a share of revenue"]];
  const thresholds = [
    "Duplicate or contract-variance payments >= 0.1% of annual spend; unapplied credits >= $10,000",
    "Auto-renewing commitments >= 5% of annual spend; any take-or-pay obligation",
    "Vendor concentration: any single vendor >= 20% of spend; related-party flows of any size",
    "Owner-related spend candidates >= 10% of unadjusted earnings; owner-sourced relationships >= 30% of revenue",
    "Enterprise SOP coverage below 60%; any core workflow with zero documented procedure; any system with a single administrator",
    "Any cap-table entry without a matching issuance document; any consent-to-sell held by a non-signing party",
  ];
  const charter = ["No purchase of outcomes","No referrer influence","Separation of issuance from sales","Published, versioned criteria","Factual appeals only","Revocation where evidence is false or incomplete","Independence of the record"];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <NavHeader />
      <div className="mx-auto max-w-4xl px-5 py-14">
        <Eyebrow>The published standard</Eyebrow>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight">The Open Readiness Standard</h1>
        <p className="mt-3 text-sm text-slate-500 font-mono">Version 2.4 / Public Draft for Comment / Issued by Impact Surety</p>
        <p className="mt-8 text-[17px] leading-relaxed text-slate-700">Don't take our word for it. This is the method we verify against: open to read, cite, and apply. Every material fact about a business (what it earns, what it spends, how it runs, and how it is governed) is verified against source evidence across the entire population of records, graded for evidence quality, disclosed without judgment, and traceable from any reported number, clause, or procedure back to the document that supports it.</p>

        <StdH n="1">Principles</StdH>
        <div className="mt-4 flex flex-wrap gap-2">{principles.map(p=>(<span key={p} className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">{p}</span>))}</div>

        <StdH n="2">The Evidence Grade Scale (A to E)</StdH>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">The grade describes the independence and reliability of the source, nothing more. No grade is a judgment: Grade D is not an accusation and Grade A is not an endorsement.</p>
        <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm border-collapse"><thead><tr className="border-b border-slate-300 text-[11px] uppercase tracking-wider text-slate-400 bg-stone-50"><th className="p-3">Grade</th><th className="p-3">Source class</th><th className="p-3">Examples</th><th className="p-3">Reader treatment</th></tr></thead><tbody>{grades.map(([g,sc,ex,rt])=>(<tr key={g} className="border-b border-slate-100 align-top"><td className="p-3"><span className={`inline-flex items-center justify-center w-7 h-6 rounded-sm font-mono text-[11px] ${gradeChip[g]}`}>{g}</span></td><td className="p-3 font-medium text-slate-800">{sc}</td><td className="p-3 text-slate-600 leading-relaxed">{ex}</td><td className="p-3 text-slate-600 leading-relaxed">{rt}</td></tr>))}</tbody></table></div>
        <div className="mt-4 bg-stone-50 border-l-2 border-slate-300 p-4 text-sm text-slate-600 space-y-2">
          <p><strong>Lowest-grade rule:</strong> a derived figure carries the grade of its weakest material input.</p>
          <p><strong>Dollar-weighted coverage</strong> is reported in aggregate.</p>
          <p><strong>Grade E</strong> is item-level, visible, reason-coded (R1 to R5), and never retroactive.</p>
        </div>

        <StdH n="3">Limits of the Standard</StdH>
        <ul className="mt-3 space-y-3">{limits.map((l,i)=>(<li key={i} className="text-[15px] leading-relaxed text-slate-700">{l}</li>))}</ul>
        <p className="mt-4 text-sm italic text-slate-500">Stating these limits is not a hedge; it is the boundary that makes everything inside it checkable.</p>

        <StdH n="4 to 7">The four Parts and 32 scope areas</StdH>
        <p className="mt-3 mb-5 text-sm text-slate-600">Tap any Part to view its verified scope areas. Every area is verified in every engagement.</p>
        <div>
          {parts.map(([t,a,d]) => <AccordionPart key={t} title={t} areas={a} details={d} />)}
        </div>

        <StdH n="8">Conformance and module marks</StdH>
        <div className="mt-4 flex flex-wrap gap-3">{marks.map(m=>(<span key={m} className="rounded-sm bg-stone-100 border border-slate-200 px-3 py-1.5 font-mono text-[13px] text-slate-800 font-medium">{m}</span>))}</div>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-700">One standard. Every engagement runs all four Parts and all 32 scope areas. There are no partial scopes. Marks attest the process, not the outcome. A business can be Evidence-Complete and still carry many disclosed conditions.</p>

        <StdH n="9">The Readiness Score</StdH>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">A 0 to 100 score measuring how close the full verified record is to complete, across all four Parts. Computed, not judged, and always shown beside its Assessed Coverage percentage.</p>
        <div className="mt-5 overflow-hidden rounded-md border border-slate-200">{readiness.map(([c,p,how],i)=>(<div key={c} className={`flex items-start gap-4 p-4 text-sm ${i%2?"bg-stone-50":"bg-white"}`}><span className="font-mono text-[13px] text-slate-500 w-8 shrink-0 pt-0.5">{p}</span><span className="font-medium text-slate-800 w-44 shrink-0">{c}</span><span className="text-slate-600 leading-relaxed">{how}</span></div>))}</div>
        <div className="mt-5 rounded-md border-l-4 border-amber-700 bg-amber-50 px-5 py-4 text-[15px] text-amber-900 leading-relaxed"><span className="font-semibold block mb-1">Wall note.</span> The Readiness Score is a record-completeness metric, never a rating of the business. It is not the LeakFinder severity score or Diligence-Exposure Index, which live across the independence wall in a separate, broker-paid report and never appear in the FactBook. The standard issues facts, evidence grades, and a record-completeness score. It never issues a verdict on the business.</div>

        <StdH n="10">Disclosed Conditions Index thresholds</StdH>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">Mechanical, published thresholds, reported descriptively. Counted and evidenced, never rated.</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">{thresholds.map((t,i)=>(<li key={i} className="text-sm font-mono text-slate-600 bg-stone-50 p-3 rounded-md border border-slate-200">{t}</li>))}</ul>

        <StdH n="11">Reliance Framework</StdH>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700">Because no deliverable is an assurance opinion, reliance routes through the party who owns the facts: the seller. The supported path is a seller completeness representation in the purchase agreement, keyed to the file, supported by the Issuer's Verification Certificate (which attests process conformity, never the business), backed by errors and omissions coverage and a revocation rule. Lenders and insurers may recognize the standard in their own guidelines.</p>

        <div className="mt-12 rounded-xl bg-blue-950 p-8 text-white shadow-lg">
          <div className="text-lg font-semibold tracking-wide border-b border-blue-800 pb-3 mb-4">12. Governance Charter</div>
          <p className="text-[15px] text-blue-100 leading-relaxed">The independence the mark depends on, and the reason a broker can route to us without fear.</p>
          <div className="mt-5 flex flex-wrap gap-2">{charter.map(c=>(<span key={c} className="rounded-full border border-blue-700 bg-blue-900/50 px-4 py-1.5 text-sm text-blue-50">{c}</span>))}</div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>© 2026 Impact Surety.</span>
          <span>This standard may be freely read, cited, quoted, and applied with attribution.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Section: FactBook Full Page ---------------- */
function FactBookPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 font-sans pb-20">
      <NavHeader />
      <div className="mx-auto max-w-4xl px-5 py-8">
        <a href="#/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-900 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Impact Surety
        </a>
        <DemoFactBook />
        <div className="text-center mt-8">
          <p className="text-sm text-slate-600 mb-4">When your facts are verified to a published standard, the buyer's accountant has to build their opinion from the same record you did.</p>
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-6 py-3 font-medium text-white hover:bg-blue-900 transition-colors">See where your facts stand</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Scroll Page  ---------------- */
function MainPage() {
  useEffect(() => { 
    if (window.location.hash) {
      const id = window.location.hash.replace('#/', '').replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <NavHeader />

      {/* hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-14">
        <Eyebrow>Sell on verified facts, not faith</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl font-semibold leading-[1.1] text-blue-950">
          In diligence, a buyer's accountant rebuilds your numbers, and discounts everything they can't trace.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Impact Surety verifies the facts of your business against a published standard before you list, so when that moment comes, there is nothing left for them to find.
        </p>
        <p className="mt-4 text-xl font-medium text-blue-900">You walk in already believed.</p>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          We verify the records you provide against a published standard, and we say exactly where that ends. You decide what's verified and what's disclosed: disclosed first, on your terms.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#/factbook" className="rounded-md bg-blue-950 px-6 py-3 text-white font-medium hover:bg-blue-900 transition-colors">See a sample FactBook</a>
          <a href="#/#advisors" className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:border-slate-400 transition-colors">I'm an advisor</a>
          <a href="#/standard" className="px-2 py-3 font-medium text-blue-900 hover:text-blue-700 underline decoration-dotted underline-offset-4">Read the published standard</a>
        </div>
      </section>

      {/* problem */}
      <section className="border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <Eyebrow>The week-eleven retrade</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-2 md:items-center">
            <p className="text-2xl font-medium leading-snug text-blue-950">The deal you counted as closed starts coming undone over a fact you couldn't prove fast enough.</p>
            <p className="text-[15px] leading-relaxed text-slate-600">It is week eleven. The letter of intent is signed and the deal is in your plans. And the buyer's accountant asks for one more thing you can't prove on demand. A number you knew was right becomes a discount, taken after your leverage is gone. The villain isn't your business. It is the late, unverified fact.</p>
          </div>
        </div>
      </section>

      {/* OpenRecord */}
      <section id="openrecord" className="mx-auto max-w-5xl px-5 py-20">
        <Eyebrow>Start here. The first read.</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-blue-950">OpenRecord: see what a buyer already can.</h2>
        
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div className="space-y-6 text-[15px] leading-relaxed text-slate-700">
            <p>Before you ever list, a buyer's diligence team can assemble a real picture of your business from public records alone: liens, litigation, licenses and permits, related entities, property and lender filings. Most owners have never looked. OpenRecord is the first read. It shows you what is already visible from the outside, ranked by what a buyer would press on, with a plain punch list of what to disclose, what to reframe, and what to fix, plus a short read on the kind of buyer your business fits.</p>
            
            <p className="text-lg font-medium text-blue-950 border-l-2 border-amber-700 pl-4 py-1">The point is not to alarm you. It is the opposite. The thing that keeps owners up at night is the unknown, what a buyer might find after the price is set and the leverage is gone. When you have already seen it, early and on your terms, the fear has nowhere left to live. Transparency, ahead of time, is where the relief starts. You stop bracing for the surprise, because there is no surprise.</p>
            
            <p>OpenRecord comes in two layers. The first read is a finding you and your advisor can act on right away. When a deal gets real, a deeper, fully sourced version goes underneath it, the evidence and the exact public sources behind every line, and it carries into your FactBook. The first read is the heads-up, not a purchase. The rest follows the deal.</p>
            
            <div className="rounded-md bg-stone-50 border border-slate-200 p-5">
              <h4 className="font-semibold text-blue-950 mb-2">Wall note</h4>
              <p className="text-sm text-slate-600">OpenRecord finds; it does not judge. The punch list is what a buyer will ask, never our verdict on your business. We verify what they will find. We do not make anything disappear. OpenRecord reads the outside. The FactBook verifies the inside. The first tells you what is visible. The second is the proof you walk in with.</p>
            </div>
            
            <div className="pt-2">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-6 py-3 font-medium text-white hover:bg-blue-900 transition-colors">See your first read</a>
            </div>
          </div>
          
          <div>
            <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-center text-[11px] uppercase tracking-wider text-slate-500 font-semibold">A sample first read</div>
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-[11px] text-amber-900">Illustrative example. Fictional company. Public-records reading only.</div>
              <div className="p-5 sm:p-7">
                <h3 className="text-xl font-semibold text-blue-950 border-b border-slate-200 pb-4 mb-4">Northwind HVAC Services, LLC</h3>
                
                <div className="space-y-4">
                  <div className="text-sm">
                    <span className="inline-block bg-orange-100 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mr-2 align-middle">Disclose</span>
                    <span className="text-slate-800 font-medium">A UCC lender filing shows an equipment-lease obligation against the company.</span>
                    <p className="text-slate-500 mt-1 italic">"A buyer sees this before the first meeting. Better they hear it from you."</p>
                  </div>
                  
                  <div className="text-sm">
                    <span className="inline-block bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mr-2 align-middle">Reframe</span>
                    <span className="text-slate-800 font-medium">A commonly-owned related entity appears in state records, sharing an address with the business.</span>
                    <p className="text-slate-500 mt-1 italic">"Untangle it now, on paper, so it reads as structure, not a surprise."</p>
                  </div>
                  
                  <div className="text-sm">
                    <span className="inline-block bg-red-100 text-red-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mr-2 align-middle">Fix</span>
                    <span className="text-slate-800 font-medium">A contractor license shows a renewal date inside the likely deal window.</span>
                    <p className="text-slate-500 mt-1 italic">"A lapse mid-sale is an easy, avoidable scare."</p>
                  </div>
                  
                  <div className="text-sm">
                    <span className="inline-block bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mr-2 align-middle">Reframe</span>
                    <span className="text-slate-800 font-medium">Prior litigation, closed, appears in the public docket.</span>
                    <p className="text-slate-500 mt-1 italic">"Closed and explained reads very differently from found and unexplained."</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <p className="text-[13px] text-slate-700 leading-relaxed"><span className="font-semibold text-blue-950">Buyer-fit:</span> Reads as a fit for a regional HVAC consolidator. They will press hardest on owner dependence and recurring-service contracts, so prepare those first.</p>
                </div>
                
                <div className="mt-6 rounded-md bg-blue-50 p-4 text-center">
                  <p className="text-sm font-medium text-blue-900">None of this is the end of anything. It is the list you get to walk in already holding. That is the whole point.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* products */}
      <section className="border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold text-blue-950">Truth you can check. Action on the checkable. Independent where it counts.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              ["FactBook + Certification","The verified factual record of your business, graded against a published standard and linked to source. The proof, before anyone asks for it."],
              ["Clawback","Where waste is a provable fact like a duplicate or unapplied credit, we recover it at your direction. The standard finds it; recovery is separate."],
              ["LeakFinder Report","The advisor's hardening tool. It reads the closed FactBook and prioritizes each finding by diligence exposure, with recommended handling, so the advisor can address each exposure before a buyer raises it. Generated separately from the FactBook: the standard reports facts, this report helps the advisor act on them."],
              ["SpendSentry","Keeps the record current after close, monitoring and preventing waste as you run leaner."],
            ].map(([t,d])=>(
               <div key={t} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                 <div className="text-lg font-semibold text-blue-950">{t}</div>
                 <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
               </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">Working with a broker or M&amp;A advisor? <span className="text-slate-700">We work alongside them, never instead of them.</span></p>
        </div>
      </section>

      {/* demo invitation */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <Eyebrow>See the work</Eyebrow>
        <h2 className="mt-3 text-3xl font-semibold text-blue-950">A sample FactBook</h2>
        <p className="mt-3 max-w-2xl mx-auto text-[15px] leading-relaxed text-slate-600">Here is everything a buyer's accountant will go looking for: already found, and already sourced. Tap any fact to open the exact record behind it.</p>
        
        <div className="mt-8 mx-auto max-w-xl group relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-100 to-amber-100 opacity-50 blur transition group-hover:opacity-100"></div>
          <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center">
            <div className="text-[13px] font-semibold tracking-[0.2em] text-blue-950 mb-3">IMPACT SURETY</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">Northwind HVAC Services, LLC</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-3 py-1 bg-stone-50 border border-slate-200 rounded-md"><span className="text-slate-500">Coverage:</span> <span className="font-mono font-medium text-blue-950">86%</span></div>
              <div className="px-3 py-1 bg-stone-50 border border-slate-200 rounded-md"><span className="text-slate-500">Conditions:</span> <span className="font-mono font-medium text-blue-950">13</span></div>
              <div className="px-3 py-1 bg-stone-50 border border-slate-200 rounded-md"><span className="text-slate-500">Readiness:</span> <span className="font-mono font-medium text-blue-950">91</span></div>
            </div>
            <a href="#/factbook" className="mt-6 inline-block rounded-md bg-blue-950 px-8 py-3 text-[15px] font-medium text-white hover:bg-blue-900 transition-colors shadow-sm">Open the sample FactBook</a>
          </div>
        </div>
      </section>

      {/* standard executive summary */}
      <section className="border-y border-slate-200 bg-stone-50">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Eyebrow>The Methodology</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold text-blue-950">The Open Readiness Standard</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">The published verification method we apply to every engagement. Every figure carries an evidence grade from A to D based on source independence, with Grade E for deliberate exclusion. The standard covers 32 scope areas across four Parts: Financial, Spend, Operational, and Governance.</p>
              
              <div className="mt-6 space-y-4">
                <div className="border-l-2 border-blue-900 pl-4">
                  <div className="font-semibold text-sm text-blue-950">Principles</div>
                  <p className="text-sm text-slate-600 mt-1">Facts, not opinions. Census, not sampling. Source-linked. Published, not proprietary. Earned, not purchased.</p>
                </div>
                <div className="border-l-2 border-slate-300 pl-4">
                  <div className="font-semibold text-sm text-blue-950">Limits</div>
                  <p className="text-sm text-slate-600 mt-1">Census means provided records, not reality. We verify the records you provide. We are not a fraud examination and not an assurance opinion.</p>
                </div>
                <div className="border-l-2 border-amber-700 pl-4">
                  <div className="font-semibold text-sm text-blue-950">Governance Charter</div>
                  <p className="text-sm text-slate-600 mt-1">Built on the independence of the record, with no purchase of outcomes and zero referrer influence.</p>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="#/standard" className="inline-block rounded-md border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:border-slate-400 transition-colors">Read the full standard</a>
              </div>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-5">
                 <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-md bg-blue-950 text-white flex items-center justify-center font-mono text-sm font-bold">A</div><div className="text-sm font-medium text-slate-800">Third-party confirmed</div></div>
                 <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-md bg-blue-800 text-white flex items-center justify-center font-mono text-sm font-bold">B</div><div className="text-sm font-medium text-slate-800">Third-party documented</div></div>
                 <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-md bg-slate-600 text-white flex items-center justify-center font-mono text-sm font-bold">C</div><div className="text-sm font-medium text-slate-800">System of record</div></div>
                 <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-md bg-slate-400 text-white flex items-center justify-center font-mono text-sm font-bold">D</div><div className="text-sm font-medium text-slate-800">Management representation</div></div>
                 <div className="flex items-center gap-3 pt-2 border-t border-slate-100"><div className="w-8 h-8 rounded-md border border-dashed border-slate-400 text-slate-500 flex items-center justify-center font-mono text-sm font-bold">E</div><div className="text-sm font-medium text-slate-800">Not assessed</div></div>
              </div>
              <p className="mt-5 text-xs text-slate-500 italic text-center">No grade is a judgment. It grades the proof, never your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* founder's why */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>Why this exists</Eyebrow>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-700">I grew up in Bethlehem, Pennsylvania as the steel mills went down. When the company failed, the pension system protected the men at the top and abandoned the ones who had done the actual work: people who did everything they were told, disbelieved and discarded by a system built that way. I've spent my career since giving smaller companies the tools the largest ones keep for themselves.</p>
          <p className="mt-5 border-l-4 border-amber-700 pl-5 text-lg font-medium leading-relaxed text-blue-950">I built Impact Surety so the business you gave your life to doesn't have to fight to be believed at the one moment it matters most: when you sell it.</p>
        </div>
      </section>

      {/* exhale */}
      <section className="border-y border-slate-200 bg-blue-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <p className="mx-auto max-w-3xl text-2xl sm:text-3xl font-medium leading-snug">When the facts are already proven and sourced, diligence stops being an exam you brace for. There is nothing left to discover, because you disclosed it first, on your terms.</p>
          <div className="mx-auto max-w-2xl mt-8 pt-8 border-t border-blue-900 leading-relaxed text-[17px] text-blue-100 italic">
            "When your facts are verified to a published standard, the buyer's accountant has to build their opinion from the same record you did, not from numbers they rebuild from scratch and then discount. You set the facts everyone works from. The opinion stays theirs to draw; the facts are no longer in dispute."
          </div>
          <p className="mt-8 text-2xl font-medium text-white tracking-wide">You go to market believed.</p>
          <p className="mx-auto mt-10 max-w-xl text-xs leading-relaxed text-blue-300">We verify 100% of the records you provide against a published standard, and we say exactly where that ends: not a fraud examination, not an assurance opinion. Stating the limit is what makes everything inside it checkable.</p>
        </div>
      </section>

      {/* for advisors */}
      <section id="advisors" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-20">
        <Eyebrow>For brokers and M&amp;A advisors</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-blue-950">Be the most-prepared person in the room, and keep the relationship.</h2>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-700">
            <p>The deal you counted as closed can come undone in week eleven of diligence, and the listing you lose is often the one where a better-prepared advisor walked in with something you didn't have.</p>
            <p>Impact Surety surfaces what the buyer's accountant will find, before you list, so the deal you counted on holds, the standard carries the hard findings, and you keep the relationship. You're the one who showed up certain.</p>
            <p className="text-slate-800 font-medium">The advisor's hardening tool, the LeakFinder report (severity, recommended handling, a Diligence-Exposure Index), is yours. The relationship and the value stay with you after the FactBook closes.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-stone-50 p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-wider text-blue-950">What we will never do</div>
            <ul className="mt-3 space-y-2 text-[15px] text-slate-700">
              <li>We never contact your buyer.</li>
              <li>We never solicit your seller.</li>
              <li>We take no success fee, and we don't market businesses.</li>
              <li>We hold no license to represent either side.</li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">We can't become your competitor. That is the point. You control disclosure; the seller decides what is put forward, and to whom.</p>
            <div className="mt-6 pt-5 border-t border-slate-200">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md bg-blue-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-900 transition-colors">See it on one of your deals</a>
              <p className="mt-3 text-xs text-slate-500">Your cost, under NDA, no strings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* data handling */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <Eyebrow>How your data is handled</Eyebrow>
          <div className="mt-4 grid gap-10 md:grid-cols-2">
            <div className="text-[15px] leading-relaxed text-slate-700">
              <p>Under NDA. De-identified on arrival with Microsoft Presidio, run locally; analysis on anonymized data only; the raw copy is destroyed after.</p>
              <p className="mt-4 font-medium text-slate-900">Your identity is protected throughout, and engaging us creates no external signal that your business is for sale.</p>
              <p className="mt-4 text-sm text-slate-500">We describe what we do. We make no certified or attested claim. The description is the thing you can check.</p>
            </div>
            <div className="space-y-3">
              {[
                ["Who sees my raw files?","De-identified on arrival via Presidio, run locally; analysis is on anonymized data; access is limited; the raw copy is destroyed after."],
                ["Where does my data live?","Processed privately, and not shared with third parties."],
                ["What if something goes wrong?","We work NDA-first and tell you plainly what we do and don't do; we make no assurance claim."],
              ].map(([q,a])=>(
                <div key={q} className="rounded-lg border border-slate-200 bg-stone-50 p-4"><div className="text-sm font-semibold text-blue-950">{q}</div><p className="mt-1.5 text-sm text-slate-600">{a}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* contact CTA */}
      <section id="contact" className="mx-auto max-w-5xl px-5 py-24 text-center">
        <h2 className="text-3xl font-semibold text-blue-950">See where your facts stand.</h2>
        <p className="mt-3 text-[15px] text-slate-600">No pressure. One look is all it takes to start.</p>
        <div className="mt-8">
          <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md border-2 border-blue-950 px-8 py-3.5 font-medium text-blue-950 hover:bg-stone-50 transition-colors">Book a conversation</a>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-slate-200 bg-stone-50 px-5 py-10 text-center">
        <p className="text-sm font-medium text-slate-700">We verify facts and conclude nothing. Advisory, not a reliance opinion.</p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-500">Census means provided records, not reality. We verify the records you provide and the sources you authorize, and we are not a fraud examination or an assurance opinion.</p>
        <p className="mt-6 text-[11px] text-slate-400 uppercase tracking-wider">© 2026 Impact Surety</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route.startsWith('#/factbook')) return <FactBookPage />;
  if (route.startsWith('#/standard')) return <StandardPage />;
  return <MainPage />;
}
