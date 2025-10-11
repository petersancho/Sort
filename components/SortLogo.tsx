export default function SortLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="black"/>
      <path 
        d="M 30 35 Q 50 20 70 35 L 70 45 Q 50 30 30 45 Z" 
        fill="white"
      />
      <path 
        d="M 30 50 Q 50 35 70 50 L 70 60 Q 50 45 30 60 Z" 
        fill="white"
        opacity="0.7"
      />
      <path 
        d="M 30 65 Q 50 50 70 65 L 70 75 Q 50 60 30 75 Z" 
        fill="white"
        opacity="0.5"
      />
    </svg>
  )
}

