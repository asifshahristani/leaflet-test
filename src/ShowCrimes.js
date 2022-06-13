import React, { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import "./ShowCrimes.css";
import useSupercluster from "use-supercluster";
import { ImageOverlay, Marker, Popup, Tooltip, useMap } from "react-leaflet";

const iconsPositions = [
  [40.72961724449847, -74.29470062255861],
  [40.77822489268387, -74.30809020996095],
  [40.778744568500976, -74.16732788085939],
  [40.74287726006463, -74.19788360595705],
  [40.77120873129293, -74.20303344726564],
  [40.75847405923122, -74.24629211425783],
  [40.75587484676188, -74.1570281982422],
  [40.75145595233487, -74.15771484375001],
  [40.746516840425414, -74.15325164794923],
];

const icons = {};
const fetchIcon = (count, size) => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
    });
  }
  return icons[count];
};

const cuffs = new L.Icon({
  iconUrl: "/handcuffs.svg",
  iconSize: [25, 25],
});

var latLngBounds = L.latLngBounds([
  [40.799311, -74.118464],
  [40.68202047785919, -74.33],
]);

function ShowCrimes({ data }) {
  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);
  const map = useMap();

  useEffect(() => {
    // L.rectangle(latLngBounds).addTo(map);
    map.fitBounds(latLngBounds);
  }, [map]);

  // get map bounds
  const updateMap = useCallback(
    function updateMap() {
      console.log("updating");
      const b = map.getBounds();
      setBounds([
        b.getSouthWest().lng,
        b.getSouthWest().lat,
        b.getNorthEast().lng,
        b.getNorthEast().lat,
      ]);
      setZoom(map.getZoom());
    },
    [map]
  );

  const onMove = useCallback(() => {
    updateMap();
  }, [updateMap]);

  React.useEffect(() => {
    updateMap();
  }, [map, updateMap]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  const points = data.map((crime) => ({
    type: "Feature",
    properties: { cluster: false, crimeId: crime.id, category: crime.category },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(crime.location.longitude),
        parseFloat(crime.location.latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points: points,
    bounds: bounds,
    zoom: zoom,
    options: { radius: 75, maxZoom: 17 },
  });

  console.log(clusters.length);

  return (
    <>
      {clusters.map((cluster) => {
        // every cluster point has coordinates
        const [longitude, latitude] = cluster.geometry.coordinates;
        // the point may be either a cluster or a crime point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        // we have a cluster to render
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={fetchIcon(
                pointCount,
                10 + (pointCount / points.length) * 40
              )}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    maxZoom
                  );
                  map.setView([latitude, longitude], expansionZoom, {
                    animate: true,
                  });
                },
              }}
            />
          );
        }

        // we have a single point (crime) to render
        return (
          <Marker
            key={`crime-${cluster.properties.crimeId}`}
            position={[latitude, longitude]}
            icon={cuffs}
          />
        );
      })}
      {/* <Marker /> */}

      {/* <Rectangle bounds={latLngBounds} /> */}
      <ImageOverlay
        url="/overlay.jpg"
        bounds={latLngBounds}
        interactive={true}
        // bubblingMouseEvents={false}
        eventHandlers={{
          click: (e) => {
            console.log("Image got clicked!", e);
          },
          //   mouseover: (e) => {
          //     console.log("salam", e);
          //   },
        }}
      >
        {iconsPositions.map((position, index) => (
          <Marker
            icon={L.divIcon({
              className: "div-icon",
              html: `<div> <span class="result-status"></span>$${
                index + 1
              }0${index}K</div>`,
              iconAnchor: [37, 45],
            })}
            position={position}
          />
        ))}

        <Marker
          icon={L.divIcon({
            className: "div-icon",
            html: `<div> <span class="result-status"></span>$504K</div>`,
            iconAnchor: [37, 45],
          })}
          position={[40.775626312669885, -74.11926269531251]}
        ></Marker>

        <Popup autoClose={false}>Salam</Popup>
      </ImageOverlay>
    </>
  );
}

export default ShowCrimes;
