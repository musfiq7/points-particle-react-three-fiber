import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BufferAttribute } from "three";
import './App.css';

const vertexShader =`
uniform float uTime;
uniform float uRadius;
varying vec2 vUv;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js

//rotate along with y-axis
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}
//rotate along with z-axis
mat3 rotation3dZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, -s, 0.0,
    s, c,  0.0,
    0.0, 0.0, 1.0
  );
}

//rotate along with x-axis
mat3 rotation3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}



//translate along with x-axis
mat3 translation3dX(float distance) {
  return mat3(
    1.0, 0.0, distance,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  );
}


//translate along with y-axis
mat3 translation3dY(float distance) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, distance,
    0.0, 0.0, 1.0
  );
}
//translate along with z-axis
mat3 translation3dZ(float distance) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, distance, 1.0
  );
}




void main() {
  vUv = uv;
  // float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
   vec3 particlePosition = position  * rotation3dY(uTime * 0.3);
   //vec3 particlePosition = position  * translation3dX(uTime * 0.3);
   //vec3 particlePosition = position  * translation3dY(uTime * 0.3);
   //vec3 particlePosition = position  * translation3dZ(uTime * 0.3);
   //vec3 particlePosition = position  * rotation3dZ(uTime * 0.3);
   //vec3 particlePosition = position  * rotation3dX(uTime * 0.3);

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
   gl_PointSize = 3.0;
}


`;
const fragmentShader =`
varying vec2 vUv;
uniform float uTime;
void main() {
  //gl_FragColor = vec4(0.34, 0.53, 0.96, 1.0);
  gl_FragColor = vec4(sin(vUv.x + uTime * 0.2) ,cos(vUv.y + uTime * 0.2), tan(vUv.y + uTime  ), 1.0);
}


`;

const CustomGeometryParticles = ({ count = 10000}) => {
  //const { count } = props;
  const radius = 2;

  // This reference gives us direct access to our points
  //const points = useRef();

  // Generate our positions attributes array
  // const particlesPosition = useMemo(() => {
  //   const positions = new Float32Array(count * 3);
    
  //   for (let i = 0; i < count; i++) {
      
  //     const theta = THREE.MathUtils.randFloatSpread(360); 
  //     const phi = THREE.MathUtils.randFloatSpread(360); 

  //     let x = Math.sin(theta) * Math.cos(phi);
  //     let y =  Math.sin(theta) * Math.sin(phi);
  //     let z =  Math.cos(theta);

  //     positions.set([x, y, z], i * 3);
  //   }
    
  //   return positions;
  // }, [count]);

  const ref = useRef();

  const points = useMemo(() => {
    const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 20);
    return new BufferAttribute(new Float32Array(p), 3);
    
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: radius
    }
  }), [])

  useFrame((state) => {
    const { clock } = state;

    // points.current.material.uniforms.uTime.value = clock.elapsedTime;
    ref.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          //count={particlesPosition.length / 3}
          count={count}
         // array={particlesPosition}
          itemSize={3}
          {...points}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [2.0, 2.0, 2.0] }}>
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles count={4000} />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};


export default Scene;
