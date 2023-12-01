import { Outlet } from 'react-router-dom';
import './style.scss';
import { ConVerterSVG } from '../../access/img/svg';

function Recruitment({ roleName }) {
    return (
        <div className="recruitment">
            <div className="recruiment-container">
                <div className="navigation">
                    <span>Trang chủ</span>
                    <span> / </span>
                    <span>Việc làm</span>
                </div>
                <div className="converter">
                    <div className="recruiment-contain">
                        <h2>
                            {roleName === 'ENTERPRISE'
                                ? 'Dành Cho Ứng Viên'
                                : 'Dành Cho Doanh nghiệp'}
                        </h2>
                    </div>
                    <ConVerterSVG className="icon-converter" />
                </div>
            </div>

            <Outlet />
        </div>
    );
}

export default Recruitment;
