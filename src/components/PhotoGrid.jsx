import React, { useEffect, useState, useRef } from "react";
import "./PhotoGrid.css";

export default function PhotoGrid({ photos = [], headerHeight = 80, footerHeight = 0 }) {
  const gridRef = useRef(null);
  const aspectRatio = 1240 / 1844; // image width/height
  const gap = 10;

  // Compute optimal grid for given count and available window space
  const computeGrid = (count) => {
    if (count === 0) return { rows: 1, cols: 1, tileSize: 100 };

    const containerW = window.innerWidth - gap * 2;
    const containerH = window.innerHeight - gap * 2 - headerHeight - footerHeight;

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

    return best;
  };

  // Initialize gridConfig based on initial photos length
  const [gridConfig, setGridConfig] = useState(() => computeGrid(photos.length));

  useEffect(() => {
    // Recompute grid whenever photos length or window resizes
    const handleResize = () => setGridConfig(computeGrid(photos.length));
    setGridConfig(computeGrid(photos.length));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photos.length, headerHeight, footerHeight]);

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
          height: window.innerHeight - headerHeight - footerHeight,
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
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
