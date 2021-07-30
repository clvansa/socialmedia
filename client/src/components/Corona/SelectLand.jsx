import { useState, useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";
import { Avatar } from "@material-ui/core";

const SelectLand = ({
  setCountryInfo,
  countries,
  setMapCenter,
  setMapZoom,
  onContryChange,
  countrySelected,
}) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "200px",
        justifyContent: "space-evenly",
      }}
    >
      <SelectImg src={`${PF}/corona/global.png`} />
      <FormControl>
        <SelectMenu
          variant="standard"
          value={countrySelected}
          onChange={(e) => onContryChange(e.target.value)}
          disableUnderline
        >
          <MenuItemStyled value="worldwide">World wide</MenuItemStyled>
          {countries.map((country, index) => (
            <MenuItemStyled key={index} value={country.value}>
              {country.name}
            </MenuItemStyled>
          ))}
        </SelectMenu>
      </FormControl>
    </div>
  );
};

export default SelectLand;

const SelectImg = styled.img`
  width: 60px;
  height: 60px;

  @media (max-width: 810px) {
    width: 30px;
    height: 30px;
  }
`;

const SelectMenu = styled(Select)`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.tintColorSecondary} !important;

  @media (max-width: 810px) {
    width: 75px;
  }
`;

const MenuItemStyled = styled(MenuItem)`
  color: ${(props) => props.theme.tintColorSecondary} !important;
  background-color: ${(props) =>
    props.theme.backgroundColorSecondary} !important;
`;
