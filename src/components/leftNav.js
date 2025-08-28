import React, { useState } from "react";
import "./leftNav.css";

function LeftNav({ items, onNavItemClick }) {
    const [activeItem, setActiveItem] = useState(null);

    const handleClick = (item) => {
        setActiveItem(item); // 클릭된 항목을 active 상태로 설정
        onNavItemClick(item); // 선택된 항목에 대해 상위 컴포넌트에 알림
    };

    return (
        <div className="left">
            <ul>
                {items.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleClick(item)}
                        className={item === activeItem ? "active" : ""}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeftNav;
