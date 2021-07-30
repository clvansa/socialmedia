import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent } from '@material-ui/core';
import axios from 'axios';
import SelectLand from '../components/Corona/SelectLand';
import InfoBox from '../components/Corona/InfoBox';
import CovidMap from '../components/Corona/CovidMap';
import Table from '../components/Corona/Table';
import LineGraph from '../components/Corona/LineGraph';
import { prettyPrintStat } from '../util/showDataOnMap';
import Topbar from '../components/Header/Topbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Typography from '@material-ui/core/Typography';

const Covid = () => {
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [countrySelected, setCountrySelected] = useState("worldwide");
    const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });

    const [mapZoom, setMapZoom] = useState(2);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("https://disease.sh/v3/covid-19/all/");
                setCountryInfo(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const getCountries = async () => {
            try {
                const res = await axios.get(
                    "https://disease.sh/v3/covid-19/countries/"
                );
                const resCountries = res.data.map((country) => ({
                    name: country.country,
                    value: country.countryInfo.iso2,
                }));
                setCountries(resCountries);
                setTableData(res.data.sort((a, b) => (a.cases > b.cases ? -1 : 1)));
                setMapCountries(res.data)
            } catch (err) {
                console.log(err);
            }
        };

        getCountries();
    }, []);



    const onContryChange = async (contryCode) => {
        //   const contryCode = e.target.value;
        setCountrySelected(contryCode);

        const url =
            contryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all/"
                : `https://disease.sh/v3/covid-19/countries/${contryCode}`;

        const res = await axios.get(url);
        setCountryInfo(res.data);

        if (contryCode === "worldwide") {
            setMapCenter({ lat: 20, lng: 0 })
            setMapZoom(2)
        } else {
            setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long])
            setMapZoom(5)
        }
    };

    return (
        <>
            <Topbar />
            <CovidContainer>
                <CovidLeft>
                    <CovidLeftTop>
                        <SelectLand
                            setCountryInfo={setCountryInfo}
                            countries={countries}
                            setMapCenter={setMapCenter}
                            setMapZoom={setMapZoom}
                            onContryChange={onContryChange}
                            countrySelected={countrySelected} />
                        <InfoBoxContainer>
                            <InfoBox
                                onClick={(e) => setCasesType('cases')}
                                title="Cases"
                                cases={prettyPrintStat(countryInfo.todayCases)}
                                total={prettyPrintStat(countryInfo.cases)}
                                isRed
                                active={casesType === "cases"}
                            />
                            <InfoBox
                                onClick={(e) => setCasesType('recovered')}
                                title="Recovered"
                                cases={prettyPrintStat(countryInfo.todayRecovered)}
                                total={prettyPrintStat(countryInfo.recovered)}
                                active={casesType === "recovered"}
                            />
                            <InfoBox
                                onClick={(e) => setCasesType('deaths')}
                                title="Death"
                                cases={prettyPrintStat(countryInfo.todayDeaths)}
                                total={prettyPrintStat(countryInfo.deaths)}
                                isRed
                                active={casesType === "deaths"} />
                        </InfoBoxContainer>
                    </CovidLeftTop>

                    <CovidMap center={mapCenter}
                        zoom={mapZoom}
                        casesType={casesType}
                        countries={mapCountries} />
                </CovidLeft>
                <CovidRight>
                    <CardContent>
                        <Title>Live cases by Country</Title>
                    </CardContent>
                    <Table countries={tableData} onContryChange={onContryChange} />
                    <CardContent>
                        <Title>Worldwide new {casesType} last 30 days</Title>
                    </CardContent>

                    <LineGraph casesType={casesType} />


                </CovidRight>


            </CovidContainer>
        </>
    )
}

export default Covid


const CovidContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding-top: 20px;
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.tintColorSecondary};
    min-height: calc(100vh - 71px);

    @media (max-width: 1360px){
        flex-direction: column;
      
    }
`

const InfoBoxContainer = styled.div`
    display: flex;
    justify-content: space-between;
    
  
`

const CovidLeft = styled.div`
    flex:0.7;
    padding: 0 10px;
    
    @media (max-width: 1360px){
        padding-bottom: 10px;
    }


`
const CovidLeftTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    border-radius: 10px;
    background-color: ${(props) => props.theme.backgroundColorSecondary};


`
const CovidRight = styled.div`
    height: fit-content;
    -webkit-box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
    border-radius: 10px;
    max-width: 400px;
    margin:0 10px;
    background-color: ${(props) => props.theme.backgroundColorSecondary};

    @media (max-width: 1360px){
        max-width: 100%;
        padding-bottom: 20px;
        margin-bottom: 50px;
    }

`

const Title = styled.h3`
    margin: 0;
`