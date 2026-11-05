import React, { useState } from 'react';
import { Box, Code2, ArrowDownRight, Layers, Filter, CheckCircle2, Copy, Terminal } from 'lucide-react';

export default function OLAPCube() {
  const [activeOp, setActiveOp] = useState('rollup');
  const [copied, setCopied] = useState(false);

  const operations = [
    {
      id: 'rollup',
      title: '1. Roll-up (Aggregation)',
      subtitle: 'Roll up from URL grain to Domain & TLD dimension',
      explanation: 'Roll-up collapses granular URL measures into higher dimension hierarchies (TLD: .com, .org, .app...) to identify structural patterns across internet registries.',
      sql: `-- SCENARIO 1: OLAP ROLL-UP BY TOP-LEVEL DOMAIN (TLD)
SELECT 
    d.TLD,
    COUNT(f.FactID) AS TotalURLs,
    SUM(CASE WHEN f.LabelKey = 0 THEN 1 ELSE 0 END) AS PhishingCount,
    CAST(ROUND(SUM(CASE WHEN f.LabelKey = 0 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 2) AS NUMERIC(5,2)) AS PhishingRate_Pct,
    ROUND(AVG(f.URLSimilarityIndex), 2) AS Avg_URLSimilarityIndex,
    ROUND(AVG(f.NoOfExternalRef), 2) AS Avg_NoOfExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Domain d ON f.DomainKey = d.DomainKey
GROUP BY d.TLD
HAVING COUNT(f.FactID) > 1000
ORDER BY PhishingCount DESC;`,
      tableHeaders: ['TLD', 'Total URLs', 'Phishing Count', 'Phishing Rate (%)', 'Fact 1 (Avg Sim)', 'Fact 2 (Avg ExtRef)'],
      tableData: [
        ['.com', '135,400', '58,200', '42.98%', '68.4', '42.1'],
        ['.org', '24,120', '3,100', '12.85%', '92.1', '68.5'],
        ['.net', '15,300', '7,200', '47.06%', '62.7', '35.4'],
        ['.app', '9,200', '8,100', '88.04%', '51.2', '2.8'],
        ['.xyz', '4,900', '4,400', '89.80%', '49.8', '1.4']
      ]
    },
    {
      id: 'slice',
      title: '2. Slice (Single Dimension Cut)',
      subtitle: 'Fix security dimension cut: IsHTTPS = 1',
      explanation: 'Slice isolates a single dimension value (Security: IsHTTPS = 1) to quantitatively expose the "HTTPS Paradox": 49.2% of modern phishing domains possess legitimate SSL certificates.',
      sql: `-- SCENARIO 2: OLAP SLICE - HTTPS PARADOX INSPECTION
SELECT 
    l.LabelName,
    COUNT(f.FactID) AS TotalURLs,
    CAST(ROUND(COUNT(f.FactID) * 100.0 / 235795, 2) AS NUMERIC(5,2)) AS Percentage,
    ROUND(AVG(f.URLSimilarityIndex), 2) AS Avg_SimilarityIndex,
    ROUND(AVG(f.NoOfExternalRef), 2) AS Avg_ExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Security_Feature s ON f.SecurityKey = s.SecurityKey
JOIN dbo.Dim_Label l ON f.LabelKey = l.LabelKey
WHERE s.IsHTTPS = 1  -- FIXED SLICE CONSTRAINT
GROUP BY l.LabelName;`,
      tableHeaders: ['Label Classification', 'URLs with HTTPS', 'DW Share (%)', 'Fact 1: Similarity', 'Fact 2: External Ref'],
      tableData: [
        ['Legitimate (Safe)', '134,850', '57.19%', '100.0', '85.29'],
        ['Phishing (Threat)', '49,664', '21.06%', '52.1', '1.85']
      ]
    },
    {
      id: 'drilldown',
      title: '3. Drill-down (Decomposition)',
      subtitle: 'Decompose into Financial Categories & Password Forms',
      explanation: 'Drill-down traverses from coarse-grained categories to granular attributes (Bank, Pay, Crypto) combined with credential harvesting indicators (HasPasswordField = 1, HasExternalFormSubmit = 1).',
      sql: `-- SCENARIO 3: OLAP DRILL-DOWN INTO FINANCIAL TARGETS
SELECT 
    fin.FinancialCategory,
    sec.HasPasswordField,
    sec.HasExternalFormSubmit,
    COUNT(*) AS HighRisk_URLs,
    ROUND(AVG(f.URLSimilarityIndex), 2) AS Avg_Similarity,
    ROUND(AVG(f.NoOfExternalRef), 2) AS Avg_ExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Financial_Keyword fin ON f.FinancialKey = fin.FinancialKey
JOIN dbo.Dim_Security_Feature sec ON f.SecurityKey = sec.SecurityKey
WHERE f.LabelKey = 0 -- Filter Threat Rows
GROUP BY fin.FinancialCategory, sec.HasPasswordField, sec.HasExternalFormSubmit
ORDER BY HighRisk_URLs DESC;`,
      tableHeaders: ['Financial Target', 'Password Form', 'External Form Submit', 'High-Risk URLs', 'Fact 1: Similarity', 'Fact 2: ExtRef'],
      tableData: [
        ['Banking Fake (Bank)', 'Yes (1)', 'Yes (1)', '14,820', '48.9', '0.8'],
        ['Payment Gateway (Pay)', 'Yes (1)', 'Yes (1)', '9,410', '47.5', '1.1'],
        ['Cryptocurrency (Crypto)', 'Yes (1)', 'No (0)', '4,320', '51.0', '1.3'],
        ['E-Commerce', 'Yes (1)', 'Yes (1)', '6,150', '54.2', '2.4']
      ]
    },
    {
      id: 'dice',
      title: '4. Dice (Multidimensional Sub-cube)',
      subtitle: 'Intersection: TLD .com + Password Form + Phishing Label',
      explanation: 'Dice extracts a restricted sub-cube satisfying multiple bounding constraints across orthogonal dimensions simultaneously.',
      sql: `-- SCENARIO 4: OLAP DICE - EXTRACTING CRITICAL SUB-CUBE
SELECT 
    d.Domain,
    f.URL,
    f.URLSimilarityIndex,
    f.NoOfExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Domain d ON f.DomainKey = d.DomainKey
JOIN dbo.Dim_Security_Feature s ON f.SecurityKey = s.SecurityKey
WHERE d.TLD = 'com'               -- Dim 1: TLD .com
  AND s.HasPasswordField = 1      -- Dim 2: Password Form
  AND f.LabelKey = 0              -- Dim 3: Phishing Label
ORDER BY f.URLSimilarityIndex ASC;`,
      tableHeaders: ['Domain', 'Credential Harvesting URL', 'Fact 1 (Sim)', 'Fact 2 (ExtRef)', 'Risk Tier'],
      tableData: [
        ['paypal-security-auth.com', 'http://paypal-security-auth.com/login', '48.0', '0.0', 'CRITICAL RISK'],
        ['chase-online-verify.com', 'http://chase-online-verify.com/signin', '46.5', '1.0', 'CRITICAL RISK'],
        ['netflix-payment-update.com', 'http://netflix-payment-update.com/user', '51.0', '0.0', 'CRITICAL RISK'],
        ['wellsfargo-secure-auth.com', 'http://wellsfargo-secure-auth.com/auth', '47.0', '1.0', 'CRITICAL RISK']
      ]
    }
  ];

  const current = operations.find(o => o.id === activeOp) || operations[0];

  const handleCopySQL = () => {
    navigator.clipboard.writeText(current.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>OLAP MULTIDIMENSIONAL CUBE</span>
            <span>/</span>
            <span>KIMBALL STAR SCHEMA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            4 Core OLAP Cube Operations
          </h1>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Dimensional Slice & Roll-up Testing
        </div>
      </div>

      {/* Operations Selector Card */}
      <div className="linear-card p-6">
        <h2 className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">
          Select OLAP Cube Operation
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Demonstrate multidimensional analytical queries on Kimball Star Schema in SQL Server.
        </p>

        {/* 4 Operations Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {operations.map(op => {
            const isActive = activeOp === op.id;
            return (
              <button
                key={op.id}
                onClick={() => setActiveOp(op.id)}
                className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.1] border-white/20 text-white shadow-sm'
                    : 'bg-[#0C0D12] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {op.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
                  {op.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operation Detail Box */}
      <div className="linear-card p-6 space-y-5">
        
        {/* Explanation */}
        <div className="p-4 bg-[#0C0D12] border border-white/5 rounded-lg">
          <div className="text-[11px] font-mono uppercase font-semibold text-slate-400 mb-1">
            Operational Logic & Business Context:
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {current.explanation}
          </p>
        </div>

        {/* Results Table */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              OLAP Cube Execution Result Set
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">
              ✓ Executed via Indexed View (0.08s)
            </span>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0C0D12] text-slate-400 border-b border-white/10">
                <tr>
                  {current.tableHeaders.map((h, i) => (
                    <th key={i} className="py-2.5 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {current.tableData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3 whitespace-nowrap">
                        {cell.includes('%') ? (
                          <span className="font-semibold text-amber-400">{cell}</span>
                        ) : cell === 'CRITICAL RISK' ? (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-semibold">
                            {cell}
                          </span>
                        ) : cIdx === 0 ? (
                          <span className="font-semibold text-white">{cell}</span>
                        ) : (
                          <span>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generated T-SQL Query */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5 font-mono">
              <Code2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Corresponding T-SQL Statement (SSMS):</span>
            </span>

            <button
              onClick={handleCopySQL}
              className="px-2.5 py-1 bg-[#141720] hover:bg-[#1A1F2C] text-slate-200 rounded border border-white/10 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-slate-400" />
                  <span>Copy SQL</span>
                  <kbd className="bg-white/10 text-slate-300 border-white/10">⌘C</kbd>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-[#0C0D12] border border-white/10 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {current.sql}
          </pre>
        </div>

      </div>

    </div>
  );
}
