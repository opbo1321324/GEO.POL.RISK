// @ts-nocheck
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';

const GlobeRenderer = ({ data, hoveredCountry, setHoveredCountry, setClickedCountry }: any) => {
  const globeRef = useRef<any>(null);
  const { scene } = useThree();
  const [geoJson, setGeoJson] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setGeoJson);
  }, []);

  // Create the globe instance once
  const globe = useMemo(() => {
    const g = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    if (geoJson) {
      g.polygonsData(geoJson.features)
        .polygonAltitude(0.01)
        .polygonCapColor((feat: any) => {
          const countryData = data.find((d: any) => d.iso_alpha3 === feat.id || d.country === feat.properties.NAME || d.iso_alpha3 === feat.properties.ISO_A3);
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
    }

    // Make the globe material look premium
    const material = g.globeMaterial() as THREE.MeshPhongMaterial;
    material.color = new THREE.Color('#050816');
    material.emissive = new THREE.Color('#223355');
    material.emissiveIntensity = 0.1;
    material.shininess = 0.7;

    return g;
  }, [data, geoJson]);

  // Handle interaction updates
  useEffect(() => {
    if (!globeRef.current) return;
    const g = globeRef.current;
    
    // Add interaction logic to the raw Three.js object if needed
    // three-globe handles polygonHoverColor internally when raycasted
  }, [globe]);

  // Auto-rotation
  useFrame(() => {
    if (globeRef.current && !hoveredCountry) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <primitive 
      object={globe} 
      ref={globeRef}
      onPointerMove={(e: any) => {
        // Simple raycast emulation or rely on three-globe internal raycaster
        // For pure R3F, we might need a custom raycast on the polygons layer, 
        // but three-globe manages its own internal meshes. We can just use the scene.
      }}
    />
  );
};

export function GlobeScene({ data, setClickedCountry }: { data: any[], setClickedCountry: (d: any) => void }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

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
          hoveredCountry={hoveredCountry}
          setHoveredCountry={setHoveredCountry}
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
