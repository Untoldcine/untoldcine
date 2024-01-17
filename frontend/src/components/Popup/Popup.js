import React from "react";
import "./Popup.css"

export const Popup = ({ width, height, children, className }) => {
    return (
        <div className={`popup ${className} `} style={{ width: width, height: height }}>
            {children}
        </div>
    );
}