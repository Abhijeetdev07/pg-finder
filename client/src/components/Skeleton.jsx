export function Skeleton({ width = '100%', height = 16, className = '' }) {
  const style = { width, height };
  return <div style={style} className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="border rounded-3xl overflow-hidden w-[280px] h-[320px] bg-white shadow-sm">
      <div className="w-full h-40 bg-gray-200 animate-pulse" />
      <div className="p-3 space-y-2">
        <Skeleton width="70%" height={20} className="mb-2" />
        <Skeleton width="50%" height={16} />
        <div className="flex justify-between items-center mt-3">
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
      </div>
    </div>
  );
}


