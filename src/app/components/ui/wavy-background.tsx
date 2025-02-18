"use client";  
import { cn } from "@/app/lib/utils";  
import React, { useEffect, useRef, useCallback, useMemo } from "react";  
// @ts-expect-error: noisejs does not have TypeScript definitions, suppressing error for usage.  
import { Noise } from "noisejs"; // Add a description for @ts-expect-error  

export const WavyBackground = ({  
  children,  
  className,  
  containerClassName,  
  colors,  
  waveWidth = 50,  
  backgroundFill = "black",  
  blur = 10,  
  speed = "fast",  
  waveOpacity = 0.5,  
  ...props  
}: {  
  children?: React.ReactNode;  
  className?: string;  
  containerClassName?: string;  
  colors?: string[];  
  waveWidth?: number;  
  backgroundFill?: string;  
  blur?: number;  
  speed?: "slow" | "fast";  
  waveOpacity?: number;  
}) => {  
  const noise = useMemo(() => new Noise(Math.random()), []); // ✅ Using Perlin Noise  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);  
  const animationRef = useRef<number | null>(null);  

  const getSpeed = useCallback(() => (speed === "slow" ? 0.001 : 0.002), [speed]);  

  const waveColors = useMemo(  
    () =>  
      colors ?? [  
        "#38bdf8",  
        "#818cf8",  
        "#c084fc",  
        "#e879f9",  
        "#22d3ee",  
      ],  
    [colors]  
  );  

  const drawWave = useCallback(  
    (ctx: CanvasRenderingContext2D, width: number, height: number, nt: number) => {  
      ctx.clearRect(0, 0, width, height);  
      ctx.fillStyle = backgroundFill;  
      ctx.globalAlpha = waveOpacity;  
      ctx.fillRect(0, 0, width, height);  
      ctx.filter = `blur(${blur}px)`;  

      for (let i = 0; i < 5; i++) {  
        ctx.beginPath();  
        ctx.lineWidth = waveWidth;  
        ctx.strokeStyle = waveColors[i % waveColors.length];  

        for (let x = 0; x < width; x += 5) {  
          const y = noise.perlin2(x / 800, nt) * 100; // ✅ Using Perlin noise  
          ctx.lineTo(x, y + height * 0.5);  
        }  
        ctx.stroke();  
        ctx.closePath();  
      }  
    },  
    [waveColors, waveWidth, backgroundFill, blur, waveOpacity, noise]  
  );  

  const render = useCallback(() => {  
    const canvas = canvasRef.current;  
    if (!canvas) return;  

    const ctx = canvas.getContext("2d");  
    if (!ctx) return;  

    const width = (canvas.width = window.innerWidth);  
    const height = (canvas.height = window.innerHeight);  
    let nt = 0;  

    const animate = () => {  
      nt += getSpeed();  
      drawWave(ctx, width, height, nt);  
      animationRef.current = requestAnimationFrame(animate);  
    };  

    animate();  
  }, [drawWave, getSpeed]);  

  useEffect(() => {  
    render();  

    const handleResize = () => {  
      const canvas = canvasRef.current;  
      if (canvas) {  
        canvas.width = window.innerWidth;  
        canvas.height = window.innerHeight;  
      }  
    };  

    window.addEventListener("resize", handleResize);  

    return () => {  
      if (animationRef.current) cancelAnimationFrame(animationRef.current);  
      window.removeEventListener("resize", handleResize);  
    };  
  }, [render]);  

  return (  
    <div className={cn("h-screen flex flex-col items-center justify-center", containerClassName)}>  
      <canvas className="absolute inset-0 z-0" ref={canvasRef}></canvas>  
      <div className={cn("relative z-10", className)} {...props}>  
        {children}  
      </div>  
    </div>  
  );  
};