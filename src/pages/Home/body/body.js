import Carousel from '../../../utils/carousel/carousel';
import Card from '../../../utils/card/card';
import InfoRead from '../../../components/InfoRead/index';
import Training from '../../../components/Training/training-item';
import OneOption from '../../../components/TextButtonSingle/index';

import { I24 } from '../../../access/img/png/index';
import './body-home.scss';
import NavBarHome from '../../../components/NavBar/index2';

const BodyHome = () => {
    const CARDS = 10;

    return (
        <>
            <NavBarHome />
            <div className="body-home">
                <Carousel>
                    {[...new Array(CARDS)].map((_, i) => (
                        <Card
                            key={i}
                            title=""
                            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        />
                    ))}
                </Carousel>

                <div className="info-read-all">
                    <InfoRead text="2000+ NGƯỜI ĐANG HỌC" />
                    <InfoRead text="2000+ NGƯỜI ĐANG HỌC" />
                    <InfoRead text="2000+ NGƯỜI ĐANG HỌC" />
                </div>

                <div className="info">
                    <p className="text-wrapper">
                        BẮT ĐẦU SỰ NGHIỆP LẬP TRÌNH CÙNG TRUNG TÂM
                    </p>
                    <div className="frame">
                        <p className="div">
                            Vững tay nghề – Học bất kỳ đâu – Chi phí cực rẻ –
                            Đảm bảo chất lượng đầu ra
                        </p>
                    </div>
                </div>

                <div>
                    <div className="frame-training-details">
                        <img className="image" alt="Image" src={I24} />
                        <div className="text-training-details">
                            Chương trình đào tạo
                        </div>
                    </div>
                </div>

                <div className="nav-training-details-all">
                    <OneOption
                        text="Đồ họa"
                        property1="hover selected"
                        styleText={{ fontSize: '20px' }}
                        styleOption={{
                            padding: '15px 65px',
                            backgroundColor: 'white',
                            opacity: '0.9',
                            borderRadius: '35px',
                        }}
                    />
                    <OneOption
                        text="Lập trình ứng dụng"
                        property1="hover selected"
                        styleText={{ fontSize: '20px' }}
                        styleOption={{
                            padding: '15px 65px',
                            backgroundColor: 'white',
                            opacity: '0.9',
                            borderRadius: '35px',
                        }}
                    />
                    <OneOption
                        text="Lập trình Website"
                        property1="hover selected"
                        styleText={{ fontSize: '20px' }}
                        styleOption={{
                            padding: '15px 65px',
                            backgroundColor: 'white',
                            opacity: '0.9',
                            borderRadius: '35px',
                        }}
                    />
                    <OneOption
                        text="Kiểm thử phần mềm"
                        property1="hover selected"
                        styleText={{ fontSize: '20px' }}
                        styleOption={{
                            padding: '15px 65px',
                            backgroundColor: 'white',
                            opacity: '0.9',
                            borderRadius: '35px',
                        }}
                    />
                    <OneOption
                        text="Mạng máy tính"
                        property1="hover selected"
                        styleText={{ fontSize: '20px' }}
                        styleOption={{
                            padding: '15px 65px',
                            backgroundColor: 'white',
                            opacity: '0.9',
                            borderRadius: '35px',
                        }}
                    />
                </div>

                <div className="training-details-contains">
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                    <Training />
                </div>
            </div>
        </>
    );
};

export default BodyHome;
