import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { PinDrop } from "@mui/icons-material";

const Map: React.FC = () => {
  // Coordinates for "26 St 478, Phnom Penh, Cambodia"
  const location: LatLngExpression = [11.5449, 104.9213];

  return (
    <MapContainer
      center={location}
      zoom={16}
      style={{ height: "500px", width: "100%" }}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker at the address */}
      <Marker position={location}>
        <Popup>
          <PinDrop />
          26 St 478, Phnom Penh, Cambodia
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
