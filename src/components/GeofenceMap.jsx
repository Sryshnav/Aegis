import React, { useEffect } from 'react';
import { Map as MapIcon, ShieldAlert, ShieldCheck } from 'lucide-react';

const GeofenceMap = ({ currentLat, currentLng, isImmobilized, onGeofenceBreach }) => {
    // Hardcoded for demo: Center of the geofence
    const CENTER_LAT = 10.06;
    const CENTER_LNG = 76.62;

    // Geofence Radius in Kilometers
    const RADIUS_KM = 0.5; // 500 meters

    // The visual map represents a 2km x 2km physical area
    const MAP_BOUNDS_KM = 2.0;

    // Haversine / Flat Earth distance approximation (good enough for 2km grid)
    const latDiffKm = (currentLat - CENTER_LAT) * 111.32;
    const lngDiffKm = (currentLng - CENTER_LNG) * (40075 * Math.cos(CENTER_LAT * (Math.PI / 180)) / 360);

    const distanceFromCenterKm = Math.sqrt(latDiffKm * latDiffKm + lngDiffKm * lngDiffKm);
    const isBreached = distanceFromCenterKm > RADIUS_KM;

    // Only trigger the auto-immobilizer once when it breaches
    useEffect(() => {
        if (isBreached && !isImmobilized) {
            onGeofenceBreach(true);
        }
    }, [isBreached, isImmobilized, onGeofenceBreach]);

    // Map math for UI
    // Center is 50% Top, 50% Left
    let leftPct = 50 + ((lngDiffKm / (MAP_BOUNDS_KM / 2)) * 50);
    let topPct = 50 - ((latDiffKm / (MAP_BOUNDS_KM / 2)) * 50); // Invert Y (Lat increases as you go North/Up)

    // Keep dot physically inside the drawn box even if it goes wildly out of bounds
    leftPct = Math.max(2, Math.min(98, leftPct));
    topPct = Math.max(2, Math.min(98, topPct));

    // The diameter of the circle on the UI relative to the map box
    const circleSizePct = (RADIUS_KM * 2 / MAP_BOUNDS_KM) * 100;

    return (
        <div className="card" style={{ gridColumn: "1 / -1", display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
                <MapIcon className="card-icon" size={18} />
                Live Geofencing Area
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <span className="data-label">Status: </span>
                    <span style={{
                        fontWeight: 'bold',
                        color: isBreached ? 'var(--status-danger)' : 'var(--status-ok)',
                        marginLeft: '8px'
                    }}>
                        {isBreached ? "BREACHED - VEHICLE IMMOBILIZED" : "SECURE - INSIDE ZONE"}
                    </span>
                </div>
            </div>

            <div className="map-container" style={{
                position: 'relative',
                width: '100%',
                flex: 1,
                backgroundColor: '#EAE0D5', // Matches coffee theme
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid rgba(52, 36, 27, 0.1)',
                // Simple map grid background
                backgroundImage: 'linear-gradient(rgba(52, 36, 27, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52, 36, 27, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                {/* The Safe Zone Circle */}
                <div style={{
                    position: 'absolute',
                    width: `${circleSizePct}%`,
                    height: `${circleSizePct}%`,
                    borderRadius: '50%',
                    backgroundColor: isBreached ? 'rgba(189, 76, 69, 0.15)' : 'rgba(80, 128, 95, 0.15)',
                    border: `2px dashed ${isBreached ? 'var(--status-danger)' : 'var(--status-ok)'}`,
                    transition: 'all 0.5s ease',
                    zIndex: 1
                }}></div>

                {/* The Center Anchor Point (Hardware Setup Location) */}
                <div style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-muted)',
                    zIndex: 2
                }}></div>
                <span style={{ position: 'absolute', fontSize: '10px', color: 'var(--text-muted)', marginTop: '24px', zIndex: 2 }}>
                    HQ Center
                </span>

                {/* The Live Vehicle Dot */}
                <div style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: '16px',
                    height: '16px',
                    backgroundColor: isBreached ? 'var(--status-danger)' : 'var(--accent-blue)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: isBreached ? '0 0 15px rgba(189, 76, 69, 0.8)' : '0 0 15px rgba(198, 110, 67, 0.6)',
                    transition: 'left 1s ease-out, top 1s ease-out, background-color 0.5s ease',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Inner pulse */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: `2px solid ${isBreached ? 'var(--status-danger)' : 'var(--accent-blue)'}`,
                        animation: 'pulse-ring 2s infinite',
                        zIndex: -1
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default GeofenceMap;
