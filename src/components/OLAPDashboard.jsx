import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Database, 
  Search,
  Activity,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WAREHOUSE_METRICS, TLD_DISTRIBUTION, CORE_FACTS_COMPARISON } from '../data/sampleData';

export default function OLAPDashboard({ totalRows = 235795 }) {
  const [selectedTLD, setSelectedTLD] = useState('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample fact rows from warehouse
  const sampleFactRows = [
    { id: 1, domain: 'www.southbankmosaics.com', tld: '.com', https: true, sim: 100, ext: 124, label: 'Legitimate (1)' },
    { id: 2, domain: 'www.uni-mainz.de', tld: '.de', https: true, sim: 100, ext: 217, label: 'Legitimate (1)' },
    { id: 3, domain: 'www.voicefmradio.co.uk', tld: '.uk', https: true, sim: 100, ext: 5, label: 'Legitimate (1)' },
    { id: 12, domain: 'www.teramill.com', tld: '.com', https: false, sim: 82, ext: 1, label: 'Phishing (0)' },
    { id: 15, domain: 'f0519141.xsph.ru', tld: '.ru', https: false, sim: 45, ext: 0, label: 'Phishing (0)' },
    { id: 19, domain: 'paypal-security-update.tk', tld: '.tk', https: true, sim: 48, ext: 1, label: 'Phishing (0)' },
    { id: 24, domain: 'vku.udn.vn', tld: '.vn', https: true, sim: 100, ext: 95, label: 'Legitimate (1)' },
    { id: 31, domain: 'techcombank-login-otp.xyz', tld: '.xyz', https: true, sim: 49, ext: 0, label: 'Phishing (0)' },
    { id: 45, domain: 'shopee.vn', tld: '.vn', https: true, sim: 100, ext: 180, label: 'Legitimate (1)' },
    { id: 52, domain: 'vcb-xac-thuc-smart-otp.online', tld: '.online', https: true, sim: 46, ext: 0, label: 'Phishing (0)' },
  ];

  const filteredRows = sampleFactRows.filter(r => {
    if (selectedTLD !== 'ALL' && r.tld !== selectedTLD) return false;
    if (selectedProtocol === 'HTTPS' && !r.https) return false;
    if (selectedProtocol === 'HTTP' && r.https) return false;
    if (searchTerm && !r.domain.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>OLAP ANALYTICS ENGINE</span>
            <span>/</span>
            <span>KIMBALL STAR SCHEMA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Multidimensional OLAP Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#12141C] border border-white/10 text-slate-300">
            Indexed View Speedup: <b className="text-emerald-400">{WAREHOUSE_METRICS.sqlServerIndexedViewSpeedup}</b>
          </span>
        </div>
      </div>

      {/* 4 Linear KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Warehouse Rows */}
        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span className="uppercase text-[10px]">TOTAL WAREHOUSE ROWS</span>
            <Database className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            {totalRows.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-3">
            ETL Throughput: <span className="text-slate-200 font-semibold">{WAREHOUSE_METRICS.etlThroughputRowsPerSec.toLocaleString()} rows/s</span>
          </div>
        </div>

        {/* Card 2: Legitimate URLs */}
        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span className="uppercase text-[10px]">LEGITIMATE RATIO</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight">
            {WAREHOUSE_METRICS.legitimatePct}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-3">
            {WAREHOUSE_METRICS.legitimateCount.toLocaleString()} URLs • <span className="text-emerald-400">Label 1 (Safe)</span>
          </div>
        </div>

        {/* Card 3: Phishing URLs */}
        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span className="uppercase text-[10px]">PHISHING RATIO</span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-red-400 tracking-tight">
            {WAREHOUSE_METRICS.phishingPct}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-3">
            {WAREHOUSE_METRICS.phishingCount.toLocaleString()} URLs • <span className="text-red-400">Label 0 (Threat)</span>
          </div>
        </div>

        {/* Card 4: HTTPS Paradox */}
        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span className="uppercase text-[10px]">HTTPS PARADOX</span>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tracking-tight">
            {WAREHOUSE_METRICS.httpsParadoxPct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            49.2% of phishing links have valid SSL certificates
          </div>
        </div>

      </div>

      {/* 2 Core Facts Comparison Visualizer */}
      <div className="linear-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Experimental Comparison of 2 Core Fact Measures
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Aggregated across {totalRows.toLocaleString()} rows in <code className="text-slate-200">dbo.Fact_Phishing_Analysis</code>
            </p>
          </div>
          <div className="px-2.5 py-1 bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-mono rounded self-start">
            59.36% Total AI Feature Importance
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Fact 1 */}
          <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  FACT 1 • WEIGHT: 36.9%
                </span>
                <span className="text-sm font-bold text-white">
                  URLSimilarityIndex (0 - 100)
                </span>
              </div>
              <span className="text-xs font-mono text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded">
                Variance: -50.87
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">Legitimate Baseline</span>
                  <span className="font-semibold text-emerald-400">100.0</span>
                </div>
                <div className="h-2 w-full bg-[#161822] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">Phishing Baseline</span>
                  <span className="font-semibold text-red-400">49.13</span>
                </div>
                <div className="h-2 w-full bg-[#161822] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[49.13%]"></div>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-white/5 leading-relaxed font-sans">
              Authentic brands preserve exact naming (100.0). Attackers distort characters or inject sub-keywords, dropping similarity score to 49.13.
            </p>
          </div>

          {/* Fact 2 */}
          <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">
                  FACT 2 • WEIGHT: 22.5%
                </span>
                <span className="text-sm font-bold text-white">
                  NoOfExternalRef (External Backlinks)
                </span>
              </div>
              <span className="text-xs font-mono text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded">
                75.5x Difference
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">Legitimate Baseline</span>
                  <span className="font-semibold text-emerald-400">85.29 links</span>
                </div>
                <div className="h-2 w-full bg-[#161822] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">Phishing Baseline</span>
                  <span className="font-semibold text-red-400">1.13 links</span>
                </div>
                <div className="h-2 w-full bg-[#161822] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[2.5%]"></div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-white/5 leading-relaxed font-sans">
              Legitimate domains maintain high community citations (85.29). Disposable phishing bait pages are isolated (average 1.13 external citations).
            </p>
          </div>

        </div>
      </div>

      {/* TLD Attack Distribution & Interactive Slicer */}
      <div className="linear-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Phishing Attack Distribution by TLD (OLAP Roll-up)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Aggregated from URL grain to Top-Level Domain dimension
            </p>
          </div>

          {/* Slicer Pill Buttons */}
          <div className="flex items-center space-x-1.5 text-xs font-mono">
            <span className="text-slate-500">TLD Filter:</span>
            {['ALL', '.com', '.org', '.app', '.xyz'].map(tld => (
              <button
                key={tld}
                onClick={() => setSelectedTLD(tld)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  selectedTLD === tld
                    ? 'bg-white text-slate-950 font-bold'
                    : 'bg-[#0E1017] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tld}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TLD_DISTRIBUTION
            .filter(item => selectedTLD === 'ALL' || item.tld === selectedTLD)
            .map((item, idx) => (
              <div key={idx} className="p-3.5 bg-[#0C0D12] border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-white">{item.tld}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    item.rate > 80 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    item.rate > 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {item.rate}% Phish
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mb-1.5 font-mono">
                  Sample: <span className="text-white font-medium">{item.total.toLocaleString()}</span>
                </div>

                <div className="w-full bg-[#161822] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.rate > 80 ? 'bg-red-500' : 
                      item.rate > 40 ? 'bg-amber-500' : 
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                  <span>Phish: {item.phishing.toLocaleString()}</span>
                  <span>Legit: {item.legit.toLocaleString()}</span>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Fact Table Staging Inspector */}
      <div className="linear-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Fact_Phishing_Analysis Live Table Inspector
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Sample records processed through Pentaho Data Integration pipeline
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter domain..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0C0D12] border border-white/10 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0C0D12] text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">FactID</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">TLD</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3 text-right">Fact 1 (Sim)</th>
                <th className="py-2.5 px-3 text-right">Fact 2 (ExtRef)</th>
                <th className="py-2.5 px-3 text-center">Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filteredRows.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 text-slate-500 font-medium">#{r.id}</td>
                  <td className="py-2 px-3 text-white font-medium">{r.domain}</td>
                  <td className="py-2 px-3 text-slate-300">{r.tld}</td>
                  <td className="py-2 px-3">
                    {r.https ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>HTTPS</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">HTTP</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-white">{r.sim}</td>
                  <td className="py-2 px-3 text-right font-semibold text-white">{r.ext}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      r.label.includes('1')
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {r.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
