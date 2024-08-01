import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import Slider from 'react-slick';
import './BannerSlider.css'; // 슬라이더의 스타일

const BannerSlider = () => {
    const settings = {
        dots:false, //밑에 점 표시할건지
        infinite: true, // 끝에서 처음으로 이어지게 할건지
        speed: 300,
        slidesToShow: 1, // 한번에 보여줄 슬라이드 개수
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className='banner-slider'>
            <Slider {...settings}>
                <div>
                    <img src="/banner1.png" alt="Slide 1" className="slider-image" />
                </div>
                <div>
                    <img src="/banner2.png" alt="Slide 2" className="slider-image" />
                </div>
                <div>
                    <img src="/banner3.jpg" alt="Slide 3" className="slider-image" />
                </div>
            </Slider>
        </div>
    )
}

export default BannerSlider;