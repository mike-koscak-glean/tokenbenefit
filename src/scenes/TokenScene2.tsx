import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGOS } from '../logos';

const TOOLS = [
  { name: 'Drive', logo: LOGOS.gdrive },
  { name: 'Jira', logo: LOGOS.jira },
  { name: 'Salesforce', logo: LOGOS.salesforce },
  { name: 'Slack', logo: LOGOS.teams },
  { name: 'Confluence', logo: LOGOS.confluence },
  { name: 'ServiceNow', logo: LOGOS.servicenow },
  { name: 'Gong', logo: LOGOS.gong },
  { name: 'Gmail', logo: LOGOS.gmail },
];

interface TokenBlock {
  id: number;
  relevant: boolean;
  toolIdx: number;
  label: string;
  logo: string;
}

const TOKEN_LABELS_IRRELEVANT = [
  'Acme onboarding (2022)', 'Unrelated P3 ticket', 'Old meeting notes',
  '#general lunch plans', 'Archived runbook v2', 'Q2 pipeline (stale)',
  'Setup checklist (draft)', 'Org chart (outdated)', 'Holiday schedule',
  'Training video link', 'Offboarding template', 'All-hands recap',
  'Random Slack thread', 'Old pricing sheet', 'Duplicate CRM entry',
  'Test account data', 'Deprecated API doc', 'Board deck v1',
  'Expired contract', 'Cancelled meeting', 'Draft proposal (empty)',
  'Unresolved comment', 'Spam notification', 'Auto-generated log',
];

const TOKEN_LABELS_RELEVANT = [
  'Acme renewal — Q4 pricing', 'Renewal risk flag (active)', 'Latest Acme exec call',
];

function generateTokens(): TokenBlock[] {
  const tokens: TokenBlock[] = [];
  let id = 0;
  for (let i = 0; i < 36; i++) {
    const isRelevant = i === 8 || i === 22 || i === 31;
    const toolIdx = i % TOOLS.length;
    tokens.push({
      id: id++,
      relevant: isRelevant,
      toolIdx,
      logo: TOOLS[toolIdx].logo,
      label: isRelevant
        ? TOKEN_LABELS_RELEVANT[tokens.filter(t => t.relevant).length % TOKEN_LABELS_RELEVANT.length]
        : TOKEN_LABELS_IRRELEVANT[i % TOKEN_LABELS_IRRELEVANT.length],
    });
  }
  return tokens;
}

const ALL_TOKENS = generateTokens();

const CAPTIONS = [
  'Every tool returns everything it can find',
  'No cross-source ranking. No deduplication.',
];

export function TokenScene2() {
  const [phase, setPhase] = useState(0);
  const fanoutRef = useRef<HTMLDivElement>(null);
  const toolRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<{ startX: number; endX: number; width: number; height: number }[]>([]);

  const measureLines = useCallback(() => {
    const container = fanoutRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const newLines = toolRefs.current.map(el => {
      if (!el) return { startX: centerX, endX: centerX, width: rect.width, height: rect.height };
      const toolRect = el.getBoundingClientRect();
      const endX = toolRect.left + toolRect.width / 2 - rect.left;
      return { startX: centerX, endX, width: rect.width, height: rect.height };
    });
    setLines(newLines);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 4800);
    const t4 = setTimeout(() => setPhase(4), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    measureLines();
    window.addEventListener('resize', measureLines);
    return () => window.removeEventListener('resize', measureLines);
  }, [measureLines]);

  const svgWidth = lines[0]?.width || 800;
  const svgHeight = 55;

  return (
    <div className="scene ts2">
      <motion.div
        className="scene-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Federated MCP
      </motion.div>

      <div className="ts2-layout">
        <div className="ts2-fanout" ref={fanoutRef}>
          <motion.div
            className="ts2-prompt-pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>chat_bubble</span>
            &ldquo;Acme renewal status?&rdquo;
          </motion.div>

          {lines.length > 0 && (
            <svg className="ts2-fan-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              {lines.map((line, i) => (
                <motion.path
                  key={i}
                  d={`M ${line.startX} 0 C ${line.startX} ${svgHeight * 0.55}, ${line.endX} ${svgHeight * 0.55}, ${line.endX} ${svgHeight}`}
                  fill="none"
                  stroke="rgba(255, 126, 76, 0.35)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={phase >= 1 ? { pathLength: 1 } : {}}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
                />
              ))}
            </svg>
          )}

          <div className="ts2-tools">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                className="ts2-tool"
                ref={el => { toolRefs.current[i] = el; }}
                initial={{ opacity: 0.3 }}
                animate={phase >= 1 ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <img src={tool.logo} alt={tool.name} className="app-icon-sm" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="ts2-flood-area">
          <div className="ts2-flood-header">
            <span className="ts2-flood-label">Context Window</span>
            {phase >= 3 && (
              <motion.span
                className="ts2-token-counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Mostly noise
              </motion.span>
            )}
          </div>

          <div className="ts2-context-window">
            <div className="ts2-token-grid">
              <AnimatePresence>
                {phase >= 2 && ALL_TOKENS.map((token, i) => (
                  <motion.div
                    key={token.id}
                    className={`ts2-token-block ${token.relevant ? 'ts2-token-relevant' : 'ts2-token-noise'}`}
                    initial={{ opacity: 0, scale: 0.6, y: -8 }}
                    animate={{ opacity: token.relevant ? 1 : 0.4, scale: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    title={token.label}
                  >
                    <img src={token.logo} alt="" className="ts2-token-icon" />
                    <span className="ts2-token-text">{token.label}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="ts2-fill-track">
              <motion.div
                className="ts2-fill-bar"
                initial={{ width: '0%' }}
                animate={phase >= 2 ? { width: '100%' } : {}}
                transition={{ delay: 0.3, duration: 2.5, ease: 'linear' }}
              />
              <motion.div
                className="ts2-fill-signal"
                initial={{ width: '0%' }}
                animate={phase >= 3 ? { width: '7%' } : {}}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              />
              {phase >= 4 && (
                <motion.span
                  className="ts2-overflow-badge"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  OVERFLOW
                </motion.span>
              )}
            </div>
            {phase >= 3 && (
              <motion.div
                className="ts2-signal-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="ts2-signal-dot ts2-signal-dot-green" />
                Tiny fraction actually useful
              </motion.div>
            )}
          </div>
        </div>

        <div className="ts2-captions">
          {CAPTIONS.map((caption, i) => {
            const showAt = i === 0 ? 2 : 3;
            return phase >= showAt ? (
              <motion.div
                key={i}
                className="ts2-caption"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {caption}
              </motion.div>
            ) : null;
          })}
        </div>

        {phase >= 4 && (
          <motion.div
            className="ts2-hero-line"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            The LLM pays for all of it.
          </motion.div>
        )}
      </div>
    </div>
  );
}
