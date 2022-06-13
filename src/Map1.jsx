import React, { useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
// import image from "./assets/2.svg";

// const porjectCity = {
//   lat: 36.3302,
//   lng: -119.2921,
// };

const libraries = ["drawing"];

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA73nHO_3GrXOlsSU3PecgsGDAnscV6Ouc",
    libraries: libraries,
  });

  const [, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(centers[0]);
    // map.fitBounds(bounds);

    const bounds = {
      17: [
        [20969, 20970],
        [50657, 50658],
      ],
      18: [
        [41939, 41940],
        [101315, 101317],
      ],
      19: [
        [83878, 83881],
        [202631, 202634],
      ],
      20: [
        [167757, 167763],
        [405263, 405269],
      ],
    };

    // eslint-disable-next-line no-undef
    const imageMapType = new google.maps.ImageMapType({
      getTileUrl: function (coord, zoom) {
        if (
          zoom < 17 ||
          zoom > 20 ||
          bounds[zoom][0][0] > coord.x ||
          coord.x > bounds[zoom][0][1] ||
          bounds[zoom][1][0] > coord.y ||
          coord.y > bounds[zoom][1][1]
        ) {
          return "";
        }

        return [
          "https://www.gstatic.com/io2010maps/tiles/5/L2_",
          zoom,
          "_",
          coord.x,
          "_",
          coord.y,
          ".png",
        ].join("");
      },
      // eslint-disable-next-line no-undef
      tileSize: new google.maps.Size(256, 256),
    });

    map.overlayMapTypes.push(imageMapType);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <>
      {isLoaded ? (
        <div>
          <GoogleMap
            mapContainerStyle={{
              height: "100vh",
              width: "100vw",
            }}
            center={{ lat: 37.783, lng: -122.403 }}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapTypeId="satellite"
            zoom={17}
          ></GoogleMap>
        </div>
      ) : null}
    </>
  );
};

export default Map;
