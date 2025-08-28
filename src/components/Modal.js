import React from 'react';
import './Modal.css'; // Modal의 스타일링을 위해 CSS 파일을 import합니다

const Modal = ({ onClose, children }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
