import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import "./BannerSlider.css";

const BannerSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        <div>
          <img src="/banner1.png" alt="Slide 1" className="slider-image" />
        </div>
        <div>
          <img src="/banner2.png" alt="Slide 2" className="slider-image" />
        </div>
        <div>
          <img src="/banner3.JPG" alt="Slide 3" className="slider-image" />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;
