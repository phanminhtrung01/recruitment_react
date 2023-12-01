import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
// import Tippy from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
// import { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import styles from './register1.module.scss';
import { Button } from '@mui/material';

const Register1 = ({ goToNextSlide }) => {
    const cx = classNames.bind(styles);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });

    // Hàm kiểm tra tính hợp lệ của email
    const isEmailValid = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    // Hàm kiểm tra tính hợp lệ của mật khẩu
    const isPasswordValid = (password) => {
        return password.length >= 8;
    };

    // Hàm kiểm tra tính hợp lệ của thẻ xác nhận mật khẩu
    const isConfirmPasswordValid = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleConfirm = (event) => {
        event.preventDefault();

        // Kiểm tra tính hợp lệ của email, mật khẩu và thẻ xác nhận mật khẩu
        const isEmailValidated = isEmailValid(formData.username);
        const isPasswordValidated = isPasswordValid(formData.password);
        const isConfirmPasswordValidated = isConfirmPasswordValid(
            formData.password,
            formData.confirmPassword,
        );

        if (
            (isEmailValidated &&
                isPasswordValidated &&
                isConfirmPasswordValidated) ||
            true
        ) {
            console.log('Form Data:', formData);
            goToNextSlide();
        } else {
        }
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px',
                }}
            >
                BƯỚC 1: THÔNG TIN ĐĂNG NHẬP
            </div>
            <div className={cx('row')}>
                <div className={cx('box-info-signup')}>
                    <div className={cx('step-title')}>
                        <div className={cx('main-step-title')}>
                            <h3>THÔNG TIN ĐĂNG NHẬP</h3>
                        </div>
                        <div className={cx('text-sup')}>
                            <Link to="/">Hướng dẫn</Link>
                        </div>
                    </div>
                    <div className={cx('main-form')}>
                        <form name="frmRegister" id="frmRegister" action="/">
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Email/Tên đăng nhập</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <Tippy
                                        visible={
                                            formData.username &&
                                            !isEmailValid(formData.username)
                                        }
                                        content={
                                            <span
                                                className={cx(
                                                    'form-error',
                                                    'error_password',
                                                )}
                                            >
                                                <FontAwesomeIcon
                                                    className="icon-error"
                                                    icon={faExclamationTriangle}
                                                />
                                                Email không hợp lệ
                                            </span>
                                        }
                                    >
                                        <input
                                            type="text"
                                            name="username"
                                            className={cx('form-control')}
                                            placeholder="Vui lòng nhập thông tin"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </Tippy>
                                </div>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Mật khẩu</span>
                                </div>
                                <Tippy
                                    visible={
                                        formData.password &&
                                        !isPasswordValid(formData.password)
                                    }
                                    content={
                                        <span
                                            className={cx(
                                                'form-error',
                                                'error_password',
                                            )}
                                        >
                                            <FontAwesomeIcon
                                                className="icon-error"
                                                icon={faExclamationTriangle}
                                            />
                                            Mật khẩu cần đủ 8 ký tự
                                        </span>
                                    }
                                >
                                    <div className={cx('form-input')}>
                                        <input
                                            type="password"
                                            className={cx('form-control')}
                                            placeholder="Vui lòng nhập thông tin"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Tippy>
                            </div>
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Xác nhận lại mật khẩu</span>
                                </div>
                                <Tippy
                                    visible={
                                        formData.confirmPassword &&
                                        !isConfirmPasswordValid(
                                            formData.password,
                                            formData.confirmPassword,
                                        )
                                    }
                                    content={
                                        <span
                                            className={cx(
                                                'form-error',
                                                'error_password',
                                            )}
                                        >
                                            <FontAwesomeIcon
                                                className="icon-error"
                                                icon={faExclamationTriangle}
                                            />
                                            Thẻ xác nhận mật khẩu không khớp
                                        </span>
                                    }
                                >
                                    <div className={cx('form-input')}>
                                        <input
                                            type="password"
                                            className={cx('form-control')}
                                            placeholder="Vui lòng xác nhận thông tin"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Tippy>
                            </div>
                            <div className={cx('user-action')}>
                                {/* <div className={cx('action-login')}>
                                    <div className={cx('btn-area')}>
                                        <input type="hidden" name="csrf_token" />
                                        <button
                                            onClick={handleConfirm}
                                            type="submit"
                                            className={cx('btn-action')}
                                        >
                                            
                                        </button>
                                    </div>
                                </div> */}

                                <Button
                                    variant="contained"
                                    onClick={handleConfirm}
                                    type="submit"
                                >
                                    Xác nhận thông tin
                                </Button>

                                <p>
                                    {' '}
                                    <a href="#." className={cx('register')}>
                                        Quý khách đã có tài khoản?
                                    </a>{' '}
                                    <Link to="/auth/login">Đăng nhập</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register1;
