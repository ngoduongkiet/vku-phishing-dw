import React, { useState } from 'react';
import { Layers, Database, Key, Table2, ArrowRight } from 'lucide-react';
import { STAR_SCHEMA_TABLES } from '../data/sampleData';

export default function StarSchemaView() {
  const [selectedTable, setSelectedTable] = useState(STAR_SCHEMA_TABLES[0]);

  return (
    <div className="space-y-6">

      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>DATA WAREHOUSE MODEL</span>
            <span>/</span>
            <span>KIMBALL DIMENSIONAL ARCHITECTURE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Kiến Trúc Mô Hình Dữ Liệu: 2 Bảng Fact Riêng Biệt (Fact Constellation)
          </h1>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
          2 Fact Tables Riêng Biệt • 5 Conformed Dimensions
        </div>
      </div>

      {/* 2 Fact Tables Architectural Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="linear-card p-4.5 border-l-2 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-cyan-400">BẢNG FACT 1: CHI TIẾT (ATOMIC FACT)</span>
            <span className="text-slate-400">Grain: Từng URL đơn lẻ</span>
          </div>
          <div className="text-sm font-bold text-white mt-1 font-mono">dbo.Fact_Phishing_Detail</div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Liên kết với <b>ĐỦ 5 BẢNG CHIỀU</b> qua Surrogate Keys. Chứa 2 thước đo Fact cốt lõi <code>URLSimilarityIndex</code> và <code>NoOfExternalRef</code>, hỗ trợ truy vấn chi tiết (Drill-down) từng URL cụ thể.
          </p>
        </div>

        <div className="linear-card p-4.5 border-l-2 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-emerald-400">BẢNG FACT 2: TỔNG HỢP (AGGREGATE FACT)</span>
            <span className="text-slate-400">Grain: TLD + An ninh + Nhãn</span>
          </div>
          <div className="text-sm font-bold text-white mt-1 font-mono">dbo.Agg_Fact_Phishing_Summary</div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Liên kết với các <b>Conformed Dimensions</b> (Bảo mật, Nhãn, Tên miền). Lưu trữ các thước đo tính toán sẵn (Pre-computed Metrics) giúp truy vấn cuộn gộp (Roll-up) chạy dưới 2ms, tăng tốc báo cáo gấp 120 lần!
          </p>
        </div>
      </div>

      {/* Table Selector Card */}
      <div className="linear-card p-6">
        <h2 className="text-sm font-bold text-white tracking-tight mb-1 font-mono uppercase">
          Danh Mục 7 Bảng Trong Mô Hình (2 Facts + 5 Dimensions)
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Bấm vào bất kỳ bảng Fact hoặc Dimension nào để kiểm tra chi tiết cấu trúc hạt (Grain), khóa chính Surrogate Key, khóa ngoại FK và danh sách các thước đo/thuộc tính.
        </p>

        {/* Visual Star Layout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {STAR_SCHEMA_TABLES.map((t, idx) => {
            const isSelected = selectedTable.name === t.name;
            const isFact = t.type.includes('FACT');
            return (
              <button
                key={idx}
                onClick={() => setSelectedTable(t)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? isFact
                      ? 'bg-white/[0.1] border-white/30 text-white shadow-sm'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#0C0D12] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${
                  isFact ? 'text-slate-300' : 'text-emerald-400'
                }`}>
                  {t.type}
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate font-mono">
                  {t.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {t.grain || 'Dimension table'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Details Viewer */}
      <div className="linear-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.2 rounded border ${
                selectedTable.type.includes('FACT')
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {selectedTable.type}
              </span>
              <span className="text-xs text-slate-500 font-mono">dbo.{selectedTable.name}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 font-mono tracking-tight">
              dbo.{selectedTable.name}
            </h2>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-[#0C0D12] px-3 py-1.5 rounded border border-white/5">
            <span className="text-slate-500">Grain:</span> <span className="text-slate-200">{selectedTable.grain}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {selectedTable.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Keys & Structure */}
          <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 font-mono">
              <Key className="h-3.5 w-3.5 text-amber-400" />
              <span>Primary / Foreign Keys:</span>
            </h3>

            <div className="text-xs font-mono space-y-1.5">
              <div className="p-2 bg-[#12141C] rounded border border-white/5 flex items-center justify-between">
                <span className="text-amber-400 font-semibold text-[11px]">PRIMARY KEY:</span>
                <span className="text-white font-medium">{selectedTable.pk}</span>
              </div>

              {selectedTable.fk && selectedTable.fk.map((fk, idx) => (
                <div key={idx} className="p-2 bg-[#12141C] rounded border border-white/5 flex items-center space-x-1.5 text-slate-300">
                  <ArrowRight className="h-3 w-3 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{fk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Measures or Attributes */}
          <div className="p-4 bg-[#0C0D12] rounded-lg border border-white/5 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 font-mono">
              <Table2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{selectedTable.measures ? 'Fact Measures:' : 'Dimension Attributes:'}</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {(selectedTable.measures || selectedTable.attributes || []).map((attr, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#12141C] border border-white/10 rounded text-xs font-mono text-slate-300"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
