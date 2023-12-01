import React, { useEffect, useState } from 'react';
import useRequestAuth from '../../../../hooks/useRequestAuth';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './login_page.module.scss';

import { Alert, Snackbar, styled } from '@mui/material';
import Tippy from '@tippyjs/react';

import { authApi, authInfoApi } from '../../../../api/auth';
import SnackbarCustom from '../../../../components/snackbar';
import { loginE } from '../../../../redux/authSlice';
import { updateAll } from '../../../../redux/infoUserSlice';

const LoginEnterprise = ({ roleName }) => {
    const requestAuth = useRequestAuth();

    const cx = classNames.bind(styles);

    const [submit, setSubmit] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from =
        location.state?.from?.pathname ||
        `${
            roleName === 'ENTERPRISE'
                ? '/recruitment/enterprise'
                : '/recruitment/student/jobs'
        }`;

    const [error, setError] = useState(false);
    const [login, setLogin] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setLogin({
            ...login,
            [name]: value,
        });

        if (error) {
            setError(!error);
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        const loginRequest = async () => {
            const loginResult = await authApi({ login: login });

            if (loginResult) {
                console.log(loginResult);
                const accessToken = loginResult.accessToken;
                dispatch(
                    loginE({
                        username: login.username,
                        role: roleName,
                        accessToken: accessToken,
                    }),
                );

                const response = await authInfoApi(requestAuth);

                if (response?.status === 200) {
                    dispatch(updateAll(response.data));
                }

                console.log({ ...login, role: roleName });

                setSubmit(true);
                setLogin({
                    username: '',
                    password: '',
                });
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 2500);
            } else {
                setError(true);
            }
        };

        loginRequest();
    };

    const AlertStyle = styled(Alert)({
        '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
        },

        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        color: 'black',
        backgroundColor: '#faff91',
    });

    return (
        <div className={cx('row')}>
            <div className={cx('box-info-signup')}>
                <div className={cx('title')}>
                    <h2>
                        {roleName !== 'STUDENT'
                            ? 'Dành Cho Nhà Tuyển Dụng'
                            : 'Dành Cho Ứng Viên'}
                    </h2>
                </div>
                <div className={cx('step-title', 'd-flex', 'align-center')}>
                    <div className={cx('main-step-title')}>
                        <h3>THÔNG TIN ĐĂNG NHẬP</h3>
                    </div>
                    <div className={cx('text-sup')}>
                        <Link to="/">Hướng dẫn</Link>
                    </div>
                </div>
                <div className={cx('main-form')}>
                    {error && (
                        <AlertStyle
                            sx={{
                                m: 2,
                            }}
                            variant="filled"
                            severity="error"
                        >
                            Đăng nhập không thành công. Xin thử lại!
                        </AlertStyle>
                    )}
                    <form name="frmLogin" id="frmLogin">
                        <Tippy
                            content="Xem lại tài khoản"
                            visible={error}
                            placement="top-end"
                        >
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Email/Tên đăng nhập</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="text"
                                        name="username"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        onChange={handleInputChange}
                                        value={login.username}
                                    />
                                    <span
                                        className={cx(
                                            'form-error',
                                            'error_username',
                                        )}
                                    ></span>
                                </div>
                            </div>
                        </Tippy>
                        <Tippy
                            content="Xem lại mật khẩu"
                            visible={error}
                            placement="bottom-end"
                        >
                            <div className={cx('form-group', 'd-flex')}>
                                <div className={cx('form-info')}>
                                    <span>Mật khẩu</span>
                                </div>
                                <div className={cx('form-input')}>
                                    <input
                                        type="password"
                                        className={cx('form-control')}
                                        placeholder="Vui lòng nhập thông tin"
                                        name="password"
                                        onChange={handleInputChange}
                                        value={login.password}
                                        required
                                    />
                                    <span
                                        className={cx(
                                            'form-error',
                                            'error_password',
                                        )}
                                    ></span>
                                </div>
                            </div>
                        </Tippy>
                        <div className={cx('user-action')}>
                            <div className={cx('action-login')}>
                                <div className={cx('btn-area')}>
                                    <input type="hidden" />

                                    <button
                                        type="submit"
                                        className={cx('btn-action')}
                                        onClick={handleSubmitLogin}
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                                <Link to="/"> Quên Mật Khẩu </Link>
                            </div>
                            <p>
                                {' '}
                                <Link to="/register" className={cx('register')}>
                                    Quý khách chưa có tài khoản?
                                </Link>{' '}
                                Đăng ký dễ dàng, hoàn toàn miễn phí
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <SnackbarCustom
                position={{ vertical: 'bottom', horizontal: 'right' }}
                severity="success"
                message="Đăng nhập thành công!"
                open={submit}
            />
        </div>
    );
};

export default LoginEnterprise;
