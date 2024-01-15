"use client"
import React from 'react';
import './ToggleSwitch.css';
import Image from "next/image";


export const ToggleSwitch = ({ off, on, setState, state, className = "" }) => {
    const handleClick = () => {
        setState(!state);
    };
    return (
        <div className={`toggle-container ${className}`} onClick={handleClick}>
            <p>{off}</p>
            {state ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="19" viewBox="0 0 29 19" fill="none">
                    <rect opacity="0.5" x="0.000976562" y="4.5791" width="24.4211" height="10.6842" rx="5.34211" fill="white" />
                    <circle cx="19.8405" cy="9.1579" r="9.1579" fill="white" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="19" viewBox="0 0 29 19" fill="none">
                    <rect opacity="0.5" width="24.4211" height="10.6842" rx="5.34211" transform="matrix(-1 0 0 1 29 4.5791)" fill="white" />
                    <circle cx="9.1579" cy="9.1579" r="9.1579" transform="matrix(-1 0 0 1 18.3164 0)" fill="white" />
                </svg>
            )}
            <p>{on}</p>
        </div >
    )
}