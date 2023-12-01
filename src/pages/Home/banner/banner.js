import React from 'react';
import '../banner/banner.css';
import ImgBanner from '../../../access/img/Picture1.png';

const ImageBanner = () => {
    return (
        <div className="image-banner">
            <img className="banner-home" alt="Banner" src={ImgBanner} />
        </div>
    );
};

export default ImageBanner;
