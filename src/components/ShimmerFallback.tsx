export function ShimmerFallback({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full max-w-7xl mx-auto px-4 py-16 animate-pulse`}>
      {/* Title shimmer */}
      <div className="h-8 w-64 rounded-lg mb-3" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.03) 25%, rgba(0,212,255,0.08) 50%, rgba(0,212,255,0.03) 75%)', backgroundSize: '200% 100%' }} />
      <div className="h-4 w-96 rounded-lg mb-8" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.02) 25%, rgba(0,212,255,0.05) 50%, rgba(0,212,255,0.02) 75%)', backgroundSize: '200% 100%' }} />
      {/* Grid shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 rounded-xl"
            style={{
              background: 'linear-gradient(90deg, rgba(0,212,255,0.02) 25%, rgba(0,212,255,0.06) 50%, rgba(0,212,255,0.02) 75%)',
              backgroundSize: '200% 100%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
