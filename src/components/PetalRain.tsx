import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  rotation: number;
}

export default function PetalRain() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate static set of random petals to avoid re-render performance issues
    const initialPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 12 + 8, // between 8px and 20px
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 20 + 15}s`, // slow floating
      rotation: Math.random() * 360,
    }));
    setPetals(initialPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute top-0 animate-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        >
          {/* A beautiful organic petal shape */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
              opacity: 0.35,
            }}
          >
            <path
              d="M12 2C16 6 22 10 22 15C22 19.5 18 22 12 22C6 22 2 19.5 2 15C2 10 8 6 12 2Z"
              fill="url(#petalGradient)"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2F5" />
                <stop offset="50%" stopColor="#FFDDE8" />
                <stop offset="100%" stopColor="#B76E79" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
