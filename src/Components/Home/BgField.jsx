const BgField = ({ position = "absolute", opacity = 30 }) => {
  return (
    <div 
      className={`${position} inset-0 z-0 pointer-events-none overflow-hidden`}
      style={{ opacity: opacity / 100 }}
    >
      {/* Holographic Center Circle */}
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] border border-indigo-500/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_50px_rgba(99,102,241,0.1)]"></div>
      
      {/* Center Dot (Glowing Pink) */}
      <div className="absolute top-1/2 left-1/2 w-[8px] h-[8px] sm:w-[12px] sm:h-[12px] bg-pink-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(236,72,153,0.9)]"></div>

      {/* Vertical Holographic Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent transform -translate-x-1/2"></div>
      
      {/* Horizontal Holographic Line */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent transform -translate-y-1/2"></div>
    </div>
  );
};

export default BgField;