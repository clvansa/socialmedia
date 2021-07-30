import { useEffect, useState } from "react";
import styled from "styled-components";
import numeral from "numeral";

const Table = ({ countries, onContryChange }) => {
  const [countriesFilter, setCountriesFilter] = useState([]);

  useEffect(() => {
    setCountriesFilter(countries);
  }, [countries]);

  const handleChange = (e) => {
    setCountriesFilter(
      countries.filter((contry) =>
        contry.country.toLowerCase().includes(e.target.value)
      )
    );
  };

  return (
    <>
      <SearchContainer>
        <SearchInput placeholder="Search" onChange={handleChange} />
      </SearchContainer>
      <TableContainer>
        <table>
          <tbody>
            {countriesFilter.map(({ country, cases, countryInfo }, index) => (
              <tr key={index} onClick={() => onContryChange(countryInfo.iso2)}>
                <td>
                  <img src={countryInfo.flag} />
                  {country}
                </td>
                <td>
                  <strong>{numeral(cases).format("0,0")}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </>
  );
};

export default Table;

const TableContainer = styled.div`
  margin-top: 20px;
  overflow-y: scroll;
  height: 400px;
  color: ${(props) => props.theme.tintColorSecondary};
  cursor: pointer;
  min-width: 300px;

  tr:nth-child(odd) {
    background-color: ${(props) => props.theme.backgroundColor};
  }

  tr {
    display: flex;
    justify-content: space-between;
    /* min-width: 400px; */
    padding: 0.5rem;
  }

  td {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    margin: 0;
  }

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 5px;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.hoverColorPrimary};
  }

  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }

  @media (max-width: 1360px) {
    width: 100%;
    tr {
      width: calc(100vw - 180px);
      padding-left: 60px ;
    }
  }
`;

const SearchContainer = styled.div`
  width: 90%;
  padding: 0.5rem 0;
  margin: auto;
  border-radius: 30px;
  background-color: ${(props) => props.theme.inputBackgroundColor};
`;

const SearchInput = styled.input`
  width: 80%;
  padding: 0.5rem;
  margin-left: 40px;
  background-color: inherit;
  border: none;
  font-size: 16px;
  color: ${(props) => props.theme.tintColorSecondary};

  &:focus {
    outline: none;
  }
  ::placeholder {
    color: ${(props) => props.theme.tintColorSecondary};
  }
`;
