import { useEffect, useState } from "react";

const fallbackCoords = {
  lat: 20.2961,
  lng: 85.8245,
  permission: "fallback"
};

export const useGeoLocation = () => {
  const [coords, setCoords] = useState(fallbackCoords);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          permission: "granted"
        });
      },
      () => {
        setCoords(fallbackCoords);
      }
    );
  }, []);

  return coords;
};
