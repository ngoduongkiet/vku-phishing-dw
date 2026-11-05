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
  ArrowRight,
  Sparkles
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

      {/* Top Banner / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              OLAP ANALYTICS ENGINE
            </span>
            <span className="text-xs text-slate-500 font-mono">SQL SERVER 2019 • KIMBALL STAR SCHEMA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Trung Tâm Phân Tích Dữ Liệu OLAP Đa Chiều
          </h1>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Indexed View:</span>
            <span className="text-emerald-400 font-bold">{WAREHOUSE_METRICS.sqlServerIndexedViewSpeedup} Speedup</span>
          </div>
        </div>
      </div>

      {/* 4 Modernized KPI Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Warehouse Rows */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="tracking-wider uppercase text-[11px] font-mono">TỔNG BẢN GHI KHO DW</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {totalRows.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono mt-3">
            <Zap className="h-3 w-3" />
            <span>ETL Throughput: {WAREHOUSE_METRICS.etlThroughputRowsPerSec.toLocaleString()} dòng/s</span>
          </div>
        </div>

        {/* Card 2: Legitimate URLs */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="tracking-wider uppercase text-[11px] font-mono">WEB HỢP PHÁP (LEGIT)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {WAREHOUSE_METRICS.legitimatePct}%
          </div>
          <div className="text-xs text-slate-400 font-mono mt-3">
            {WAREHOUSE_METRICS.legitimateCount.toLocaleString()} URLs • <span className="text-emerald-400 font-bold">Label 1 (Safe)</span>
          </div>
        </div>

        {/* Card 3: Phishing URLs */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="tracking-wider uppercase text-[11px] font-mono">WEB LỪA ĐẢO (PHISH)</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-400 font-mono tracking-tight">
            {WAREHOUSE_METRICS.phishingPct}%
          </div>
          <div className="text-xs text-slate-400 font-mono mt-3">
            {WAREHOUSE_METRICS.phishingCount.toLocaleString()} URLs • <span className="text-red-400 font-bold">Label 0 (Threat)</span>
          </div>
        </div>

        {/* Card 4: HTTPS Paradox */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span className="tracking-wider uppercase text-[11px] font-mono">NGHỊCH LÝ HTTPS SSL</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
            {WAREHOUSE_METRICS.httpsParadoxPct}%
          </div>
          <div className="text-xs text-slate-400 font-medium mt-3">
            49.2% website phishing đã có chứng chỉ SSL xanh
          </div>
        </div>

      </div>

      {/* 2 Core Facts Comparison Visualizer */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                KIMBALL CORE MEASURES
              </span>
              <span className="text-xs text-slate-500 font-mono">FACT TABLE TELEMETRY</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Phân Tích Đối Sánh 2 Fact Đo Lường Cốt Lõi Trong Star Schema
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dữ liệu tổng hợp từ truy vấn SQL Server OLAP trên {totalRows.toLocaleString()} bản ghi <code className="text-cyan-400 font-mono">dbo.Fact_Phishing_Analysis</code>
            </p>
          </div>
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-xl self-start flex items-center space-x-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Đóng góp 59.36% trọng số AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Fact 1 Comparison Card */}
          <div className="bg-slate-950/70 border border-white/[0.08] p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  FACT 1 • MEASURE TRỌNG TÂM (36.9% AI)
                </span>
                <span className="text-base font-extrabold text-white">
                  URLSimilarityIndex (0 - 100 Điểm)
                </span>
              </div>
              <span className="text-xs font-mono text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">
                Tụt dốc -50.87 điểm
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Website Hợp pháp (Legitimate)</span>
                  <span className="font-bold text-emerald-400">100.0 điểm</span>
                </div>
                <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full animate-shimmer"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Website Lừa đảo (Phishing)</span>
                  <span className="font-bold text-red-400">49.13 điểm</span>
                </div>
                <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full w-[49.13%]"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-white/[0.05] text-[11px] text-slate-400 leading-relaxed font-sans">
              💡 <b className="text-slate-200">Ý nghĩa nghiệp vụ:</b> Website chính thống luôn duy trì đúng tên thương hiệu nguyên bản (100 điểm). Ngược lại, kẻ tấn công phải biến dạng ký tự, chèn từ khóa phụ làm điểm tụt sâu xuống 49.13.
            </div>
          </div>

          {/* Fact 2 Comparison Card */}
          <div className="bg-slate-950/70 border border-white/[0.08] p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  FACT 2 • MEASURE LIÊN KẾT (22.5% AI)
                </span>
                <span className="text-base font-extrabold text-white">
                  NoOfExternalRef (Số Liên Kết Ngoài)
                </span>
              </div>
              <span className="text-xs font-mono text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">
                Chênh lệch 75 lần
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Website Hợp pháp (Legitimate)</span>
                  <span className="font-bold text-emerald-400">85.29 liên kết</span>
                </div>
                <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full animate-shimmer"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-400">Website Lừa đảo (Phishing)</span>
                  <span className="font-bold text-red-400">1.13 liên kết</span>
                </div>
                <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full w-[2.5%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-white/[0.05] text-[11px] text-slate-400 leading-relaxed font-sans">
              💡 <b className="text-slate-200">Ý nghĩa nghiệp vụ:</b> Web hợp pháp có mạng lưới backlink dày đặc (85.29 link). Web phishing chỉ là trang bẫy dựng vội để đánh cắp thông tin, cô lập hoàn toàn (trung bình chỉ 1.13 link ngoài).
            </div>
          </div>

        </div>
      </div>

      {/* TLD Attack Distribution & Interactive Slicer */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                OLAP ROLL-UP OPERATION
              </span>
              <span className="text-xs text-slate-500 font-mono">DIM_DOMAIN AGGREGATION</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Phân Bố Tỷ Lệ Lừa Đảo Theo Đuôi Tên Miền (TLD Roll-up)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Phép toán OLAP Roll-up từ từng URL chi tiết lên cấp độ đuôi tên miền (TLD)
            </p>
          </div>

          {/* Slicer Pill Buttons */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold font-mono">Lọc TLD:</span>
            {['ALL', '.com', '.org', '.app', '.xyz'].map(tld => (
              <button
                key={tld}
                onClick={() => setSelectedTLD(tld)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                  selectedTLD === tld
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tld}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TLD_DISTRIBUTION
            .filter(item => selectedTLD === 'ALL' || item.tld === selectedTLD)
            .map((item, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-white/[0.08] p-4 rounded-xl hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-base font-extrabold text-white">{item.tld}</span>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                    item.rate > 80 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    item.rate > 40 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.rate}% Lừa đảo
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2 font-mono">
                  Tổng mẫu: <b className="text-white">{item.total.toLocaleString()}</b>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/[0.05]">
                  <div
                    className={`h-full rounded-full ${
                      item.rate > 80 ? 'bg-gradient-to-r from-red-600 to-rose-400' : 
                      item.rate > 40 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 
                      'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>Phish: {item.phishing.toLocaleString()}</span>
                  <span>Legit: {item.legit.toLocaleString()}</span>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Fact Table Live Browser */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                STAGING DATA INSPECTOR
              </span>
              <span className="text-xs text-slate-500 font-mono">LIVE ROW SAMPLER</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Trích Xuất Dữ Liệu Bảng Fact_Phishing_Analysis (SQL Server)
            </h2>
            <p className="text-xs text-slate-400">
              Kiểm tra trực tiếp các dòng bản ghi đại diện đã qua luồng Pentaho Data Integration ETL
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm domain URL..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-3.5">FactID</th>
                <th className="py-3 px-3.5">Domain</th>
                <th className="py-3 px-3.5">TLD</th>
                <th className="py-3 px-3.5">Giao thức</th>
                <th className="py-3 px-3.5 text-right">Fact 1 (Sim)</th>
                <th className="py-3 px-3.5 text-right">Fact 2 (ExtRef)</th>
                <th className="py-3 px-3.5 text-center">Nhãn (Label)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              {filteredRows.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-2.5 px-3.5 text-slate-500 font-bold">#{r.id}</td>
                  <td className="py-2.5 px-3.5 text-white font-medium">{r.domain}</td>
                  <td className="py-2.5 px-3.5 text-cyan-400 font-bold">{r.tld}</td>
                  <td className="py-2.5 px-3.5">
                    {r.https ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>HTTPS</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">HTTP</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-white">{r.sim}</td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-white">{r.ext}</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      r.label.includes('1')
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
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
