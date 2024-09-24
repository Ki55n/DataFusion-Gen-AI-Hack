"use client";

import React, { useMemo, useCallback } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

interface DataPoint {
  lat: number;
  lng: number;
  city: string;
  population: number;
}

interface GlobeProps {
  data: DataPoint[];
}

export default function GlobeComponent({ data }: GlobeProps) {
  const globeMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial();
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

  const getPointColor = useCallback((d: DataPoint) => {
    return d.population > 1000000
      ? "rgba(255,165,0,0.8)"
      : "rgba(255,255,255,0.8)";
  }, []);

  const markerSvg = useMemo(() => {
    return `<svg viewBox="-4 0 36 36">
      <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
      <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={data}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d) => getPointColor(d as DataPoint)} // Cast to DataPoint
        pointAltitude={0.07}
        pointRadius={0.05}
        pointsMerge={true}
        pointLabel={(d: any) =>
          `${d.city}: Pop. ${d.population.toLocaleString()}`
        }
        htmlElementsData={data}
        htmlElement={(d: any) => {
          const el = document.createElement("div");
          el.innerHTML = markerSvg;
          el.style.color = getPointColor(d as DataPoint); // Cast to DataPoint
          el.style.width = "20px";
          el.style.height = "20px";
          return el;
        }}
        width={400}
        height={400}
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.25}
        globeMaterial={globeMaterial}
        showAtmosphere={true}
        showGraticules={false}
        polygonsData={[]}
        polygonCapColor={() => "rgba(200, 0, 0, 0.3)"}
        polygonSideColor={() => "rgba(150, 0, 0, 0.3)"}
        polygonStrokeColor={() => "#111"}
        ringsData={[]}
        ringColor={() => "#9cff00"}
        ringMaxRadius={2}
        arcsData={[]}
        arcColor={(e: any) => {
          const op = Math.pow(0.9, e.stroke);
          return `rgba(255,100,50,${op})`;
        }}
        arcAltitude={0.1}
        arcStroke={0.5}
        arcDashLength={1}
        arcDashGap={0.5}
        arcDashAnimateTime={4000}
      />
    </div>
  );
}
