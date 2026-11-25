import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

export default function CrimeMap({ points = [], height = 360 }) {
  const valid = points.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number' && !Number.isNaN(p.latitude) && !Number.isNaN(p.longitude));
  const center = valid.length ? [valid[0].latitude, valid[0].longitude] : [20.5937, 78.9629];
  const zoom = valid.length ? 11 : 5;
  const colorFor = (status) => {
    if (status === 'Resolved') return '#16a34a';
    if (status === 'Rejected') return '#dc2626';
    if (status === 'Under Investigation') return '#7c3aed';
    return '#1d4ed8';
  };
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {valid.map((p) => (
          <CircleMarker key={p._id || p.complaintId} center={[p.latitude, p.longitude]} radius={8} pathOptions={{ color: colorFor(p.status), fillColor: colorFor(p.status), fillOpacity: 0.7 }}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.complaintId || 'Report'}</div>
                <div>{p.title}</div>
                <div>Category: {p.category}</div>
                <div>Status: {p.status}</div>
                <div>{[p.location, p.city, p.district].filter(Boolean).join(', ')}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {!valid.length && <div className="p-3 text-sm text-slate-500">No geolocated incident points available yet.</div>}
    </div>
  );
}
