import React from 'react';

const Bar = ({ className }) => <div className={`rounded-full bg-white/[0.08] ${className}`} />;

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse" aria-hidden="true">
    {/* hero */}
    <div className="flex flex-col items-center gap-5 pt-4">
      <Bar className="h-6 w-56" />
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/[0.06]" />
        <div className="font-display font-extrabold text-[clamp(4.2rem,17vw,8.5rem)] leading-none text-white/10 select-none">
          --°
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-panel rounded-xl h-14" />
        ))}
      </div>
    </div>

    {/* hourly strip */}
    <div className="glass-panel p-5 sm:p-6">
      <Bar className="h-3 w-28 mb-4" />
      <div className="flex gap-1.5 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="shrink-0 w-[68px] h-[104px] rounded-2xl bg-white/[0.05]" />
        ))}
      </div>
    </div>

    {/* wind/uv + aqi row */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-panel p-5 grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <Bar className="h-3 w-16 self-start" />
            <div className="w-24 h-24 rounded-full bg-white/[0.05] my-auto" />
            <Bar className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="glass-panel p-5 space-y-4">
        <Bar className="h-3 w-24" />
        <Bar className="h-9 w-36" />
        <div className="h-2.5 rounded-full flex overflow-hidden opacity-60">
          {['#4ADE80', '#FBBF24', '#FB923C', '#F87171', '#C084FC'].map((c) => (
            <span key={c} style={{ background: c, width: '20%' }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Bar className="h-12 rounded-xl" />
          <Bar className="h-12 rounded-xl" />
        </div>
      </div>
    </div>

    {/* outlook + laundry row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-5 space-y-3">
        <Bar className="h-3 w-28 mb-2" />
        {[...Array(3)].map((_, i) => (
          <Bar key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
      <div className="glass-panel p-5 space-y-3">
        <Bar className="h-3 w-32 mb-2" />
        <Bar className="h-7 w-44" />
        <Bar className="h-4 w-full max-w-xs" />
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          {[...Array(4)].map((_, i) => (
            <Bar key={i} className="h-4 w-3/4" />
          ))}
        </div>
      </div>
    </div>

    {/* advisories */}
    <div className="glass-panel p-5">
      <Bar className="h-3 w-24 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[...Array(4)].map((_, i) => (
          <Bar key={i} className={`h-16 rounded-2xl ${i === 3 ? 'sm:col-span-3' : ''}`} />
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
