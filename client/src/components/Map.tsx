/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (result, status) => {
 *     if (status === "OK") {
 *       directionsRenderer.setDirections(result);
 *     }
 *   }
 * );
 *
 * ======
 * 🔑 API Key Setup
 * ======
 * The API key is automatically injected from environment variables.
 * No manual setup required—just use the MapView component.
 *
 * ======
 * 🎯 Key Points
 * ======
 * 1. Google Maps API is loaded once globally; subsequent uses reuse the loaded script.
 * 2. All services (Geocoder, Directions, Places) are available via window.google.maps.
 * 3. Markers and overlays attach directly to the map object.
 * 4. The component is fully managed by Google Maps; React state is not used for map rendering.
 * 5. Use refs to store map instance for external control.
 *
 */

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function usePersistFn<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return ((...args) => ref.current(...args)) as T;
}

declare global {
  interface Window {
    google?: any;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

let mapScriptLoaded = false;
let mapScriptLoading = false;
let mapScriptPromise: Promise<void> | null = null;

function loadMapScript() {
  // If already loaded, resolve immediately
  if (mapScriptLoaded) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (mapScriptLoading && mapScriptPromise) {
    return mapScriptPromise;
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector(
    'script[src*="maps/api/js"]'
  );
  if (existingScript) {
    mapScriptLoaded = true;
    return Promise.resolve();
  }

  // Start loading
  mapScriptLoading = true;
  mapScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      mapScriptLoaded = true;
      mapScriptLoading = false;
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script from:", script.src);
      mapScriptLoading = false;
      mapScriptPromise = null;
      resolve();
    };
    document.head.appendChild(script);
  });

  return mapScriptPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: any;
  initialZoom?: number;
  onMapReady?: (map: any) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
      
      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!mapContainer.current) {
        console.error("Map container not found - ref is null");
        return;
      }

      if (!window.google || !window.google.maps) {
        console.warn("Google Maps API not available - map will not be displayed");
        if (mapContainer.current) {
          mapContainer.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #666; font-size: 14px;">Map unavailable - please check your internet connection</div>';
        }
        return;
      }

      // Ensure container has dimensions
      if (mapContainer.current.offsetHeight === 0) {
        console.warn("Map container has no height - waiting for layout");
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      map.current = new window.google.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });

      if (onMapReady) {
        onMapReady(map.current);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
