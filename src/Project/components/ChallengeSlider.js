import { useContext } from 'react';
import Slider from 'react-slick';
import ChallengeItem from './ChallengeItem';
import { ChallengeStateContext } from '../App';
import './ChallengeSlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const ChallengeSlider = () => {
    const data = useContext(ChallengeStateContext);

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
        <div className='ChallengeSlider'>
            <Slider {...settings}>
                {data.slice(0,8).map((item) => (
                    <ChallengeItem key={item.challenge_id} {...item}/>
                ))}
            </Slider>
        </div>
    )
};
export default ChallengeSlider;
