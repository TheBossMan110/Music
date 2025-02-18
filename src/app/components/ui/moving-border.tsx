"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/app/lib/utils";

type ButtonProps = {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
} & React.ComponentPropsWithoutRef<"button">; // ✅ Fix: Allows additional button props without `any`

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps} // ✅ Safe to spread additional props
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration}>
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

type MovingBorderProps = {
  children: React.ReactNode;
  duration?: number;
} & React.SVGProps<SVGSVGElement>; // ✅ Fix: Explicitly define SVG props

export const MovingBorder = ({  
  children,  
  duration = 2000,  
  ...otherProps  
}: MovingBorderProps) => {  
  const pathRef = useRef<SVGPathElement | null>(null);  
  const progress = useMotionValue<number>(0);  

  useAnimationFrame((time) => {  
    if (pathRef.current) {  
      const length = pathRef.current.getTotalLength();  
      if (length) {  
        const pxPerMillisecond = length / duration;  
        progress.set((time * pxPerMillisecond) % length);  
      }  
    }  
  });  

  const x = useTransform(  
    progress,  
    (val) => pathRef.current?.getPointAtLength(val).x || 0  
  );  
  const y = useTransform(  
    progress,  
    (val) => pathRef.current?.getPointAtLength(val).y || 0  
  );  

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;  

  return (  
    <>  
      <svg  
        xmlns="http://www.w3.org/2000/svg"  
        preserveAspectRatio="none"  
        className="absolute h-full w-full"  
        width="100%"  
        height="100%"  
        {...otherProps} // ✅ Spreads only valid SVG props  
      >  
        <path  
          d="M10 10 H 90 V 90 H 10 Z"  
          fill="none"  
          stroke="transparent"  
          ref={pathRef}  
        />  
      </svg>  
      <motion.div  
        style={{  
          position: "absolute",  
          top: 0,  
          left: 0,  
          display: "inline-block",  
          transform,  
        }}  
      >  
        {children}  
      </motion.div>  
    </>  
  );  
};
