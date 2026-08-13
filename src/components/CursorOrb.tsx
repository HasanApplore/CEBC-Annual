import { useEffect, useRef, type RefObject } from "react";

interface CursorOrbProps {
  /** Element whose bounds and pointer movement drive the orb's position. */
  containerRef: RefObject<HTMLElement | null>;
  /** Diameter of the orb's canvas, in CSS pixels. */
  size?: number;
}

/**
 * A small glassy sphere rendered with Three.js that trails the cursor across
 * the hero — a real refractive/iridescent ball instead of a flat CSS glow.
 * Mount only when `prefers-reduced-motion` is off; this owns its own
 * render loop and pointer listener, independent of the rest of the hero's
 * framer-motion-driven effects.
 */
export function CursorOrb({ containerRef, size = 130 }: CursorOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !canvas || !wrapper) return;

    let disposed = false;
    let cleanupInner: (() => void) | undefined;

    // three.js is a heavy dependency — load it only once this component
    // actually mounts, so it doesn't bloat the main bundle.
    import("three").then((THREE) => {
      if (disposed) return;
      cleanupInner = setupScene(THREE, canvas, wrapper, container, size);
    });

    return () => {
      disposed = true;
      cleanupInner?.();
    };
  }, [containerRef, size]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[2] opacity-0 transition-opacity duration-300"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function setupScene(
  THREE: typeof import("three"),
  canvas: HTMLCanvasElement,
  wrapper: HTMLDivElement,
  container: HTMLElement,
  size: number
) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 4;

    // High-segment icosahedron reads as a smooth sphere but catches light
    // in facets, which sells the glassy "illusion" better than a plain UV sphere.
    const geometry = new THREE.IcosahedronGeometry(1.15, 8);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#eafff0"),
      roughness: 0.08,
      metalness: 0.04,
      transmission: 0.95,
      thickness: 1.6,
      ior: 1.4,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 500],
      envMapIntensity: 1.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const hemi = new THREE.HemisphereLight("#ffffff", "#1c2f5b", 0.7);
    scene.add(hemi);
    const greenLight = new THREE.PointLight("#5b8c5a", 8, 12);
    greenLight.position.set(-2, 1.5, 2.5);
    scene.add(greenLight);
    const blueLight = new THREE.PointLight("#004aad", 8, 12);
    blueLight.position.set(2, -1.2, 2.5);
    scene.add(blueLight);
    const rim = new THREE.DirectionalLight("#ffffff", 1.4);
    rim.position.set(0, 2, 3);
    scene.add(rim);

    let target = { x: -9999, y: -9999 };
    let current = { x: -9999, y: -9999 };
    let visible = false;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      visible = true;
    };
    const handleLeave = () => {
      visible = false;
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);

    let frameId: number;
    const animate = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;

      wrapper.style.transform = `translate3d(${current.x - size / 2}px, ${
        current.y - size / 2
      }px, 0)`;
      wrapper.style.opacity = visible ? "1" : "0";

      sphere.rotation.y += 0.006;
      sphere.rotation.x += 0.003;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

  return () => {
    cancelAnimationFrame(frameId);
    container.removeEventListener("mousemove", handleMove);
    container.removeEventListener("mouseleave", handleLeave);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
