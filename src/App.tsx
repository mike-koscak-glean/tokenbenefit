import { useState, useCallback, useEffect, Component, type ReactNode, type ErrorInfo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StepIndicator } from './components/StepIndicator';
import { TokenScene1 } from './scenes/TokenScene1';
import { TokenScene2 } from './scenes/TokenScene2';
import { TokenScene3 } from './scenes/TokenScene3';
import { TokenScene4 } from './scenes/TokenScene4';
import { TokenScene5 } from './scenes/TokenScene5';
import './App.css';
import './scenes/scenes.css';

class SceneErrorBoundary extends Component<
  { children: ReactNode; resetKey: number },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Scene render error:', error, info);
  }

  componentDidUpdate(prev: { resetKey: number }) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  'The Question',
  'Federated MCP',
  'Glean Index',
  'The Math',
  'Takeaway',
];

const scenes = [TokenScene1, TokenScene2, TokenScene3, TokenScene4, TokenScene5];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (step: number) => {
      if (step < 0 || step >= TOTAL_STEPS || step === currentStep) return;
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep],
  );

  const next = useCallback(() => goTo(currentStep + 1), [goTo, currentStep]);
  const back = useCallback(() => goTo(currentStep - 1), [goTo, currentStep]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, back]);

  const SceneComponent = scenes[currentStep];

  return (
    <div className="app">
      <svg className="noise-svg" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <div className="scene-viewport">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            className="scene-wrapper"
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={{
              enter: (d: number) => ({
                x: d >= 0 ? '60%' : '-60%',
                opacity: 0,
                scale: 0.95,
              }),
              center: {
                x: 0,
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
              exit: (d: number) => ({
                x: d >= 0 ? '-40%' : '40%',
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
              }),
            }}
          >
            <SceneErrorBoundary resetKey={currentStep}>
              <SceneComponent />
            </SceneErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>

      <StepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
        onNext={next}
        onBack={back}
        onGoTo={goTo}
      />
    </div>
  );
}
