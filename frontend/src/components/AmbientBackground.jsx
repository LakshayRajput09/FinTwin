import React from "react";
import "./AmbientBackground.css";

/**
 * AmbientBackground
 * Renders the exact Apple-inspired Liquid Glass background matching the reference photo.
 * Features photorealistic out-of-focus tropical foliage behind the sidebar and in the bottom corner,
 * a 3D flowing frosted acrylic liquid glass wave ribbon curving across the upper right,
 * and delicate studio lighting.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient-background-canvas" aria-hidden="true">
      <img
        src="/liquid_glass_bg.jpg"
        alt=""
        className="ambient-wallpaper-img"
      />
      <div className="ambient-soft-bloom" />
    </div>
  );
}
