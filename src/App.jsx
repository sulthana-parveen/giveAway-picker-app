import React, { useState } from "react";
import PhotoGrid from "./components/PhotoGrid";
import WinnerModal from "./components/WinnerModal";
import Header from "./components/Header";
import "./index.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [logos, setLogos] = useState({ logo1: null, logo2: null });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [title, setTitle] = useState("جائزة كابتن التصفير"); // default Arabic title
  const [bgColor, setBgColor] = useState("#111");
  const [defaultWinners, setDefaultWinners] = useState(1);
  const [showWinners, setShowWinners] = useState(false);

  // Upload photos
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (!files.length) return;

    const newPhotos = files.map(f => ({
      url: URL.createObjectURL(f),
      name: f.name
    }));

    setPhotos(prev => [...prev, ...newPhotos]);

    // Enter fullscreen after upload
    setTimeout(() => {
      enterFullscreen();
    }, 100);
  };

  // Upload logos
  const handleLogoUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) setLogos(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  // Fullscreen function
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  // Pick winners
  const pickWinner = () => {
    setShowWinners(true);
  };

  // Reset winners modal
  const reset = () => {
    setShowWinners(false);
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      {/* Normal (non-fullscreen) settings */}
      {!isFullscreen && (
        <div
          style={{
            maxWidth: "500px",
            margin: "20px auto",
            padding: "20px",
            background: "#222",
            color: "#fff",
            borderRadius: "12px",
          }}
        >
          <h2>Event Settings</h2>
          <h2>{title}</h2>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <input
            type="number"
            min="1"
            max={photos.length || 20}
            value={defaultWinners}
            onChange={(e) => setDefaultWinners(Number(e.target.value))}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button onClick={enterFullscreen} style={{ width: "100%" }}>
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* PhotoGrid outside fullscreen */}
      {photos.length > 0 && !isFullscreen && (
        <PhotoGrid photos={photos} headerHeight={80} footerHeight={50} />
      )}

      {/* Fullscreen layout */}
      {isFullscreen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            padding: "20px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: "10px" }}>
            <Header logos={logos} handleLogoUpload={handleLogoUpload} title={title} />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              id="photo-upload"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <label
              htmlFor="photo-upload"
              style={{
                padding: "12px 24px",
                background: "grey",
                color: "#000",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {photos.length ? "Upload More Photos" : "Upload Photos"}
            </label>

            {photos.length > 0 && (
              <button
                onClick={pickWinner}
                style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "#000",
                  borderRadius: "8px",
                }}
              >
                Pick Winner(s)
              </button>
            )}
          </div>

          {/* PhotoGrid */}
          <div
            style={{
             flex: 1,
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {photos.length > 0 && <PhotoGrid photos={photos} />}
          </div>
        </div>
      )}

      {/* Winner modal */}
      {showWinners && (
        <WinnerModal
          allPhotos={photos}
          numberOfWinners={defaultWinners}
          onReset={reset}
        />
      )}
    </div>
  );
}
