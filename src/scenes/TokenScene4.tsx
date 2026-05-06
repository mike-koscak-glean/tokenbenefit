import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MetricRow {
  label: string;
  fedLabel: string;
  gleanLabel: string;
  fedPct: number;
  gleanPct: number;
  icon: string;
}

const METRICS: MetricRow[] = [
  { label: 'Tokens to LLM', fedLabel: 'Massive', gleanLabel: 'Minimal', fedPct: 95, gleanPct: 12, icon: 'token' },
  { label: 'Signal quality', fedLabel: 'Mostly noise', gleanLabel: 'High signal', fedPct: 8, gleanPct: 92, icon: 'target' },
  { label: 'API calls', fedLabel: 'One per tool', gleanLabel: 'Single call', fedPct: 90, gleanPct: 12, icon: 'cable' },
  { label: 'Latency', fedLabel: 'Slowest tool wins', gleanLabel: 'Sub-second', fedPct: 85, gleanPct: 10, icon: 'speed' },
  { label: 'Cost per query', fedLabel: 'Expensive', gleanLabel: 'Fraction', fedPct: 90, gleanPct: 8, icon: 'payments' },
];

export function TokenScene4() {
  const [showRows, setShowRows] = useState(0);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    METRICS.forEach((_, i) => {
      timers.push(setTimeout(() => setShowRows(i + 1), 400 + i * 550));
    });
    timers.push(setTimeout(() => setShowTagline(true), 400 + METRICS.length * 550 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="scene ts4">
      <motion.div
        className="scene-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        The Comparison
      </motion.div>

      <div className="ts4-table">
        {/* Header */}
        <div className="ts4-header">
          <div className="ts4-header-label" />
          <motion.div
            className="ts4-header-col ts4-header-fed"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>hub</span>
            Federated MCP
          </motion.div>
          <motion.div
            className="ts4-header-col ts4-header-glean"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>database</span>
            Glean Index
          </motion.div>
        </div>

        {/* Rows */}
        {METRICS.map((metric, i) => {
          if (i >= showRows) return null;

          return (
            <motion.div
              key={metric.label}
              className="ts4-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="ts4-row-label">
                <span className="material-symbols-rounded ts4-row-icon">{metric.icon}</span>
                {metric.label}
              </div>

              {/* Federated cell */}
              <div className="ts4-cell ts4-cell-fed">
                <div className="ts4-qualitative ts4-qualitative-fed">{metric.fedLabel}</div>
                <div className="ts4-bar-track">
                  <motion.div
                    className="ts4-bar ts4-bar-fed"
                    initial={{ width: '0%' }}
                    animate={{ width: `${metric.fedPct}%` }}
                    transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Glean cell */}
              <div className="ts4-cell ts4-cell-glean">
                <div className="ts4-qualitative ts4-qualitative-glean">{metric.gleanLabel}</div>
                <div className="ts4-bar-track">
                  <motion.div
                    className="ts4-bar ts4-bar-glean"
                    initial={{ width: '0%' }}
                    animate={{ width: `${metric.gleanPct}%` }}
                    transition={{
                      delay: 0.15,
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 150,
                      damping: 18,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tagline */}
      {showTagline && (
        <motion.div
          className="ts4-tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        >
          Same question. Dramatically fewer tokens. Better answers.
        </motion.div>
      )}
    </div>
  );
}
