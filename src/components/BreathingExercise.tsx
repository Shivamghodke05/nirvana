import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('rest');
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // 4-7-8 breathing technique timing (in seconds)
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2
  };

  const phaseMessages = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest'
  };

  const phaseColors = {
    inhale: 'hsl(var(--breath-in))',
    hold: 'hsl(var(--breath-hold))',
    exhale: 'hsl(var(--breath-out))',
    rest: 'hsl(var(--muted))'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      const currentDuration = phaseDurations[phase] * 1000; // Convert to milliseconds
      
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = 100 / (currentDuration / 50); // Update every 50ms
          const newProgress = prev + increment;
          
          if (newProgress >= 100) {
            // Move to next phase
            const phaseOrder: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phaseOrder.indexOf(phase);
            const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
            
            setPhase(nextPhase);
            
            // Count cycles (complete when returning to inhale)
            if (nextPhase === 'inhale' && phase === 'rest') {
              setCycleCount(prev => prev + 1);
            }
            
            return 0;
          }
          
          return newProgress;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('inhale');
      setProgress(0);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('rest');
    setProgress(0);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 1 + (progress / 100) * 0.5; // Scale from 1 to 1.5
      case 'exhale':
        return 1.5 - (progress / 100) * 0.3; // Scale from 1.5 to 1.2
      case 'hold':
        return 1.5; // Stay large
      default:
        return 1; // Normal size
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-background/50 backdrop-blur-sm ">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          Breathing Exercise
        </CardTitle>
        <p className="text-muted-foreground">4-7-8 Breathing Technique</p>
      </CardHeader>
      
      <CardContent className="text-center space-y-6 text-b">
        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center h-64">
          <motion.div
            className="absolute w-48 h-48 rounded-full border-4 border-dashed border-muted/30"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ 
              duration: isActive ? 20 : 0,
              repeat: isActive ? Infinity : 0,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: `radial-gradient(circle, ${phaseColors[phase]}, ${phaseColors[phase]}CC)`,
            }}
            animate={{ 
              scale: getCircleScale(),
            }}
            transition={{ 
              duration: isActive ? phaseDurations[phase] * 0.8 : 0.5,
              ease: "easeInOut"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-black dark:text-white font-semibold text-lg">
                  {phaseMessages[phase]}
                </div>
                {isActive && (
                  <div className="text-black/80 dark:text-white/80 text-sm mt-1">
                    {Math.ceil((phaseDurations[phase] * (100 - progress)) / 100)}s
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${phaseColors[phase]}, ${phaseColors[phase]}AA)`,
              width: `${progress}%`
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Cycles: {cycleCount}</span>
          <span>Phase: {phaseMessages[phase]}</span>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={toggleExercise}
            className="gradient-primary text-primary-foreground border-0"
            size="lg"
          >
            {isActive ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Start</>
            )}
          </Button>
          
          <Button
            onClick={resetExercise}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>

        {cycleCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-success/10 border border-success/20 rounded-lg"
          >
            <p className="text-success font-medium">
              Great job! You've completed {cycleCount} breathing cycle{cycleCount > 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep going to enhance the calming effect.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;