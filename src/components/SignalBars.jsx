import React from 'react';

// signal: 0–31 (AT+CSQ scale) or treat as 0–100 percentage
// We'll accept 0–31 and map to 5 bars
const SignalBars = ({ signal = 0, maxSignal = 31 }) => {
    const totalBars = 5;
    const filledBars = signal <= 0
        ? 0
        : Math.min(totalBars, Math.ceil((signal / maxSignal) * totalBars));

    const barColor = (i) => {
        if (i >= filledBars) return '#E8E2D9'; // unfilled — latte border
        if (filledBars <= 1) return '#BD4C45'; // 1 bar — cherry red
        if (filledBars <= 2) return '#D98845'; // 2 bars — cinnamon
        return '#50805F';                       // 3–5 bars — matcha green
    };

    return (
        <span
            title={`Signal: ${signal}/${maxSignal}`}
            style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}
        >
            {Array.from({ length: totalBars }, (_, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        width: '4px',
                        borderRadius: '1px',
                        height: `${(i + 1) * 3 + 3}px`, // 6 9 12 15 18 px
                        backgroundColor: barColor(i),
                        transition: 'background-color 0.5s ease',
                    }}
                />
            ))}
        </span>
    );
};

export default SignalBars;
