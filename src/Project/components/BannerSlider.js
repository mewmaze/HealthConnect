import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import Slider from 'react-slick';
import './BannerSlider.css'; // 슬라이더의 스타일

const BannerSlider = () => {
    const settings = {
        dots: true, //밑에 점 표시할건지
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
                    <h3>1</h3>
                </div>
                <div>
                    <h3>2</h3>
                </div>
                <div>
                    <h3>3</h3>
                </div>
                <div>
                    <h3>4</h3>
                </div>
                <div>
                    <h3>5</h3>
                </div>
                <div>
                    <h3>6</h3>
                </div>
            </Slider>
        </div>
    )
}

export default BannerSlider;