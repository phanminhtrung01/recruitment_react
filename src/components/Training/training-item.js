import React from 'react';
import './style.scss';
import { I10 } from '../../access/img/png/index';
import { TimeSVG, PriceSVG, DiscountSVG } from '../../access/img/svg/index';

const Training = () => {
    return (
        <div className="container">
            <img className="image" alt="Image" src={I10} />
            <p className="chuy-n-vi-n-thi-t-k">
                Chuyên viên Thiết kế Đồ hoạ &amp; Web
            </p>
            <div className="vector"></div>
            <footer className="footer">
                <div className="time">
                    <TimeSVG />
                    <div className="text-wrapper">12 tháng</div>
                </div>
                <div className="price">
                    <div className="div">
                        <PriceSVG />
                        <div className="text-wrapper-2">8.500.000đ</div>
                    </div>
                    <div className="discount">
                        <DiscountSVG />
                        <div className="text-wrapper">7.900.000đ</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Training;
