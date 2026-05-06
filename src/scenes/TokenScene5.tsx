import { motion } from 'framer-motion';

const STATEMENTS = [
  'Index once. Retrieve precisely.',
  'Every token to the LLM is earned.',
  'Better retrieval > bigger context windows.',
];

const PIPELINE_STAGES = [
  { label: '100+ sources', icon: 'cloud' },
  { label: 'Glean Index', icon: 'database' },
  { label: 'Curated results', icon: 'filter_alt' },
  { label: 'LLM', icon: 'psychology' },
];

function PipelineDot({ delay, duration }: { delay: number; duration: number }) {
  return (
    <motion.div
      className="ts5-dot"
      initial={{ left: '0%', opacity: 0 }}
      animate={{
        left: ['0%', '100%'],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.1, 0.9, 1],
      }}
    />
  );
}

export function TokenScene5() {
  return (
    <div className="scene ts5">
      {/* Statements */}
      <div className="ts5-statements">
        {STATEMENTS.map((statement, i) => (
          <motion.div
            key={i}
            className="ts5-statement"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3 + i * 0.6,
              duration: 0.6,
              type: 'spring',
              stiffness: 100,
              damping: 16,
            }}
          >
            {statement}
          </motion.div>
        ))}
      </div>

      {/* Pipeline diagram */}
      <motion.div
        className="ts5-pipeline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.label} className="ts5-pipeline-segment">
            <motion.div
              className="ts5-stage"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4 + i * 0.2, duration: 0.4 }}
            >
              <span className="material-symbols-rounded ts5-stage-icon">{stage.icon}</span>
              <span className="ts5-stage-label">{stage.label}</span>
            </motion.div>

            {i < PIPELINE_STAGES.length - 1 && (
              <div className="ts5-connector">
                <div className="ts5-connector-line" />
                <PipelineDot delay={3 + i * 0.7} duration={2.2} />
                <PipelineDot delay={3.6 + i * 0.7} duration={2.4} />
                <PipelineDot delay={4.2 + i * 0.7} duration={2.0} />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Breathing background glow */}
      <motion.div
        className="ts5-bg-glow"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
