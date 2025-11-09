import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  type: 'radar' | 'bar' | 'pie';
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, isActive }) => {

  return (
    <div
      className={`
        relative w-full h-full rounded-full 
        transition-all duration-300 [transform-style:preserve-3d] group 
        ${isActive ? 'hover:[transform:translateZ(40px)]' : ''}
      `}
    >
      {/* Hologram Base */}
      <div 
        className={`
          absolute inset-0 rounded-full bg-white/3 backdrop-blur-md 
          transition-all duration-500
          ${isActive ? 'animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]' : ''}
        `}
        style={{ 
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.15)'
        }}
      />
      
      {/* Hologram Energy Core */}
      <div 
        className="absolute inset-[15%] rounded-full bg-white/10 blur-xl"
      />
      
      {/* Scanline Effect */}
       <div 
        className={`
          absolute inset-0 rounded-full opacity-20
          bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:100%_3px]
          animate-[scanline_8s_linear_infinite]
        `}
        style={{
          '--scanline-start': '-100%',
          '--scanline-end': '200%'
        } as React.CSSProperties}
      />
      <style>{`
        @keyframes pulse {
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.2); }
        }
        @keyframes scanline {
          from { background-position: 0 var(--scanline-start); }
          to { background-position: 0 var(--scanline-end); }
        }
      `}</style>


      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 transition-transform duration-500 ease-out group-hover:[transform:translateZ(30px)]">
        <h3 
          className={`w-full text-center text-base font-semibold p-2 truncate transition-all duration-300`}
          style={{
            color: '#FFFFFF',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.7)'
          }}
        >
          {title}
        </h3>
        <div className="w-full h-[85%]">
          {children}
        </div>
      </div>

      {/* Floor Shadow / Projection */}
      <div 
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full 
          transition-all duration-700 ease-out
        `}
        style={{
          width: isActive ? '80%' : '50%',
          height: isActive ? '30px' : '15px',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: isActive ? 'blur(20px)' : 'blur(10px)',
          opacity: isActive ? 1 : 0.6,
          transform: `translateZ(-50px) rotateX(80deg) translateX(-50%)`
        }}
      />
    </div>
  );
};

export { ChartContainer };