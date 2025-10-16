export function Skeleton({ width = '100%', height = 16, className = '' }) {
  const style = { width, height };
  return <div style={style} className={`bg-gray-100 rounded-md animate-pulse ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="border rounded-lg overflow-hidden w-[280px]">
      <div className="w-full h-40 bg-gray-100 animate-pulse" />
      <div className="p-3">
        <Skeleton width="70%" className="mb-2" />
        <Skeleton width="50%" />
      </div>
    </div>
  );
}


