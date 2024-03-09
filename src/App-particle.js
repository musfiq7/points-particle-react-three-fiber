import { OrbitControls, useFBO} from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import './App.css';

import { BufferAttribute } from "three";




const vertexShader =`

uniform float uTime;

void main() {
  

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // gl_PointSize = 3.0;
  // Size attenuation;
  //gl_PointSize *= step(1.0 - (1.0 / 64.0), position.x) + 0.5;
 
}
`;
const fragmentShader =`
void main() {
  
  gl_FragColor = vec4(0.1,0.0,0.0, 1.0);
}


`;


const uniforms = {
  u_time:0,
  uColor: { value: new THREE.Color(1, 1, 0) }
}




function BufferPoints({ count = 10000}) {
  
  const ref = useRef();

  const points = useMemo(() => {
    const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 20);
    return new BufferAttribute(new Float32Array(p), 3);
    
  }, [count]);

  console.log(ref.current.points);

  return (
   
    <points ref={ref} >
       <shaderMaterial uniforms={uniforms} fragmentShader={fragmentShader} vertexShader={vertexShader}/>
      <bufferGeometry>
        <bufferAttribute attach={"attributes-position"} {...points} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        threshold={0.1}
        //color={0xff00ff}
        color={'yellow'}
        sizeAttenuation={true}
      />
    </points>
  );
}

const App = () => {
  return (
    <Canvas>
   
      <BufferPoints />
      <OrbitControls />
    </Canvas>
  );
};
export default App  



