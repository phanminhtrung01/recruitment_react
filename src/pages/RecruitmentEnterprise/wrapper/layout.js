import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/NavBar/index';
import styles from './layout.module.scss';
import classNames from 'classnames/bind';

export default function EnterpriseLayout() {
    const cx = classNames.bind(styles);
    const links = [
        { to: '', text: 'Trang chủ' },
        { to: 'register', text: 'Đăng ký tuyển dụng' },
        { to: 'test', text: 'Đăng ký bài thi' },
        { to: 'post', text: 'Đăng tin tuyển dụng' },
        { to: 'guide', text: 'Hướng dẫn' },
    ];

    return (
        <>
            <Navbar
                style={{
                    top: 130,
                }}
                init={0}
                startTitle="DOANH NGHIỆP"
                links={links}
            />
            <div className={cx('overight-header')}></div>
            <Outlet />
        </>
    );
}
