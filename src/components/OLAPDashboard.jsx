import React, { useState } from 'react';
import { BarChart3, PieChart, Filter, ArrowUpRight, ShieldCheck, ShieldAlert, Lock, Database, Search } from 'lucide-react';
import { WAREHOUSE_METRICS, TLD_DISTRIBUTION, CORE_FACTS_COMPARISON } from '../data/sampleData';

export default function OLAPDashboard() {
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

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>TỔNG SỐ URL TRONG KHO</span>
            <Database className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {WAREHOUSE_METRICS.totalRecords.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium mt-3">
            <span>Tốc độ ETL: {WAREHOUSE_METRICS.etlThroughputRowsPerSec.toLocaleString()} dòng/s</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>WEB HỢP PHÁP (LEGITIMATE)</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {WAREHOUSE_METRICS.legitimatePct}%
          </div>
          <div className="text-xs text-slate-400 font-medium mt-3">
            {WAREHOUSE_METRICS.legitimateCount.toLocaleString()} URLs • Nhãn 1 (Safe)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>WEB LỪA ĐẢO (PHISHING)</span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400 font-mono">
            {WAREHOUSE_METRICS.phishingPct}%
          </div>
          <div className="text-xs text-slate-400 font-medium mt-3">
            {WAREHOUSE_METRICS.phishingCount.toLocaleString()} URLs • Nhãn 0 (Risk)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>NGHỊCH LÝ HTTPS</span>
            <Lock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {WAREHOUSE_METRICS.httpsParadoxPct}%
          </div>
          <div className="text-xs text-slate-400 font-medium mt-3">
            Web phishing vẫn có ổ khóa SSL/HTTPS
          </div>
        </div>

      </div>

      {/* 2 Core Facts Comparison Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              So Sánh Thực Nghiệm 2 Fact Đo Lường Cốt Lõi Trong Star Schema
            </h2>
            <p className="text-xs text-slate-400">
              Dữ liệu tổng hợp từ truy vấn SQL Server OLAP trên 235.795 bản ghi Fact_Phishing_Analysis
            </p>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg self-start">
            Quyết định 59.36% sức mạnh AI
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Fact 1 Comparison Card */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Fact 1: URLSimilarityIndex (0 - 100)
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">Giảm 50.87 điểm</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Web Hợp pháp (Legitimate)</span>
                  <span className="font-mono font-bold text-emerald-400">100.0 điểm</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Web Lừa đảo (Phishing)</span>
                  <span className="font-mono font-bold text-red-400">49.13 điểm</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[49.13%]"></div>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              💡 <b>Ý nghĩa nghiệp vụ:</b> Website hợp pháp luôn giữ tên miền nguyên bản (100 điểm). Ngược lại, kẻ lừa đảo thường biến dạng ký tự, chèn từ khóa phụ làm điểm tương đồng tụt xuống còn 49.1.
            </p>
          </div>

          {/* Fact 2 Comparison Card */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Fact 2: NoOfExternalRef (Số Link Ngoài)
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">Chênh lệch 75 lần</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Web Hợp pháp (Legitimate)</span>
                  <span className="font-mono font-bold text-emerald-400">85.29 liên kết</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Web Lừa đảo (Phishing)</span>
                  <span className="font-mono font-bold text-red-400">1.13 liên kết</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full w-[2%]"></div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              💡 <b>Ý nghĩa nghiệp vụ:</b> Web hợp pháp có mạng lưới liên kết dày đặc với cộng đồng mạng (85 link). Web phishing chỉ là các trang bẫy dựng vội, bị cô lập hoàn toàn (trung bình chỉ 1 link ngoài).
            </p>
          </div>

        </div>
      </div>

      {/* TLD Attack Distribution & Interactive Slicer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Phân Bố Tỷ Lệ Lừa Đảo Theo Đuôi Tên Miền (TLD Roll-up)
            </h2>
            <p className="text-xs text-slate-400">
              Phép toán OLAP Roll-up từ từng URL lên cấp độ đuôi tên miền
            </p>
          </div>

          {/* Slicer Pill Buttons */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">Lọc TLD:</span>
            {['ALL', '.com', '.org', '.app', '.xyz'].map(tld => (
              <button
                key={tld}
                onClick={() => setSelectedTLD(tld)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border transition-colors cursor-pointer ${
                  selectedTLD === tld
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
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
              <div key={idx} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-base font-extrabold text-white">{item.tld}</span>
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    item.rate > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    item.rate > 40 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.rate}% Lừa đảo
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2">
                  Tổng mẫu: <b className="text-white font-mono">{item.total.toLocaleString()}</b>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.rate > 80 ? 'bg-red-500' : item.rate > 40 ? 'bg-amber-500' : 'bg-emerald-500'
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Trích Xuất Dữ Liệu Bảng Fact_Phishing_Analysis (SQL Server Staging)
            </h2>
            <p className="text-xs text-slate-400">
              Kiểm tra trực tiếp các dòng bản ghi đại diện đã qua luồng Pentaho ETL
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm domain..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">FactID</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">TLD</th>
                <th className="py-2.5 px-3">Giao thức</th>
                <th className="py-2.5 px-3 text-right">Fact 1 (Sim)</th>
                <th className="py-2.5 px-3 text-right">Fact 2 (ExtRef)</th>
                <th className="py-2.5 px-3 text-center">Nhãn (Label)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 font-bold">{r.id}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{r.domain}</td>
                  <td className="py-2.5 px-3 text-blue-400">{r.tld}</td>
                  <td className="py-2.5 px-3">
                    {r.https ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <Lock className="h-3 w-3" />
                        <span>HTTPS</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">HTTP</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold">{r.sim}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{r.ext}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
