import React from "react";

/**
 * HeartBorderSpinner
 * A heart-shaped border spinner (non-rotating) using SVG stroke animation.
 *
 * Props:
 *  - size: number | string (heart size)
 *  - color: string (stroke color)
 *  - strokeWidth: number (line thickness)
 *  - speed: number (seconds per loop)
 */

export default function HeartBorderSpinner({
  size = 64,
  color = "#ef4444",
  strokeWidth = 2,
  speed = 0.6,
  className = "",
}) {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={sizeValue}
        height={sizeValue}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      >
        {/* Heart outline with moving dash animation */}
        <path
          d="M12 21s-8-5.33-8-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.67-8 10-8 10z"
          strokeDasharray="60"
          strokeDashoffset="60"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur={`${speed}s`}
            repeatCount="indefinite"
            fill="freeze"
          />
        </path>
      </svg>
    </div>
  );
}
