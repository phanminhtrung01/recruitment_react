import { Outlet } from 'react-router-dom';

import classNames from 'classnames/bind';
import style from './layout.module.scss';

import Navbar from '../../../components/NavBar/index';

export default function StudentLayout() {
    const cx = classNames.bind(style);

    const links = [
        { to: 'jobs', text: 'Khám phá' },
        { to: 'job', text: 'Quản lý công việc' },
        { to: 'record', text: 'Lớp học' },
    ];

    return (
        <>
            <Navbar
                style={{
                    top: 130,
                }}
                init={0}
                startTitle="HỌC VIÊN"
                links={links}
            />
            <div className={cx('overight-header')}></div>
            <Outlet />
        </>
    );
}
