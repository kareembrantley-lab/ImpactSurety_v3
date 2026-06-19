import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  ShieldCheck, 
  Search, 
  Info, 
  FileCheck, 
  ArrowRight,
  Database,
  Building,
  UserCheck
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
  const colors: Record<string, string> = {
    'A': 'bg-[#f4f7f6] text-emerald-800 border-emerald-200/50',
    'B': 'bg-[#f4f6f8] text-blue-800 border-blue-200/50',
    'C': 'bg-[#faf7f3] text-amber-800 border-amber-200/50',
    'D': 'bg-[#fcf5f5] text-red-800 border-red-200/50',
    'E': 'bg-slate-50 text-slate-500 border-slate-200 border-dashed',
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-mono tracking-widest uppercase border ${colors[grade] || colors.E} shrink-0`}>
      Grade {grade}
    </span>
  );
};

const FactRow = ({ item, showRecoverable = false }: { item: any, showRecoverable?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border border-slate-200/70 bg-white mb-2 transition-all hover:border-slate-300">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full text-left p-5 flex items-start sm:items-center gap-4 transition-colors"
      >
        <div className="mt-1 sm:mt-0 text-slate-300">
          {expanded ? <ChevronDown size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 gap-x-4">
          <div className="text-[15px] font-medium text-navy-900 pr-4 leading-relaxed tracking-tight">
            {item.fact}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 sm:justify-end shrink-0">
            {showRecoverable && item.recoverable && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">owner-directed, separate</span>
                <span className="px-2 py-0.5 text-[11px] uppercase tracking-wider font-medium bg-slate-50 border border-slate-200 text-slate-600">
                  recoverable - your call
                </span>
              </div>
            )}
            {item.figure && (
              <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 border border-slate-100">
                {item.figure}
              </span>
            )}
            <GradeBadge grade={item.grade} />
          </div>
        </div>
      </button>
      
      {expanded && (
        <div className="bg-[#fafaf9] border-t border-slate-100 p-5 pl-[60px] text-sm text-slate-600 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-xs tracking-widest uppercase text-slate-400 whitespace-nowrap">Source Area</span>
            <span className="font-mono text-xs text-navy-900">{item.area}</span>
          </div>
          {item.threshold && (
            <div className="flex items-center gap-3">
              <span className="font-medium text-xs tracking-widest uppercase text-slate-400 whitespace-nowrap">Threshold</span>
              <span className="font-mono text-xs text-slate-500">{item.threshold}</span>
            </div>
          )}
          <div className="pt-3 border-t border-slate-200/50 mt-3 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Search size={12} strokeWidth={1.5} /> Trailing logic trace linked to source document
          </div>
        </div>
      )}
    </div>
  );
};

const FactBookDemo = () => {
  const [activeTab, setActiveTab] = useState('Cover');
  
  const tabs = ['Cover', 'Part A - Financial Record', 'Part B - Quality of Spend', 'Parts C/D - Ops & Gov', 'Disclosed-Conditions Index'];

  return (
    <div id="demo-factbook" className="w-full max-w-[1000px] mx-auto border border-slate-200 bg-white shadow-[0_4px_40px_rgba(0,0,0,0.03)] scroll-mt-32">
      {/* Required Illustrative Label */}
      <div className="bg-[#faf9f6] border-b border-slate-200 px-6 py-3 text-[11px] uppercase tracking-widest font-medium text-slate-500 flex justify-center items-center gap-2">
        <Info size={14} className="text-accent-500" strokeWidth={1.5} />
        {DEMO_DATA.label}
      </div>

      <div className="flex flex-col md:flex-row border-b border-slate-200 bg-[#fdfdfc]">
        <div className="flex overflow-x-auto no-scrollbar md:w-full">
          {tabs.map((tab, idx) => {
            const shortName = tab.split(' - ')[0];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-xs uppercase tracking-widest font-medium whitespace-nowrap focus:outline-none transition-colors border-b border-r border-r-slate-100 last:border-r-0 ${
                  activeTab === tab 
                    ? 'border-b-accent-500 text-navy-900 bg-white' 
                    : 'border-b-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="hidden md:inline">{tab}</span>
                <span className="md:hidden">{shortName === 'Disclosed-Conditions Index' ? 'Index' : shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 md:p-12 min-h-[560px] bg-white">
        {activeTab === 'Cover' && (
          <div className="max-w-2xl mx-auto py-12 md:py-16 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-serif text-navy-900 mb-6 tracking-tight leading-tight">{DEMO_DATA.cover.company}</h3>
            <div className="h-px w-24 bg-accent-500 mb-12 mx-auto md:mx-0" />
            
            <dl className="space-y-10">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Assessment Mark</dt>
                <dd className="text-xl text-navy-900 font-serif flex items-center justify-center md:justify-start gap-3">
                  <ShieldCheck className="text-accent-500" size={24} strokeWidth={1.5} />
                  {DEMO_DATA.cover.mark}
                </dd>
              </div>
              
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-center md:justify-start gap-2">
                  Assessed Coverage
                </dt>
                <dd className="text-5xl font-light text-navy-900 tracking-tight">
                  {DEMO_DATA.cover.assessed_coverage_pct}<span className="text-3xl text-slate-400 ml-1">%</span>
                </dd>
                <dd className="text-sm font-serif text-slate-500 mt-3 italic max-w-sm mx-auto md:mx-0">
                  (the share of the records in scope that we verified)
                </dd>
              </div>

              <div className="pt-10 mt-10 border-t border-slate-100">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Limits of Verification</dt>
                <dd className="text-sm text-slate-600 leading-loose bg-[#fafaf9] p-6 border border-slate-100">
                  <p className="mb-3 text-navy-900 font-medium">{DEMO_DATA.cover.limits.split('.')[0]}.</p>
                  <p>{DEMO_DATA.cover.limits.substring(DEMO_DATA.cover.limits.indexOf('.') + 1).trim()}</p>
                </dd>
                <dd className="text-xs text-slate-400 mt-4 flex justify-center md:justify-start gap-2">
                  <Info size={14} className="shrink-0 text-accent-500" strokeWidth={1.5} />
                  <span className="font-serif italic">Gloss: Census means every record you give us - not a sample.</span>
                </dd>
              </div>
            </dl>
          </div>
        )}

        {activeTab.includes('Part A') && (
          <div className="max-w-[760px] mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-3xl font-serif text-navy-900 tracking-tight">Part A</h3>
                <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest font-medium">Financial Record</p>
              </div>
              <div className="bg-[#faf9f6] border border-slate-200 p-4 text-xs font-serif italic text-slate-600 flex items-start gap-3 max-w-sm">
                <Info size={16} className="shrink-0 mt-0.5 text-accent-500" strokeWidth={1.5} />
                <span className="leading-relaxed">An evidence grade rates how well the evidence backs a fact - it grades the proof, never your business.</span>
              </div>
            </div>
            
            <div className="space-y-0 text-left">
              {DEMO_DATA.partA.map((item: any) => (
                <FactRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab.includes('Part B') && (
          <div className="max-w-[760px] mx-auto">
             <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-3xl font-serif text-navy-900 tracking-tight">Part B</h3>
                <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest font-medium">Quality of Spend</p>
              </div>
              <div className="bg-[#faf9f6] border border-slate-200 p-4 text-xs font-serif italic text-slate-600 flex items-start gap-3 max-w-sm">
                <Info size={16} className="shrink-0 mt-0.5 text-accent-500" strokeWidth={1.5} />
                <span className="leading-relaxed">An evidence grade rates how well the evidence backs a fact - it grades the proof, never your business.</span>
              </div>
            </div>

            <div className="space-y-0 text-left">
              {DEMO_DATA.partB.map((item: any) => (
                <FactRow key={item.id} item={item} showRecoverable={true} />
              ))}
            </div>
          </div>
        )}

        {activeTab.includes('Parts C/D') && (
          <div className="max-w-[760px] mx-auto">
             <div className="mb-10 border-b border-slate-100 pb-6">
              <h3 className="text-3xl font-serif text-navy-900 tracking-tight">Parts C & D</h3>
              <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest font-medium">Operations & Governance</p>
            </div>

            <div className="space-y-0 mb-12 text-left">
              {DEMO_DATA.partsCD.map((item: any) => (
                <FactRow key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-16 bg-[#fafaf9] border border-slate-200 p-8 text-left">
              <div className="flex items-start gap-4 mb-6">
                <Lock size={20} className="text-accent-500 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-widest text-navy-900">Owner-controlled scope</h4>
                  <p className="text-[15px] font-serif italic text-slate-600 mt-2 leading-relaxed">Scope is the owner's choice. What's assessed, and what's disclosed, is set by the seller - disclosed first, on their terms.</p>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                {DEMO_DATA.gradeE.map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center py-4 px-5 bg-white border border-slate-200 text-sm gap-3">
                    <span className="text-slate-400 font-mono text-xs w-36 shrink-0">{item.area}</span>
                    <span className="text-slate-600 font-medium flex-1 tracking-tight">{item.fact}</span>
                    <GradeBadge grade="E" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab.includes('Index') && (
          <div className="max-w-2xl mx-auto py-8">
            <h3 className="text-3xl font-serif text-navy-900 mb-8 border-b border-slate-200 pb-6 text-center tracking-tight">Disclosed-Conditions Index</h3>
            
            <div className="bg-[#faf9f6] border-l-2 border-accent-500 p-6 my-10 text-base font-serif text-slate-700 italic leading-relaxed text-center shadow-sm">
              Conditions are counted and evidenced, never rated. Whether any condition matters is the reader's judgment.
            </div>

            <div className="flex flex-col gap-6 py-6 border-y border-slate-100 my-10 px-4 md:px-12 bg-slate-50/50">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Total conditions disclosed</span>
                <span className="text-3xl font-serif text-navy-900">{DEMO_DATA.index_count}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Out of scope schedule</span>
                <span className="font-mono text-sm text-slate-500 bg-white px-2 py-1 border border-slate-200">{DEMO_DATA.gradeE_schedule}</span>
              </div>
            </div>

            <div className="bg-navy-900 text-white p-10 md:p-12 text-center mt-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 bottom-0 w-1 bg-accent-500" />
               <p className="text-xl md:text-2xl font-serif italic text-accent-400 leading-relaxed max-w-lg mx-auto">
                "{DEMO_DATA.close}"
               </p>
            </div>
            
            <div className="mt-12 text-center text-[13px] font-serif italic text-slate-400 max-w-md mx-auto">
               <p>Scope is the owner's choice. What's assessed, and what's disclosed, is set by the seller - disclosed first, on their terms.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900 flex flex-col selection:bg-accent-500/20 selection:text-navy-900">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-navy-900 flex items-center justify-center">
              <div className="w-4 h-4 border border-accent-500 rotate-45"></div>
            </div>
            <span className="font-serif text-xl tracking-wide text-navy-900">Impact Surety</span>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-widest font-semibold text-slate-400">
            <a href="#problem" className="hover:text-navy-900 transition-colors">The Problem</a>
            <a href="#products" className="hover:text-navy-900 transition-colors">Products</a>
            <a href="#demo-factbook" className="hover:text-navy-900 transition-colors">FactBook Demo</a>
            <a href="#advisors" className="hover:text-accent-600 transition-colors">For Advisors</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#fcfcfc] pt-32 pb-40 border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 shrink-0 select-none pointer-events-none opacity-[0.03]">
           <div className="w-[800px] h-[800px] border border-slate-900 rounded-full"></div>
        </div>
        <div className="absolute -bottom-40 -left-40 shrink-0 select-none pointer-events-none opacity-[0.03]">
           <div className="w-[600px] h-[600px] border border-slate-900 rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-navy-900 leading-[1.15] tracking-tight mb-10 max-w-4xl mx-auto">
            In diligence, a buyer's accountant rebuilds your numbers from scratch and discounts everything they can't trace.
          </h1>
          <p className="font-sans text-xl sm:text-2xl text-slate-600 mb-14 leading-relaxed max-w-3xl mx-auto font-light">
            Impact Surety <span className="text-navy-900 font-medium">verifies the facts of your business</span> against a published standard before you list - so when that moment comes, there's nothing left for them to find.
          </p>
          
          <p className="text-2xl sm:text-3xl font-serif italic text-accent-600 mb-16">
            You walk in already believed.
          </p>

          <div className="flex flex-col items-center gap-8">
            <a 
              href="#demo-factbook"
              className="inline-flex items-center justify-center px-10 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-white bg-navy-900 hover:bg-slate-800 transition-colors"
            >
              See a sample FactBook
            </a>
            
            <div className="flex flex-col items-center gap-4 text-[13px] text-slate-500 max-w-2xl text-center bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="shrink-0 text-accent-500" strokeWidth={1.5} />
                <span className="font-medium text-navy-900">We verify the records you provide against a published standard, and we say exactly where that ends.</span>
              </div>
            </div>
            
            <p className="text-sm font-serif italic text-slate-500 mt-2">
              You decide what's verified and what's disclosed - disclosed first, on your terms.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-32 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[11px] uppercase tracking-widest font-semibold text-accent-500 mb-6">The week-eleven diligence retrade</h2>
          <p className="text-2xl md:text-3xl text-navy-900 leading-snug font-serif tracking-tight">
            When late, unverified facts surface in diligence, trust breaks down. Buyers discount the unknown, and you pay the price for records that weren't proven before you went to market. A home inspection protects a house transaction - but for the business you built, you're expected to cross your fingers and brace for the exam.
          </p>
        </div>
      </section>

      {/* Three Products Section */}
      <section id="products" className="py-32 bg-[#fafaf9] border-b border-slate-200 relative">
        <div className="absolute top-0 left-1/2 -ml-px w-px h-16 bg-accent-500/30"></div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24 mt-8">
            <h2 className="text-4xl font-serif text-navy-900 mb-6 tracking-tight">A verified-truth platform</h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              Truth you can check, action on the checkable, and independent where it counts. We work alongside your advisor, never instead of them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white border-t-2 border-slate-200 hover:border-accent-500 p-10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <FileCheck className="text-accent-500 mb-8" size={32} strokeWidth={1} />
              <h3 className="text-xl font-serif text-navy-900 mb-4 block tracking-tight">FactBook + Certification</h3>
              <p className="text-[15px] text-slate-600 leading-loose font-light">
                <strong className="text-navy-900 font-medium">Truth you can check.</strong> We verify your historical records against a published standard. Every fact is graded and source-linked, establishing completeness and trace to source.
              </p>
            </div>
            
            <div className="bg-white border-t-2 border-slate-200 hover:border-accent-500 p-10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <ArrowRight className="text-accent-500 mb-8" size={32} strokeWidth={1} />
              <h3 className="text-xl font-serif text-navy-900 mb-4 flex flex-col tracking-tight">
                <span>Clawback</span>
                <span className="text-[11px] uppercase tracking-widest font-sans font-medium text-slate-400 mt-2">owner-directed</span>
              </h3>
              <p className="text-[15px] text-slate-600 leading-loose font-light mt-1">
                <strong className="text-navy-900 font-medium">Action on the checkable.</strong> Where waste is a provable fact - like a duplicate payment - we recover and prevent it, entirely at your direction.
              </p>
            </div>

            <div className="bg-white border-t-2 border-slate-200 hover:border-accent-500 p-10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <Database className="text-accent-500 mb-8" size={32} strokeWidth={1} />
              <h3 className="text-xl font-serif text-navy-900 mb-4 block tracking-tight">SpendSentry</h3>
              <p className="text-[15px] text-slate-600 leading-loose font-light">
                <strong className="text-navy-900 font-medium">Continuous verification.</strong> We independently monitor the facts of your payables to keep your records verified and help you run leaner before the transition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Confidentiality / Trust */}
      <section className="py-24 bg-navy-900 text-white relative">
        <div className="absolute inset-0 bg-[#060a10] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <Lock size={32} className="text-accent-400 mx-auto mb-8" strokeWidth={1} />
          <h2 className="text-[11px] uppercase tracking-widest font-semibold text-accent-500 mb-6">
            Confidentiality of process
          </h2>
          <p className="text-slate-300 font-serif italic leading-loose text-2xl md:text-3xl max-w-3xl mx-auto text-balance">
            We work NDA-first. Your identity is protected throughout, and engaging us creates no external signal that your business is for sale. Verification happens privately, on de-identified data; you decide if and when anything is shared.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-[#efefed] border-b border-slate-200/60 pb-40 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-navy-900 tracking-tight">The inspection before you sell</h2>
            <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto font-light leading-relaxed">Explore a sample verification. Every fact is traceable, every condition is disclosed first, and you maintain complete control over scope.</p>
          </div>
          
          <FactBookDemo />
        </div>
      </section>

      {/* Why This Exists */}
      <section className="py-32 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-accent-500">Why this exists</span>
          </div>
          
          <div className="space-y-8 text-xl text-slate-600 font-light leading-loose border-l border-slate-200 pl-8 md:pl-12">
            <p>
              I grew up in Bethlehem, Pennsylvania as the steel mills went down. When the company failed, the pension system protected the men at the top and abandoned the ones who had done the actual work - people who did everything they were told, disbelieved and discarded by a system built that way. I've spent my career since giving smaller companies the tools the largest ones keep for themselves.
            </p>
            
            <p className="text-2xl font-serif text-navy-900 pt-8 mt-12 bg-white relative block">
              I built Impact Surety so the business you gave your life to doesn't have to fight to be believed at the one moment it matters most - when you sell it.
            </p>
          </div>
        </div>
      </section>

      {/* The Exhale */}
      <section className="py-40 bg-[#f8f8f6] border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-navy-900 leading-[1.1] tracking-tight mb-10 max-w-3xl mx-auto">
            When the facts are already proven and sourced, diligence stops being an exam you brace for.
          </h2>
          <p className="text-2xl md:text-3xl text-slate-500 mb-16 font-light">
            There's nothing left to discover, because you disclosed it first, on your terms. 
            <span className="font-serif italic text-accent-600 block mt-6 text-3xl md:text-4xl">You go to market believed.</span>
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-600 bg-white border-t border-slate-200 py-6 px-10 mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-accent-500 shrink-0" strokeWidth={1.5} />
              <span className="font-medium text-navy-900 tracking-wide">We verify the records you provide against a published standard, and we say exactly where that ends.</span>
            </div>
          </div>
        </div>
      </section>

      {/* For Advisors / Brokers */}
      <section id="advisors" className="py-32 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="uppercase tracking-widest text-[11px] font-semibold text-accent-500 mb-6">For M&A Advisors & Brokers</div>
              <h2 className="text-4xl font-serif text-navy-900 mb-8 tracking-tight">Arm your client with verified facts.</h2>
              <p className="text-[17px] text-slate-500 font-light leading-relaxed mb-12">
                You build the narrative; we verify the facts your judgment stands on. We arm you and your client with a verified FactBook, so you control the deal timeline from day one, safe from late-stage retrades.
              </p>
              
              <div className="border border-slate-200 bg-[#fafaf9] p-10 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                  <UserCheck size={140} strokeWidth={1} />
                </div>
                <h3 className="font-serif text-xl text-navy-900 mb-6 flex items-center gap-3 relative z-10 tracking-tight">
                  <UserCheck size={20} className="text-accent-500" strokeWidth={1.5} />
                  Channel Safety
                </h3>
                <p className="text-[15px] text-slate-600 leading-loose font-light relative z-10">
                  We verify facts and conclude nothing. The truth layer never profits from what the facts say, never opines on what they mean, and never competes with the advisor who brought the deal. <strong className="font-medium text-navy-900">We work alongside your advisor, never instead of them.</strong>
                </p>
              </div>

              <a href="#contact" className="text-accent-600 font-[11px] uppercase tracking-widest font-semibold hover:text-navy-900 transition-colors flex items-center gap-3 group">
                Partner with us to verify your next listing <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" strokeWidth={1.5} />
              </a>
            </div>
            
            <div className="bg-navy-900 text-white p-12 lg:p-16 relative shadow-xl overflow-hidden">
               <div className="absolute top-0 right-0 bottom-0 w-1 bg-accent-500" />
               <Building className="text-accent-500/20 w-32 h-32 mb-12" strokeWidth={0.5} />
               <blockquote className="text-2xl md:text-3xl font-serif italic text-slate-200 leading-normal">
                 "A buyer's accountant uses unverified numbers to grind price. When the facts are verified before you list, that leverage disappears."
               </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security FAQ */}
      <section className="py-32 bg-[#fafaf9] border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-[11px] uppercase tracking-widest font-semibold text-accent-500 mb-16 text-center">How your data is handled</h2>
          
          <div className="space-y-16">
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-2xl font-serif text-navy-900 mb-4 tracking-tight">Who sees my raw files?</h3>
              <p className="text-slate-600 font-light leading-relaxed text-lg">
                De-identified on arrival with Microsoft Presidio, run locally; analysis is on anonymized data; access is limited; the raw copy is destroyed after.
              </p>
            </div>
            
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-2xl font-serif text-navy-900 mb-4 tracking-tight">Where does my data live?</h3>
              <p className="text-slate-600 font-light leading-relaxed text-lg">
                Processed privately; not shared with third parties.
              </p>
            </div>
            
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-2xl font-serif text-navy-900 mb-4 tracking-tight">What if something goes wrong?</h3>
              <p className="text-slate-600 font-light leading-relaxed text-lg">
                We work NDA-first and tell you plainly what we do and don't do; we make no assurance claim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="py-32 bg-white text-center border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
          <div className="absolute top-0 left-1/2 -ml-px w-px h-12 bg-accent-500/30 -mt-16"></div>
          <h2 className="text-5xl font-serif text-navy-900 mb-6 tracking-tight">See where your facts stand.</h2>
          <p className="text-xl text-slate-500 mb-12 font-light">A confidential conversation about verifying your records before you sell.</p>
          <a 
            href="mailto:contact@impactsurety.com"
            className="inline-flex items-center justify-center px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-white bg-navy-900 hover:bg-slate-800 transition-all border border-navy-900"
          >
            Contact us securely
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-slate-400 py-24 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-20 bg-[#0a0f18] p-10 md:p-12 border border-slate-800 text-center md:text-left">
            <h4 className="text-[11px] uppercase tracking-widest font-semibold text-accent-500 mb-6 flex items-center justify-center md:justify-start gap-3">
              <Info size={16} strokeWidth={2} />
              Limits of Verification
            </h4>
            <div className="space-y-6 text-sm font-light leading-loose">
              <p>
                <strong className="text-slate-200 font-medium tracking-wide">Census means provided records, not reality.</strong> <span className="inline-block ml-1 text-slate-500 italic font-serif">Gloss: Census means every record you give us - not a sample.</span>
              </p>
              <p className="text-slate-400">
                We verify 100% of the records you provide and the sources you authorize - establishing their completeness, consistency, and traceability to source. We are not a fraud examination and not an assurance opinion. Stating this limit is the boundary that makes everything inside it checkable.
              </p>
              <p className="text-slate-500 pt-6 border-t border-slate-800/50 italic font-serif">
                We verify facts and conclude nothing. Advisory, not a reliance opinion.
              </p>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px] uppercase tracking-widest font-semibold">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 border border-slate-600 rotate-45"></div>
              <span>&copy; {new Date().getFullYear()} Impact Surety. All rights reserved.</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-accent-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent-500 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
