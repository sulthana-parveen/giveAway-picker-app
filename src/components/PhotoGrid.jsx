import React, { useEffect, useState } from "react";
import "./PhotoGrid.css";

export default function PhotoGrid({ photos = [], headerHeight = 80, footerHeight = 0 }) {
  const aspectRatio = 1240 / 1844; // width / height
  const gap = 10;
  const padding = 20;

  const computeGrid = (count) => {
    if (count === 0) return { rows: 1, cols: 1, tileSize: 100 };

    const containerW = window.innerWidth - padding * 2;
    const containerH = window.innerHeight - headerHeight - footerHeight - padding * 2;

    let best = { rows: 1, cols: count, tileSize: 100, area: 0 };

    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);
      const totalGapW = (cols - 1) * gap;
      const totalGapH = (rows - 1) * gap;

      const maxTileW = (containerW - totalGapW) / cols;
      const maxTileH = (containerH - totalGapH) / rows;

      // limit tile height based on aspect ratio and width
      const tileH = Math.min(maxTileH, maxTileW / aspectRatio);

      const area = tileH * (tileH * aspectRatio);
      if (area > best.area) best = { rows, cols, tileSize: tileH, area };
    }

    return best;
  };

  const [gridConfig, setGridConfig] = useState(() => computeGrid(photos.length));

  useEffect(() => {
    const handleResize = () => setGridConfig(computeGrid(photos.length));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [photos.length]);

  return (
    <div
      className="grid-wrapper"
      style={{ padding: `${padding}px`, boxSizing: "border-box" }}
    >
      <div
        className="photo-grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.tileSize * aspectRatio}px)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, ${gridConfig.tileSize}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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