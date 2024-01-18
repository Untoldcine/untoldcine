import React from "react";
import "./PrimaryButton.css"

export const PrimaryButton = ({ className = "", children }) => {
    return (
        <button className={className}>
            <p>
                {children}
            </p>
        </button>
    );
}