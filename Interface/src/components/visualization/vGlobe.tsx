import React, { useMemo } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

interface GlobeProps {
  data: { lat: number; lng: number; city: string }[];
}

const GlobeComponent: React.FC<GlobeProps> = ({ data }) => {
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

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl={null}
      pointsData={data}
      pointLat="lat"
      pointLng="lng"
      pointColor={() => "red"}
      pointAltitude={0.1}
      pointRadius={0.5}
      pointLabel="city"
      width={300}
      height={200}
      backgroundColor="rgba(0,0,0,0)"
      atmosphereColor="lightskyblue"
      atmosphereAltitude={0.25}
      globeMaterial={globeMaterial}
      showAtmosphere={true}
      showGraticules={true}
    />
  );
};

export default GlobeComponent;
