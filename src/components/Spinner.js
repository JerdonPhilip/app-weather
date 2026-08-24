import React from 'react';

const Spinner = ({ size = 'h-5 w-5', color = 'border-white/30 border-t-horizon' }) => (
    <span
        className={`inline-block animate-spin rounded-full border-2 border-solid ${size} ${color}`}
        role="progressbar"
        aria-label="Loading"
    />
);

export default Spinner;
