import React from "react";
import "./SecondaryButton.css"

export const SecondaryButton = ({ className, children }) => {
    return (
        <button className={className}>
            <p>
                {children}
            </p>
        </button>
    );
}