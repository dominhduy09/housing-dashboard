import { useEffect, useRef, useState } from 'react';
import { MapView } from './Map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, DollarSign, TrendingUp } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface PropertyLocation {
  latitude: number;
  longitude: number;
  predicted_price?: number;
  price_in_dollars?: number;
  confidence?: number;
  median_income?: number;
  house_age?: number;
  label?: string;
}

interface PropertyMapProps {
  properties: PropertyLocation[];
  selectedProperty?: PropertyLocation;
  onPropertySelect?: (property: PropertyLocation) => void;
}

export default function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
}: PropertyMapProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // California bounds for reference
  const californiaCenter = { lat: 36.7783, lng: -119.4179 };
  const californiaBounds = {
    north: 42.0,
    south: 32.5,
    east: -114.0,
    west: -124.5,
  };

  const handleMapReady = (map: any) => {
    mapRef.current = map;
    setMapReady(true);
  };

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Clear existing markers and info windows
    markersRef.current.forEach((marker) => marker.element?.remove());
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    if (properties.length === 0) {
      // Center on California if no properties
      mapRef.current.setCenter(californiaCenter);
      mapRef.current.setZoom(6);
      return;
    }

    // Create markers for each property
    properties.forEach((property, index) => {
      const position = { lat: property.latitude, lng: property.longitude };

      // Determine marker color based on price
      let markerColor = '#0ea5a5'; // Default teal
      if (property.price_in_dollars) {
        if (property.price_in_dollars > 800000) {
          markerColor = '#ef4444'; // Red for expensive
        } else if (property.price_in_dollars > 500000) {
          markerColor = '#f97316'; // Orange for moderate-high
        } else if (property.price_in_dollars > 350000) {
          markerColor = '#eab308'; // Yellow for moderate
        }
      }

      // Create custom marker element with price
      const markerDiv = document.createElement('div');
      markerDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      `;

      // Price badge
      const priceBadge = document.createElement('div');
      priceBadge.style.cssText = `
        background-color: ${markerColor};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      priceBadge.textContent = property.price_in_dollars 
        ? `$${(property.price_in_dollars / 1000).toFixed(0)}K`
        : 'N/A';

      // Marker pin
      const pinDiv = document.createElement('div');
      pinDiv.style.cssText = `
        width: 24px;
        height: 24px;
        background-color: ${markerColor};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      markerDiv.appendChild(priceBadge);
      markerDiv.appendChild(pinDiv);

      // Create marker
      const marker = new window.google!.maps.marker.AdvancedMarkerElement({
        position,
        map: mapRef.current,
        title: property.label || `Property ${index + 1}`,
        content: markerDiv,
      });

      // Create info window content
      const infoContent = document.createElement('div');
      infoContent.className = 'p-3 max-w-xs';
      infoContent.innerHTML = `
        <div class="space-y-2">
          <div class="font-semibold text-foreground">
            ${property.label || `Property ${index + 1}`}
          </div>
          ${
            property.price_in_dollars
              ? `<div class="flex items-center gap-2 text-sm">
                  <span class="font-medium text-foreground">Predicted Price:</span>
                  <span class="text-lg font-bold text-accent">$${(property.price_in_dollars / 1000).toFixed(0)}K</span>
                </div>`
              : ''
          }
          ${
            property.confidence
              ? `<div class="flex items-center gap-2 text-sm">
                  <span class="font-medium text-foreground">Confidence:</span>
                  <span class="text-accent">${(property.confidence * 100).toFixed(0)}%</span>
                </div>`
              : ''
          }
          <div class="text-xs text-muted-foreground space-y-1">
            <div>📍 Lat: ${property.latitude.toFixed(4)}, Lng: ${property.longitude.toFixed(4)}</div>
            ${property.median_income ? `<div>💰 Income: $${property.median_income.toFixed(1)}0K</div>` : ''}
            ${property.house_age ? `<div>🏠 Age: ${property.house_age} years</div>` : ''}
          </div>
        </div>
      `;

      const infoWindow = new window.google!.maps.InfoWindow({
        content: infoContent,
      });

      // Add click listener to marker
      marker.addEventListener('click', () => {
        // Close all other info windows
        infoWindowsRef.current.forEach((iw) => iw.close());
        infoWindow.open({
          anchor: marker,
          map: mapRef.current,
        });
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);

      // Open info window for selected property
      if (
        selectedProperty &&
        selectedProperty.latitude === property.latitude &&
        selectedProperty.longitude === property.longitude
      ) {
        infoWindow.open({
          anchor: marker,
          map: mapRef.current,
        });
      }
    });

    // Fit map to bounds of all markers
    if (properties.length > 0) {
      const bounds = new window.google!.maps.LatLngBounds();
      properties.forEach((property) => {
        bounds.extend({ lat: property.latitude, lng: property.longitude });
      });
      mapRef.current.fitBounds(bounds, 50);
    }
  }, [properties, selectedProperty, mapReady, onPropertySelect]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          Property Location Map
        </CardTitle>
        <CardDescription>
          Interactive map showing property locations and predicted prices across California
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Container */}
          <div className="rounded-lg overflow-hidden border border-border">
            <MapView
              initialCenter={californiaCenter}
              initialZoom={6}
              onMapReady={handleMapReady}
              className="w-full h-[400px]"
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">&lt;$350K</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-muted-foreground">$350K-$500K</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-muted-foreground">$500K-$800K</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-muted-foreground">&gt;$800K</span>
            </div>
          </div>

          {/* Property Stats */}
          {properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Total Properties</div>
                <div className="text-2xl font-bold text-foreground">{properties.length}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Avg Price
                </div>
                <div className="text-2xl font-bold text-accent">
                  ${(
                    properties.reduce((sum, p) => sum + (p.price_in_dollars || 0), 0) /
                    properties.length /
                    1000
                  ).toFixed(0)}K
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Avg Confidence
                </div>
                <div className="text-2xl font-bold text-accent">
                  {(
                    (properties.reduce((sum, p) => sum + (p.confidence || 0), 0) /
                      properties.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
            </div>
          )}

          {properties.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No properties to display. Make a prediction to see it on the map.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
