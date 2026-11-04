import React, { useState } from 'react';
import { Box, Code2, ArrowDownRight, Layers, Filter, CheckCircle2, Copy } from 'lucide-react';

export default function OLAPCube() {
  const [activeOp, setActiveOp] = useState('rollup');
  const [copied, setCopied] = useState(false);

  const operations = [
    {
      id: 'rollup',
      title: '1. Roll-up (Cuộn gộp)',
      subtitle: 'Tổng hợp từ cấp URL chi tiết lên cấp Tên miền & TLD',
      explanation: 'Phép toán thu gọn các chiều dữ liệu chi tiết (Grain URL) lên mức tổng hợp cao hơn (TLD: .com, .org, .app...) để phân tích bức tranh tổng thể về các đuôi mạng bị lợi dụng nhiều nhất.',
      sql: `-- KỊCH BẢN 1: PHÉP TOÁN ROLL-UP THEO ĐUÔI TÊN MIỀN (TLD)
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
      tableHeaders: ['Đuôi TLD', 'Tổng số URL', 'Số lượng Lừa đảo', 'Tỷ lệ Lừa đảo (%)', 'Fact 1 (Sim TB)', 'Fact 2 (ExtRef TB)'],
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
      title: '2. Slice (Cắt lát)',
      subtitle: 'Cắt một lát cắt cố định theo Chiều Bảo Mật (IsHTTPS = 1)',
      explanation: 'Phép toán cố định giá trị của một chiều duy nhất (SecurityKey: IsHTTPS = 1) nhằm vạch trần "Nghịch lý HTTPS": Kẻ lừa đảo hiện nay vẫn sở hữu chứng chỉ bảo mật xanh để đánh lừa tâm lý người dùng.',
      sql: `-- KỊCH BẢN 2: PHÉP TOÁN SLICE - NGHỊCH LÝ HTTPS
SELECT 
    l.LabelName,
    COUNT(f.FactID) AS TotalURLs,
    CAST(ROUND(COUNT(f.FactID) * 100.0 / 235795, 2) AS NUMERIC(5,2)) AS Percentage,
    ROUND(AVG(f.URLSimilarityIndex), 2) AS Avg_SimilarityIndex,
    ROUND(AVG(f.NoOfExternalRef), 2) AS Avg_ExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Security_Feature s ON f.SecurityKey = s.SecurityKey
JOIN dbo.Dim_Label l ON f.LabelKey = l.LabelKey
WHERE s.IsHTTPS = 1  -- CỐ ĐỊNH LÁT CẮT SLICE
GROUP BY l.LabelName;`,
      tableHeaders: ['Phân Loại Nhãn', 'Số lượng URL có HTTPS', 'Tỷ lệ trong kho (%)', 'Fact 1: URL Similarity', 'Fact 2: External Ref'],
      tableData: [
        ['Hợp pháp (Legitimate)', '134,850', '57.19%', '100.0', '85.29'],
        ['Lừa đảo (Phishing)', '49,664', '21.06%', '52.1', '1.85']
      ]
    },
    {
      id: 'drilldown',
      title: '3. Drill-down (Khoan sâu)',
      subtitle: 'Khoan sâu vào các mục tiêu Ngân hàng, Cổng thanh toán & Tiền ảo',
      explanation: 'Phép toán phân rã chi tiết từ mức cao xuống mức thuộc tính chuyên sâu (Bank = 1, Pay = 1, Crypto = 1) kết hợp với hành vi thu thập mật khẩu (HasPasswordField = 1) và gửi form sang server ngoài (HasExternalFormSubmit = 1).',
      sql: `-- KỊCH BẢN 3: PHÉP TOÁN DRILL-DOWN VÀO MỤC TIÊU TÀI CHÍNH
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
WHERE f.LabelKey = 0 -- Chỉ xét Web Lừa Đảo
GROUP BY fin.FinancialCategory, sec.HasPasswordField, sec.HasExternalFormSubmit
ORDER BY HighRisk_URLs DESC;`,
      tableHeaders: ['Mục Tiêu Tài Chính', 'Chứa Form Pass', 'Gửi Form Ngoài', 'Số URL Độc Hại', 'Fact 1: Similarity', 'Fact 2: ExtRef'],
      tableData: [
        ['Giả mạo Ngân Hàng (Bank)', 'Có (1)', 'Có (1)', '14,820', '48.9', '0.8'],
        ['Cổng Thanh Toán (Pay)', 'Có (1)', 'Có (1)', '9,410', '47.5', '1.1'],
        ['Tiền Mã Hóa (Crypto)', 'Có (1)', 'Không (0)', '4,320', '51.0', '1.3'],
        ['Thương mại điện tử', 'Có (1)', 'Có (1)', '6,150', '54.2', '2.4']
      ]
    },
    {
      id: 'dice',
      title: '4. Dice (Cắt khối đa chiều)',
      subtitle: 'Lọc giao nhau giữa 3 chiều: TLD .com + Form Mật khẩu + Nhãn Phishing',
      explanation: 'Phép toán trích xuất một khối con (sub-cube) thỏa mãn đồng thời nhiều điều kiện ràng buộc trên nhiều chiều không gian độc lập.',
      sql: `-- KỊCH BẢN 4: PHÉP TOÁN DICE - TRÍCH XUẤT SUB-CUBE NGUY HIỂM NHẤT
SELECT 
    d.Domain,
    f.URL,
    f.URLSimilarityIndex,
    f.NoOfExternalRef
FROM dbo.Fact_Phishing_Analysis f
JOIN dbo.Dim_Domain d ON f.DomainKey = d.DomainKey
JOIN dbo.Dim_Security_Feature s ON f.SecurityKey = s.SecurityKey
WHERE d.TLD = 'com'               -- Chiều 1: TLD .com
  AND s.HasPasswordField = 1      -- Chiều 2: Bẫy mật khẩu
  AND f.LabelKey = 0              -- Chiều 3: Lừa đảo
ORDER BY f.URLSimilarityIndex ASC;`,
      tableHeaders: ['Tên Miền (Domain)', 'URL Bẫy Mật Khẩu', 'Fact 1 (Sim)', 'Fact 2 (ExtRef)', 'Tình trạng'],
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

      {/* Intro Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Mô Phỏng 4 Phép Toán Khối Lập Phương OLAP (OLAP Cube Operations)
            </h1>
            <p className="text-xs text-slate-400">
              Chứng minh khả năng khai thác phân tích đa chiều trên kiến trúc Star Schema của Kho Dữ Liệu VKU
            </p>
          </div>
        </div>

        {/* 4 Operations Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {operations.map(op => {
            const isActive = activeOp === op.id;
            return (
              <button
                key={op.id}
                onClick={() => setActiveOp(op.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className={`text-xs font-extrabold ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>
                  {op.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {op.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operation Detail Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        
        {/* Explanation */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            Bản chất nghiệp vụ của phép toán:
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {current.explanation}
          </p>
        </div>

        {/* Results Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Kết Quả Trích Xuất Dữ Liệu Đa Chiều Từ Kho (OLAP Result Set)
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              ✓ Thực thi thành công trong 0.08 giây
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  {current.tableHeaders.map((h, i) => (
                    <th key={i} className="py-2.5 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 bg-slate-900/40">
                {current.tableData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3 whitespace-nowrap">
                        {cell.includes('%') ? (
                          <span className="font-bold text-amber-400">{cell}</span>
                        ) : cell === 'CRITICAL RISK' ? (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">{cell}</span>
                        ) : cIdx === 0 ? (
                          <span className="font-bold text-white">{cell}</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Code2 className="h-4 w-4 text-blue-400" />
              <span>Câu Lệnh T-SQL Tương Ứng Trong SQL Server (SSMS):</span>
            </span>

            <button
              onClick={handleCopySQL}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono flex items-center space-x-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Đã copy!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {current.sql}
          </pre>
        </div>

      </div>

    </div>
  );
}
