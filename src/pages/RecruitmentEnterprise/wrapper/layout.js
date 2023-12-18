import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/NavBar/index';
import styles from './layout.module.scss';
import classNames from 'classnames/bind';

export default function EnterpriseLayout() {
    const cx = classNames.bind(styles);
    const links = [
        { to: '', text: 'Trang chủ' },
        { to: 'register', text: 'Đăng ký hợp đồng' },
        { to: 'contract', text: 'Danh sách hợp đồng' },
        { to: 'test', text: 'Đăng ký bài thi' },
        { to: 'post', text: 'Đăng tin tuyển dụng' },
        { to: 'posts', text: 'Danh sách tin đăng' },
        { to: 'candidate', text: 'Theo dõi ứng viên' },
        { to: 'statistical', text: 'Thống kê' },
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
