"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export interface PerfumeSmokeTheme {
  primaryGlow: string;    // e.g. "rgba(212, 175, 55,"
  secondaryGlow: string;  // e.g. "rgba(255, 215, 0,"
  smokeCore: string;      // e.g. "rgba(35, 25, 20,"
  particleAccent: string; // e.g. "#D4AF37"
}

interface SmokeRevealCanvasProps {
  imageSrc: string;
  altText: string;
  triggerKey: string | number;
  theme?: PerfumeSmokeTheme;
  className?: string;
}

const DEFAULT_THEME: PerfumeSmokeTheme = {
  primaryGlow: "rgba(212, 175, 55,",
  secondaryGlow: "rgba(245, 210, 120,",
  smokeCore: "rgba(30, 25, 22,",
  particleAccent: "#D4AF37",
};

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  colorType: "core" | "primary" | "secondary" | "sparkle";
}

export const SmokeRevealCanvas: React.FC<SmokeRevealCanvasProps> = ({
  imageSrc,
  altText,
  triggerKey,
  theme = DEFAULT_THEME,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  const [revealProgress, setRevealProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Mouse interaction state
  const mousePosRef = useRef({ x: -1000, y: -1000, active: false });

  // Animation frame ref
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const revealProgressRef = useRef(0);
  const isRevealingRef = useRef(false);

  // Preload Product Image with resilient crossOrigin and fallback logic
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    if (imageSrc.startsWith("http")) {
      img.crossOrigin = "anonymous";
    }
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Retry without crossOrigin if crossOrigin failed
      const fallbackImg = new Image();
      fallbackImg.src = imageSrc;
      fallbackImg.onload = () => {
        imgRef.current = fallbackImg;
        setImageLoaded(true);
      };
      fallbackImg.onerror = () => {
        // Fallback to primary hero_perfume.png if image path is missing
        const defaultImg = new Image();
        defaultImg.src = "/hero_perfume.png";
        defaultImg.onload = () => {
          imgRef.current = defaultImg;
          setImageLoaded(true);
        };
      };
    };
  }, [imageSrc]);

  // Trigger Burst & Reset Mask Reveal whenever triggerKey changes
  const triggerReveal = useCallback(() => {
    revealProgressRef.current = 0;
    setRevealProgress(0);
    isRevealingRef.current = true;

    // Generate heavy smoke burst around center & bottom
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h * 0.55;

    const newParticles: SmokeParticle[] = [];

    // Dense smoke cloud particles
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      const maxLife = 90 + Math.random() * 60;
      newParticles.push({
        x: centerX + Math.cos(angle) * (Math.random() * 40),
        y: centerY + Math.sin(angle) * (Math.random() * 40),
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
        vy: Math.sin(angle) * speed - (Math.random() * 1.5 + 0.5),
        size: Math.random() * 35 + 25,
        maxSize: Math.random() * 90 + 70,
        alpha: 0,
        maxAlpha: Math.random() * 0.45 + 0.35,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        life: 0,
        maxLife,
        colorType: i % 3 === 0 ? "primary" : i % 3 === 1 ? "secondary" : "core",
      });
    }

    // Glowing ember / golden perfume mist sparkles
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      newParticles.push({
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.2 - 0.5,
        size: Math.random() * 3 + 1.5,
        maxSize: Math.random() * 6 + 3,
        alpha: 0,
        maxAlpha: Math.random() * 0.8 + 0.2,
        rotation: 0,
        vRot: 0,
        life: 0,
        maxLife: 70 + Math.random() * 50,
        colorType: "sparkle",
      });
    }

    particlesRef.current = newParticles;
  }, []);

  useEffect(() => {
    triggerReveal();
  }, [triggerKey, triggerReveal]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const container = containerRef.current;

    if (!bgCanvas || !maskCanvas || !container) return;

    const bgCtx = bgCanvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");
    if (!bgCtx || !maskCtx) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      bgCanvas.width = rect.width * dpr;
      bgCanvas.height = rect.height * dpr;
      maskCanvas.width = rect.width * dpr;
      maskCanvas.height = rect.height * dpr;

      bgCtx.scale(dpr, dpr);
      maskCtx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // 1. Advance Mask Reveal progress over ~2.6 seconds (delta * 0.38)
      if (isRevealingRef.current) {
        revealProgressRef.current += delta * 0.38;
        if (revealProgressRef.current >= 1) {
          revealProgressRef.current = 1;
          isRevealingRef.current = false;
        }
        setRevealProgress(revealProgressRef.current);
      }

      const rawVal = revealProgressRef.current;

      // Delay product reveal so smoke/gas cloud swells FIRST (rawVal < 0.22 -> product hidden)
      let pVal = 0;
      if (rawVal > 0.22) {
        const normalized = (rawVal - 0.22) / 0.78;
        // Cubic ease-out for a slow, silky unmasking of the product out of the gas cloud
        pVal = 1 - Math.pow(1 - normalized, 2.5);
      }

      // Clear Canvas
      bgCtx.clearRect(0, 0, width, height);
      maskCtx.clearRect(0, 0, width, height);

      // --- MASK CANVAS RENDERING ---
      // We build an expanding, organic fluid/smoke mask to reveal the perfume image
      if (imgRef.current && imageLoaded) {
        const maskRadius = Math.max(width, height) * (0.05 + pVal * 1.1);
        const centerX = width / 2;
        const centerY = height * 0.5;

        // Base organic circular expansion mask
        maskCtx.save();
        
        // Draw fluid radial gradient expansion
        const grad = maskCtx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          maskRadius
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(Math.min(0.7, pVal), "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.9, `rgba(255, 255, 255, ${Math.min(1, pVal * 1.5)})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        maskCtx.fillStyle = grad;
        maskCtx.beginPath();
        maskCtx.arc(centerX, centerY, maskRadius, 0, Math.PI * 2);
        maskCtx.fill();

        // Add extra swirling mask blobs during reveal for vapor texture edge
        if (pVal < 1.0) {
          particlesRef.current.forEach((pt) => {
            if (pt.colorType !== "sparkle") {
              const maskBlobGrad = maskCtx.createRadialGradient(
                pt.x,
                pt.y,
                0,
                pt.x,
                pt.y,
                pt.size * 1.2
              );
              maskBlobGrad.addColorStop(0, `rgba(255, 255, 255, ${pt.alpha * 0.8})`);
              maskBlobGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

              maskCtx.fillStyle = maskBlobGrad;
              maskCtx.beginPath();
              maskCtx.arc(pt.x, pt.y, pt.size * 1.2, 0, Math.PI * 2);
              maskCtx.fill();
            }
          });
        }

        // Composite product image into mask via destination-in
        maskCtx.globalCompositeOperation = "source-in";

        // Fit & draw perfume image centered inside mask canvas
        const img = imgRef.current;
        const imgAspect = img.width / img.height;

        let drawW = width * 0.85;
        let drawH = drawW / imgAspect;

        if (drawH > height * 0.85) {
          drawH = height * 0.85;
          drawW = drawH * imgAspect;
        }

        const drawX = (width - drawW) / 2;
        const drawY = (height - drawH) / 2;

        maskCtx.drawImage(img, drawX, drawY, drawW, drawH);
        maskCtx.restore();
      }

      // --- SMOKE BACKGROUND CANVAS RENDERING ---
      // Render floating volumetric smoke particles & sparkles
      const particles = particlesRef.current;
      const mouse = mousePosRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += delta * 60;

        // Particle lifecycle alpha & size curve
        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else if (progress > 0.6) {
          p.alpha = (1 - (progress - 0.6) / 0.4) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        p.size += (p.maxSize - p.size) * 0.015;
        p.rotation += p.vRot;

        // Physics movement with upward heat buoyancy & turbulence noise
        p.x += p.vx + Math.sin(p.life * 0.05) * 0.4;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Interactive mouse force
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 15000 && distSq > 0) {
            const force = (15000 - distSq) / 15000;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 1.2;
            p.vy += Math.sin(angle) * force * 1.2;
          }
        }

        // Render Particle
        if (p.colorType === "sparkle") {
          bgCtx.save();
          bgCtx.fillStyle = theme.particleAccent;
          bgCtx.globalAlpha = p.alpha;
          bgCtx.beginPath();
          bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          bgCtx.fill();
          
          // Glow halo
          bgCtx.fillStyle = `${theme.primaryGlow}${p.alpha * 0.4})`;
          bgCtx.beginPath();
          bgCtx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          bgCtx.fill();
          bgCtx.restore();
        } else {
          bgCtx.save();
          bgCtx.translate(p.x, p.y);
          bgCtx.rotate(p.rotation);

          const radGrad = bgCtx.createRadialGradient(0, 0, 0, 0, 0, p.size);

          if (p.colorType === "primary") {
            radGrad.addColorStop(0, `${theme.primaryGlow}${p.alpha})`);
            radGrad.addColorStop(0.5, `${theme.primaryGlow}${p.alpha * 0.4})`);
            radGrad.addColorStop(1, `${theme.primaryGlow}0)`);
          } else if (p.colorType === "secondary") {
            radGrad.addColorStop(0, `${theme.secondaryGlow}${p.alpha * 0.9})`);
            radGrad.addColorStop(0.6, `${theme.secondaryGlow}${p.alpha * 0.3})`);
            radGrad.addColorStop(1, `${theme.secondaryGlow}0)`);
          } else {
            radGrad.addColorStop(0, `${theme.smokeCore}${p.alpha * 0.7})`);
            radGrad.addColorStop(0.7, `${theme.smokeCore}${p.alpha * 0.2})`);
            radGrad.addColorStop(1, `${theme.smokeCore}0)`);
          }

          bgCtx.fillStyle = radGrad;
          bgCtx.beginPath();
          bgCtx.arc(0, 0, p.size, 0, Math.PI * 2);
          bgCtx.fill();
          bgCtx.restore();
        }

        // Respawn continuous ambient particles
        if (p.life >= p.maxLife) {
          const centerX = width / 2;
          const centerY = height * 0.65;
          p.life = 0;
          p.x = centerX + (Math.random() - 0.5) * (width * 0.6);
          p.y = centerY + (Math.random() - 0.5) * (height * 0.3);
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = -Math.random() * 0.8 - 0.2;
          p.size = Math.random() * 20 + 15;
          p.alpha = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [imageLoaded, theme]);

  // Mouse move / touch handlers for interactive smoke swirling
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair ${className}`}
    >
      {/* Background Volumetric Smoke Canvas */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Mask Revealed Product Image Canvas (Fixed position) */}
      <canvas
        ref={maskCanvasRef}
        className="relative z-10 w-full h-full pointer-events-none drop-shadow-[0_20px_35px_rgba(212,175,55,0.3)]"
      />

      {/* Fallback image when canvas is initializing */}
      {!imageLoaded && (
        <img
          src={imageSrc}
          alt={altText}
          className="w-4/5 h-4/5 object-contain opacity-0 animate-pulse"
        />
      )}

      {/* Ethereal Gas Burst Wave Overlay on slide transition */}
      {revealProgress < 0.85 && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div
            className="w-48 h-48 rounded-full border border-gold-400/40 animate-ping"
            style={{
              animationDuration: "1.2s",
              background: `radial-gradient(circle, ${theme.primaryGlow}0.25) 0%, transparent 70%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};
