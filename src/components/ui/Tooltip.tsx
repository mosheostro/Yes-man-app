"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * Desktop-only tooltip — only renders on devices that support true hover
 * (mouse/trackpad). On touch-only devices (iOS/Android) it renders children
 * unchanged and the tooltip bubble is never shown.
 *
 * Detection: CSS Media Feature `(hover: hover) and (pointer: fine)`.
 * This matches mice and trackpads, not touchscreens.
 */
export function Tooltip({ content, children, position = "top", className = "" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  // Only enable on devices that have a real hover capability (desktop/mouse).
  // Defaults to false (hidden) until we verify on the client — this also
  // prevents any tooltip flash during SSR hydration.
  const [hoverDevice, setHoverDevice] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHoverDevice(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const positionClasses = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => hoverDevice && setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => hoverDevice && setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && hoverDevice && (
        <div className={`absolute z-50 pointer-events-none ${positionClasses[position]}`}>
          <div className="bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 max-w-[200px] text-center shadow-lg whitespace-normal leading-snug">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
