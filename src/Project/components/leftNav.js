import React from "react";
import "./leftNav.css";

function LeftNav({ items, onNavItemClick }) {
    return (
        <div className="left">
            <ul>
                {items.map((item, index) => (
                    <li key={index} onClick={() => onNavItemClick(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeftNav;