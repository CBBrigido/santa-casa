import { useState, useRef } from "react";
import { boxPlotData } from "@/data/mockData";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface DotTooltip {
  providerName: string;
  value: number;
  procedureName: string;
  median: number;
  clientX: number;
  clientY: number;
}

interface BoxTooltip {
  item: typeof boxPlotData[number];
  clientX: number;
  clientY: number;
}

const PROVIDER_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

// All unique providers across all procedures
const ALL_PROVIDERS = Array.from(
  new Set(boxPlotData.flatMap(d => d.providers.map(p => p.name)))
).sort();

const PAD = { top: 20, right: 14, bottom: 38, left: 68 };
const CHART_W = 680;
const CHART_H = 200;
const INNER_W = CHART_W - PAD.left - PAD.right;
const INNER_H = CHART_H - PAD.top - PAD.bottom;

export function BoxPlotChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dotTooltip, setDotTooltip] = useState<DotTooltip | null>(null);
  const [boxTooltip, setBoxTooltip] = useState<BoxTooltip | null>(null);
  const [highlightProvider, setHighlightProvider] = useState<string | null>(null);

  // Y scale
  const allValues = boxPlotData.flatMap(d => [d.min, d.max]);
  const yRawMin = Math.min(...allValues);
  const yRawMax = Math.max(...allValues);
  const yPad = (yRawMax - yRawMin) * 0.1;
  const yMin = yRawMin - yPad;
  const yMax = yRawMax + yPad;

  const yScale = (v: number) => INNER_H - ((v - yMin) / (yMax - yMin)) * INNER_H;

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => yMin + (i / 4) * (yMax - yMin));

  const catW = INNER_W / boxPlotData.length;
  const BOX_W = Math.min(catW * 0.34, 28);
  const WHISKER_CAP = BOX_W * 0.45;

  function getProviderColor(name: string) {
    const idx = ALL_PROVIDERS.indexOf(name);
    return PROVIDER_COLORS[idx % PROVIDER_COLORS.length];
  }

  function handleDotEnter(e: React.MouseEvent, item: typeof boxPlotData[number], p: { name: string; value: number }) {
    setDotTooltip({
      providerName: p.name,
      value: p.value,
      procedureName: item.name,
      median: item.median,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    setBoxTooltip(null);
  }

  function handleBoxEnter(e: React.MouseEvent, item: typeof boxPlotData[number]) {
    if (dotTooltip) return; // dot takes priority
    setBoxTooltip({ item, clientX: e.clientX, clientY: e.clientY });
  }

  return (
    <div className="space-y-3">
      {/* Chart */}
      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="overflow-visible"
          onMouseLeave={() => { setDotTooltip(null); setBoxTooltip(null); }}
        >
          {/* Grid + Y-axis labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={PAD.left} y1={PAD.top + yScale(tick)}
                x2={PAD.left + INNER_W} y2={PAD.top + yScale(tick)}
                stroke="hsl(220 15% 91%)" strokeWidth={1}
              />
              <text
                x={PAD.left - 6} y={PAD.top + yScale(tick)}
                textAnchor="end" dominantBaseline="middle"
                fontSize={9} fill="hsl(220 15% 52%)"
              >
                {tick >= 1000
                  ? `${(tick / 1000).toFixed(tick < 5000 ? 1 : 0)}k`
                  : Math.round(tick)}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + INNER_H}
            stroke="hsl(220 15% 82%)" strokeWidth={1} />
          <line x1={PAD.left} y1={PAD.top + INNER_H} x2={PAD.left + INNER_W} y2={PAD.top + INNER_H}
            stroke="hsl(220 15% 82%)" strokeWidth={1} />

          {/* Boxes */}
          {boxPlotData.map((item, idx) => {
            const cx = PAD.left + catW * (idx + 0.5);
            const q1y  = PAD.top + yScale(item.q1);
            const q3y  = PAD.top + yScale(item.q3);
            const medY = PAD.top + yScale(item.median);
            const minY = PAD.top + yScale(item.min);
            const maxY = PAD.top + yScale(item.max);
            const meanY = PAD.top + yScale(item.mean);
            const boxH = q1y - q3y;

            return (
              <g key={item.name}>
                {/* Invisible hit area for box tooltip */}
                <rect
                  x={cx - catW * 0.45} y={maxY}
                  width={catW * 0.9} height={minY - maxY}
                  fill="transparent"
                  onMouseEnter={(e) => handleBoxEnter(e, item)}
                  onMouseMove={(e) => setBoxTooltip(prev => prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null)}
                  onMouseLeave={() => setBoxTooltip(null)}
                />

                {/* Max cap */}
                <line x1={cx - WHISKER_CAP} y1={maxY} x2={cx + WHISKER_CAP} y2={maxY}
                  stroke="hsl(220 15% 55%)" strokeWidth={1.5} />
                {/* Whisker top */}
                <line x1={cx} y1={maxY} x2={cx} y2={q3y}
                  stroke="hsl(220 15% 62%)" strokeWidth={1.2} strokeDasharray="3 2" />

                {/* Box */}
                <rect
                  x={cx - BOX_W / 2} y={q3y}
                  width={BOX_W} height={Math.max(boxH, 2)}
                  fill="hsl(220 53% 45% / 0.13)"
                  stroke="hsl(220 53% 45%)"
                  strokeWidth={1.5} rx={2}
                />

                {/* Whisker bottom */}
                <line x1={cx} y1={q1y} x2={cx} y2={minY}
                  stroke="hsl(220 15% 62%)" strokeWidth={1.2} strokeDasharray="3 2" />
                {/* Min cap */}
                <line x1={cx - WHISKER_CAP} y1={minY} x2={cx + WHISKER_CAP} y2={minY}
                  stroke="hsl(220 15% 55%)" strokeWidth={1.5} />

                {/* Median */}
                <line
                  x1={cx - BOX_W / 2} y1={medY} x2={cx + BOX_W / 2} y2={medY}
                  stroke="hsl(220 53% 32%)" strokeWidth={2.5}
                />

                {/* Mean diamond */}
                <polygon
                  points={`${cx},${meanY - 4} ${cx + 4},${meanY} ${cx},${meanY + 4} ${cx - 4},${meanY}`}
                  fill="hsl(45 90% 50%)" stroke="white" strokeWidth={1}
                />

                {/* Provider dots */}
                {item.providers.map((p, pi) => {
                  const py = PAD.top + yScale(p.value);
                  const jitter = (pi - (item.providers.length - 1) / 2) * (BOX_W * 0.32);
                  const color = getProviderColor(p.name);
                  const isHL = highlightProvider === p.name;
                  const dimmed = highlightProvider !== null && !isHL;
                  return (
                    <circle
                      key={p.name}
                      cx={cx + jitter} cy={py}
                      r={isHL ? 5.5 : 4}
                      fill={color}
                      stroke="white" strokeWidth={1.5}
                      opacity={dimmed ? 0.18 : 0.88}
                      className="transition-all duration-100 cursor-pointer"
                      onMouseEnter={(e) => { handleDotEnter(e, item, p); setHighlightProvider(p.name); }}
                      onMouseMove={(e) => setDotTooltip(prev => prev ? { ...prev, clientX: e.clientX, clientY: e.clientY } : null)}
                      onMouseLeave={() => { setDotTooltip(null); setHighlightProvider(null); }}
                    />
                  );
                })}

                {/* X-axis label */}
                <text
                  x={cx} y={PAD.top + INNER_H + 14}
                  textAnchor="middle" fontSize={9.5}
                  fill="hsl(220 15% 42%)" fontWeight="500"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dot tooltip — fixed positioning via clientX/Y */}
        {dotTooltip && (
          <div
            className="fixed z-50 pointer-events-none bg-gray-900/95 text-white rounded-lg shadow-xl p-3 text-xs"
            style={{ left: dotTooltip.clientX + 14, top: dotTooltip.clientY - 60 }}
          >
            <p className="font-semibold text-[13px] mb-1">{dotTooltip.providerName}</p>
            <p className="text-gray-300 text-[11px]">Procedimento: <span className="text-white font-medium">{dotTooltip.procedureName}</span></p>
            <p className="text-gray-300 text-[11px]">Valor recebido: <span className="text-white font-mono font-semibold">{formatCurrency(dotTooltip.value)}</span></p>
            <div className="mt-1.5 pt-1.5 border-t border-white/15 text-[10px] text-gray-400">
              {dotTooltip.value > dotTooltip.median
                ? <span className="text-emerald-400">▲ {formatCurrency(dotTooltip.value - dotTooltip.median)} acima da mediana</span>
                : dotTooltip.value < dotTooltip.median
                  ? <span className="text-red-400">▼ {formatCurrency(dotTooltip.median - dotTooltip.value)} abaixo da mediana</span>
                  : <span className="text-yellow-400">= Na mediana</span>
              }
            </div>
          </div>
        )}

        {/* Box tooltip */}
        {boxTooltip && !dotTooltip && (
          <div
            className="fixed z-50 pointer-events-none bg-gray-900/95 text-white rounded-lg shadow-xl p-3 text-xs"
            style={{ left: boxTooltip.clientX + 14, top: boxTooltip.clientY - 90 }}
          >
            <p className="font-semibold text-[12px] mb-1.5">{boxTooltip.item.name}</p>
            {[
              ["Máximo",   boxTooltip.item.max],
              ["Q3 (75%)", boxTooltip.item.q3],
              ["Mediana",  boxTooltip.item.median],
              ["Média",    boxTooltip.item.mean],
              ["Q1 (25%)", boxTooltip.item.q1],
              ["Mínimo",   boxTooltip.item.min],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between gap-8 text-[10px] leading-5">
                <span className="text-gray-400">{label as string}</span>
                <span className="font-mono">{formatCurrency(val as number)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t">
        {/* Box elements */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pr-4 border-r">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-2.5 border border-primary/70 bg-primary/13 rounded-[2px]" />
            IQR (Q1–Q3)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-0.5 bg-primary" />
            Mediana
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 bg-amber-400 border border-white"
              style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }} />
            Média
          </span>
        </div>

        {/* Providers */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Prestadores:</span>
          {ALL_PROVIDERS.map((name) => {
            const color = getProviderColor(name);
            const dimmed = highlightProvider !== null && highlightProvider !== name;
            return (
              <button
                key={name}
                className={`flex items-center gap-1.5 text-[11px] transition-opacity ${dimmed ? "opacity-30" : ""}`}
                onMouseEnter={() => setHighlightProvider(name)}
                onMouseLeave={() => setHighlightProvider(null)}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color }} />
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
