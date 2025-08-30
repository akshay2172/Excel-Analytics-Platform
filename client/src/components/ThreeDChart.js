import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function ThreeDChart({ data, xCol, yCol }) {
  const barWidth = 0.5;
  return (
    <Canvas camera={{ position: [5, 5, 10] }}>
      <ambientLight intensity={0.5} />
      <OrbitControls />
      {data.map((row, i) => (
        <mesh key={i} position={[i * (barWidth + 0.2), (row[yCol] || 0) / 2, 0]}>
          <boxGeometry args={[barWidth, row[yCol] || 0, barWidth]} />
          <meshStandardMaterial color="teal" />
        </mesh>
      ))}
      <gridHelper args={[20, 20]} />
      <axesHelper args={[5]} />
    </Canvas>
  );
}
