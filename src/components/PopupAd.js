import React from 'react';
import './PopupAd.css';

const PopupAd = ({onClose}) => {
    return (
        <div className='popup-ad'>
            <div className='popup-content'>
                <span className='popup-close' onClick={onClose}>&times;</span> 
                <h2>special Offer!</h2>
                <p>Get 20% off on your next purchase. Use code <strong>HEALTH20</strong> at checkout.</p>
                <a href="https://www.naver.com/" className="cta-button">Shop Now</a>            
            </div>
        </div>
    )
}

export default PopupAd;