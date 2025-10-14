import React, { useState, useEffect, useRef } from "react";
import "./PhotoGrid.css";

export default function PhotoGrid({ photos = [], isShuffling = false, winner = [], onWinnerAnimationEnd }) {
  const [shuffledPhotos, setShuffledPhotos] = useState(photos);
  const [highlighted, setHighlighted] = useState([]);
  const [gridConfig, setGridConfig] = useState({ rows: 1, cols: 1, tileSize: 100 });
  const gridRef = useRef(null);
  const [winnerStyles, setWinnerStyles] = useState([]);
  const aspectRatio = 1240 / 1844; // image width/height
  const gap = 10;

  // Compute optimal rows, cols, and tile size to fit viewport
  const computeGrid = () => {
    const count = photos.length;
    if (count === 0) return;

  const wrapper = gridRef.current?.parentElement;
const containerW = (wrapper?.clientWidth || window.innerWidth) - gap * 4;
const containerH = (wrapper?.clientHeight || window.innerHeight) - gap * 4;



     let best = { rows: 1, cols: count, tileSize: 100, area: 0 };


    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);

      const maxTileW = (containerW - (cols - 1) * gap) / cols;
      const maxTileH = (containerH - (rows - 1) * gap) / rows;

      let tileH = Math.min(maxTileH, maxTileW / aspectRatio);
      let tileW = tileH * aspectRatio;

      const area = tileW * tileH;
     if (area > best.area) best = { rows, cols, tileSize: tileH, area };
    }

    setGridConfig(best);
  };

  useEffect(() => {
    computeGrid();
    window.addEventListener("resize", computeGrid);
    return () => window.removeEventListener("resize", computeGrid);
  }, [photos.length]);

  // Shuffle effect
  useEffect(() => {
    if (!isShuffling) {
      setShuffledPhotos(photos);
      setHighlighted([]);
      return;
    }

    const interval = setInterval(() => {
      setShuffledPhotos(prev => {
        const copy = [...prev];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      });

      const indices = [];
      const numHighlight = Math.min(5, photos.length);
      while (indices.length < numHighlight) {
        const rand = Math.floor(Math.random() * photos.length);
        if (!indices.includes(rand)) indices.push(rand);
      }
      setHighlighted(indices);
    }, 70);

    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isShuffling, photos]);
     useEffect(() => {
    if (!winner || winner.length === 0 || !gridRef.current) return;

    const styles = winner.map(w => {
      const index = shuffledPhotos.findIndex(p => p === w);
      const winnerImg = gridRef.current.querySelectorAll(".grid-photo")[index];
      if (!winnerImg) return null;

      const rect = winnerImg.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      return {
        position: "absolute",
        left: rect.left - bodyRect.left,
        top: rect.top - bodyRect.top,
        width: rect.width,
        height: rect.height,
        transition: "all 1s ease-out",
        zIndex: 1000,
        opacity: 1,
        targetLeft: window.innerWidth / 2 - rect.width,
        targetTop: window.innerHeight / 2 - rect.height,
        targetWidth: rect.width * 2,
        targetHeight: rect.height * 2,
      };
    }).filter(Boolean);

    setWinnerStyles(styles);

    requestAnimationFrame(() => {
      setWinnerStyles(prev => prev.map((s, i) => ({
        ...s,
        left: s.targetLeft + i * 20, // slightly offset multiple winners
        top: s.targetTop + i * 20,
        width: s.targetWidth,
        height: s.targetHeight,
      })));
    });

    const timer = setTimeout(() => onWinnerAnimationEnd(), 1100);
    return () => clearTimeout(timer);
  }, [winner, onWinnerAnimationEnd, shuffledPhotos]);
  return (
    <div className="grid-wrapper">
      <div
        className="photo-grid-container"
        ref={gridRef}
        style={{
          display: "grid",
    gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.tileSize * aspectRatio}px)`,
    gridTemplateRows: `repeat(${gridConfig.rows}, ${gridConfig.tileSize}px)`,
    gap: `${gap}px`,
    justifyContent: "center",
    alignContent: "center",
    width: "100%",         // ✅ fix: respects wrapper padding
    height: "100%",        // ✅ optional: matches wrapper height
   
    boxSizing: "border-box",
        }}
      >
        {shuffledPhotos.map((photo, index) => {
          const isHighlighted = highlighted.includes(index);
          if (winner.includes(photo)) return null;
          return (
            <div
              key={index}
              className="photo-cell"
              style={{
                width: gridConfig.tileSize * aspectRatio,
                height: gridConfig.tileSize,
                overflow: "hidden",
                borderRadius: 0,
                backgroundColor: "#000",
              }}
            >
              <img
                src={photo.url}
                alt={`photo-${index}`}
                className={`grid-photo ${isShuffling && isHighlighted ? "fade-animate pop-out" : ""}`}
                style={{  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                  objectFit: "contain", }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
