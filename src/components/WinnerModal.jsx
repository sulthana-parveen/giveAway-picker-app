import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

export default function WinnerModal({ onReset, allPhotos = [], numberOfWinners = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [winners, setWinners] = useState([]);
  const [shuffledPhotos, setShuffledPhotos] = useState([]);
  const [allWinners, setAllWinners] = useState([]); // keep track of all previous winners
  const audioRef = useRef(null);

  useEffect(() => {
    if (!allPhotos || allPhotos.length === 0) return;

    // Shuffle all images once
    const shuffled = [...allPhotos].sort(() => Math.random() - 0.5);
    setShuffledPhotos(shuffled);

    const intervalTime = 1000 / 3; // 3 images per second (~0.33s per image)
    let index = 0;

    const interval = setInterval(() => {
      setCurrentIndex(index);
      index++;

      if (index >= shuffled.length) {
        clearInterval(interval);

        // Filter out previous winners
        const availablePhotos = allPhotos.filter(
          (photo) => !allWinners.some((w) => w.name === photo.name)
        );

        // Pick winners
        const selectedWinners = availablePhotos
          .sort(() => Math.random() - 0.5)
          .slice(0, numberOfWinners);

        // Update states
        setWinners(selectedWinners);
        setAllWinners((prev) => [...prev, ...selectedWinners]);
        setShowWinner(true);

        launchConfetti();
        playWinnerSound();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [allPhotos, numberOfWinners, allWinners]);

  const launchConfetti = () => {
    const duration = 6000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 35,
      spread: 120,
      ticks: 80,
      gravity: 0.7,
      scalar: 1.3,
      zIndex: 1500,
      colors: ["#ff5f6d", "#ffc371", "#00f5d4", "#9b5de5", "#f15bb5"],
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 60 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.5, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.5 + Math.random() * 0.5, y: Math.random() - 0.2 } });
    }, 250);
  };

  const playWinnerSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  if (!shuffledPhotos.length) return null;

  const displayPhoto = showWinner ? winners[0] : shuffledPhotos[currentIndex];
  const removeExtension = (name = "") => name.replace(/\.[^/.]+$/, "");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <audio ref={audioRef} src="/sounds/applause.mp3" preload="auto" />

      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 4rem)",
          color: "#ff1744",
          textShadow: "0 0 25px black, 0 0 60px black",
          textAlign: "center",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}
      >
        {showWinner ? "!!مبرووووك " : "اختيار كابتن التصفير"}
      </h1>

      <div
        style={{
          width: "300px",
          maxWidth: "90vw",
          height: "400px",
          overflow: "hidden",
          boxShadow: "0 0 25px white, 0 0 60px white",
        }}
      >
        {displayPhoto && (
          <img
            src={displayPhoto.url}
            alt={displayPhoto.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.2s ease",
              transform: showWinner ? "scale(1.2)" : "scale(1)",
            }}
          />
        )}
      </div>

      {showWinner && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "1.6rem",
            fontWeight: "600",
            color: "#fff",
            textShadow: "0 0 10px black",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
         
        </div>
      )}

      {showWinner && (
        <button
          onClick={onReset}
          style={{
            marginTop: "40px",
            padding: "14px 32px",
            background: "#111",
            color: "#fff",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: "bold",
            border: "2px solid #000",
            boxShadow: "0 0 20px rgba(255, 23, 68, 0.5)",
          }}
        >
          Pick Again
        </button>
      )}
    </div>
  );
}
