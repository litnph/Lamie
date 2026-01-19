import React, { useEffect, useRef, useState } from 'react';

// --- Icons (SVG Line Art Style) ---
export const LamieLogoIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M18 78C38 78 52 70 58 55C58 55 30 60 28 45C26 32 40 22 50 30C56 35 58 48 58 55C58 55 60 50 64 52C68 55 66 62 60 64C52 66 45 62 58 55C62 52 72 35 80 25" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const LeafIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20.94c1.64-1.12 3-2.6 4-4.28.66-1.1.92-2.3.7-3.48-.34-1.84-1.84-3.34-3.68-3.68-1.18-.22-2.38.04-3.48.7-1.68 1-3.16 2.36-4.28 4L12 20.94z" />
    <path d="M12 20.94c1.12-1.64 2.6-3 4.28-4 1.1-.66 2.3-.92 3.48-.7 1.84.34 3.34 1.84 3.68 3.68.22 1.18-.04 2.38-.7 3.48-1 1.68-2.36 3.16-4 4.28L12 20.94z" transform="rotate(-45 12 20.94)" />
  </svg>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-8 py-3 rounded-full transition-all duration-500 ease-out font-body tracking-wider text-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-mocha-800 text-cream-100 hover:bg-mocha-900 hover:shadow-lg hover:shadow-mocha-100/50",
    outline: "border border-mocha-800 text-mocha-800 hover:bg-mocha-800 hover:text-cream-100",
    text: "text-mocha-800 hover:text-mocha-500 underline decoration-1 underline-offset-4"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Fade In Animation Wrapper ---
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Section Wrapper ---
export const SectionWrapper: React.FC<{ children: React.ReactNode; id?: string; className?: string; noPadding?: boolean }> = ({ children, id, className = "", noPadding = false }) => (
  <section id={id} className={`relative overflow-hidden w-full ${noPadding ? '' : 'py-20 md:py-32'} ${className}`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
      {children}
    </div>
  </section>
);