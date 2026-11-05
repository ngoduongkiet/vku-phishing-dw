import React, { useState } from 'react';
import { Cpu, CheckCircle2, Sliders, BarChart3, TrendingUp, Award, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
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

      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>MACHINE LEARNING ENGINE</span>
            <span>/</span>
            <span>FEATURE IMPORTANCE & EVALUATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Model Benchmarking & Fact Sensitivity
          </h1>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Independent Test Set: <b className="text-white">47,159 URLs</b>
        </div>
      </div>

      {/* Model Benchmark Card */}
      <div className="linear-card p-6">
        <div className="mb-5 pb-3 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white tracking-tight">
            Supervised Classifier Benchmark
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective performance evaluation across Logistic Regression, CART Decision Tree, and Random Forest.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {MODEL_BENCHMARK.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border transition-all ${
                m.isBest
                  ? 'bg-[#141822] border-white/20 shadow-sm'
                  : 'bg-[#0C0D12] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{m.type}</span>
                {m.isBest && (
                  <span className="text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    Selected Model
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-white mt-1">{m.name}</div>

              <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/5 text-xs font-mono">
                <div className="p-2 bg-[#08090C] rounded">
                  <span className="text-slate-500 block text-[9px]">ACCURACY</span>
                  <span className="text-base font-bold text-white">{m.accuracy}%</span>
                </div>
                <div className="p-2 bg-[#08090C] rounded">
                  <span className="text-slate-500 block text-[9px]">PRECISION</span>
                  <span className="text-base font-bold text-emerald-400">{m.precision}%</span>
                </div>
                <div className="p-2 bg-[#08090C] rounded">
                  <span className="text-slate-500 block text-[9px]">RECALL</span>
                  <span className="text-base font-bold text-amber-400">{m.recall}%</span>
                </div>
                <div className="p-2 bg-[#08090C] rounded">
                  <span className="text-slate-500 block text-[9px]">F1-SCORE</span>
                  <span className="text-base font-bold text-slate-200">{m.f1}%</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex justify-between font-mono pt-2 border-t border-white/5">
                <span>Training Latency:</span>
                <span className="text-slate-300 font-semibold">{m.trainTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance & Fact Justification */}
      <div className="linear-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Feature Importance Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Empirical justification: 2 Kimball Fact Measures drive 59.36% of classification decisions
            </p>
          </div>
          <div className="px-2.5 py-1 bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-mono rounded self-start">
            2 Facts + SSL = 71.19% Total
          </div>
        </div>

        {/* Horizontal Ranked Bars */}
        <div className="space-y-2.5">
          {FEATURE_IMPORTANCES.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-[#0C0D12] border border-white/5 rounded-md flex items-center gap-3 text-xs">
              <span className="font-mono text-slate-500 w-5">#{idx + 1}</span>
              <div className="w-60 font-mono text-slate-200 truncate">
                {item.feature}
              </div>

              {/* Bar */}
              <div className="flex-1 bg-[#161822] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.weight / 40) * 100}%`,
                    backgroundColor: item.color || '#4B5563'
                  }}
                ></div>
              </div>

              <span className="font-mono font-semibold text-white w-14 text-right">
                {item.weight.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Fact Sensitivity Lab Simulator */}
      <div className="linear-card p-6">
        <div className="mb-4 pb-3 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-slate-400" />
            <span>Fact Sensitivity Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactively adjust Fact 1 & Fact 2 values to inspect dynamic decision boundary shifts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          
          {/* Sliders Side */}
          <div className="space-y-4">
            
            {/* Slider 1 */}
            <div className="p-3.5 bg-[#0C0D12] rounded-lg border border-white/5">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Fact 1: URLSimilarityIndex</span>
                <span className="text-red-400 font-bold">{simSlider} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simSlider}
                onChange={(e) => setSimSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-[#161822] rounded appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                <span>0 (Distorted / Fake)</span>
                <span>100 (Exact Brand)</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="p-3.5 bg-[#0C0D12] rounded-lg border border-white/5">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Fact 2: NoOfExternalRef</span>
                <span className="text-slate-200 font-bold">{extRefSlider} links</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={extRefSlider}
                onChange={(e) => setExtRefSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-[#161822] rounded appearance-none cursor-pointer accent-slate-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                <span>0 (Isolated / Bait)</span>
                <span>100+ (High Citations)</span>
              </div>
            </div>

            {/* Checkbox HTTPS */}
            <div className="flex items-center space-x-2.5 p-3 bg-[#0C0D12] rounded-lg border border-white/5">
              <input
                type="checkbox"
                id="httpsToggle"
                checked={httpsCheck}
                onChange={(e) => setHttpsCheck(e.target.checked)}
                className="h-4 w-4 rounded bg-[#161822] border-white/20 text-slate-900 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="httpsToggle" className="text-xs text-slate-300 cursor-pointer select-none">
                Domain possesses valid SSL Certificate (IsHTTPS = 1)
              </label>
            </div>

          </div>

          {/* Real-time Dynamic Classification Outcome */}
          <div className={`p-5 rounded-lg border flex flex-col justify-between transition-all ${
            isSimLegit
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
              : 'bg-red-950/20 border-red-500/30 text-red-400'
          }`}>
            <div>
              <div className="text-[10px] uppercase font-mono font-semibold tracking-wider mb-1">
                Real-Time Inference Output:
              </div>
              <div className="text-2xl font-bold mt-1">
                {isSimLegit ? 'Legitimate Domain (Safe)' : 'Phishing Threat (Risk)'}
              </div>
              <div className="text-xs text-slate-300 mt-2 font-mono">
                Algorithm Confidence: <b className="text-white text-base font-bold">{liveConf}%</b>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 leading-relaxed font-sans">
              {isSimLegit ? (
                <span>Fact 1 and Fact 2 values surpass the high-dimensional decision boundary of Random Forest.</span>
              ) : (
                <span>Low lexical similarity combined with isolated external reference triggers classifier threat threshold.</span>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
