import { Outlet } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './style.module.scss';

function LoginWrapper() {
    const cx = classNames.bind(style);

    return (
        <>
            <div className={cx('login-wrapper')}></div>
            <Outlet />
        </>
    );
}

export default LoginWrapper;
