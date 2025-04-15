
import { useState, useEffect } from 'react';

const IntroAnimation = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'growing' | 'zooming' | 'complete'>('initial');

  useEffect(() => {
    // Initial delay
    const timer1 = setTimeout(() => {
      setAnimationStage('growing');
    }, 500);
    
    // Logo grows
    const timer2 = setTimeout(() => {
      setAnimationStage('zooming');
    }, 2000);
    
    // Logo zooms in
    const timer3 = setTimeout(() => {
      setAnimationStage('complete');
    }, 3500);
    
    // Animation completes
    const timer4 = setTimeout(() => {
      onAnimationComplete();
    }, 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-orange">
      <div 
        className={`transition-all duration-1500 ease-in-out ${
          animationStage === 'initial' ? 'scale-[0.2] opacity-0' : 
          animationStage === 'growing' ? 'scale-100 opacity-100' : 
          animationStage === 'zooming' ? 'scale-[1.8] opacity-100' :
          'scale-[3] opacity-0'
        }`}
      >
        <img 
          src="/intro1.PNG" 
          alt="ECOVLUU Logo" 
          className="max-w-[260px] max-h-[160px] object-contain md:max-w-[160px] md:max-h-[160px]"
        />
      </div>
      </div>
    
  );
};

export default IntroAnimation;
