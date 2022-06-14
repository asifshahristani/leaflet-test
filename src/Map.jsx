import React from "react";
import { useQuery } from "react-query";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import ShowCrimes from "./ShowCrimes";
import "./Map.css";

const Map = () => {
  const { isLoading, error, data } = useQuery("repoData", () =>
    fetch(
      "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10"
    ).then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log(data);

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
      </LayersControl>

      <ShowCrimes data={data} />
    </MapContainer>
  );
};

export default Map;
