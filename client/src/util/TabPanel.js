import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import Box from '@material-ui/core/Box';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box  >
                    <Container>{children}</Container>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


export default TabPanel

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: 40px;
    flex-wrap: wrap;
    padding-bottom: 40px;
    background-color: ${props => props.theme.backgroundColor};

    @media (max-width : 1039px){
        flex-wrap: nowrap;
    }
    @media (max-width : 400px){
            width: 100vw;
        }
`