import { useState, useEffect } from 'react';
import { CircleMarker, Popup } from 'react-leaflet';

interface UserLocationMarkerProps {
  visible: boolean;
}

export function UserLocationMarker({ visible }: UserLocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(latlng);
        setAccuracy(pos.coords.accuracy);
      },
      () => {
        // Silently fail if geolocation denied
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [visible]);

  if (!visible || !position) return null;

  return (
    <>
      {/* Accuracy circle */}
      <CircleMarker
        center={position}
        radius={Math.min(accuracy / 2, 40)}
        pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1, weight: 1 }}
      />
      {/* Position dot */}
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{ color: '#fff', fillColor: '#3B82F6', fillOpacity: 1, weight: 3 }}
      >
        <Popup>
          <span className="text-sm font-medium">Ma position</span>
        </Popup>
      </CircleMarker>
    </>
  );
}
