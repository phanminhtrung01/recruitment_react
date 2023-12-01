import React from 'react';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';

import Logo from '../../access/img/png/logo.png';
import {
    FaceBookSVG,
    TelegramSVG,
    LinkedSVG,
    ZaloSVG,
} from '../../access/img/svg';
import { Link } from 'react-router-dom';

const Header = () => {
    const cx = classNames.bind(styles);
    return (
        <div className={cx('header-all')}>
            <div className={cx('header')}>
                <Link to="/">
                    <img src={Logo} alt="LOGO" />
                </Link>
                <div className={cx('header-info')}>
                    <p className={cx('info')}>
                        Trung tâm Công nghệ và Đào tạo Bích Nguyên
                    </p>
                    <p className={cx('hotline')}>
                        <span className={cx('text-wrapper')}>Hotline: </span>
                        <span className={cx('span')}>(+84) 939 586 168</span>
                    </p>
                    <input
                        className={cx('email')}
                        placeholder="Email: bichnguyen@ttdt.edu.vn"
                        type="email"
                    />
                </div>
                <div className={cx('header-more')}>
                    <FaceBookSVG />
                    <TelegramSVG />
                    <LinkedSVG />
                    <ZaloSVG />
                </div>
            </div>
            <div className={cx('box')}>
                <div className={cx('boder')} />
            </div>
        </div>
    );
};

export default Header;
