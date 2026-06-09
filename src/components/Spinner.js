import React from 'react';

const Spinner = ({ size = 'h-5 w-5', color = 'border-white/60 border-t-white' }) => (
    <div
        className={ `inline-flex animate-spin rounded-full border-2 ${size} ${color}` }
        role="status"
        aria-label="loading"
    />
);

export default Spinner;