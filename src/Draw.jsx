import React from "react";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import "./Map.css";

const Draw = () => {
  return (
    <MapContainer center={[40.799311, -74.118464]} zoom={8}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Open Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Google Map">
          <ReactLeafletGoogleLayer
            apiKey="AIzaSyA73nHO_3GrXOlsSU3PecgsGDAnscV6Ouc"
            type={"satellite"}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Google Map Hybrid">
          <ReactLeafletGoogleLayer
            apiKey="AIzaSyA73nHO_3GrXOlsSU3PecgsGDAnscV6Ouc"
            type={"hybrid"}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
};

export default Draw;
