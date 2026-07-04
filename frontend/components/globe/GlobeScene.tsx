// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';

const GlobeRenderer = ({ data, setClickedCountry }: any) => {
  const [geoJson, setGeoJson] = useState<any>(null);

  // Lazy initialize the globe exactly ONCE to prevent WebGL crashes
  const [globe] = useState(() => {
    const g = new ThreeGlobe()
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png');
    
    const material = g.globeMaterial() as THREE.MeshPhongMaterial;
    material.color = new THREE.Color('#050816');
    material.emissive = new THREE.Color('#111827');
    material.emissiveIntensity = 0.1;
    material.shininess = 0.7;
    return g;
  });

  // Fetch local geojson
  useEffect(() => {
    fetch('/custom.geo.json')
      .then(res => res.json())
      .then(setGeoJson)
      .catch(err => console.error('Failed to load GeoJSON', err));
  }, []);

  // Safely mutate globe properties when data or geojson loads
  useEffect(() => {
    if (!globe || !geoJson) return;

    globe.polygonsData(geoJson.features)
      .polygonAltitude(0.01)
      .polygonCapColor((feat: any) => {
        const countryData = data.find((d: any) => d.iso_alpha3 === feat.id || d.country === feat.properties.ADMIN || d.iso_alpha3 === feat.properties.ISO_A3);
        if (!countryData) return 'rgba(20, 30, 50, 0.5)';
        
        const score = countryData.risk_score;
        if (score <= 25) return '#00E676';
        if (score <= 50) return '#FFC107';
        if (score <= 75) return '#FF7043';
        return '#F44336';
      })
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => '#111')
      .polygonHoverColor(() => '#3B82F6')
      .onPolygonClick((feat: any) => {
        setClickedCountry(feat);
      });
  }, [data, geoJson, globe, setClickedCountry]);

  // Handle slow spin
  useFrame(() => {
    if (globe) {
      globe.rotation.y += 0.0005;
    }
  });

  // Officially mount the ThreeGlobe instance into React Three Fiber
  return globe ? <primitive object={globe} /> : null;
};

export function GlobeScene({ data, setClickedCountry }: { data: any[], setClickedCountry: (d: any) => void }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing relative">
      <Canvas camera={{ position: [0, 0, 250], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 100, 100]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-100, -100, -100]} intensity={0.5} color="#3B82F6" />
        <pointLight position={[-200, 0, 200]} intensity={1} color="#00E676" />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <GlobeRenderer 
          data={data} 
          setClickedCountry={setClickedCountry}
        />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={150}
          maxDistance={400}
          autoRotate={false} 
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
