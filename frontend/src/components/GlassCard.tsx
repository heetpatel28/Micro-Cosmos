import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'cyan' | 'purple';
  tiltIntensity?: number;
}

const GlassCard = ({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  tiltIntensity = 15 
}: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowClasses = {
    blue: 'shadow-neon-blue border-neon-blue/30',
    cyan: 'shadow-neon-cyan border-neon-cyan/30',
    purple: 'shadow-neon-purple border-neon-purple/30',
  };

  return (
    <motion.div
      ref={ref}
      className={`glass-card ${glowClasses[glowColor]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

