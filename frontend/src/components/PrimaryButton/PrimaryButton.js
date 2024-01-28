import React from "react";
import styles from "./PrimaryButton.module.css";

export const PrimaryButton = ({ className = "", children }) => {
    const combinedClassName = `${styles.primaryButton} ${className}`.trim();

    return (
        <button className={combinedClassName}>
            <p>
                {children}
            </p>
        </button>
    );
}
