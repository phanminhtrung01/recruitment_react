import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './components/GlobalStyles';

import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LocalizationProvider } from '@mui/x-date-pickers';
import * as locales from '@mui/material/locale';
import { viVN } from '@mui/x-data-grid';
import { viVN as pickersBgBG } from '@mui/x-date-pickers/locales';
import { viVN as coreBgBG } from '@mui/material/locale';

import { Translator } from 'react-auto-translate';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/vi';

import { Provider } from 'react-redux';
import { store } from './redux/store';

import App from './App';

const theme = createTheme(
    {
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root, & .MuiInputLabel-root': {
                            fontSize: '1.2rem',
                        },
                        '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                            transform: 'translate(14px, -6px) scale(0.75)',
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    label: {
                        fontSize: '1.2rem',
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    select: {
                        fontSize: '1.2rem',
                    },
                    option: {
                        fontSize: '1.2rem',
                    },
                },
            },
            MuiAutocomplete: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#f9f8b6',
                    },
                    option: {
                        fontSize: '1.2rem',
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        fontSize: '1.2rem',
                    },
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        '& .MuiDataGrid-cell': {
                            fontSize: '1.2rem',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            fontSize: '1.2rem',
                        },
                        '& .MuiTablePagination-caption': {
                            fontSize: '1.5rem',
                        },
                        '& .MuiButton-label': {
                            fontSize: '1.5rem',
                        },
                        '& .MuiDataGrid-row': {
                            backgroundColor: '#f9f8b6',
                            fontSize: '1.5rem',
                        },
                        backgroundColor: '#f9f8b6',
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        fontSize: '1.2rem',
                        // backgroundColor: '#f9f8b6',
                    },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        '& .MuiTableCell-root': {
                            fontSize: '1.2rem',
                        },
                        backgroundColor: '#f9f8b6',
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        '& .MuiSvgIcon-root': {
                            fontSize: '2rem',
                        },
                    },
                },
            },
            MuiFormControlLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '1.2rem',
                    },
                    label: {
                        fontSize: '1.2rem',
                    },
                },
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        fontSize: '1.2rem',
                        backgroundColor: '#f9f8b6',
                    },
                },
            },
            MuiPickersBasePicker: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#f9f8b6',
                    },
                    pickerView: {
                        fontSize: '1.5rem',
                    },
                },
            },
            MuiAccordion: {
                styleOverrides: {
                    root: {
                        fontSize: '1.7rem',
                        backgroundColor: '#f9f8b6',
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        fontSize: '1.3rem',
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        fontSize: '1.1rem', // Thay đổi kích thước font tại đây
                        // Thêm các quy tắc CSS khác tại đây
                    },
                },
            },
        },
    },
    viVN, // x-data-grid translations
    pickersBgBG, // x-date-pickers translations
    coreBgBG,
    locales['viVN'],
);

const cacheProvider = {
    get: (language, key) =>
        ((JSON.parse(localStorage.getItem('translations')) || {})[key] || {})[
            language
        ],
    set: (language, key, value) => {
        const existing = JSON.parse(localStorage.getItem('translations')) || {
            [key]: {},
        };
        existing[key] = { ...existing[key], [language]: value };
        localStorage.setItem('translations', JSON.stringify(existing));
    },
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <GlobalStyle>
        <Router>
            <ThemeProvider theme={theme}>
                <LocalizationProvider
                    adapterLocale="vi"
                    dateAdapter={AdapterDayjs}
                >
                    <Provider store={store}>
                        <Translator
                            cacheProvider={cacheProvider}
                            from="en"
                            to="vi"
                            googleApiKey="AIzaSyCTCKcV7A80lqEGa0oLWjNvHPPYIZwWOBY"
                        >
                            <App />
                        </Translator>
                    </Provider>
                </LocalizationProvider>
            </ThemeProvider>
        </Router>
    </GlobalStyle>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
