import React, { useRef, useState } from 'react';
import { ArrowDownIcon, RefreshIcon } from './icons';
import Spinner from './Spinner';

const THRESHOLD = 56;
const MAX_PULL = 110;

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
    if (window.scrollY !== 0 || refreshing) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    // rubber-band damping
    if (diff > 0) setPullDistance(Math.min(diff * 0.55, MAX_PULL));
    else setPullDistance(0);
  };

  const handleTouchEnd = async () => {
    if (pullDistance > THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
  };

  const pullPct = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div
        className="flex justify-center items-center overflow-hidden transition-[height] duration-200"
        style={{ height: refreshing ? THRESHOLD : pullDistance }}
        aria-live="polite"
      >
        {refreshing ? (
          <span className="flex items-center gap-2 text-sm text-mist">
            <Spinner size="h-4 w-4" /> Refreshing…
          </span>
        ) : (
          pullDistance > 0 && (
            <span
              className="flex items-center gap-2 text-sm text-mist"
              style={{ opacity: 0.35 + pullPct * 0.65 }}
            >
              <ArrowDownIcon
                className="w-4 h-4 text-horizon transition-transform duration-150"
                style={{ transform: `rotate(${pullPct * -180}deg)` }}
              />
              {pullPct >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          )
        )}
      </div>
      {children}
    </div>
  );
};

export default PullToRefreshWrapper;
