import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (!canvasDiv.current) return;

    let rect = canvasDiv.current.getBoundingClientRect();
    let container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    const clock = new THREE.Clock();

    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let currentCharacter: THREE.Object3D | null = null;

    loadCharacter().then((gltf) => {
      if (gltf) {
        const animations = setAnimations(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        currentCharacter = gltf.scene;
        setChar(currentCharacter);
        scene.add(currentCharacter);
        headBone = currentCharacter.getObjectByName("spine006") || null;
        screenLight = currentCharacter.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      }
    });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    let debounce: number | undefined;

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse = { x, y };
      });
    };

    const onTouchStart = () => {
      debounce = window.setTimeout(() => {
        const landingDiv = document.getElementById("landingDiv");
        if (landingDiv) {
          landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
        }
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.removeEventListener("touchmove", onTouchMove);
      }
    };

    const onResize = () => {
      handleResize(renderer, camera, canvasDiv, currentCharacter);
    };

    const landingDiv = document.getElementById("landingDiv");
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove);

    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (debounce !== undefined) {
        window.clearTimeout(debounce);
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
        landingDiv.removeEventListener("touchmove", onTouchMove);
      }
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      scene.clear();
      renderer.dispose();
      if (canvasDiv.current && canvasDiv.current.contains(renderer.domElement)) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
