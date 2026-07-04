'use client';

import { useEffect, useRef } from 'react';

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const colors = ['#3b82f6', '#8b5cf6', '#6366f1', '#a855f7', '#ec4899']; // Brilliant Blues, Purples, and Neon Pink

    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      angle: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.z = Math.random() * 150; // Z depth for parallax and glowing
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.8 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX * (this.z * 0.02);
        this.y += this.speedY * (this.z * 0.02);

        // Fluid morphing wave motion
        this.angle += 0.02;
        this.y += Math.sin(this.angle + this.x * 0.005) * 1.5;
        this.x += Math.cos(this.angle + this.y * 0.005) * 0.5;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        // Perspective scaling
        const depthSize = this.size * (this.z * 0.02);
        
        ctx.arc(this.x, this.y, Math.max(0.5, depthSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Intense bloom effect for closer particles (like the MP4)
        if (this.z > 100) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      particles = [];
      // High density for the morphing aesthetic
      const count = window.innerWidth < 768 ? 80 : 300;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Trail effect for motion blur
      ctx.fillStyle = 'rgba(2, 8, 23, 0.2)'; // Fades out the old frames slowly
      ctx.fillRect(0, 0, w, h);
      
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Web connections for the "mesh" look
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dz = Math.abs(particles[i].z - particles[j].z);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 90 && dz < 30) {
                ctx.beginPath();
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = 0.15 * (1 - distance / 90);
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover"
        style={{ opacity: 0.85 }}
      />
    </div>
  );
}
