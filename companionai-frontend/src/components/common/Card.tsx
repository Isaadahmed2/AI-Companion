import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  children: React.ReactNode;
}

export default function Card({ glow = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glow ? 'glass-panel-glow' : 'glass-panel'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
