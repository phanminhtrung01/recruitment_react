import { useState, useMemo } from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { styled } from '@mui/material';

import { useTheme, AppBar, Tabs, Tab } from '@mui/material';

export default function TabPanelCustom({ ...props }) {
    const { panel } = props;
    const { titles, children } = panel;

    const StyledTab = useMemo(() => {
        return styled(Tab)({
            minHeight: '30px',
            height: '30px',
            marginRight: '10px',
            color: '#0400b0',
            backgroundColor: '#5454694c',
            textTransform: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            borderBottom: '20px',
            opacity: 1,

            '&.Mui-selected': {
                color: '#000000',
                backgroundColor: '#f9f8b6',
                borderTop: '1px solid #e0e0fd',
                borderLeft: '1px solid #e0e0fd',
                borderRight: '1px solid #e0e0fd',
            },
        });
    }, []);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return <div {...other}>{children}</div>;
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    const theme = useTheme();
    const [valuePanal, setValuePanal] = useState(0);

    const handleChange = (event, newValue) => {
        setValuePanal(newValue);
    };

    const handleChangeIndex = (index) => {
        setValuePanal(index);
    };

    return (
        <div {...props}>
            <div
                style={{
                    position: 'sticky',
                    top: 130,
                    zIndex: 100,
                    backgroundColor: '#faffb7',
                }}
            >
                <AppBar
                    style={{
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    }}
                    position="static"
                >
                    <Tabs
                        style={{
                            minHeight: '30px',
                            height: '30px',
                            textAlign: 'center',
                            backgroundColor: 'transparent',
                        }}
                        value={valuePanal}
                        onChange={handleChange}
                        TabIndicatorProps={{}}
                        textColor="inherit"
                        aria-label="full width tabs example"
                    >
                        {titles.map((title, index) => (
                            <StyledTab key={index} label={title} />
                        ))}
                    </Tabs>
                </AppBar>
            </div>
            <SwipeableViews
                animateHeight
                style={{
                    border: '1px solid #e0e0fd',
                }}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={valuePanal}
                onChangeIndex={handleChangeIndex}
            >
                {children.map((child, index) => (
                    <TabPanel
                        key={index}
                        value={valuePanal}
                        index={index}
                        dir={theme.direction}
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        <div>{child}</div>
                    </TabPanel>
                ))}
            </SwipeableViews>
        </div>
    );
}
