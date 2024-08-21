import { useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";

export default function Experience() {
    const directionalLightRef = useRef(null);
    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1); // 1 is the size of the helper
    const cube = useRef();

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2;
    });

    return (
        <>
            {/*
                The <color /> tag provides the same solution as using the vanilla THREE.js method of changing the background
                color by setting scene.background = new THREE.Color('color');

                The fact is that you're using only R3F this way which is preferred, but there is a catch, in fact, you need to use the attach property
                because the same way you're setting the color to the property background of the scene object above, you need to tell R3F which property should it attach the color tag to
                and you also need to consider the parenthood, which currently implicitly is the <Scene></Scene> tag and thus why setting the attach="background" works

                If you were to put the color tag inside another R3F tag then this wouldn't work because the immediate parent of the color tag wouldn't be the Scene
            */}
            <color args={["ivory"]} attach="background" />

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight
                ref={directionalLightRef}
                position={[1, 2, 3]}
                intensity={4.5}
            />
            <ambientLight intensity={1.5} />

            <mesh position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={cube} position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    );
}
