import React from "react";
import styles from "./SecondaryButton.module.css";

export const SecondaryButton = ({ className = "", children }) => {
    const combinedClassName = `${styles.secondaryButton} ${className}`.trim();

    return (
        <button className={combinedClassName}>
            <p className={styles.secondaryButtonParagraph}>
                {children}
            </p>
        </button>
    );
}
