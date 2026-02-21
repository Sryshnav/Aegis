import React from 'react';

const Speedometer = ({ speed = 0, maxSpeed = 200 }) => {
    // — Geometry —
    const cx = 100;
    const cy = 80;
    const r = 78;

    const startAngle = -210;
    const endAngle = 30;
    const totalAngle = endAngle - startAngle; // 240°

    const clampedSpeed = Math.max(0, Math.min(speed, maxSpeed));

    // Arc length in SVG units (circumference of the partial circle)
    const totalArcLength = (totalAngle / 360) * 2 * Math.PI * r; // ~326

    // How much of the arc to fill
    const activeFraction = clampedSpeed / maxSpeed;
    const activeLength = activeFraction * totalArcLength;
    const gapLength = totalArcLength - activeLength;

    // Helper: polar → Cartesian (0° = 12 o'clock, increases clockwise)
    const polar = (angleDeg, radius = r) => {
        const rad = (angleDeg - 90) * (Math.PI / 180);
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad),
        };
    };

    // Single arc path from startAngle to endAngle (always 240°, large arc)
    const fullArc = () => {
        const s = polar(startAngle);
        const e = polar(endAngle);
        // 240° > 180° → large-arc-flag = 1, sweep clockwise = 1
        return `M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${e.x} ${e.y}`;
    };

    // Needle angle
    const needleAngle = startAngle + activeFraction * totalAngle;
    const tip = polar(needleAngle, r - 10);
    const back = polar(needleAngle + 180, 14);

    // Colour based on speed
    const needleColor =
        clampedSpeed < 60 ? '#50805F' :
            clampedSpeed < 120 ? '#D98845' : '#BD4C45';

    // Zone boundaries (arc-length offsets from start)
    const zone1ArcLen = (60 / maxSpeed) * totalArcLength;
    const zone2ArcLen = (120 / maxSpeed) * totalArcLength;

    // Tick marks (21 ticks, 0–200 in steps of 10)
    const ticks = Array.from({ length: 21 }, (_, i) => {
        const pct = i / 20;
        const a = startAngle + pct * totalAngle;
        const major = i % 5 === 0;
        return {
            inner: polar(a, r - (major ? 16 : 10)),
            outer: polar(a, r),
            label: Math.round(pct * maxSpeed),
            labelPt: polar(a, r - 27),
            major,
        };
    });

    const path = fullArc();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg
                viewBox="0 -10 200 185"
                width="100%"
                style={{ maxWidth: 300, display: 'block', margin: '0 auto' }}
            >
                {/* ── Background track ── */}
                <path
                    d={path}
                    fill="none"
                    stroke="#E8E2D9"
                    strokeWidth={10}
                    strokeLinecap="round"
                />

                {/* ── Zone colour hints (same path, different dash offsets) ── */}
                {/* Green 0–60 */}
                <path d={path} fill="none" stroke="rgba(80,128,95,0.25)"
                    strokeWidth={10} strokeLinecap="butt"
                    strokeDasharray={`${zone1ArcLen} ${totalArcLength - zone1ArcLen}`}
                    strokeDashoffset={0}
                />
                {/* Amber 60–120 */}
                <path d={path} fill="none" stroke="rgba(217,136,69,0.25)"
                    strokeWidth={10} strokeLinecap="butt"
                    strokeDasharray={`${zone2ArcLen - zone1ArcLen} ${totalArcLength - (zone2ArcLen - zone1ArcLen)}`}
                    strokeDashoffset={-zone1ArcLen}
                />
                {/* Red 120–200 */}
                <path d={path} fill="none" stroke="rgba(189,76,69,0.25)"
                    strokeWidth={10} strokeLinecap="butt"
                    strokeDasharray={`${totalArcLength - zone2ArcLen} ${zone2ArcLen}`}
                    strokeDashoffset={-zone2ArcLen}
                />

                {/* ── Active filled arc (same path, dash trick) ── */}
                <path
                    d={path}
                    fill="none"
                    stroke={needleColor}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${activeLength} ${gapLength}`}
                    strokeDashoffset={0}
                    style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.25,0.8,0.25,1), stroke 0.6s ease' }}
                />

                {/* ── Tick marks & labels ── */}
                {ticks.map((t, i) => (
                    <g key={i}>
                        <line
                            x1={t.inner.x} y1={t.inner.y}
                            x2={t.outer.x} y2={t.outer.y}
                            stroke="#7A6356"
                            strokeWidth={t.major ? 1.8 : 1}
                            opacity={t.major ? 0.7 : 0.35}
                        />
                        {t.major && (
                            <text
                                x={t.labelPt.x} y={t.labelPt.y}
                                textAnchor="middle" dominantBaseline="middle"
                                fontSize="7" fill="#7A6356"
                                fontFamily="'JetBrains Mono', monospace"
                            >
                                {t.label}
                            </text>
                        )}
                    </g>
                ))}

                {/* ── Needle ── */}
                <line
                    x1={back.x} y1={back.y}
                    x2={tip.x} y2={tip.y}
                    stroke={needleColor}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    style={{ transition: 'all 0.6s cubic-bezier(0.25,0.8,0.25,1)' }}
                />

                {/* ── Hub ── */}
                <circle cx={cx} cy={cy} r={7} fill="#34241B" />
                <circle cx={cx} cy={cy} r={4} fill={needleColor}
                    style={{ transition: 'fill 0.6s ease' }}
                />

                {/* ── Speed readout ── */}
                <text x={cx} y={cy + 28}
                    textAnchor="middle" fontSize="20" fontWeight="700"
                    fontFamily="'JetBrains Mono', monospace"
                    fill={needleColor}
                    style={{ transition: 'fill 0.6s ease' }}
                >
                    {clampedSpeed}
                </text>
                <text x={cx} y={cy + 42}
                    textAnchor="middle" fontSize="7" fill="#7A6356"
                    fontFamily="'Outfit', sans-serif" letterSpacing="1"
                >
                    KM/H
                </text>
            </svg>
        </div>
    );
};

export default Speedometer;
