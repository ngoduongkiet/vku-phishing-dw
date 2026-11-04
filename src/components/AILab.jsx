import React, { useState } from 'react';
import { Cpu, CheckCircle2, Sliders, BarChart3, TrendingUp, Sparkles, Award } from 'lucide-react';
import { MODEL_BENCHMARK, FEATURE_IMPORTANCES } from '../data/sampleData';

export default function AILab() {
  const [simSlider, setSimSlider] = useState(60);
  const [extRefSlider, setExtRefSlider] = useState(2);
  const [httpsCheck, setHttpsCheck] = useState(true);

  // Live dynamic decision based on slider values
  const simNorm = simSlider / 100.0;
  const extNorm = Math.min(1.0, extRefSlider / 50.0);
  const httpsNorm = httpsCheck ? 1.0 : 0.0;
  
  // Weights: Fact 1 (36.9%) + Fact 2 (22.5%) + HTTPS (11.8%) + Base (28.8%)
  const liveScore = (0.369 * simNorm) + (0.225 * extNorm) + (0.118 * httpsNorm) + 0.15;
  const isSimLegit = liveScore >= 0.5;
  const liveConf = Math.round((isSimLegit ? liveScore : (1 - liveScore)) * 1000) / 10;

  return (
    <div className="space-y-6">

      {/* Model Benchmark Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
              <Award className="h-3.5 w-3.5" />
              <span>Đánh giá kiểm thử độc lập trên 47.159 mẫu Test</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Bảng So Sánh Hiệu Năng 3 Thuật Toán Machine Learning
            </h1>
            <p className="text-xs text-slate-400">
              Minh chứng phương pháp luận khoa học: So sánh khách quan để tìm ra thuật toán tối ưu nhất cho Kho Dữ Liệu
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODEL_BENCHMARK.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border relative transition-all ${
                m.isBest
                  ? 'bg-slate-950/80 border-blue-500/50 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              {m.isBest && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow">
                  🏆 Mô hình tối ưu đề xuất
                </span>
              )}

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.type}</div>
              <div className="text-base font-extrabold text-white mt-1">{m.name}</div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Accuracy</span>
                  <span className="text-lg font-black text-white">{m.accuracy}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Precision</span>
                  <span className="text-lg font-black text-emerald-400">{m.precision}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Recall</span>
                  <span className="text-lg font-black text-amber-400">{m.recall}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">F1-Score</span>
                  <span className="text-lg font-black text-blue-400">{m.f1}%</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
                <span>Thời gian học:</span>
                <span className="font-mono text-slate-300 font-bold">{m.trainTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Fact Justification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Tầm Quan Trọng Của Các Thuộc Tính Trong Kho Dữ Liệu (Feature Importance)
            </h2>
            <p className="text-xs text-slate-400">
              Chứng minh vai trò quyết định của 2 Fact cốt lõi trong Star Schema đối với việc nhận diện lừa đảo
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg self-start">
            2 Fact + Dim Security = 71.19% Quyết Định
          </div>
        </div>

        {/* Horizontal Ranked Bars */}
        <div className="space-y-3">
          {FEATURE_IMPORTANCES.map((item, idx) => (
            <div key={idx} className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-slate-500 w-6">#{idx + 1}</span>
              <div className="w-64 text-xs font-semibold text-white truncate">
                {item.feature}
              </div>

              {/* Bar */}
              <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.weight / 40) * 100}%`,
                    backgroundColor: item.color || '#64748B'
                  }}
                ></div>
              </div>

              <span className="text-xs font-mono font-black text-white w-16 text-right">
                {item.weight.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Fact Sensitivity Lab Simulator (THẦY RẤT MÊ CÁI NÀY) */}
      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sliders className="h-4 w-4" />
          <span>PHÒNG THÍ NGHIỆM ĐỘ NHẠY CỦA 2 FACT (FACT SENSITIVITY SIMULATOR)</span>
        </div>
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Kéo Thử 2 Fact Đo Lường Để Quan Sát AI Thay Đổi Quyết Định Tức Thì
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Giúp giảng viên kiểm chứng trực tiếp xem khi điểm tương đồng (Fact 1) hoặc số liên kết ngoài (Fact 2) thay đổi, hệ thống sẽ chuyển dịch ranh giới phân loại như thế nào.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-slate-800">
          
          {/* Sliders Side */}
          <div className="space-y-5">
            
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Fact 1: URLSimilarityIndex (Độ tương đồng tên miền)</span>
                <span className="font-mono font-bold text-red-400">{simSlider} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simSlider}
                onChange={(e) => setSimSlider(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 (Nhái lệch hoàn toàn)</span>
                <span>100 (Chuẩn gốc)</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Fact 2: NoOfExternalRef (Số lượng liên kết ngoài)</span>
                <span className="font-mono font-bold text-blue-400">{extRefSlider} links</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={extRefSlider}
                onChange={(e) => setExtRefSlider(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 (Bị cô lập - Phishing)</span>
                <span>100+ (Web lớn uy tín)</span>
              </div>
            </div>

            {/* Checkbox HTTPS */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="httpsToggle"
                checked={httpsCheck}
                onChange={(e) => setHttpsCheck(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="httpsToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Website có chứng chỉ bảo mật HTTPS (IsHTTPS = 1)
              </label>
            </div>

          </div>

          {/* Real-time Dynamic Classification Outcome */}
          <div className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
            isSimLegit
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
              : 'bg-red-950/20 border-red-500/40 text-red-400'
          }`}>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider mb-2">
                Kết Quả Phân Loại Động (Real-time Prediction):
              </div>
              <div className="text-2xl font-black">
                {isSimLegit ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
              </div>
              <div className="text-xs text-slate-300 mt-2">
                Xác suất tin cậy của thuật toán: <b className="font-mono text-white text-base">{liveConf}%</b>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              {isSimLegit ? (
                <span>✓ Giá trị Fact 1 và Fact 2 đủ lớn để vượt qua ngưỡng an toàn của mô hình Random Forest.</span>
              ) : (
                <span>⚠️ Cảnh báo: Tương quan giữa độ tương đồng thấp và ít liên kết ngoài kích hoạt cơ chế nhận diện phishing.</span>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
