import React from "react";
import "./Header.css";

export default function Header({ logos, handleLogoUpload, title }) { // add title prop
  return (
    <div className="header">
      {/* Left Logo */}
      <div className="logo-container">
        {logos.logo1 ? (
          <img src={logos.logo1} alt="Logo 1" className="header-logo" />
        ) : (
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogoUpload(e, "logo1")}
              id="logo1-upload"
            />
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="header-title">{title}</h1>  {/* dynamic title */}

      {/* Right Logo */}
      <div className="logo-container">
        {logos.logo2 ? (
          <img src={logos.logo2} alt="Logo 2" className="header-logo" />
        ) : (
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogoUpload(e, "logo2")}
              id="logo2-upload"
            />
          </div>
        )}
      </div>
    </div>
  );
}
