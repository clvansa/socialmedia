import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import styled from "styled-components";
const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 80,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 120,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 200,
    },
};


export const prettyPrintStat = (stat) =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") =>
    data.map((country, index) => (
        
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            fillOpacity={0.4}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
            key={index}
        >
            <Popup>
                <InfoContainer>
                    <InfoFlag
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    ></InfoFlag>
                    <InfoName >{country.country}</InfoName>
                    <InfoConfirmed >
                        Cases: {numeral(country.cases).format("0,0")}
                    </InfoConfirmed>
                    <InfoRecovered >
                        Recovered: {numeral(country.recovered).format("0,0")}
                    </InfoRecovered>
                    <InfoDeaths >
                        Deaths: {numeral(country.deaths).format("0,0")}
                    </InfoDeaths>
                </InfoContainer>
            </Popup>
        </Circle>
    ));



const InfoContainer = styled.div`
    width: 150px;
`
const InfoFlag = styled.div`
  height: 80px;
  width: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`
const InfoName = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #555;
`
const InfoConfirmed = styled.div`
  font-size: 14px;
  margin-top: 5px;
`
const InfoRecovered = styled.div`
  font-size: 14px;
  margin-top: 5px;
`
const InfoDeaths = styled.div`
  font-size: 14px;
  margin-top: 5px;
`