'use client';

export default function Logo() {
  return (
    <div className="logo-container w-24 h-24 mx-auto mb-6">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle with pulse animation */}
        <circle
          cx="50"
          cy="50"
          r="45"
          className="logo-circle"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Heart rate line */}
        <path
          className="logo-path"
          d="M20 50 L35 50 L40 30 L50 70 L60 30 L65 50 L80 50"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner circles */}
        <circle
          cx="50"
          cy="50"
          r="8"
          className="logo-path"
          fill="#3B82F6"
          opacity="0.3"
        />
        <circle
          cx="50"
          cy="50"
          r="4"
          className="logo-path"
          fill="#3B82F6"
        />
      </svg>
    </div>
  );
}
