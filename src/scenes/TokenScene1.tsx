import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUESTION = "What's the latest status on the Acme renewal?";

export function TokenScene1() {
  const [displayText, setDisplayText] = useState('');
  const [showFork, setShowFork] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setDisplayText(QUESTION.slice(0, idx));
      if (idx >= QUESTION.length) {
        clearInterval(timer);
        setTimeout(() => setShowFork(true), 400);
        setTimeout(() => setShowSubtitle(true), 1200);
      }
    }, 38);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="scene token-scene1">
      <motion.div
        className="ts1-prompt"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="material-symbols-rounded ts1-prompt-icon">chat_bubble</span>
        <span className="ts1-prompt-text">
          {displayText}
          <span className="cursor-blink">|</span>
        </span>
      </motion.div>

      <div className="ts1-fork-container">
        <svg
          className="ts1-fork-svg"
          viewBox="0 0 800 200"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Left path — Federated MCP (orange) */}
          <motion.path
            d="M 400 10 C 400 80, 130 100, 130 185"
            fill="none"
            stroke="rgba(255, 126, 76, 0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={showFork ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          {/* Left glow dot */}
          <motion.circle
            cx="130"
            cy="185"
            r="6"
            fill="#FF7E4C"
            initial={{ scale: 0, opacity: 0 }}
            animate={showFork ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: showFork ? 1 : 0, duration: 0.4, ease: 'easeOut' }}
          />
          <motion.circle
            cx="130"
            cy="185"
            r="12"
            fill="none"
            stroke="rgba(255, 126, 76, 0.3)"
            strokeWidth="1.5"
            animate={showFork ? { scale: [0, 1.5, 1.2], opacity: [0, 0.6, 0] } : { scale: 0, opacity: 0 }}
            transition={showFork ? { delay: 1.1, duration: 1.2, repeat: Infinity } : { duration: 0 }}
          />

          {/* Right path — Glean Index (green) */}
          <motion.path
            d="M 400 10 C 400 80, 670 100, 670 185"
            fill="none"
            stroke="rgba(216, 253, 73, 0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={showFork ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: showFork ? 0.15 : 0 }}
          />
          {/* Right glow dot */}
          <motion.circle
            cx="670"
            cy="185"
            r="6"
            fill="#D8FD49"
            initial={{ scale: 0, opacity: 0 }}
            animate={showFork ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: showFork ? 1.15 : 0, duration: 0.4, ease: 'easeOut' }}
          />
          <motion.circle
            cx="670"
            cy="185"
            r="12"
            fill="none"
            stroke="rgba(216, 253, 73, 0.3)"
            strokeWidth="1.5"
            animate={showFork ? { scale: [0, 1.5, 1.2], opacity: [0, 0.6, 0] } : { scale: 0, opacity: 0 }}
            transition={showFork ? { delay: 1.25, duration: 1.2, repeat: Infinity } : { duration: 0 }}
          />

          {/* Origin dot */}
          <motion.circle
            cx="400"
            cy="10"
            r="5"
            fill="rgba(255,255,255,0.8)"
            initial={{ scale: 0, opacity: 0 }}
            animate={showFork ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </svg>

        <div className="ts1-labels">
          <motion.div
            className="ts1-label ts1-label-fed"
            animate={showFork ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: showFork ? 0.8 : 0, duration: 0.4 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 24 }}>hub</span>
            Federated MCP
          </motion.div>
          <motion.div
            className="ts1-label ts1-label-glean"
            animate={showFork ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: showFork ? 0.95 : 0, duration: 0.4 }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 24 }}>database</span>
            Glean Index
          </motion.div>
        </div>
      </div>

      <motion.div
        className="ts1-subtitle"
        animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6 }}
      >
        Two architectures. Same question. Wildly different token consumption.
      </motion.div>
    </div>
  );
}
