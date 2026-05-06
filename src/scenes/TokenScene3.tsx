import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GRAPH_NODES = [
  { id: 0, label: 'Acme Corp', x: 50, y: 40, hit: true },
  { id: 1, label: 'Sales Team', x: 25, y: 55, hit: false },
  { id: 2, label: 'Q4 Renewal', x: 72, y: 30, hit: true },
  { id: 3, label: 'Support', x: 80, y: 60, hit: false },
  { id: 4, label: 'Pricing', x: 35, y: 30, hit: true },
  { id: 5, label: 'Onboarding', x: 60, y: 65, hit: false },
  { id: 6, label: 'Exec Call', x: 45, y: 70, hit: true },
  { id: 7, label: 'Engineering', x: 15, y: 40, hit: false },
  { id: 8, label: 'Contract', x: 85, y: 45, hit: false },
  { id: 9, label: 'Risk Flag', x: 65, y: 48, hit: true },
];

const GRAPH_EDGES: [number, number][] = [
  [0, 2], [0, 4], [0, 1], [2, 9], [4, 2],
  [1, 7], [5, 6], [3, 5], [6, 0], [8, 3],
  [9, 6], [7, 4], [1, 6],
];

const ML_SIGNALS = [
  { label: 'Semantic match', icon: 'neurology' },
  { label: 'Recency boost', icon: 'schedule' },
  { label: 'Personalization', icon: 'person' },
  { label: 'ACL-verified', icon: 'lock' },
];

const RESULT_CARDS = [
  'Acme renewal — Q4 pricing approved',
  'Renewal risk flag: champion left',
  'Latest exec call summary (May 2)',
  'Q4 contract terms (final)',
];

const CAPTIONS = [
  '60+ ranking signals score every candidate',
  'Only verified, relevant results reach the LLM',
];

export function TokenScene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => setPhase(4), 5000);
    const t5 = setTimeout(() => setPhase(5), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  return (
    <div className="scene ts3">
      <motion.div
        className="scene-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Glean Index
      </motion.div>

      <div className="ts3-layout">
        {/* Prompt */}
        <motion.div
          className="ts3-prompt-pill"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chat_bubble</span>
          "Acme renewal status?"
        </motion.div>

        {/* Arrow down to index */}
        <motion.div
          className="ts3-arrow-down"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={phase >= 1 ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 24, color: 'rgba(216,253,73,0.7)' }}>arrow_downward</span>
        </motion.div>

        {/* Graph layer */}
        <div className="ts3-graph-container">
          <div className="ts3-graph-label">Enterprise Knowledge Graph</div>
          <svg className="ts3-graph-svg" viewBox="0 0 100 80">
            {/* Edges */}
            {GRAPH_EDGES.map(([a, b], i) => (
              <motion.line
                key={`e-${i}`}
                x1={GRAPH_NODES[a].x}
                y1={GRAPH_NODES[a].y}
                x2={GRAPH_NODES[b].x}
                y2={GRAPH_NODES[b].y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.3"
                initial={{ opacity: 0 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
              />
            ))}
            {/* Nodes */}
            {GRAPH_NODES.map((node, i) => {
              const isLit = phase >= 2 && node.hit;
              const isDimmed = phase >= 2 && !node.hit;
              return (
                <motion.circle
                  key={`n-${i}`}
                  cx={node.x}
                  cy={node.y}
                  r={node.hit ? 3 : 2.2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isDimmed ? 0.2 : 1,
                    scale: isLit ? 1.4 : 1,
                    fill: isLit ? '#D8FD49' : 'rgba(255,255,255,0.5)',
                  }}
                  transition={{
                    delay: phase >= 2 ? 0.1 + i * 0.05 : 0.5 + i * 0.04,
                    duration: 0.4,
                    type: isLit ? 'spring' : 'tween',
                    stiffness: 300,
                    damping: 15,
                  }}
                />
              );
            })}
            {/* Query sweep beam (radial highlight) */}
            {phase >= 1 && phase < 3 && (
              <motion.rect
                x="0"
                y="0"
                width="8"
                height="80"
                fill="url(#sweepGrad)"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [0, 92], opacity: [0, 0.6, 0.6, 0] }}
                transition={{ duration: 1.5, ease: 'linear', delay: 0.3 }}
              />
            )}
            <defs>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(216,253,73,0)" />
                <stop offset="50%" stopColor="rgba(216,253,73,0.3)" />
                <stop offset="100%" stopColor="rgba(216,253,73,0)" />
              </linearGradient>
            </defs>
          </svg>

          {/* ML signal badges */}
          {phase >= 2 && (
            <div className="ts3-signals">
              {ML_SIGNALS.map((sig, i) => (
                <motion.div
                  key={sig.label}
                  className="ts3-signal-badge"
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.3 }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 14 }}>{sig.icon}</span>
                  {sig.label}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Result cards emerging */}
        {phase >= 3 && (
          <div className="ts3-results">
            <div className="ts3-results-header">
              <span className="ts3-results-label">Context Window</span>
              {phase >= 4 && (
                <motion.span
                  className="ts3-token-counter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Minimal, high-signal
                </motion.span>
              )}
            </div>
            <div className="ts3-result-cards">
              {RESULT_CARDS.map((card, i) => (
                <motion.div
                  key={i}
                  className="ts3-result-card"
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.15 + i * 0.2,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <span className="ts3-result-dot" />
                  {card}
                </motion.div>
              ))}
            </div>
            {/* Small fill bar — only 15% */}
            <div className="ts3-fill-track">
              <motion.div
                className="ts3-fill-bar"
                initial={{ width: '0%' }}
                animate={phase >= 4 ? { width: '15%' } : {}}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
        )}

        {/* Captions */}
        <div className="ts3-captions">
          {CAPTIONS.map((caption, i) => {
            const showAt = i === 0 ? 2 : 3;
            return phase >= showAt ? (
              <motion.div
                key={i}
                className="ts3-caption"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {caption}
              </motion.div>
            ) : null;
          })}
        </div>

        {phase >= 5 && (
          <div className="ts3-hero-group">
            <motion.div
              className="ts3-hero-line"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              Fewer tokens. Better answers.
            </motion.div>
            <motion.div
              className="ts3-hero-sub"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Powered by Waldo agentic search model
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
