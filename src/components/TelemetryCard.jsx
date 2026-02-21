import React from 'react';
import { Activity, Power } from 'lucide-react';

const TelemetryCard = ({ voltage, ignitionOn }) => {
    let voltageColor = 'var(--status-ok)';
    if (voltage < 2.0) voltageColor = 'var(--status-danger)';
    else if (voltage < 3.5) voltageColor = 'var(--status-warning)';

    return (
        <div className="card">
            <div className="card-header">
                <Activity className="card-icon" size={18} />
                Real-time Telemetry
            </div>

            {/* Big voltage readout */}
            <div className="voltage-display">
                <div>
                    <span className="voltage-value" style={{ color: voltageColor }}>
                        {voltage.toFixed(2)}
                    </span>
                    <span className="voltage-unit">V</span>
                </div>
                <span className="data-label" style={{ marginTop: '0.5rem' }}>Battery Voltage</span>
            </div>

            {/* Ignition Status row — label on left, indicator on right */}
            <div className="data-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Power size={14} style={{ color: 'var(--accent-blue)' }} />
                    Ignition Status
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        className={`status-dot ${ignitionOn ? 'pulse' : ''}`}
                        style={{ backgroundColor: ignitionOn ? 'var(--status-ok)' : 'var(--text-muted)' }}
                    />
                    <span className="data-value" style={{ color: ignitionOn ? 'var(--status-ok)' : 'var(--text-muted)' }}>
                        {ignitionOn ? 'ON' : 'OFF'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TelemetryCard;
