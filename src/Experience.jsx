import { useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    useHelper,
    BakeShadows,
    SoftShadows,
    AccumulativeShadows,
    RandomizedLight,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";

export default function Experience() {
    const directionalLightRef = useRef(null);
    // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1); // 1 is the size of the helper
    const cube = useRef();

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;
        cube.current.position.x = 2 + Math.sin(time);
        cube.current.rotation.y += delta * 0.2;
    });

    return (
        <>
            {/*<BakeShadows />*/}
            {/*
                size: radius of the softness
                samples: quality (more samples = less visual noise but worse performance)
                focus: distance where the shadow is the sharpest
            */}
            {/*<SoftShadows size={25} samples={10} focus={0} />*/}

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

            {/*
                We use a 0.99 for the position instead of using 1 to avoid z-fighting between the shadow plane spawned by the accumulative shadows
                and the plane itself that we have rendered

                Also notice that the accumulative shadows can only be used on planes

                The <RandomizedLight> has multiple attributes to control the behaviour of the light:

                amount: how many lights (by default there is multiple lights)
                radius: the amplitude of the jiggle
                intensity: the intensity of the lights
                ambient: act like if a global light was illuminating the whole scene, making only tight spaces and crevices receiving shadows
                And parameters related to the shadow map:

                castShadow: If it should cast shadows
                bias: the bias offset to fix the issue where the objects are casting shadows on themselves or not casting shadow on objects very close to their surface (shadow acne)
                mapSize: the shadow map size (the lower, the better for performances)
                size: the amplitude of the shadow (top, right, bottom and left all at once)
                near and far: how close and how far the shadow map camera will render objects


            */}
            <AccumulativeShadows
                opacity={0.8}
                frames={Infinity} // shadow renders, there is a HUGE issue regarding iOs in fact the page freezes on initial renders because THREE.js has to do multiple renders but iOs will reload the page if it takes too much to load, and so everything needs to be rendered once again and a loop occurs, so iOs only tests have to be performed. When the cube moves though, with the animation we previously implemented, the value of this property needs to be changed into Infinity
                temporal // this "spreads" the renders and fixes the iOs issue. This creats an artifact if you're still using the Helper, so remove the latter if this happens
                blend={100} // the default value is 20 shadows accumulated
                color="#316d39"
                scale={10}
                position={[0, -0.99, 0]}
            >
                <RandomizedLight
                    amount={8}
                    radius={1}
                    ambient={0.5}
                    intensity={3}
                    position={[1, 2, 3]}
                    bias={0.001}
                />
            </AccumulativeShadows>

            <directionalLight
                shadow-mapSize={[1024, 1024]} // This calls the set method on the shadow.mapSize and sets the selected resolution
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={5}
                shadow-camera-right={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
                castShadow
                ref={directionalLightRef}
                position={[1, 2, 3]}
                intensity={4.5}
            />
            <ambientLight intensity={1.5} />

            <mesh castShadow position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh castShadow ref={cube} position-x={2} scale={1.5}>
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
