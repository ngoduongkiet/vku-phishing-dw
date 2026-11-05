import React, { useState } from 'react';
import { Cpu, CheckCircle2, Sliders, BarChart3, TrendingUp, Sparkles, Award, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
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

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              AI & MACHINE LEARNING LAB
            </span>
            <span className="text-xs text-slate-500 font-mono">MODEL EVALUATION & FACT JUSTIFICATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Phòng Thí Nghiệm & Thẩm Định Mô Hình Trí Tuệ Nhân Tạo
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <Award className="h-4 w-4" />
          <span>47,159 Mẫu Test Độc Lập</span>
        </div>
      </div>

      {/* Model Benchmark Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-1">
              <Cpu className="h-3.5 w-3.5" />
              <span>Đánh giá kiểm thử khách quan theo chuẩn quốc tế</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Bảng So Sánh Hiệu Năng 3 Thuật Toán Học Máy (ML Benchmarking)
            </h2>
            <p className="text-xs text-slate-400">
              So sánh khách quan giữa Logistic Regression, Decision Tree và Random Forest trên tập dữ liệu kho
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODEL_BENCHMARK.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border relative transition-all ${
                m.isBest
                  ? 'bg-gradient-to-b from-cyan-950/40 via-slate-950/80 to-slate-950/90 border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-white/[0.08]'
              }`}
            >
              {m.isBest && (
                <span className="absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg font-mono">
                  🏆 Mô hình tối ưu đề xuất
                </span>
              )}

              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">{m.type}</div>
              <div className="text-base font-extrabold text-white mt-1">{m.name}</div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">ACCURACY</span>
                  <span className="text-lg font-black text-white">{m.accuracy}%</span>
                </div>
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">PRECISION</span>
                  <span className="text-lg font-black text-emerald-400">{m.precision}%</span>
                </div>
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">RECALL</span>
                  <span className="text-lg font-black text-amber-400">{m.recall}%</span>
                </div>
                <div className="p-2 bg-slate-900/50 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">F1-SCORE</span>
                  <span className="text-lg font-black text-cyan-400">{m.f1}%</span>
                </div>
              </div>

              <div className="mt-3.5 text-[11px] text-slate-400 flex justify-between font-mono pt-2 border-t border-white/[0.04]">
                <span>Thời gian huấn luyện:</span>
                <span className="text-cyan-300 font-bold">{m.trainTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Fact Justification */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                RANDOM FOREST FEATURE IMPORTANCE
              </span>
              <span className="text-xs text-slate-500 font-mono">FACT WEIGHT ANALYSIS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Tầm Quan Trọng Của Các Thuộc Tính Trong Kho Dữ Liệu
            </h2>
            <p className="text-xs text-slate-400">
              Minh chứng vai trò quyết định của 2 Fact cốt lõi trong Star Schema đối với mô hình phát hiện lừa đảo
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl self-start font-mono">
            2 Fact + Dim Security = 71.19% Trọng Số
          </div>
        </div>

        {/* Horizontal Ranked Bars */}
        <div className="space-y-3">
          {FEATURE_IMPORTANCES.map((item, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-white/[0.06] p-3 rounded-xl flex items-center gap-4 hover:border-cyan-500/30 transition-all">
              <span className="text-xs font-mono font-bold text-slate-500 w-6">#{idx + 1}</span>
              <div className="w-64 text-xs font-semibold text-white truncate font-mono">
                {item.feature}
              </div>

              {/* Bar */}
              <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/[0.05]">
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

      {/* Interactive Fact Sensitivity Lab Simulator */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden border-cyan-500/30">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
          <Sliders className="h-4 w-4" />
          <span>PHÒNG THÍ NGHIỆM ĐỘ NHẠY 2 FACT (FACT SENSITIVITY SIMULATOR)</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Kéo Thử 2 Fact Đo Lường Để Quan Sát AI Chuyển Đổi Quyết Định Tức Thì
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kiểm chứng trực tiếp xem khi điểm tương đồng (Fact 1) hoặc số liên kết ngoài (Fact 2) biến thiên, hệ thống sẽ dịch chuyển ranh giới phân loại như thế nào.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-white/[0.08]">
          
          {/* Sliders Side */}
          <div className="space-y-5">
            
            {/* Slider 1 */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/[0.06]">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Fact 1: URLSimilarityIndex (Độ tương đồng)</span>
                <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{simSlider} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simSlider}
                onChange={(e) => setSimSlider(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                <span>0 (Nhái lệch hoàn toàn)</span>
                <span>100 (Chuẩn thương hiệu)</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/[0.06]">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Fact 2: NoOfExternalRef (Số liên kết ngoài)</span>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{extRefSlider} links</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={extRefSlider}
                onChange={(e) => setExtRefSlider(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                <span>0 (Bị cô lập - Phishing)</span>
                <span>100+ (Web lớn uy tín)</span>
              </div>
            </div>

            {/* Checkbox HTTPS */}
            <div className="flex items-center space-x-2.5 p-3 bg-slate-950/60 rounded-xl border border-white/[0.06]">
              <input
                type="checkbox"
                id="httpsToggle"
                checked={httpsCheck}
                onChange={(e) => setHttpsCheck(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="httpsToggle" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Website có chứng chỉ bảo mật HTTPS (IsHTTPS = 1)
              </label>
            </div>

          </div>

          {/* Real-time Dynamic Classification Outcome */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            isSimLegit
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400 glow-emerald'
              : 'bg-red-950/30 border-red-500/40 text-red-400 glow-crimson'
          }`}>
            <div>
              <div className="text-[11px] uppercase font-extrabold tracking-wider mb-2 font-mono flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>KẾT QUẢ SUY LUẬN THỜI GIAN THỰC (INFERENCE):</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black mt-2">
                {isSimLegit ? '🟢 HỢP PHÁP (LEGITIMATE)' : '🔴 LỪA ĐẢO (PHISHING)'}
              </div>
              <div className="text-xs text-slate-300 mt-3 font-mono">
                Độ tin cậy thuật toán: <b className="text-white text-base font-black">{liveConf}%</b>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs text-slate-400 leading-relaxed font-sans">
              {isSimLegit ? (
                <span>✓ Giá trị Fact 1 và Fact 2 đủ lớn để vượt qua ngưỡng tin cậy an toàn của mô hình Random Forest.</span>
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
