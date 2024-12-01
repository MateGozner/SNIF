import { LocationDto } from "@/lib/types/location";
import { useState, useEffect } from "react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/reverse";

export function useGeolocation() {
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionStatus(permission);

      permission.addEventListener("change", () => {
        setPermissionStatus(permission);
        setPermissionDenied(permission.state === "denied");
      });
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<Partial<LocationDto>> => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'SNIF-App/1.0', // Required by Nominatim
            'Accept-Language': 'en' // Get English results
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }

      const data = await response.json();

      return {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        country: data.address?.country
      };
    } catch (error) {
      console.error("Error getting address details:", error);
      return {};
    }
  };

  const getLocation = async (retryAttempt = 0): Promise<LocationDto | undefined> => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported");
    }

    try {
      if (permissionStatus?.state === "denied") {
        const shouldRetry = window.confirm(
          "Location access is required. Please enable it in your browser settings and try again."
        );
        if (shouldRetry) {
          await checkPermission();
          if (retryAttempt < 2) {
            return getLocation(retryAttempt + 1);
          }
        }
        throw new Error("Location permission denied");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
                setPermissionDenied(true);
              }
              reject(new Error(`Geolocation error: ${error.message}`));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      );

      const { latitude, longitude } = position.coords;
      const addressDetails = await getAddressFromCoords(latitude, longitude);

      setPermissionDenied(false);
      return {
        latitude,
        longitude,
        ...addressDetails
      };

    } catch (error) {
      console.error("Error getting location:", error);
      throw error;
    }
  };

  const resetPermissionState = () => {
    setPermissionDenied(false);
    checkPermission();
  };

  return {
    getLocation,
    permissionDenied,
    resetPermissionState,
    permissionStatus: permissionStatus?.state,
  };
}
