import { TextField, Button } from '@mui/material';
import { React, useState, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import PropTypes from 'prop-types';

import { IMaskInput } from 'react-imask';

import styles from './register2.module.scss';
const TextMaskCustom = forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="(000) 0000 000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) =>
                onChange({
                    target: { name: props.name, value },
                })
            }
            overwrite
        />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
function Register2({ goBackPreviousSlide }) {
    const navigate = useNavigate();

    const cx = classNames.bind(styles);

    const [companyInfo, setCompanyInfo] = useState({
        companyName: '',
        representative: '',
        position: '',
        companyAddress: '',
        companySummary: '',
        phoneNumber: '',
        companyCode: '',
        verificationCode: '',
    });

    // Hàm kiểm tra tính hợp lệ của số điện thoại
    const isPhoneNumberValid = (phoneNumber) => {
        // Kiểm tra xem chuỗi có chứa chữ cái không
        return /^\d+$/.test(phoneNumber);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCompanyInfo({
            ...companyInfo,
            [name]: value,
        });
    };

    const handleConfirm = (event) => {
        event.preventDefault();
        console.log('Company Information:', companyInfo);
        navigate('/auth/login');
    };

    const handleBack = (event) => {
        event.preventDefault();
        goBackPreviousSlide();
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px',
                }}
            >
                BƯỚC 2: THÔNG TIN CÔNG TY
            </div>
            <div className={cx('row')}>
                <div className={cx('box-info-signup')}>
                    <div className={cx('step-title')}>
                        <div className={cx('main-step-title')}>
                            <h3>THÔNG TIN CÔNG TY</h3>
                        </div>
                        <div className={cx('text-sup')}>
                            <Link to="/">Hướng dẫn</Link>
                        </div>
                    </div>
                    <div className={cx('main-form')}>
                        <form
                            name="frmCompanyInfo"
                            id="frmCompanyInfo"
                            onSubmit={handleConfirm}
                        >
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Tên công ty</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Người đại diện</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="representative"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Chức vụ</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="position"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Địa chỉ công ty</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="companyAddress"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        value={companyInfo.companyAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Sơ lược công ty</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <textarea
                                        name="companySummary"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        value={companyInfo.companySummary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Số điện thoại</span>
                                </div>

                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        value={companyInfo.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Mã công ty</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="companyCode"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        value={companyInfo.companyCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Mã xác nhận</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="verificationCode"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                    />
                                </div>
                            </div>
                            <div className={cx('user-action')}>
                                <p>
                                    <Link to="/" onClick={handleBack}>
                                        Quay lại bước trước
                                    </Link>
                                </p>
                                <Button
                                    variant="contained"
                                    onClick={handleConfirm}
                                    type="submit"
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register2;
