import React from "react";
import "./TextField.css"

export const TextField = ({ text = "Text", icon }) => {
    return (
        <div className="box">
            <i className={icon}></i>
            <input type="text" placeholder={text} className="input" />
        </div>
    );
}