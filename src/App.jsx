import React, { useState } from "react";
import PhotoGrid from "./components/PhotoGrid";
import WinnerModal from "./components/WinnerModal";
import Header from "./components/Header";
import "./index.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [logos, setLogos] = useState({ logo1: null, logo2: null });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [title, setTitle] = useState("My Giveaway Event");
  const [bgColor, setBgColor] = useState("#111");
  const [defaultWinners, setDefaultWinners] = useState(1);

  const preloadImages = (urls) => urls.forEach((url) => new Image().src = url);

  const handlePhotoUpload = (e) => {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
  if (!files.length) return;

  // store both URL and filename
  const newPhotos = files.map(f => ({
    url: URL.createObjectURL(f),
    name: f.name
  }));

  setPhotos(prev => [...prev, ...newPhotos]);
};


  const handleLogoUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) setLogos(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const enterFullscreen = () => setIsFullscreen(true);

  const [winners, setWinners] = useState([]);
  const [showWinners, setShowWinners] = useState(false);

  // Pick multiple winners
  const pickWinner = () => {
  setIsShuffling(true);
  setWinners([]);
  setShowWinners(false);

  setTimeout(() => {
    setIsShuffling(false);

    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    const selectedWinners = shuffled.slice(0, Math.min(defaultWinners, photos.length));
    setWinners(selectedWinners); // trigger pop-out in PhotoGrid
  }, 2000);
};

  // After winner animation ends
  const handleWinnerAnimationEnd = () => {
    setShowWinners(true); // show WinnerModal
  };

  const reset = () => {
    setWinners([]);
    setShowWinners(false);
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      <Header logos={logos} handleLogoUpload={handleLogoUpload} title={title} />


      {!isFullscreen && (
        <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", background: "#222", color: "#fff", borderRadius: "12px" }}>
          <h2>Event Settings</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
          <input type="number" min="1" max={photos.length || 20} value={defaultWinners} onChange={(e) => setDefaultWinners(Number(e.target.value))} style={{ width: "100%", marginBottom: "10px" }} />
          <button onClick={enterFullscreen} style={{ width: "100%" }}>Enter Fullscreen</button>
        </div>
      )}

     

      {photos.length > 0 && (
        <PhotoGrid
  photos={photos} // now each photo is {url, name}
  isShuffling={isShuffling}
  winner={winners}
  onWinnerAnimationEnd={handleWinnerAnimationEnd}
/>

      )}
       {isFullscreen && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <input type="file" accept="image/*" multiple id="photo-upload" style={{ display: "none" }} onChange={handlePhotoUpload} />
         {!isShuffling && (
           <label htmlFor="photo-upload" style={{ padding: "12px 24px", background: "grey", color: "#000", borderRadius: "8px", cursor: "pointer", marginRight: "10px" }}>
            {photos.length ? "Upload More Photos" : "Upload Photos"}
          </label>
         )}
       
          {photos.length > 0 && winners.length === 0 && !isShuffling &&
            <button onClick={pickWinner} style={{ padding: "12px 24px", background: "white", color: "#000", borderRadius: "8px" }}>Pick Winner(s)</button>
          }
        </div>
      )}
      {showWinners && winners.length > 0 && (
        <WinnerModal winner={winners} onReset={reset} />
      )}
    </div>
  );
}