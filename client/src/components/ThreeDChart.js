import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";


function Bar({ position, height, width, depth, color, label, value, onHover }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    
    if (hovered) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y, 
        1.1, 
        0.1
      );
    } else {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y, 
        1, 
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => {
          setHovered(true);
          onHover({ label, value });
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={hovered ? "#ff6b6b" : color} 
          emissive={hovered ? "#ff6b6b" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, height/2 + 0.3, 0]}
          color="white"
          fontSize={0.2}
          anchorX="center"
          anchorY="middle"
          renderOrder={1}
        >
          {value.toFixed(1)}
        </Text>
      )}
    </group>
  );
}


function GridAndAxes({ xCol, yCol, data, maxValue, barWidth, spacing }) {
  const xAxisLength = data.length * (barWidth + spacing) - spacing;
  
  return (
    <group>
     
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[xAxisLength + 2, 8]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
      </mesh>
      
      
      <gridHelper args={[xAxisLength + 2, 10, "#888888", "#cccccc"]} />
      
      {/* Y-axis line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-xAxisLength/2, 0, 0, -xAxisLength/2, maxValue + 1, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#4a5568" linewidth={2} />
      </line>
      
      {/* Y-axis labels */}
      {[0, maxValue/2, maxValue].map((value, i) => (
        <group key={i} position={[-xAxisLength/2 - 0.5, value, 0]}>
          <Text fontSize={0.15} color="#4a5568" anchorX="right" anchorY="middle">
            {value.toFixed(1)}
          </Text>
        </group>
      ))}
      
      {/* X-axis label */}
      <Text position={[0, -0.8, 0]} fontSize={0.2} color="#4a5568" anchorX="center">
        {xCol}
      </Text>
      
      {/* Y-axis label */}
      <Text 
        position={[-xAxisLength/2 - 1, maxValue/2, 0]} 
        fontSize={0.2} 
        color="#4a5568" 
        anchorX="center"
        rotation={[0, 0, Math.PI/2]}
      >
        {yCol}
      </Text>
    </group>
  );
}

export default function ThreeDBarChart({ data, xCol, yCol }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  
 
  const barWidth = 0.5;
  const spacing = 0.2;
  const depth = 0.3;
  const maxValue = Math.max(...data.map(row => row[yCol] || 0));
  

  const scaleFactor = 6 / maxValue;
  
 
  const colors = [
    "#4ecdc4", "#ff6b6b", "#45b7d1", "#f9c74f", 
    "#90be6d", "#577590", "#7209b7", "#f8961e"
  ];

  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      <Canvas camera={{ position: [8, 5, 10], fov: 40 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <GridAndAxes 
          xCol={xCol} 
          yCol={yCol} 
          data={data} 
          maxValue={maxValue * scaleFactor} 
          barWidth={barWidth} 
          spacing={spacing} 
        />
        
        {data.map((row, i) => {
          const xPos = i * (barWidth + spacing) - (data.length * (barWidth + spacing) - spacing) / 2 + barWidth/2;
          const height = (row[yCol] || 0) * scaleFactor;
          const color = colors[i % colors.length];
          
          return (
            <Bar
              key={i}
              position={[xPos, height/2, 0]}
              height={height}
              width={barWidth}
              depth={depth}
              color={color}
              label={row[xCol] || `Item ${i+1}`}
              value={row[yCol]}
              onHover={setHoveredBar}
            />
          );
        })}
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
      
    
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-1">3D Bar Chart</h3>
        {hoveredBar ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">{hoveredBar.label}</span>: {hoveredBar.value}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Hover over a bar for details</p>
        )}
      </div>
      
     
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md text-xs text-gray-600 border border-gray-200">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}