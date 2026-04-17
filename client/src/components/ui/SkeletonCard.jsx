export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: 0 }} />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-3 w-14 rounded-full" />
        </div>
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="skeleton w-7 h-7 rounded-lg" />
            <div className="skeleton h-3.5 w-24" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-3 w-10" />
            <div className="skeleton h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
export function SkeletonHero() {
  return <div className="skeleton rounded-2xl" style={{ height: '460px' }} />;
}
export function SkeletonList() {
  return (
    <div className="flex items-center gap-4 p-3.5">
      <div className="skeleton w-8 h-6 rounded" />
      <div className="skeleton w-16 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-4/5" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
