import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function WinnerModal({ winner = [], onReset }) {
  const [animateWinner, setAnimateWinner] = useState(false);

  useEffect(() => {
    const audio = new Audio("/sounds/applause.mp3");
    audio.play();

    setTimeout(() => {
      setAnimateWinner(true);

      const duration = 5000;
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

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 60 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.15, 0.25), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.75, 0.85), y: Math.random() - 0.2 },
        });
      }, 250);
    }, 400);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle, rgba(0,0,0,0.92) 0%, rgba(25,25,25,0.9) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        zIndex: 1000,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: animateWinner ? "clamp(2rem, 6vw, 4rem)" : "0rem",
          opacity: animateWinner ? 1 : 0,
          transition: "all 1s ease-out",
          color: "#ff1744",
          textShadow: "0 0 25px black, 0 0 60px black",
          textAlign: "center",
          marginBottom: "1.5rem",
          textTransform:'uppercase'
        }}
      >
         Congratulations! 
      </h1>

      {/* Winners Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {winner.map((w, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 250px",
              maxWidth: "min(90vw, 320px)",
              aspectRatio: "1240 / 1844",
              textAlign: "center",
            }}
          >
            <img
              src={w.url}
              alt={w.name}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "1240 / 1844",
                borderRadius: "20px",
                border: "3px solid #ff1744",
                boxShadow: "0 0 25px white, 0 0 60px white",
                objectFit: "cover",
                transition: "all 1s ease-out",
                transform: animateWinner ? "scale(1)" : "scale(0)",
                opacity: animateWinner ? 1 : 0,
              }}
            />
            <div
              style={{
                marginTop: "12px",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                wordBreak: "break-word",
              }}
            >
               {w.name.replace(/\.[^/.]+$/, "")} {/* removes file extension */}
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onReset}
        style={{
          marginTop: "35px",
          padding: "14px 32px",
          background: "#111",
          color: "#fff",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          fontWeight: "bold",
          border: "2px solid #000",
          boxShadow: "0 0 20px rgba(255, 23, 68, 0.5)",
          transition: "all 0.3s ease",
        }}
       
        onMouseLeave={(e) => (e.target.style.background = "#111")}
      >
        Pick Again
      </button>
    </div>
  );
}
