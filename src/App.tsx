import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Info,
  ArrowRight,
  ShieldCheck,
  Lock,
  Download
} from 'lucide-react';

const DEMO_DATA = {
  "label": "Illustrative example - fictional company. Not a real verification.",
  "cover": {
    "company": "Northwind HVAC Services, LLC",
    "mark": "Evidence-Complete (Part A) + Spend-Complete (Part B); Parts C-D scoped",
    "assessed_coverage_pct": 86,
    "disclosed_conditions": 13,
    "limits": "Census means provided records, not reality. We verify 100% of the records you provide and the sources you authorize - establishing their completeness, consistency, and traceability to source. We are not a fraud examination and not an assurance opinion."
  },
  "partA": [
    {
      "figure": "$83,404 unreconciled",
      "grade": "B",
      "recoverable": true,
      "fact": "One operating account went unreconciled to the general ledger for three months; the variance is traced and quantified.",
      "area": "ORS area 1 - Proof of cash",
      "threshold": "Proof-of-cash variance > 0.05% / month",
      "id": "P6"
    },
    {
      "figure": "~$210,000 moved",
      "grade": "C",
      "recoverable": false,
      "fact": "Manual top-side journal entries posted within three days of year-end shifted roughly $210,000 of income into the earlier period.",
      "area": "ORS area 5 - Period-end entries",
      "threshold": "Unsupported period-end entries (Grade C/D cluster)",
      "id": "P7"
    },
    {
      "figure": "$785,000 debt-like",
      "grade": "B",
      "recoverable": false,
      "fact": "Accrued bonuses and deferred service revenue are debt-like but do not appear in the net-debt summary.",
      "area": "ORS area 11 - Debt-like items bridge",
      "threshold": "Debt-like items omitted from net-debt view",
      "id": "P13"
    },
    {
      "figure": "+14.8% largest swing",
      "grade": "A",
      "recoverable": false,
      "fact": "Working capital swings more than 12% month-to-month with summer cooling demand; a seasonal peg is required to read it.",
      "area": "ORS area 10 - Seasonal working capital",
      "threshold": "Seasonal working-capital peg required",
      "id": "P11"
    },
    {
      "id": "A-payroll",
      "grade": "A",
      "fact": "Payroll taxes were remitted on time and tie to the filed returns for all twenty-four months.",
      "area": "ORS area 13 - Payroll tax"
    }
  ],
  "partB": [
    {
      "figure": "$18,240",
      "grade": "A",
      "recoverable": true,
      "fact": "Invoice #4471 from a vendor was paid twice, 6 days apart.",
      "area": "ORS area 16 - Duplicate payments",
      "threshold": "Duplicate >= 0.1% of annual spend",
      "id": "P1"
    },
    {
      "figure": "$14,500",
      "grade": "A",
      "recoverable": true,
      "fact": "A vendor credit memo was issued but never applied to a later invoice.",
      "area": "ORS area 16 - Unapplied credits",
      "threshold": "Unapplied credits >= $10,000",
      "id": "P2"
    },
    {
      "figure": "$96,000 / yr",
      "grade": "B",
    "recoverable": false,
      "fact": "A vendor contract renews automatically each year with a 7% price escalator.",
      "area": "ORS area 19 - Auto-renewing commitments",
      "threshold": "Auto-renewing commitments >= 5% of annual spend",
      "id": "P3"
    },
    {
      "figure": "~28% / $3.9M",
      "grade": "A",
      "recoverable": false,
      "fact": "One customer is about 28% of trailing-twelve-month revenue.",
      "area": "ORS area 3 / 19 - Customer concentration",
      "threshold": "Concentration >= 20%",
      "id": "P4"
    },
    {
      "figure": "$3,100 / mo",
      "grade": "B",
      "recoverable": false,
      "fact": "A signed equipment-lease obligation has no matching entry in the ledger or payables - an unrecorded payable.",
      "area": "ORS area 19 vs 11 - Commitment-to-ledger gap",
      "threshold": "Unrecorded payable (commitment-to-ledger gap)",
      "id": "P5"
    },
    {
      "figure": "$90,000 / yr",
      "grade": "B",
      "recoverable": false,
      "fact": "A consulting vendor paid monthly is the owner's spouse; no contract is on file.",
      "area": "ORS area 7 / 16 - Related-party flows",
      "threshold": "Related-party flows of any size",
      "id": "P8"
    },
    {
      "figure": "3 vehicles / 18 mo",
      "grade": "B",
      "recoverable": false,
      "fact": "3 service vehicles past useful life show no repair-and-maintenance spend for eighteen months.",
      "area": "ORS area 22 (LMM) - Deferred maintenance",
      "threshold": "Facilities / capital deferred-maintenance fact",
      "id": "P9"
    },
    {
      "figure": "4 contractors",
      "grade": "B",
      "recoverable": false,
      "fact": "4 contractors paid a fixed monthly amount for more than six months follow a full-time work pattern; classification is shown as filed.",
      "area": "ORS area 12 / 23 - Labor classification",
      "threshold": "Classification facts as filed",
      "id": "P10"
    }
  ],
  "partsCD": [
    {
      "figure": "Consent required",
      "grade": "B",
      "recoverable": false,
      "fact": "A material customer contract requires the customer's written consent before a change of control.",
      "area": "ORS area 32 (Part D) - Change-of-control consent",
      "threshold": "Consent-to-sell held by a non-signing party",
      "id": "P12"
    },
    {
      "id": "A-captable",
      "grade": "A",
      "fact": "The capitalization table reconciles to 100% of the issuance documents; ownership is fully accounted.",
      "area": "ORS area 29 (Part D) - Cap table"
    }
  ],
  "gradeE": [
    {
      "id": "E1",
      "grade": "E",
      "reason": "R1 - sale confidentiality",
      "fact": "Not assessed - access logs / training records not collected",
      "area": "ORS area 25-26 (C)"
    },
    {
      "id": "E2",
      "grade": "E",
      "reason": "R4 - consent withheld",
      "fact": "Not assessed - communications-metadata analysis not run",
      "area": "ORS area 26 (C)"
    },
    {
      "id": "E3",
      "grade": "E",
      "reason": "R5 - third party declined",
      "fact": "Not assessed - landlord refused to confirm lease terms",
      "area": "ORS area 22 (B)"
    }
  ],
  "index_count": 13,
  "gradeE_schedule": "Not assessed: R1x1, R4x1, R5x1",
  "close": "This is the record a buyer's accountant would rebuild - already built, already sourced. There is nothing here left to find."
};

const GradeBadge = ({ grade }: { grade: string }) => {
  const styles: Record<string, string> = {
    'A': 'text-zinc-600',
    'B': 'text-zinc-500',
    'C': 'text-zinc-400',
    'D': 'text-zinc-400',
    'E': 'text-zinc-400',
  };
  
  return (
    <span className={`px-2 py-[2px] text-[10px] font-mono tracking-widest uppercase border border-zinc-200 ${styles[grade] || styles.E} shrink-0`}>
      Grade {grade}
    </span>
  );
};

const FactRow = ({ item, showRecoverable = false }: { item: any, showRecoverable?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border-b border-zinc-200 bg-white last:border-b-0 transition-all hover:bg-zinc-50">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full text-left py-6 px-4 md:px-8 flex items-start sm:items-center gap-4 transition-colors"
      >
        <div className="mt-1 sm:mt-0 text-zinc-300">
          {expanded ? <ChevronDown size={18} strokeWidth={1} /> : <ChevronRight size={18} strokeWidth={1} />}
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 gap-x-6">
          <div className="text-[15px] text-zinc-800 pr-4 leading-relaxed font-light">
            {item.fact}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:justify-end shrink-0">
            {showRecoverable && item.recoverable && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">owner-directed</span>
                <span className="px-2 py-[2px] text-[10px] uppercase tracking-widest bg-zinc-50 border border-zinc-200 text-zinc-600">
                  recoverable - your call
                </span>
              </div>
            )}
            {item.figure && (
              <span className="text-xs font-mono text-zinc-500 px-2 py-0.5 border border-zinc-200/50 bg-[#fafafa]">
                {item.figure}
              </span>
            )}
            <GradeBadge grade={item.grade} />
          </div>
        </div>
      </button>
      
      {expanded && (
        <div className="bg-[#fafafa] border-t border-zinc-200 p-6 md:pl-[68px] text-sm text-zinc-500 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[10px] tracking-widest uppercase text-zinc-400 whitespace-nowrap">Source Area</span>
              <span className="font-mono text-[11px] text-zinc-700">{item.area}</span>
            </div>
            {item.threshold && (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[10px] tracking-widest uppercase text-zinc-400 whitespace-nowrap">Threshold</span>
                <span className="font-mono text-[11px] text-zinc-500">{item.threshold}</span>
              </div>
            )}
          </div>
          {item.grade !== 'E' && (
            <div className="pt-4 border-t border-zinc-200/50 text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
              <Search size={12} strokeWidth={1} /> Trailing logic trace linked to source document
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FactBookDemo = () => {
  const [activeTab, setActiveTab] = useState('Cover');
  const tabs = ['Cover', 'Part A - Financial Record', 'Part B - Quality of Spend', 'Parts C/D - Ops & Gov', 'Disclosed-Conditions Index'];

  return (
    <div id="demo-factbook" className="w-full max-w-[1000px] mx-auto border border-zinc-200 bg-white scroll-mt-32">
      <div className="bg-[#fafafa] border-b border-zinc-200 px-6 py-4 text-[10px] uppercase tracking-widest font-medium text-zinc-500 flex justify-center items-center gap-2">
        <Info size={14} className="text-zinc-400" strokeWidth={1.5} />
        {DEMO_DATA.label}
      </div>

      <div className="flex flex-col md:flex-row border-b border-zinc-200 bg-white">
        <div className="flex overflow-x-auto no-scrollbar md:w-full">
          {tabs.map((tab) => {
            const shortName = tab.split(' - ')[0];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 px-6 text-[11px] uppercase tracking-widest font-medium whitespace-nowrap focus:outline-none transition-colors border-b border-r border-zinc-200 last:border-r-0 ${
                  activeTab === tab 
                    ? 'border-b-zinc-900 text-zinc-900 bg-zinc-50/50' 
                    : 'border-b-transparent text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <span className="hidden md:inline">{tab}</span>
                <span className="md:hidden">{shortName === 'Disclosed-Conditions Index' ? 'Index' : shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 md:p-16 min-h-[600px] bg-white">
        {activeTab === 'Cover' && (
          <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-10 text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
              <ShieldCheck size={14} className="text-zinc-400" />
              graded against the <a href="#/standard" className="underline hover:text-zinc-900">published standard</a>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-8 tracking-tight leading-tight">{DEMO_DATA.cover.company}</h3>
            <div className="h-px w-24 bg-zinc-300 mb-16" />
            
            <dl className="space-y-12">
              <div className="grid md:grid-cols-3 gap-4 border-b border-zinc-100 pb-12">
                <dt className="text-[11px] uppercase tracking-widest text-zinc-400 md:pt-2">Assessment Mark</dt>
                <dd className="text-lg md:text-xl text-zinc-800 font-mono text-[14px] leading-relaxed">
                  {DEMO_DATA.cover.mark}
                </dd>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 border-b border-zinc-100 pb-12">
                <dt className="text-[11px] uppercase tracking-widest text-zinc-400 md:pt-2">
                  Assessed Coverage
                </dt>
                <dd className="md:col-span-2">
                  <div className="text-5xl font-light text-zinc-900 tracking-tight mb-2">
                    {DEMO_DATA.cover.assessed_coverage_pct}<span className="text-3xl text-zinc-400 ml-1">%</span>
                  </div>
                  <div className="text-[13px] font-serif text-zinc-500 italic">
                    (the share of the records in scope that we verified)
                  </div>
                </dd>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 pt-6">Limits of Verification</dt>
                <dd className="md:col-span-2 text-[15px] text-zinc-600 leading-loose bg-[#fafafa] p-8 border border-zinc-200">
                  <p className="mb-4 text-zinc-900 font-medium font-serif italic text-lg">{DEMO_DATA.cover.limits.split('.')[0]}.</p>
                  <p className="font-light">{DEMO_DATA.cover.limits.substring(DEMO_DATA.cover.limits.indexOf('.') + 1).trim()}</p>
                </dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab.includes('Part A') && (
          <div className="max-w-[800px] mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
              <div>
                <h3 className="text-4xl font-serif text-zinc-900 tracking-tight mb-2">Part A</h3>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-4">Financial Record</p>
              </div>
              <div className="bg-[#fafafa] border border-zinc-200 p-5 text-[13px] font-serif italic text-zinc-600 flex items-start gap-4 max-w-sm">
                <Info size={16} className="shrink-0 mt-1 text-zinc-400" strokeWidth={1.5} />
                <span className="leading-relaxed">An evidence grade rates the proof, never your business.</span>
              </div>
            </div>
            
            <div className="border border-zinc-200 text-left">
              {DEMO_DATA.partA.map((item: any) => (
                <FactRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab.includes('Part B') && (
          <div className="max-w-[800px] mx-auto">
             <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
              <div>
                <h3 className="text-4xl font-serif text-zinc-900 tracking-tight mb-2">Part B</h3>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-4">Quality of Spend</p>
              </div>
              <div className="bg-[#fafafa] border border-zinc-200 p-5 text-[13px] font-serif italic text-zinc-600 flex items-start gap-4 max-w-sm">
                <Info size={16} className="shrink-0 mt-1 text-zinc-400" strokeWidth={1.5} />
                <span className="leading-relaxed">An evidence grade rates the proof, never your business.</span>
              </div>
            </div>

            <div className="border border-zinc-200 text-left">
              {DEMO_DATA.partB.map((item: any) => (
                <FactRow key={item.id} item={item} showRecoverable={true} />
              ))}
            </div>
          </div>
        )}

        {activeTab.includes('Parts C/D') && (
          <div className="max-w-[800px] mx-auto">
             <div className="mb-12 border-b border-zinc-200 pb-8">
              <h3 className="text-4xl font-serif text-zinc-900 tracking-tight mb-2">Parts C & D</h3>
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mt-4">Operations & Governance</p>
            </div>

            <div className="border border-zinc-200 mb-16 text-left">
              {DEMO_DATA.partsCD.map((item: any) => (
                <FactRow key={item.id} item={item} />
              ))}
            </div>

            <div className="bg-[#fafafa] border border-zinc-200 p-8 md:p-12 text-left">
              <div className="mb-8">
                 <h4 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-900">Owner-controlled scope</h4>
                 <p className="text-[15px] font-serif italic text-zinc-600 mt-3 leading-relaxed">Scope is the owner's choice. What's assessed, and what's disclosed, is set by the seller - disclosed first, on their terms.</p>
              </div>

              <div className="space-y-3">
                {DEMO_DATA.gradeE.map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center py-5 px-6 bg-white border border-zinc-200 text-sm gap-4">
                    <span className="text-zinc-500 font-mono text-[11px] w-40 shrink-0">{item.area}</span>
                    <span className="text-zinc-600 font-light flex-1">{item.fact}</span>
                    <GradeBadge grade="E" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab.includes('Index') && (
          <div className="max-w-2xl mx-auto py-12">
            <h3 className="text-4xl font-serif text-zinc-900 mb-12 border-b border-zinc-200 pb-8 text-center tracking-tight">Disclosed-Conditions Index</h3>
            
            <div className="p-8 my-12 text-[17px] font-serif text-zinc-600 italic leading-relaxed text-center border border-zinc-200 bg-[#fafafa]">
              Conditions are counted and evidenced, never rated. Whether any condition matters is the reader's judgment.
            </div>

            <div className="flex flex-col gap-8 py-10 border-y border-zinc-200 my-12 px-6">
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Total conditions disclosed</span>
                <span className="text-4xl font-serif text-zinc-900">{DEMO_DATA.index_count}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Out of scope schedule</span>
                <span className="font-mono text-xs text-zinc-500 bg-[#fafafa] px-3 py-1 border border-zinc-200">{DEMO_DATA.gradeE_schedule}</span>
              </div>
            </div>

            <div className="bg-zinc-900 text-white p-12 md:p-16 text-center mt-16 shadow-2xl">
               <p className="text-2xl md:text-3xl font-serif italic text-zinc-300 leading-relaxed max-w-lg mx-auto">
                "{DEMO_DATA.close}"
               </p>
            </div>
            
            <div className="mt-12 text-center text-[13px] font-serif italic text-zinc-400 max-w-md mx-auto leading-relaxed">
               <p>Scope is the owner's choice. What's assessed, and what's disclosed, is set by the seller - disclosed first, on their terms.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StandardPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-800 pb-32">
      <div className="bg-zinc-900 text-zinc-200 py-4 px-6 text-center text-[13px] tracking-wide font-light shadow-inner sticky top-0 z-40">
        Don’t take our word for it. This is the method we verify against — open to read, cite, and apply.
      </div>
      
      <div className="max-w-[800px] mx-auto px-6 pt-24">
        {/* Masthead */}
        <div className="border-b-2 border-zinc-200 pb-12 mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-zinc-900 mb-6">
            THE OPEN READINESS STANDARD
          </h1>
          <p className="font-mono text-sm tracking-widest uppercase text-zinc-500 mb-12">
            Version 2.3 — Public Draft for Comment
          </p>
          <p className="text-xl md:text-2xl font-serif italic text-zinc-600 leading-relaxed mb-12 text-balance">
            A published methodology for evidence verification in private business transactions — extended from the financial record to the spend, operational, and governance records that make a business transferable
          </p>
          <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
            <p><span className="text-zinc-600 font-semibold mr-2">Issued by:</span> Impact Surety — the Standard Issuer</p>
            <p><span className="text-zinc-600 font-semibold mr-2">Date:</span> June 2026</p>
            <p><span className="text-zinc-600 font-semibold mr-2">Supersedes:</span> Versions 2.2, 2.1, 2.0, and 1.0 (June 2026). Engagements complete under the version current at signing. The change log appears in Section 1.2; v2.3 records the issuer’s renaming to Impact Surety — no methodological change.</p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-zinc-900 p-8 mb-16 shadow-sm">
          <p className="font-serif text-lg leading-relaxed text-zinc-800">
            <strong>The standard in one sentence: </strong> 
            Every material fact about a business — what it earns, what it spends, how it runs, and how it is governed — is verified against source evidence across the entire population of records, graded for evidence quality, disclosed without judgment, and traceable from any reported number, clause, or procedure back to the document that supports it.
          </p>
        </div>

        {/* TOC */}
        <div className="bg-[#fafafa] border border-zinc-200 p-8 mb-20">
          <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-6 font-mono">Table of Contents</h2>
          <ul className="space-y-3 font-mono text-[13px] text-zinc-600">
            <li><a href="#section-1" className="hover:text-zinc-900 hover:underline">1. Purpose: From Verified Earnings to a Fungible Asset</a></li>
            <li><a href="#section-2" className="hover:text-zinc-900 hover:underline">2. Conformance Tiers</a></li>
            <li><a href="#section-3" className="hover:text-zinc-900 hover:underline">3. Grade E — Not Assessed (and the Quiet Collection Rule)</a></li>
            <li><a href="#section-4" className="hover:text-zinc-900 hover:underline">4. Limits of the Standard</a></li>
            <li><a href="#section-5" className="hover:text-zinc-900 hover:underline">5. Part A — The Financial Record</a></li>
            <li><a href="#section-6" className="hover:text-zinc-900 hover:underline">6. Part B — The Spend Record (Quality of Spend)</a></li>
            <li><a href="#section-7" className="hover:text-zinc-900 hover:underline">7. Part C — The Operational Record</a></li>
            <li><a href="#section-8" className="hover:text-zinc-900 hover:underline">8. Part D — The Governance Record</a></li>
            <li><a href="#section-9" className="hover:text-zinc-900 hover:underline">9. Issuance Criteria and Machine-Grade Tolerances</a></li>
            <li><a href="#section-10" className="hover:text-zinc-900 hover:underline">10. Disclosed Conditions Index — v2.0 Thresholds</a></li>
            <li><a href="#section-11" className="hover:text-zinc-900 hover:underline">11. Reliance Framework</a></li>
            <li><a href="#section-12" className="hover:text-zinc-900 hover:underline">12. Governance, Maintenance, and Open Items</a></li>
          </ul>
        </div>

        <div className="space-y-24">
          
          <section id="section-1" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">1. Purpose: From Verified Earnings to a Fungible Asset</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed">
              <p>Version 1.0 standardized the financial record — the Quality-of-Earnings-adjacent facts a buyer’s accountant relies on. That solved diligence survivability. It did not solve the deeper illiquidity of the private business market: businesses are hard to buy not only because their earnings are unverified, but because their costs are opaque, their operations live in the owner’s head, and their governance is undocumented. Each of those is a bespoke discovery exercise in every transaction — which is precisely what makes every transaction bespoke.</p>
              <p>Version 2.0 extends the methodology across the remaining records of the enterprise. The destination is fungibility: when the earnings, spend, operating, and governance facts of any business are verified to identical published tolerances and presented in identical structure, businesses become comparable the way graded commodities, inspected houses, and title-searched properties are comparable. Pricing remains the market’s job; the standard’s job is to make every business legible in the same language. The same extension carries the standard upmarket: the records that let a Main Street buyer close are the records M&A advisors, investment banks, lenders, and private-equity operating teams currently rebuild by hand in every deal.</p>

              <h3 className="text-xl font-serif text-zinc-900 tracking-tight mt-10 mb-4">1.1 Principles (unchanged from v1.0)</h3>
              <p>Facts, not opinions. Census, not sampling. Source-linked. Published, not proprietary. Earned, not purchased. These five govern every Part of this standard; their full statements appear in v1.0 Section 1.1 and are incorporated here unchanged.</p>

              <h3 className="text-xl font-serif text-zinc-900 tracking-tight mt-10 mb-4">1.2 Change log: v1.0 → v2.0</h3>
              <div className="overflow-x-auto text-[13px] font-sans">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500 whitespace-nowrap">C1</td><td className="py-3">Scope reorganized into four Parts: A — Financial Record (v1.0 areas 1–15, unchanged); B — Spend Record (new, areas 16–24, the Quality of Spend discipline); C — Operational Record (new, areas 25–28); D — Governance Record (new, areas 29–32)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C2</td><td className="py-3">Two conformance tiers introduced: Readiness Core (Part A) and Transaction Grade (Parts A–D)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C3</td><td className="py-3">Module marks introduced: Evidence-Complete (A), Spend-Complete (B), Operations-Documented (C), Governance-Complete (D); all four current at once constitute the Transaction-Grade designation</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C4</td><td className="py-3">Disclosed Conditions Index extended with spend, operational, and governance thresholds (Section 10)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C5</td><td className="py-3">Conditional-computation rule extended to spend and dependence arithmetic (e.g., acquisition cost recomputed at cited benchmark channel rates); the prohibition on forecasts, probabilities, and time-horizon predictions is restated and applies in full</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C6</td><td className="py-3">Evidence Grade Scale (v1.0 Section 3) applied unchanged to non-financial artifacts: procedures, system logs, registers, and corporate records are graded by the same A–D source hierarchy</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C7</td><td className="py-3">Machine-grade tolerances (v1.0 Section 6) retained for Part A and extended with Part-specific thresholds (Section 9)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C8</td><td className="py-3">v2.1: Grade E (Not Assessed) added to the evidence scale — a disclosed, reason-coded state for evidence deliberately not gathered, with anti-gaming rules (Section 3)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C9</td><td className="py-3">v2.1: Quiet Collection rule and Staged module marks added, sequencing employee-visible evidence gathering to protect confidential sale processes (Section 3.3)</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C10</td><td className="py-3">v2.2: Limits of the Standard added (Section 4) — an explicit statement of what census verification does and does not establish, accompanying every deliverable</td></tr>
                    <tr className="border-b border-zinc-200 align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C11</td><td className="py-3">v2.2: Reliance Framework added (Section 11) — the supported path by which buyers, lenders, and insurers rely on the file: a seller completeness representation keyed to the file in the purchase agreement, supported by the Issuer’s Verification Certificate; representation template opened as Annex R for counsel drafting</td></tr>
                    <tr className="align-top"><td className="py-3 pr-4 font-mono text-zinc-500">C12</td><td className="py-3">v2.3: Standard Issuer renamed Impact Surety; the working name "DealReady" is retired. Editorial only — no criterion, threshold, or governance rule changes. Marks issued under prior versions remain valid and reference their issuing version</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-2" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">2. Conformance Tiers</h2>
            <div className="overflow-x-auto text-[13px] font-sans border border-zinc-200 rounded-sm">
              <table className="w-full text-left">
                <thead className="bg-[#fafafa] border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="py-4 px-4 font-medium uppercase tracking-widest text-[11px]"></th>
                    <th className="py-4 px-4 font-medium uppercase tracking-widest text-[11px] border-l border-zinc-200">Tier I — Readiness Core</th>
                    <th className="py-4 px-4 font-medium uppercase tracking-widest text-[11px] border-l border-zinc-200">Tier II — Transaction Grade</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 font-light">
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">Scope</td><td className="py-4 px-4 border-l border-zinc-200">Part A (areas 1–15)</td><td className="py-4 px-4 border-l border-zinc-200">Parts A–D (areas 1–32)</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">Built for</td><td className="py-4 px-4 border-l border-zinc-200">Main Street and lower-middle-market sales; broker-intermediated deals; SBA-financed buyers</td><td className="py-4 px-4 border-l border-zinc-200">M&A advisors, investment banks, private-equity and family-office buyers, lender credit committees, post-close operating teams</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">Marks available</td><td className="py-4 px-4 border-l border-zinc-200 font-mono text-[12px] bg-zinc-50">Evidence-Complete</td><td className="py-4 px-4 border-l border-zinc-200 font-mono text-[12px] bg-zinc-50">All module marks; Transaction-Grade designation when all four are simultaneously current</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-zinc-800">What it answers</td><td className="py-4 px-4 border-l border-zinc-200 italic">"Are the earnings real and traceable?"</td><td className="py-4 px-4 border-l border-zinc-200 italic">"Is this enterprise legible end-to-end — earnings, spend, operations, governance — to anyone who reads the standard?"</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-3" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">3. Grade E — Not Assessed (and the Quiet Collection Rule)</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed">
              <p>Versions 1.0 and 2.0 of this standard graded every figure A–D and required every scope area populated. Real transactions are not always free to collect everything: gathering employee-visible evidence — access logs, training records, time and communications metadata — can announce a confidential sale to a workforce that must not learn of it; some owners decline consent to specific sources; some records simply have never existed. v2.1 therefore adds a fifth state to the evidence scale:</p>
              
              <div className="bg-zinc-50 border border-zinc-200 p-6 flex items-start gap-6 font-mono text-sm leading-relaxed my-8">
                <span className="text-2xl font-bold bg-white px-3 py-1 border border-zinc-200 shadow-sm text-zinc-900">E</span>
                <p className="text-zinc-700">Not assessed — the evidence was deliberately not gathered. Always disclosed, always reason-coded, never silent. Grade E is neither a finding nor a failure: it tells the reader precisely what was not looked at, and why.</p>
              </div>

              <h3 className="text-xl font-serif text-zinc-900 tracking-tight mt-10 mb-4">3.1 Reason codes (the published registry)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="font-mono text-zinc-900 font-normal">R1 — Sale confidentiality.</strong> Collection would be visible to employees or other parties from whom the process is confidential. The default reason for deferring employee-facing items in Parts B and C.</li>
                <li><strong className="font-mono text-zinc-900 font-normal">R2 — Staged collection.</strong> Deferred by plan to a later stage (e.g., post-LOI, post-announcement), with the stage named.</li>
                <li><strong className="font-mono text-zinc-900 font-normal">R3 — Records do not exist.</strong> The system or document class has never existed (distinct from Grade D, where a representation exists without support).</li>
                <li><strong className="font-mono text-zinc-900 font-normal">R4 — Consent withheld.</strong> The owner declined consent for a specific source (e.g., communications metadata). The decline itself is the disclosed fact.</li>
                <li><strong className="font-mono text-zinc-900 font-normal">R5 — Third party declined.</strong> A counterparty, landlord, or institution refused to provide or confirm.</li>
              </ul>

              <h3 className="text-xl font-serif text-zinc-900 tracking-tight mt-10 mb-4">3.2 Anti-gaming rules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>No E after evidence is in hand.</strong> Once collection on an item has begun and evidence exists, it must be graded A–D and its findings disclosed. Grade E can never be applied retroactively to suppress an inconvenient result; doing so is a revocation event under the Governance Charter.</li>
                <li><strong>E is item-level and visible.</strong> Every deliverable and every mark states its E-count with reason codes (e.g., “6 items Grade E: R1×4, R4×2”), and the E-item list is enumerated in a schedule the reader can inspect.</li>
                <li><strong>Part A is E-restricted.</strong> The financial record (areas 1–15) does not admit Grade E except under R3/R5 line items disclosed within an area; the Evidence-Complete mark requires zero E items in Part A. The earnings facts are never optional.</li>
                <li><strong>Scores show assessed coverage.</strong> All scores are computed over assessed items only, and every score is displayed beside its Assessed Coverage percentage — a 92 score at 60% assessed coverage cannot masquerade as a 92 at full coverage.</li>
                <li><strong>Best practice stated plainly.</strong> Full collection is best operational practice and the standard says so; Grade E exists to make honest incompleteness legible, not to make incompleteness comfortable. E items convert to graded items the moment the evidence is gathered.</li>
              </ul>

              <h3 className="text-xl font-serif text-zinc-900 tracking-tight mt-10 mb-4">3.3 Quiet Collection and Staged marks</h3>
              <p>Engagements conducted during a confidential sale process follow the Quiet Collection sequence: documents, system exports, bank and accounting feeds, and public records first (invisible to the workforce); employee-visible collection — access-log analysis, training records, interviews of any kind, time and communications metadata — deferred under R1/R2 until the owner authorizes the stage. Module marks issuable with open R1/R2 items carry the Staged designation (e.g., “Operations-Documented (Staged): 71% assessed coverage; 5 items deferred R1”), convert automatically to full marks when the deferred items are collected and graded, and are dated like all marks under the 90-day currency rule.</p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-4" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">4. Limits of the Standard</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed">
              <p>Credibility requires stating not only what this standard verifies, but what it cannot. A Limits statement substantially in the following form accompanies every deliverable and every mark.</p>
              <ul className="list-disc pl-5 space-y-4">
                <li><strong>Census means provided records, not reality.</strong> Full-population verification covers 100% of the records provided by the business and the sources it authorizes — books, bank and system feeds, tax filings, contracts, and public records. It establishes the completeness, consistency, and source-traceability of that record. It cannot establish that the record is the whole of reality.</li>
                <li><strong>What the methodology structurally narrows.</strong> Grade A bank-direct evidence and three-way reconciliation make many misstatements arithmetically visible: revenue booked without deposits, deposits without revenue, books that diverge from filed returns, duplicate and phantom payments, undisclosed liens in public records. These are caught not by suspicion but by the matching itself.</li>
                <li><strong>What remains outside any records-based method.</strong> Revenue never deposited into any visible account; a parallel undisclosed entity; collusive schemes documented with genuine-looking third-party paper; oral commitments never written down; and future events. Where adjacent facts make such gaps detectable (e.g., margins inconsistent with purchasing volumes), they surface as disclosed conditions — but their absence is never certified.</li>
                <li><strong>This is not a fraud examination and not assurance.</strong> No deliverable expresses an opinion, provides assurance under any professional attestation standard, or substitutes for the reader’s own procedures, professional advisors, or contractual protections. The Reliance Framework (Section 11) defines the supported path for placing legal weight on the file.</li>
              </ul>
              <p className="mt-6 italic font-serif text-lg">Stating these limits is not a hedge; it is the boundary that makes everything inside it checkable. A method that claims everything can be trusted nowhere.</p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-5" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">5. Part A — The Financial Record (areas 1–15)</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed">
              <p>Part A is v1.0’s fifteen scope areas, incorporated unchanged: (1) proof of cash; (2) revenue composition; (3) customer concentration; (4) gross margin; (5) earnings adjustments; (6) owner compensation and perquisites; (7) related-party transactions; (8) receivables, payables and cutoff; (9) inventory; (10) working capital; (11) debt and debt-like items; (12) payroll and workforce; (13) tax; (14) contracts and leases; (15) legal and licensing. Populations, deliverables, and excluded judgments are as published in v1.0 Section 4; machine-grade issuance tolerances as in v1.0 Section 6.</p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-6" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">6. Part B — The Spend Record (Quality of Spend, areas 16–24)</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed mb-8">
              <p>Part B applies the identical methodology to the expense side of the P&L — the discipline known as Quality of Spend (QofS). Where a Quality of Earnings asks whether the revenue is real, the spend record asks whether the cost base is what it appears to be: what is actually being paid versus what was contracted, what spend is the owner’s rather than the business’s, what future spend is already committed, and what the true, fully loaded cost of acquiring a customer is. These are the findings behind the majority of price re-trades between letter of intent and close; verifying them before market is what removes the ambush.</p>
            </div>

            <div className="overflow-x-auto text-[13px] font-sans border border-zinc-200 rounded-sm mb-12">
              <table className="w-full text-left">
                <thead className="bg-[#fafafa] border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="py-4 px-4 font-medium text-[12px]">Scope area</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Population examined</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Factual deliverable</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Excluded judgment (reserved to the reader)</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 font-light">
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">16. Vendor & payables forensics</td><td className="py-4 px-4 border-l border-zinc-200">100% of AP transactions, vendor master, and vendor contracts, 36 months</td><td className="py-4 px-4 border-l border-zinc-200">Duplicate-vendor and duplicate-payment matches listed; contract rate vs. billed rate reconciled line-by-line; unapplied credits and rebate thresholds vs. claims scheduled; early-payment discounts available vs. captured computed; top-10 vendor and related-party vendor exposure</td><td className="py-4 px-4 border-l border-zinc-200">Whether vendor relationships are “good”; which contracts to renegotiate</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">17. Owner-related spend universe</td><td className="py-4 px-4 border-l border-zinc-200">All disbursements, payroll, benefits, and related-party flows</td><td className="py-4 px-4 border-l border-zinc-200">Every owner-related item identified, categorized, and quantified; each presented as an evidence-graded adjustment candidate with a cited market benchmark; family-on-payroll roles documented per HR and system records</td><td className="py-4 px-4 border-l border-zinc-200">Which adjustments are allowable; the persuasive narrative (advocacy is the seller’s and advisor’s domain)</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">18. Acquisition cost & relationship attribution</td><td className="py-4 px-4 border-l border-zinc-200">All sales and marketing spend; CRM/customer-origin records; owner calendar, communications metadata, and time records (with consent)</td><td className="py-4 px-4 border-l border-zinc-200">Fully loaded acquisition cost computed and decomposed by channel; share of revenue attributable to owner-sourced relationships per origin records; conditional recomputation of acquisition cost at cited third-party benchmark channel rates</td><td className="py-4 px-4 border-l border-zinc-200">Whether the relationships will transfer; post-transition performance forecasts; transition timelines</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">19. Commitment inventory</td><td className="py-4 px-4 border-l border-zinc-200">Every contract, lease, subscription, and obligation — 100%, no materiality sample</td><td className="py-4 px-4 border-l border-zinc-200">Auto-renewal, take-or-pay, change-of-control, royalty, exclusivity, and consulting-obligation clauses extracted verbatim with clause-level citations; committed future spend scheduled by year</td><td className="py-4 px-4 border-l border-zinc-200">Materiality of any commitment; whether consents are obtainable</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">20. Technology & subscription spend</td><td className="py-4 px-4 border-l border-zinc-200">All software, cloud, and telecom spend; system usage logs</td><td className="py-4 px-4 border-l border-zinc-200">License count vs. active-user count per system logs; tier vs. metered usage; duplicate-function tool inventory; committed vs. consumed cloud spend; licensing-compliance facts as recorded</td><td className="py-4 px-4 border-l border-zinc-200">Which tools “should” be cut; security adequacy</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">21. Insurance & risk spend</td><td className="py-4 px-4 border-l border-zinc-200">All policies, premiums, claims history, broker agreements</td><td className="py-4 px-4 border-l border-zinc-200">Policy census with coverage terms extracted; premiums against cited benchmarks; claims and experience-modification history as filed; broker compensation as disclosed in documents</td><td className="py-4 px-4 border-l border-zinc-200">Coverage adequacy; risk acceptability</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">22. Facilities & capital record</td><td className="py-4 px-4 border-l border-zinc-200">All leases, work orders, maintenance ledgers, asset registers</td><td className="py-4 px-4 border-l border-zinc-200">Lease economics extracted and set against cited market data; asset register with age and documented condition reports; maintenance backlog as evidenced by work orders and inspections; capitalization boundary as applied, documented</td><td className="py-4 px-4 border-l border-zinc-200">What “should” be spent on deferred items; lease fairness</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">23. Labor & benefits record</td><td className="py-4 px-4 border-l border-zinc-200">All compensation, benefits invoices, and plan documents</td><td className="py-4 px-4 border-l border-zinc-200">Wage census against cited benchmarks by role; benefits cost series from invoices; severance, retention, and bonus commitments extracted (formal and documented-informal); classification facts as filed</td><td className="py-4 px-4 border-l border-zinc-200">Compensation appropriateness; classification risk opinions</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-zinc-800">24. Off-balance-sheet & contingent items</td><td className="py-4 px-4 border-l border-zinc-200">Warranty records, litigation dockets, guarantees, indemnities, environmental records — 100%</td><td className="py-4 px-4 border-l border-zinc-200">Warranty claims history computed; litigation and threatened-claim docket compiled from records; personal guarantees and indemnification obligations extracted with citations; environmental records inventoried</td><td className="py-4 px-4 border-l border-zinc-200">Reserve adequacy; outcome predictions</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white border-l-4 border-zinc-400 p-8 shadow-sm">
                <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold font-sans mb-3">The facts line in Part B</h4>
                <p className="text-zinc-700 font-serif leading-relaxed">The spend record deliberately stops where Quality-of-Spend practice drifts into advocacy or prediction. Adjustment candidates are graded and benchmarked — the “defensible narrative” belongs to the seller’s advisors. Acquisition cost is recomputed at cited benchmark rates — the claim that the transition takes eighteen months, or succeeds at all, is a forecast and is excluded. The standard hands the reader the buyer’s own arithmetic, pre-run from documented inputs; it never tells the reader how the story ends.</p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-7" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">7. Part C — The Operational Record (areas 25–28)</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed mb-8">
              <p>A business whose operations exist only in its owner’s head is not transferable at full value, however clean its financials. Part C verifies the documented state of operations — presence and coverage, never quality. Whether a procedure is any good is an operating judgment; whether it exists, is current, and is actually used is a fact.</p>
            </div>

            <div className="overflow-x-auto text-[13px] font-sans border border-zinc-200 rounded-sm">
              <table className="w-full text-left">
                <thead className="bg-[#fafafa] border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="py-4 px-4 font-medium text-[12px]">Scope area</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Population examined</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Factual deliverable</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Excluded judgment</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 font-light">
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">25. Procedure inventory & coverage</td><td className="py-4 px-4 border-l border-zinc-200">Every business function in the published Function Taxonomy (sales, fulfillment, finance, HR, IT, compliance, …) against the company’s full document corpus</td><td className="py-4 px-4 border-l border-zinc-200">Per function: documented procedure exists / does not; last-revision date; usage evidence (access logs, training records, references in tickets). Enterprise SOP coverage ratio computed: functions with a current, used procedure ÷ total functions</td><td className="py-4 px-4 border-l border-zinc-200">Procedure quality; whether coverage is “enough”</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">26. Owner-time & dependence record</td><td className="py-4 px-4 border-l border-zinc-200">Owner calendar, communications metadata, and system approval logs (with consent), 12 months</td><td className="py-4 px-4 border-l border-zinc-200">Owner hours allocated by function as recorded; count and dollar value of approvals only the owner can execute per system permissions; customers and vendors for whom the owner is the sole recorded contact, quantified by revenue and spend</td><td className="py-4 px-4 border-l border-zinc-200">Whether the business “can run without them”; successor suitability</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">27. Systems & automation record</td><td className="py-4 px-4 border-l border-zinc-200">Complete system inventory; integration logs; core workflow definitions</td><td className="py-4 px-4 border-l border-zinc-200">System census with data flows mapped from integration evidence; manual-step counts in each core workflow as documented; single-person system-admin dependencies listed from permission records</td><td className="py-4 px-4 border-l border-zinc-200">Which processes to automate; system quality</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-zinc-800">28. Key-relationship transferability facts</td><td className="py-4 px-4 border-l border-zinc-200">All customer and vendor contracts; CRM ownership records</td><td className="py-4 px-4 border-l border-zinc-200">Contracts containing personal-service or named-individual terms extracted; relationship-owner field census from CRM; documented succession or second-contact coverage per relationship</td><td className="py-4 px-4 border-l border-zinc-200">Whether relationships will survive transition</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-8" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">8. Part D — The Governance Record (areas 29–32)</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed mb-8">
              <p>Institutional buyers and their counsel spend the first weeks of every deal reconstructing whether the company is what its cap table says, who can authorize what, and whether the corporate record supports the transaction. Part D verifies the documented state of governance — again presence, completeness, and consistency, never effectiveness, which is the domain of controls attestation and is expressly excluded.</p>
            </div>

             <div className="overflow-x-auto text-[13px] font-sans border border-zinc-200 rounded-sm">
              <table className="w-full text-left">
                <thead className="bg-[#fafafa] border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="py-4 px-4 font-medium text-[12px]">Scope area</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Population examined</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Factual deliverable</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Excluded judgment</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 font-light">
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">29. Corporate record completeness</td><td className="py-4 px-4 border-l border-zinc-200">Formation documents, minutes, resolutions, equity issuances, transfer records — 100%</td><td className="py-4 px-4 border-l border-zinc-200">Cap table reconciled to every issuance and transfer document; minute-book gaps listed by date; consents and resolutions inventoried against actions requiring them per the company’s own documents</td><td className="py-4 px-4 border-l border-zinc-200">Enforceability; cleanup advice</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">30. Authority & controls presence</td><td className="py-4 px-4 border-l border-zinc-200">Signing-authority documents; system permission exports; policy corpus</td><td className="py-4 px-4 border-l border-zinc-200">Documented authority matrix compiled; who-can-do-what facts extracted from live system permissions; policy inventory mapped to recognized control-framework components as presence facts (exists / dated / acknowledged)</td><td className="py-4 px-4 border-l border-zinc-200">Control effectiveness (attestation territory); policy quality</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800">31. Related-party governance</td><td className="py-4 px-4 border-l border-zinc-200">Related-party register; all related-party transactions; approval records</td><td className="py-4 px-4 border-l border-zinc-200">Complete related-party register; each related-party transaction matched to its approval record or listed as unapproved-as-documented</td><td className="py-4 px-4 border-l border-zinc-200">Fairness of terms</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-zinc-800">32. Transaction-governance readiness</td><td className="py-4 px-4 border-l border-zinc-200">Charter documents, equity agreements, guarantees, D&O policies</td><td className="py-4 px-4 border-l border-zinc-200">Consents required to sell, per the documents, listed verbatim; drag/tag, ROFR, and transfer-restriction clauses extracted; personal guarantees inventoried with release requirements as written; D&O coverage terms extracted</td><td className="py-4 px-4 border-l border-zinc-200">Deal-structure advice; legal opinions</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-9" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">9. Issuance Criteria and Machine-Grade Tolerances</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed mb-8">
              <p>Part A retains v1.0 Section 6 in full: ≥99% of revenue and expense dollars at Grade A/B; 100% of revenue transactions individually matched record-to-record; aggregate unreconciled variance ≤0.01% of trailing-twelve-month revenue with a 0.05% per-month ceiling; 100% clause extraction with clause-level citations; 90-day currency with continuous-feed standing verification. Parts B–D add module thresholds, equally mechanical and equally beyond manual feasibility:</p>
            </div>

            <div className="overflow-x-auto text-[13px] font-sans border border-zinc-200 rounded-sm">
              <table className="w-full text-left">
                <thead className="bg-[#fafafa] border-b border-zinc-200 text-zinc-700">
                  <tr>
                    <th className="py-4 px-4 font-medium text-[12px]">Module mark</th>
                    <th className="py-4 px-4 font-medium text-[12px] border-l border-zinc-200">Issuance thresholds (all required)</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 font-light font-mono text-[11px] leading-relaxed">
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800 bg-zinc-50">Spend-Complete (Part B)</td><td className="py-4 px-4 border-l border-zinc-200">100% of AP transactions tested for duplicates and contract-rate variance; ≥99% of expense dollars at Grade A/B; 100% of commitments and clauses extracted with citations; every owner-related disbursement categorized; acquisition-cost attribution populated for ≥99% of customer records</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800 bg-zinc-50">Operations-Documented (Part C)</td><td className="py-4 px-4 border-l border-zinc-200">100% of Function Taxonomy assessed; coverage ratio, owner-time allocation, sole-contact exposure, and manual-step counts computed from records (not interviews); every figure source-linked. Issues as Operations-Documented (Staged) while R1/R2 Grade E items remain open, per Section 3.3. Note: this mark attests the record is complete — a low coverage ratio still earns the mark, disclosed</td></tr>
                  <tr className="border-b border-zinc-200"><td className="py-4 px-4 font-medium text-zinc-800 bg-zinc-50">Governance-Complete (Part D)</td><td className="py-4 px-4 border-l border-zinc-200">Cap table reconciled to 100% of issuance documents with zero unexplained entries; 100% of transfer-restriction and consent clauses extracted; every related-party transaction matched to an approval record or listed as unmatched</td></tr>
                  <tr><td className="py-4 px-4 font-medium text-zinc-800 bg-zinc-50">Transaction-Grade™</td><td className="py-4 px-4 border-l border-zinc-200">All four module marks simultaneously current (90-day rule applies to each). The designation that makes the enterprise legible end-to-end under one published methodology. Where Staged module marks are included, the designation reads Transaction-Grade (Staged) and enumerates open E items</td></tr>
                </tbody>
              </table>
            </div>

            <p className="mt-8 text-zinc-700 font-light leading-relaxed">Required mark language per v1.0 Section 6, extended per module and including the E-count with reason codes and the Assessed Coverage percentage; every mark states what it describes and repeats that it is not an opinion on the business, its operations, its controls’ effectiveness, or its value.</p>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-10" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">10. Disclosed Conditions Index — v2.0 Thresholds</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed mb-6">
              <p>v1.0 financial thresholds carry over unchanged. Conditions cannot fire on Grade E items; unassessed areas are listed as such beside the index so absence of a condition is never mistaken for absence of the fact. New mechanical disclosure thresholds, reported descriptively, never rated:</p>
            </div>
            <ul className="list-disc pl-5 space-y-3 font-mono text-xs text-zinc-600 leading-relaxed">
              <li><strong className="text-zinc-900 font-sans text-sm">Spend:</strong> duplicate or contract-variance payments ≥ 0.1% of annual spend; unapplied credits ≥ $10,000; auto-renewing commitments ≥ 5% of annual spend; any take-or-pay obligation; vendor concentration — any single vendor ≥ 20% of spend; related-party vendor flows of any size.</li>
              <li><strong className="text-zinc-900 font-sans text-sm">Owner economics:</strong> owner-related spend candidates ≥ 10% of unadjusted earnings; related-party real estate at terms deviating ≥ 15% from cited market data.</li>
              <li><strong className="text-zinc-900 font-sans text-sm">Acquisition dependence:</strong> owner-sourced relationships ≥ 30% of revenue; loaded acquisition cost deviating ≥ 50% from cited channel benchmarks in either direction (unusually low is disclosed exactly as unusually high is).</li>
              <li><strong className="text-zinc-900 font-sans text-sm">Operations:</strong> enterprise SOP coverage ratio below 60%; owner sole-contact relationships ≥ 25% of revenue or spend; any core workflow with zero documented procedure; any system with a single administrator.</li>
              <li><strong className="text-zinc-900 font-sans text-sm">Governance:</strong> any cap-table entry without a matching issuance document; any related-party transaction without an approval record; any consent-to-sell requirement held by a non-signing party; any personal guarantee without documented release terms.</li>
            </ul>
          </section>

          <hr className="border-zinc-200" />

          <section id="section-11" className="scroll-mt-32">
            <h2 className="text-3xl font-serif text-zinc-900 mb-6 tracking-tight">11. Reliance Framework</h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 font-light leading-relaxed">
              <p>Because no deliverable under this standard is an assurance opinion, the question institutional readers rightly ask is: what happens, legally, if the file is wrong? The standard’s answer routes reliance through the party who owns the facts — the seller — with the Issuer’s process standing behind the verification itself:</p>
              
              <ul className="list-disc pl-5 space-y-4 mt-6">
                <li><strong>The seller completeness representation.</strong> The supported reliance path is a representation by the seller, in the purchase agreement, that the records furnished for verification were complete and authentic and that the resulting file fairly reflects them — keyed to the file by version, date, and mark identifiers. This gives buyer, lender, and insurer a contractual hook with conventional indemnity mechanics, attached to the facts rather than to a professional’s opinion. Template language is published as Annex R (in counsel drafting at v2.2; non-normative until issued).</li>
                <li><strong>The Verification Certificate.</strong> For each issued mark, the Issuer provides a certificate stating, as fact: the standard version applied, the procedures of Sections 5–9 performed, the tolerances met, the named human reviewer, the E-item schedule, and the verification dates. The certificate attests process conformity — never the business — and is the document the seller’s representation and an insurer’s underwriting file reference.</li>
                <li><strong>Issuer accountability.</strong> The Issuer’s responsibility for performing the published procedures correctly is defined in engagement terms and backed by errors-and-omissions coverage; the revocation rule (Governance Charter) applies where underlying evidence is found false or materially incomplete, with notice to known recipients.</li>
                <li><strong>Third-party recognition pathways.</strong> Lenders, representation-and-warranty insurers, and diligence providers may formally recognize the standard in their own guidelines (e.g., underwriting credit for marked files, scoped procedures over the census base). Recognition statements are published in the standard’s public registry as they are granted; none is claimed before it exists.</li>
              </ul>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* Section 12 is placed inside a highly visible block specifically requested in the prompt */}
          <section id="section-12" className="scroll-mt-32">
            <div className="bg-zinc-900 text-white p-10 md:p-14 shadow-xl">
              <h2 className="text-3xl font-serif text-zinc-100 mb-8 tracking-tight border-b border-zinc-800 pb-6">12. Governance, Maintenance, and Open Items (The Governance Charter)</h2>
              <div className="text-zinc-300 font-light leading-relaxed space-y-6">
                <p className="text-lg">The Governance Charter of v1.0 Section 8 applies to every Part and every module mark without modification:</p>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm tracking-wide bg-zinc-950 p-8 border border-zinc-800">
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> No purchase of outcomes</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> No referrer influence</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Separation of issuance from sales</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Published versioned criteria</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Factual appeals only</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Revocation</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Consent and custody</div>
                  <div className="flex items-center gap-3"><span className="text-zinc-500">→</span> Independence of the record</div>
                </div>
                <p>Engagements complete under the version current at signing; module marks display their issuing version.</p>
                
                <h3 className="text-xl font-serif text-white tracking-tight mt-10 mb-4 border-t border-zinc-800 pt-8">Maintenance and Open Items</h3>
                <p className="text-sm">Open items for v2.1, recorded for transparency: the v1.1 items (cash-revenue procedure, paper-record digitization prerequisite, industry value-dependencies, international equivalents) remain open and now apply across all Parts; the Function Taxonomy for area 25 requires publication as a normative annex; communications-metadata analysis in areas 18 and 26 requires a published privacy procedure and employee-notice guidance (partially addressed by Grade E reason codes R1/R4 and the Quiet Collection sequence; the affirmative-collection procedure remains open); benchmark-source eligibility (what counts as a citable third-party rate for areas 18, 21, 22, 23) requires a published source registry; the interaction between area 30 presence-facts and formal controls attestation frameworks requires a counsel-reviewed boundary note; Annex R (seller completeness representation template) requires counsel drafting before it becomes normative; and the third-party recognition registry (Section 11) requires its publication procedure.</p>
              </div>
            </div>
            
            <div className="mt-16 text-xs text-zinc-500 leading-relaxed font-mono border-t border-zinc-200 pt-8">
              © 2026. This standard may be freely read, cited, quoted, and applied with attribution. Module marks and the Transaction-Grade™ designation may be used only on deliverables meeting Section 9 in full, issued under Section 12 governance. “Quality of Spend” is used here as the name of the spend-side verification discipline.
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'standard'>('home');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/standard')) {
        setCurrentPage('standard');
      } else {
        setCurrentPage('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navToHomeHash = (hash: string) => (e: React.MouseEvent) => {
    if (currentPage === 'standard') {
      e.preventDefault();
      window.location.hash = hash;
    }
  };

  if (currentPage === 'standard') {
    return (
      <div className="min-h-screen bg-[#FCFCFC] font-sans text-zinc-900 flex flex-col selection:bg-zinc-200 selection:text-zinc-900">
        <nav className="bg-white/95 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
            <a href="#/" onClick={(e) => { e.preventDefault(); window.location.hash = '/'; }} className="flex items-center gap-4 group">
              <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-2.5 h-2.5 bg-white"></div>
              </div>
              <span className="font-serif text-2xl tracking-wide text-zinc-900">Impact Surety</span>
            </a>
            <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              <a href="#demo-factbook" onClick={navToHomeHash('#demo-factbook')} className="hover:text-zinc-900 transition-colors">Sample FactBook</a>
              <a href="#/standard" className="text-zinc-900 transition-colors">The Standard</a>
              <a href="#advisors" onClick={navToHomeHash('#advisors')} className="hover:text-zinc-900 transition-colors">For advisors</a>
              <a href="#contact" onClick={navToHomeHash('#contact')} className="hover:text-zinc-900 transition-colors">Get started</a>
            </div>
          </div>
        </nav>
        <StandardPage />
      </div>
    );
  }

  // Home Page
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans text-zinc-900 flex flex-col selection:bg-zinc-200 selection:text-zinc-900">
      
      {/* Premium Minimal Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-4">
            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white"></div>
            </div>
            <span className="font-serif text-2xl tracking-wide text-zinc-900">Impact Surety</span>
          </a>
          <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
            <a href="#demo-factbook" className="hover:text-zinc-900 transition-colors">Sample FactBook</a>
            <a href="#/standard" className="hover:text-zinc-900 transition-colors">The Standard</a>
            <a href="#advisors" className="hover:text-zinc-900 transition-colors">For advisors</a>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">Get started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-40 px-6 max-w-[1000px] mx-auto text-center border-b border-zinc-200">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-zinc-900 tracking-tight leading-[1.15] mb-12 max-w-4xl mx-auto text-balance">
          In diligence, a buyer's accountant rebuilds your numbers from scratch and discounts everything they can't trace.
        </h1>
        <p className="text-xl sm:text-2xl text-zinc-600 mb-16 leading-relaxed max-w-3xl mx-auto font-light">
          Impact Surety <span className="text-zinc-900 font-medium">verifies the facts of your business</span> against <a href="#/standard" className="underline hover:text-zinc-900 transition-colors underline-offset-4 pointer-events-auto">a published standard</a> before you list - so when that moment comes, there's nothing left for them to find.
        </p>
        
        <p className="text-3xl sm:text-4xl font-serif italic text-zinc-400 mb-20 text-balance">
          You walk in already believed.
        </p>

        <div className="flex flex-col items-center gap-10">
          <a 
            href="#demo-factbook"
            className="inline-flex items-center justify-center px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            See a sample FactBook
          </a>
          
          <div className="flex items-center gap-3 text-[14px] text-zinc-700 max-w-2xl text-center bg-white border border-zinc-200 px-6 py-4">
            <ShieldCheck size={18} className="shrink-0 text-zinc-400" strokeWidth={1.5} />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-800 leading-relaxed text-balance">
              We verify the records you provide against <a href="#/standard" className="underline hover:text-zinc-500">a published standard</a>, and we say exactly where that ends.
            </span>
          </div>
          
          <p className="text-[15px] font-serif italic text-zinc-500 mt-2">
            You decide what's verified and what's disclosed - disclosed first, on your terms.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-32 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-12 gap-16 md:gap-24 items-start">
          <div className="md:col-span-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 leading-relaxed md:pt-3">
              The week-eleven <br/> diligence retrade
            </h2>
          </div>
          <div className="md:col-span-8">
            <p className="text-3xl md:text-4xl text-zinc-900 leading-snug font-serif tracking-tight text-balance">
              When late, unverified facts surface in diligence, trust breaks down. Buyers discount the unknown, and you pay the price for records that weren't proven before you went to market. A home inspection protects a house transaction - but for the business you built, you're expected to cross your fingers and brace for the exam.
            </p>
          </div>
        </div>
      </section>

      {/* Three Products Section */}
      <section id="products" className="py-32 md:py-40 bg-[#fafafa] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24 mb-24 md:mb-32">
            <div className="md:col-span-4">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 leading-relaxed md:pt-3">A verified-truth platform</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-3xl md:text-4xl text-zinc-900 font-serif leading-snug tracking-tight text-balance">
                Truth you can check, action on the checkable, and independent where it counts. We work alongside your advisor, never instead of them.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="group">
              <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight border-b border-zinc-200 pb-6">FactBook + Certification</h3>
              <p className="text-base text-zinc-600 leading-loose font-light">
                <strong className="text-zinc-900 font-medium">Truth you can check.</strong> We verify your historical records against <a href="#/standard" className="text-zinc-900 underline hover:text-zinc-600">a published standard</a>. Every fact is graded and source-linked, establishing completeness and trace to source.
              </p>
            </div>
            
            <div className="group">
              <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight border-b border-zinc-200 pb-6 flex items-end justify-between">
                <span>Clawback</span>
                <span className="text-[10px] pb-1.5 uppercase tracking-widest font-sans font-semibold text-zinc-400">owner-directed</span>
              </h3>
              <p className="text-base text-zinc-600 leading-loose font-light">
                <strong className="text-zinc-900 font-medium">Action on the checkable.</strong> Where waste is a provable fact - like a duplicate payment - we recover and prevent it, entirely at your direction.
              </p>
            </div>

            <div className="group">
              <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight border-b border-zinc-200 pb-6">SpendSentry</h3>
              <p className="text-base text-zinc-600 leading-loose font-light">
                <strong className="text-zinc-900 font-medium">Independent where it counts.</strong> The truth layer never profits from what the facts say, never opines on what they mean, and never competes with the advisor who brought the deal. See our <a href="#/standard#section-12" className="underline text-zinc-900 hover:text-zinc-600">Governance Charter</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 md:py-40 bg-[#f4f4f4] border-b border-zinc-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 tracking-tight">The inspection before you sell</h2>
            <p className="text-xl text-zinc-500 mt-8 max-w-2xl mx-auto font-light leading-relaxed">Explore a sample verification. Every fact is traceable, every condition is disclosed first, and you maintain complete control over scope.</p>
          </div>
          
          <FactBookDemo />
        </div>
      </section>

      {/* Why This Exists */}
      <section className="py-32 md:py-40 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 md:pt-3">Why this exists</h2>
          </div>
          
          <div className="md:col-span-8 space-y-12">
            <p className="text-2xl text-zinc-600 font-light leading-relaxed text-balance">
              I grew up in Bethlehem, Pennsylvania as the steel mills went down. When the company failed, the pension system protected the men at the top and abandoned the ones who had done the actual work - people who did everything they were told, disbelieved and discarded by a system built that way. I've spent my career since giving smaller companies the tools the largest ones keep for themselves.
            </p>
            
            <p className="text-3xl md:text-4xl font-serif text-zinc-900 leading-snug pt-12 border-t border-zinc-200 text-balance">
              I built Impact Surety so the business you gave your life to doesn't have to fight to be believed at the one moment it matters most - when you sell it.
            </p>
          </div>
        </div>
      </section>

      {/* The Exhale */}
      <section className="py-40 bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-zinc-900 leading-[1.1] tracking-tight mb-12 max-w-3xl mx-auto text-balance">
            When the facts are already proven and sourced, diligence stops being an exam you brace for.
          </h2>
          <p className="text-2xl md:text-3xl text-zinc-500 mb-20 font-light text-balance">
            There's nothing left to discover, because you disclosed it first, on your terms. 
            <span className="font-serif italic text-zinc-900 block mt-8 text-3xl md:text-4xl">You go to market believed.</span>
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-zinc-600 bg-[#fafafa] border border-zinc-200 py-6 px-10 mx-auto">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-zinc-400 shrink-0" strokeWidth={1.5} />
              <span className="font-medium text-zinc-900 tracking-wide uppercase text-[10px] font-mono leading-relaxed max-w-lg text-balance">We verify the records you provide against <a href="#/standard" className="underline hover:text-zinc-500">a published standard</a>, and we say exactly where that ends.</span>
            </div>
          </div>
        </div>
      </section>

      {/* For Advisors / Brokers */}
      <section id="advisors" className="py-32 md:py-40 bg-[#fafafa] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-20 md:gap-32">
            <div>
              <div className="uppercase tracking-[0.2em] text-[11px] font-semibold text-zinc-400 mb-8 border-b border-zinc-200 pb-6 inline-block">For M&A Advisors & Brokers</div>
              <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-10 tracking-tight leading-tight text-balance">Arm your client with verified facts.</h2>
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-16">
                You build the narrative; we verify the facts your judgment stands on. We arm you and your client with a verified FactBook, so you control the deal timeline from day one, safe from late-stage retrades. A LeakFinder report keeps you in the chain if any uncontracted outreach occurs.
              </p>
              
              <div className="border border-zinc-200 bg-white p-12 mb-16">
                <h3 className="font-serif text-2xl text-zinc-900 mb-6 tracking-tight">
                  Channel Safety
                </h3>
                <p className="text-base text-zinc-600 leading-loose font-light">
                  We verify facts and conclude nothing. The truth layer never profits from what the facts say, never opines on what they mean, and never competes with the advisor who brought the deal. <strong className="font-medium text-zinc-900">We work alongside your advisor, never instead of them.</strong> See our <a href="#/standard#section-12" className="underline text-zinc-900 hover:text-zinc-600">published Governance Charter</a>.
                </p>
              </div>

              <a href="#contact" className="text-zinc-900 font-[11px] uppercase tracking-[0.2em] font-semibold hover:text-zinc-500 transition-colors flex items-center gap-4 group">
                Partner with us to verify your next listing <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" strokeWidth={1.5} />
              </a>
            </div>
            
            <div className="bg-zinc-900 text-white p-12 md:p-20 flex items-center">
               <blockquote className="text-3xl md:text-4xl font-serif italic text-zinc-300 leading-relaxed text-balance">
                 "A buyer's accountant uses unverified numbers to grind price. When the facts are verified before you list, that leverage disappears."
               </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security FAQ */}
      <section className="py-32 bg-white border-b border-zinc-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <Lock size={24} className="text-zinc-400 mb-8" strokeWidth={1} />
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-8">
                How your data is handled
              </h2>
              <p className="text-zinc-800 font-serif italic text-2xl md:text-3xl leading-relaxed text-balance mb-8">
                We work NDA-first. Your identity is protected throughout, and engaging us creates no external signal that your business is for sale.
              </p>
              <p className="text-zinc-600 font-light leading-relaxed">
                Verification happens privately, on de-identified data; you decide if and when anything is shared.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-12 sm:gap-16 pt-8 lg:pt-0">
              <div>
                <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight">Who sees my raw files?</h3>
                <p className="text-zinc-600 font-light leading-relaxed text-lg text-balance">
                  De-identified on arrival with Microsoft Presidio, run locally; analysis is on anonymized data; access is limited; the raw copy is destroyed after.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight">Where does my data live?</h3>
                <p className="text-zinc-600 font-light leading-relaxed text-lg text-balance">
                  Processed privately; not shared with third parties.
                </p>
              </div>
              
              <div className="sm:col-span-2 pt-8 sm:pt-16 sm:border-t border-zinc-200">
                <h3 className="text-2xl font-serif text-zinc-900 mb-6 tracking-tight">What if something goes wrong?</h3>
                <p className="text-zinc-600 font-light leading-relaxed text-lg max-w-3xl text-balance">
                  We work NDA-first and tell you plainly what we do and don't do; we make no assurance claim. We maintain standard cybersecurity and incident response practices appropriate for processing confidential enterprise records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="py-32 md:py-48 bg-[#fafafa] text-center border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-serif text-zinc-900 mb-8 tracking-tight">See where your facts stand.</h2>
          <p className="text-2xl text-zinc-500 mb-16 font-light">A confidential conversation about verifying your records before you sell.</p>
          <a 
            href="mailto:contact@impactsurety.com"
            className="inline-flex items-center justify-center px-16 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-white bg-zinc-900 hover:bg-black transition-colors"
          >
            Contact us securely
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-32 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-8 bg-[#111] border border-zinc-800 p-8 md:p-12 text-left">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-8 flex items-center gap-4">
              <Info size={16} strokeWidth={1.5} />
              Limits of Verification
            </h4>
            <div className="space-y-6 text-sm font-light leading-relaxed">
              <p>
                <strong className="text-zinc-200 font-medium tracking-wide">Census means provided records, not reality.</strong> <span className="inline-block md:ml-1 text-zinc-500 italic font-serif">Gloss: Census means every record you give us - not a sample.</span>
              </p>
              <p className="text-zinc-400">
                We verify 100% of the records you provide and the sources you authorize - establishing their completeness, consistency, and traceability to source. We are not a fraud examination and not an assurance opinion. Stating this limit is the boundary that makes everything inside it checkable.
              </p>
              <p className="text-zinc-500 pt-6 border-t border-zinc-800 italic font-serif">
                We verify facts and conclude nothing. Advisory, not a reliance opinion.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-4 flex flex-col justify-between">
             <div className="space-y-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                <a href="#/standard" className="block hover:text-white transition-colors">The Standard</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
                <a href="#" className="block hover:text-white transition-colors">Terms</a>
             </div>
             
             <div className="mt-20 md:mt-0 text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-600">
                &copy; {new Date().getFullYear()} Impact Surety.<br/>All rights reserved.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
