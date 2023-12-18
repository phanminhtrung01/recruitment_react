import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';

import './register.scss';
import Register1 from './register1';
import Register2 from './register2';

const Register = () => {
    const theme = useTheme();
    const [valuePanal, setValuePanal] = useState(0);

    const handleChangeIndex = (index) => {
        setValuePanal(index);
    };

    return (
        <div className="register-wrapper">
            <div className="register-header"></div>
            <div className="register-main">
                ĐĂNG KÝ TÀI KHOẢN NHÀ TUYỂN DỤNG
            </div>

            <SwipeableViews
                animateHeight
                style={{
                    width: '100%',
                    height: '100%',
                    padding: '5px',
                    border: '1px solid #e0e0fd',
                    marginTop: '30px',
                    marginBottom: '30px',
                }}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={valuePanal}
                onChangeIndex={handleChangeIndex}
            >
                <div>
                    <Register1 goToNextSlide={() => handleChangeIndex(1)} />
                </div>

                <div>
                    <Register2
                        goBackPreviousSlide={() => handleChangeIndex(0)}
                    />
                </div>
            </SwipeableViews>
        </div>
    );
};

export default Register;
