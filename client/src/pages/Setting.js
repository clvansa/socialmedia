import Topbar from "../components/Header/Topbar";
import Container from '@material-ui/core/Container';
import AccountSetting from '../components/Setting/AccontSetting';
import styled from 'styled-components'


const Setting = () => {
    return (
        <SettingContainer>
            <Topbar />
            <Container maxWidth="sm">
                <Title>Account Setting</Title>
                <AccountSetting />
            </Container>
        </SettingContainer>
    )
}

export default Setting


const SettingContainer = styled.div`
    background-color: ${(props) => props.theme.backgroundColor};
    min-height: 100vh;


`
const Title = styled.h3`
    padding-left: 10px;
    color: ${(props) => props.theme.tintColorSecondary};
`