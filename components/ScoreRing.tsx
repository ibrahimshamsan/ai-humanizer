"use client";

type Props = { value: number; label: string; size?: number };

export default function ScoreRing({ value, label, size = 140 }: Props) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 90 ? "#10B981" : value >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all hover:shadow-lift">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EAF3FC"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-baseline justify-center gap-0.5"
          style={{ color }}
        >
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          <span className="text-lg font-medium">%</span>
        </div>
      </div>
      <div className="text-center text-sm font-medium text-ink-muted">
        {label}
      </div>
    </div>
  );
}
