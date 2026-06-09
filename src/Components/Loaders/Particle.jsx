import { useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const themeColors = ["#3b82f6", "#a855f7", "#ec4899", "#f43f5e"];

    // Generate static initial positions and movement vectors
    const generatedParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2, // 2px to 5px radius
      color: themeColors[Math.floor(Math.random() * themeColors.length)],
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      // Randomize animation speed and start time so they don't move together
      duration: `${Math.random() * 15 + 15}s`, 
      delay: `-${Math.random() * 20}s`,
      // Define a random distance for them to drift across the screen
      tx: `${(Math.random() - 0.5) * 300}px`,
      ty: `${(Math.random() - 0.5) * 300}px`,
    }));

    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Injecting a dedicated keyframe for GPU-accelerated floating.
        Using translate3d forces hardware acceleration on iOS.
      */}
      <style>
        {`
          @keyframes iosFloat {
            0% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(var(--tx), var(--ty), 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
        `}
      </style>
      
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full "
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            // CSS Variables allow us to pass JS math directly to the stylesheet
            "--tx": p.tx,
            "--ty": p.ty,
            animation: `iosFloat ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}