import { Outlet } from 'react-router-dom';

import Carousel from '../../components/SlideShow/index';
import {
    TiktokSVG,
    ACBSVG,
    GarenaSVG,
    ShopeeSVG,
    VNGSVG,
    ADIASSVG,
} from '../../access/img/svg/index';
import { BIDVLogo } from '../../access/img/png/index';
import './style.scss';

export default function RecruitmentEnterprise() {
    const slideImages = [
        {
            url: 'https://d33wubrfki0l68.cloudfront.net/dd23708ebc4053551bb33e18b7174e73b6e1710b/dea24/static/images/wallpapers/shared-colors@2x.png',
            caption: 'Slide 1',
        },
        {
            url: 'https://d33wubrfki0l68.cloudfront.net/49de349d12db851952c5556f3c637ca772745316/cfc56/static/images/wallpapers/bridge-02@2x.png',
            caption: 'Slide 2',
        },
        {
            url: 'https://d33wubrfki0l68.cloudfront.net/594de66469079c21fc54c14db0591305a1198dd6/3f4b1/static/images/wallpapers/bridge-01@2x.png',
            caption: 'Slide 3',
        },
    ];
    return (
        <>
            <Carousel className="slide" images={slideImages} />

            <div
                className="achievements-enterprise"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '150px',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        height: '150px',
                        width: '300px',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    <span>3000+</span>
                    <span>Tập đoàn toàn cầu sử dụng</span>
                </div>

                <div
                    className="driver"
                    style={{
                        height: '80%',
                        width: 2,
                        backgroundColor: '#c6e5ff',
                    }}
                ></div>

                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        height: '150px',
                        width: '300px',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    <span>2000+</span>
                    <span>Việc làm được ký kết mỗi ngày</span>
                </div>

                <div
                    className="driver"
                    style={{
                        height: '80%',
                        width: 2,
                        backgroundColor: '#c6e5ff',
                    }}
                ></div>

                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        height: '150px',
                        width: '300px',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    <span>1000+</span>
                    <span>Doanh nghiệp hàng đầu Việt Nam</span>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginTop: '50px',

                    textAlign: 'center',
                }}
            >
                <span
                    style={{
                        color: '#0091ff',
                        fontWeight: 'bold',
                        fontSize: '30px',
                    }}
                >
                    CHÚNG TÔI MANG ĐẾN TRẢI NGHIỆM DỊCH VỤ TỐT NHẤT
                </span>
                <span
                    style={{
                        fontSize: '16px',
                        fontWeight: 'normal',
                        lineHeight: '1.2',
                        padding: '25px',
                    }}
                >
                    Tại Việt Nam, Trung tâm đào tạo của chúng tôi là lựa chọn
                    hàng đầu của hơn 17.000 học viên và doanh nghiệp. Chúng tôi
                    cung cấp các giải pháp kết nối, tuyển dụng và quản lý nhân
                    tài hiệu quả, giúp học viên tiếp cận với nhiều cơ hội việc
                    làm tiềm năng và doanh nghiệp tìm kiếm nhân tài phù hợp. Với
                    các dịch vụ như Hướng dẫn Việc làm, Hỗ trợ Đào tạo Kỹ năng,
                    Dịch vụ Email Marketing Chuyên nghiệp, và Hệ thống Giới
                    thiệu Việc làm, chúng tôi đã thu hút hàng trăm ngàn hồ sơ
                    ứng viên hoàn chỉnh và được cập nhật mới thường xuyên. Chúng
                    tôi tự hào là cầu nối giữa học viên và doanh nghiệp, giúp
                    tạo ra các hợp đồng tuyển dụng hiệu quả.
                </span>
            </div>

            <div
                style={{
                    marginTop: '10px',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: '#0091ff',
                    textAlign: 'center',
                }}
            >
                ĐỐI TÁC HÀNG ĐẦU CỦA CHÚNG TÔI
            </div>

            <div className="grid-partner">
                <div className="item-partner">
                    <TiktokSVG />
                </div>
                <div className="item-partner">
                    <ACBSVG />
                </div>
                <div className="item-partner">
                    <GarenaSVG />
                </div>
                <div className="item-partner">
                    <ShopeeSVG />
                </div>
                <div className="item-partner">
                    <VNGSVG />
                </div>
                <div className="item-partner">
                    <ADIASSVG />
                </div>
                <div className="item-partner">
                    <TiktokSVG />
                </div>
                <div className="item-partner">
                    <ACBSVG />
                </div>
                <div className="item-partner">
                    <GarenaSVG />
                </div>
                <div className="item-partner">
                    <ShopeeSVG />
                </div>
                <div className="item-partner">
                    <VNGSVG />
                </div>
                <div className="item-partner">
                    <ADIASSVG />
                </div>
                <div className="item-partner">
                    <TiktokSVG />
                </div>
                <div className="item-partner">
                    <ACBSVG />
                </div>
                <div className="item-partner">
                    <GarenaSVG />
                </div>
                <div className="item-partner">
                    <ShopeeSVG />
                </div>
                <div className="item-partner">
                    <VNGSVG />
                </div>
                <div className="item-partner">
                    <ADIASSVG />
                </div>
                <div className="item-partner">
                    <TiktokSVG />
                </div>

                <div className="item-partner">
                    <ACBSVG />
                </div>
                <div className="item-partner">
                    <img src={BIDVLogo} alt="" />
                </div>
                <div className="item-partner">
                    <GarenaSVG />
                </div>
                <div className="item-partner">
                    <ShopeeSVG />
                </div>
                <div className="item-partner">
                    <VNGSVG />
                </div>
                <div className="item-partner">
                    <ADIASSVG />
                </div>
                <div className="item-partner">
                    <img src={BIDVLogo} alt="" />
                </div>
                <div className="item-partner">
                    <TiktokSVG />
                </div>
                <div className="item-partner">
                    <ACBSVG />
                </div>
                <div className="item-partner">
                    <GarenaSVG />
                </div>
                <div className="item-partner">
                    <img src={BIDVLogo} alt="" />
                </div>
                <div className="item-partner">
                    <ShopeeSVG />
                </div>
                <div className="item-partner">
                    <VNGSVG />
                </div>

                <div className="item-partner">
                    <ADIASSVG />
                </div>
            </div>
            <Outlet />
        </>
    );
}
