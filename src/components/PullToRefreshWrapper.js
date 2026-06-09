import React, { useRef, useState, useCallback } from 'react';

const PullToRefreshWrapper = ({ onRefresh, children }) => {
    const touchStartY = useRef(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const handleTouchStart = (e) => {
        if (window.scrollY === 0) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (window.scrollY !== 0) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;
        if (diff > 0 && !refreshing) {
            setPullDistance(Math.min(diff, 80));
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > 40 && !refreshing) {
            setRefreshing(true);
            setPullDistance(0);
            await onRefresh();
            setRefreshing(false);
        }
        setPullDistance(0);
    };

    return (
        <div
            onTouchStart={ handleTouchStart }
            onTouchMove={ handleTouchMove }
            onTouchEnd={ handleTouchEnd }
        >
            { pullDistance > 0 && (
                <div
                    className="flex justify-center items-center text-sm text-text-secondary py-2"
                    style={ { height: pullDistance } }
                >
                    { refreshing ? '🔄 Refreshing...' : '↓ Pull to refresh' }
                </div>
            ) }
            { children }
        </div>
    );
};

export default PullToRefreshWrapper;