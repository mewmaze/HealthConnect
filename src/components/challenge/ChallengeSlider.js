import { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../../api/api";
import ChallengeItem from "./ChallengeItem";
import "./ChallengeSlider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ChallengeSlider = () => {
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get("/challenges");
        setChallenges(response.data.slice(0, 8));
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
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
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
