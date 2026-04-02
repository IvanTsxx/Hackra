"use client";

import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useRef, useMemo } from "react";
import type * as THREE from "three";

interface GlobeProps {
  color: string;
}

function Globe({ color }: GlobeProps) {
  const ref = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    const pts: number[] = [];
    const radius = 2;

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const latRad = (lat * Math.PI) / 180;
      const r = radius * Math.cos(latRad);
      const y = radius * Math.sin(latRad);

      for (let lon = 0; lon < 360; lon += 5) {
        const lonRad = (lon * Math.PI) / 180;
        pts.push(r * Math.cos(lonRad), y, r * Math.sin(lonRad));
      }
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      const lonRad = (lon * Math.PI) / 180;

      for (let lat = -90; lat <= 90; lat += 5) {
        const latRad = (lat * Math.PI) / 180;
        const r = radius * Math.cos(latRad);
        const y = radius * Math.sin(latRad);
        pts.push(r * Math.cos(lonRad), y, r * Math.sin(lonRad));
      }
    }

    return new Float32Array(pts);
  }, []);

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.03}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

interface FloatingParticlesProps {
  color: string;
}

function FloatingParticles({ color }: FloatingParticlesProps) {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const pts: number[] = [];

    for (let i = 0; i < 200; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + Math.random() * 2;

      pts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    return new Float32Array(pts);
  }, []);

  return (
    <Points ref={ref} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

export function Globe3D() {
  const { resolvedTheme } = useTheme();

  const pointColor = resolvedTheme === "dark" ? "#4ade80" : "#0a0a0a";

  return (
    <div className="relative w-full h-full cursor-grab">
      <Canvas
        camera={{ fov: 45, position: [0, 0, 6] }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />

        <Globe color={pointColor} />
        <FloatingParticles color={pointColor} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI / 3) * 2}
        />
      </Canvas>
    </div>
  );
}
