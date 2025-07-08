import L from "leaflet";

// Fix for default markers in webpack/Next.js
// This addresses the missing marker icon issue
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker for our app with primary color
const CustomIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#006FEE"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#006FEE"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Alternative orange marker for fallback locations
const FallbackIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#F5A524"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#F5A524"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

export { DefaultIcon, CustomIcon, FallbackIcon };

// Initialize Leaflet configuration
export const initLeaflet = () => {
  // This ensures icons work properly in Next.js
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};
