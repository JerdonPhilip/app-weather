import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Current weather card skeleton */ }
            <div className="bg-surface-light/60 backdrop-blur-md rounded-card p-6 border border-white/10">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-48 bg-white/10 rounded" />
                    <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 bg-white/10 rounded-full" />
                        <div className="h-12 w-24 bg-white/10 rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mt-4">
                        { [...Array(5)].map((_, i) => (
                            <div key={ i } className="h-14 bg-white/5 rounded-lg" />
                        )) }
                    </div>
                </div>
            </div>
            {/* Hourly skeleton */ }
            <div className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10">
                <div className="h-6 w-32 bg-white/10 rounded mb-4" />
                <div className="flex gap-4 overflow-x-auto">
                    { [...Array(6)].map((_, i) => (
                        <div key={ i } className="h-16 w-16 bg-white/5 rounded-lg flex-shrink-0" />
                    )) }
                </div>
            </div>
            {/* Forecast + laundry row skeleton */ }
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-light/60 rounded-card p-6 border border-white/10">
                    <div className="h-6 w-32 bg-white/10 rounded mb-4" />
                    <div className="grid grid-cols-3 gap-4">
                        { [...Array(3)].map((_, i) => (
                            <div key={ i } className="h-32 bg-white/5 rounded-card" />
                        )) }
                    </div>
                </div>
                <div className="bg-surface-light/50 rounded-card p-5 border border-white/10">
                    <div className="h-6 w-40 bg-white/10 rounded mb-3" />
                    <div className="space-y-3">
                        { [...Array(4)].map((_, i) => (
                            <div key={ i } className="h-5 bg-white/5 rounded w-3/4" />
                        )) }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;