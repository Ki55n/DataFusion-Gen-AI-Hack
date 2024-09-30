"use client";

import React, { useMemo, useCallback, useRef, useEffect } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

interface DataPoint {
  lat: number;
  lng: number;
  city: string;
}

const data: DataPoint[] = [
  { lat: -22.9068, lng: -43.1729, city: "Rio de Janeiro" },
  { lat: 25.2048, lng: 55.2708, city: "Dubai" },
  { lat: 40.7128, lng: -74.006, city: "New York City" },
  { lat: 19.076, lng: 72.8777, city: "Mumbai" },
  { lat: 51.5074, lng: -0.1278, city: "London" },
];

export default function CustomerLocationGlobe() {
  const globeRef = useRef<any>();

  const globeMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial({ color: "white" });
    material.bumpScale = 10;
    new THREE.TextureLoader().load(
      "//unpkg.com/three-globe/example/img/earth-topology.png",
      (texture) => {
        material.bumpMap = texture;
        material.needsUpdate = true;
      }
    );
    return material;
  }, []);

  const customGlobeImage = useCallback((context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.arc(512, 512, 500, 0, 2 * Math.PI);
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fill();

    // Add more white dots for a brighter appearance
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - 512, 2) + Math.pow(y - 512, 2)
      );
      if (distanceFromCenter <= 500) {
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        context.fillRect(x, y, 1, 1);
      }
    }

    // Add some larger, brighter dots
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - 512, 2) + Math.pow(y - 512, 2)
      );
      if (distanceFromCenter <= 500) {
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.beginPath();
        context.arc(x, y, Math.random() * 2 + 1, 0, 2 * Math.PI);
        context.fill();
      }
    }

    return context.getImageData(0, 0, 1024, 1024);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const markerSvg = useCallback(
    (color: string) => `
    <svg viewBox="-4 0 36 36" width="14" height="14">
      <path fill="${color}" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    </svg>
  `,
    []
  );

  return (
    <div className="  flex items-center justify-center">
      <div className="">
        <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-3xl"></div>
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          // customGlobeImageUrl={customGlobeImage}
          pointsData={data}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#FF69B4"}
          pointAltitude={0.1}
          pointRadius={0.25}
          pointsMerge={false}
          htmlElementsData={data}
          htmlElement={(d: any) => {
            const el = document.createElement("div");
            el.innerHTML = markerSvg("#FF69B4");
            el.style.width = "20px";
            el.style.height = "20px";
            el.style.pointerEvents = "auto";
            el.style.cursor = "pointer";
            el.onclick = () => alert(`Clicked on ${d.city}`);
            return el;
          }}
          width={400}
          height={400}
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#ffffff"
          atmosphereAltitude={0.25}
          globeMaterial={globeMaterial}
          showAtmosphere={true}
          showGraticules={false}
        />
      </div>
      <div className="absolute bottom-4 left-4 text-white text-sm space-y-2">
        {data.map((location, index) => (
          <div key={index} className="flex items-center">
            <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
            {location.city}
          </div>
        ))}
      </div>
    </div>
  );
}
