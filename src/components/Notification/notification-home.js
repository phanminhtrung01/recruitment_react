import PropTypes from 'prop-types';
import React from 'react';

function NotificationHome() {
    return (
        <div className={`notification}`}>
            <img className="image" alt="Image" src="image-25.png" />
            <p className="t-ng-khai-gi-ng-kh-a">
                Tổng khai giảng khóa 289 Từ ngày: 23/10/2023 đến 30/10/2023 Ưu
                đãi học phí lên đến 30%
            </p>
        </div>
    );
}

Notification.propTypes = {
    property1: PropTypes.oneOf(['default']),
};
export default NotificationHome;
