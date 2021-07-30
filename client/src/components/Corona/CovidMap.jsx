import styled from "styled-components";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { showDataOnMap } from "../../util/showDataOnMap";
import L from "leaflet";

const CovidMap = ({ countries, casesType, center, zoom }) => {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    map.closePopup();
    return null;
  }

  const ChangeColor = ({ center, zoom }) => {
    const map = useMap();
    const c = L.circleMarker(center, zoom, { fillColor: "blue" }).addTo(map);
    return null;
  };

  return (
    <CovidMapContainer>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {countries && showDataOnMap(countries, casesType)}
        {/* <ChangeColor center={center} zoom={zoom} /> */}
      </MapContainer>
    </CovidMapContainer>
  );
};

export default CovidMap;

const CovidMapContainer = styled.div`
  height: 500px;
  background-color: ${(props) => props.theme.backgroundColorSecondary};
  padding: 1rem;
  border-radius: 16px;
  margin-top: 16px;
  box-shadow: 0 0 8px -4px rgba(0, 0, 0, 0.5);
  /* & .MapContainer {
    height: 100%;
  } */
`;
