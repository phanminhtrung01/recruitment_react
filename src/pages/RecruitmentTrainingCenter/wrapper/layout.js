import classNames from 'classnames/bind';

import { Link, Outlet } from 'react-router-dom';

import style from './layout.module.scss';
import Navbar from '../../../components/NavBar/index';

export default function TraningCenterLayout() {
    const cx = classNames.bind(style);

    const links = [
        { to: 'contract', text: 'Quản lý hợp đồng' },
        { to: 'post', text: 'Quản lý tuyển dụng' },
        { to: 'candidate', text: 'Quản lý ứng viên' },
        { to: 'statistical', text: 'Thống kê' },
    ];

    return (
        <>
            <Navbar
                style={{
                    top: 80,
                }}
                init={0}
                startTitle="TRUNG TÂM"
                links={links}
            />
            <div className={cx('overight-header')}></div>
            <Outlet />
        </>
    );
}
