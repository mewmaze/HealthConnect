import { useEffect, useState } from "react";
import Slider from "react-slick";
import ChallengeItem from "./ChallengeItem";
import "./ChallengeSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ChallengeSlider = () => {
  const [challenges, setChallenges] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/challenges`);
        const data = await response.json();
        setChallenges(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="ChallengeSlider">
      <Slider {...settings}>
        {challenges.slice(0, 8).map((item) => (
          <ChallengeItem key={item.challenge_id} {...item} />
        ))}
      </Slider>
    </div>
  );
};
export default ChallengeSlider;
