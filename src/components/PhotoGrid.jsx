import React, { useEffect, useState, useRef } from "react";
import "./PhotoGrid.css";

export default function PhotoGrid({ photos = [], winner = [], onWinnerAnimationEnd }) {
  const [gridConfig, setGridConfig] = useState({ rows: 1, cols: 1, tileSize: 100 });
  const gridRef = useRef(null);
  const aspectRatio = 1240 / 1844; // image width/height
  const gap = 10;

  // Compute optimal rows, cols, and tile size to fit viewport
  const computeGrid = () => {
    const count = photos.length;
    if (count === 0) return;

    const containerW = window.innerWidth - gap * 2;
    const containerH = window.innerHeight - gap * 2;

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
          width: "100vw",
          height: "100vh",
          padding: `${gap}px`,
          boxSizing: "border-box",
        }}
      >
        {photos.map((photo, index) => (
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
              alt={photo.name}
              className="grid-photo"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 0,
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
