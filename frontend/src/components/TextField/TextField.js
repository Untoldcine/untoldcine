"use client";
import { useState } from "react";
import "./TextField.css";

export const TextField = ({ text, value, update, icon, field }) => {
  const [passVisible, setPassVisible] = useState(false);

  return (
    <div className="box">
      <i className={icon}></i>
      <input
        type={field === "password" ? passVisible ? "text" : "password": 'text'}
        placeholder={text}
        className="input"
        value={value}
        onChange={(e) =>
          update((prev) => ({ ...prev, [field]: e.target.value }))
        }
      />
      {field === "password" ? (
        passVisible ? (
          <i
            className="fa fa-regular fa-eye"
            id="pw-hidden"
            style={{ color: "white" }}
            onClick = {() => setPassVisible(!passVisible)}
          ></i>
        ) : (
          <i
            className="fa fa-regular fa-eye-slash"
            id="pw-hidden"
            style={{ color: "white" }}
            onClick = {() => setPassVisible(!passVisible)}
          ></i>
        )
      ) : <div id = 'spacer'>
        </div>}
    </div>
  );
};

// <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
