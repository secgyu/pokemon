export function PokeballSpinner({ size = 48 }: { size?: number }) {
  return (
    <div role="status" aria-label="로딩중" className="flex items-center justify-center p-8">
      <svg width={size} height={size} viewBox="0 0 100 100" className="animate-pokeball-wobble">
        <circle cx="50" cy="50" r="48" fill="#cc0000" stroke="#2a2a4a" strokeWidth="4" />
        <rect x="2" y="46" width="96" height="8" fill="#2a2a4a" />
        <circle cx="50" cy="50" r="48" fill="url(#spinHalf)" stroke="#2a2a4a" strokeWidth="4" />
        <defs>
          <linearGradient id="spinHalf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cc0000" />
            <stop offset="46%" stopColor="#cc0000" />
            <stop offset="46%" stopColor="#2a2a4a" />
            <stop offset="54%" stopColor="#2a2a4a" />
            <stop offset="54%" stopColor="#f0f0f0" />
            <stop offset="100%" stopColor="#f0f0f0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="12" fill="#f0f0f0" stroke="#2a2a4a" strokeWidth="4" />
        <circle cx="50" cy="50" r="6" fill="#2a2a4a" />
      </svg>
    </div>
  );
}
