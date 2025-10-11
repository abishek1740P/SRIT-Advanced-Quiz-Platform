// src/components/BackgroundElements.tsx
interface BackgroundElementsProps {
  className?: string;
}

export function BackgroundElements({ className = "" }: BackgroundElementsProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl sm:-top-40 sm:-right-40 sm:w-80 sm:h-80"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl sm:-bottom-40 sm:-left-40 sm:w-80 sm:h-80"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl sm:w-96 sm:h-96"></div>
    </div>
  );
}