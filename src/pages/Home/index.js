import classNames from 'classnames/bind';
import style from './style.module.scss';
import { Outlet } from 'react-router-dom';

function Home() {
    const cx = classNames.bind(style);
    return (
        <div>
            <div className={cx('home-wrapper')}></div>
            <Outlet />
        </div>
    );
}

export default Home;
