import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * A small network orbit: a shared idea sits at the center, with four nodes for
 * people, ideas, teams and shipped work. The ring makes the relationship legible.
 */
export function HeroSculpture() {
  const canvasHost = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0, 7.8);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { host.classList.add('webgl-unavailable'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const system = new THREE.Group();
    scene.add(system);
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.014, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x91d91b, transparent: true, opacity: 0.9 }),
    );
    orbit.rotation.set(0.78, 0.12, -0.48);
    system.add(orbit);
    const returnOrbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.007, 6, 120),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.2 }),
    );
    returnOrbit.rotation.set(-0.54, 0.52, 0.64);
    system.add(returnOrbit);

    const idea = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78, 1),
      new THREE.MeshPhysicalMaterial({ color: 0x7557f8, metalness: 0.42, roughness: 0.25, clearcoat: 0.85, clearcoatRoughness: 0.18 }),
    );
    system.add(idea);
    const ideaFrame = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.98, 1),
      new THREE.MeshBasicMaterial({ color: 0xf5f4ef, wireframe: true, transparent: true, opacity: 0.42 }),
    );
    system.add(ideaFrame);

    const nodes: Array<{ point: [number, number, number]; color: number; radius: number }> = [
      { point: [1.72, 0.62, 0.15], color: 0x91d91b, radius: 0.2 },
      { point: [-1.68, 0.76, -0.12], color: 0xf5f4ef, radius: 0.17 },
      { point: [1.4, -1.08, -0.16], color: 0x7557f8, radius: 0.19 },
      { point: [-1.48, -1.04, 0.18], color: 0x111111, radius: 0.15 },
    ];
    const satellites = nodes.map(({ point, color, radius }) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 16),
        new THREE.MeshStandardMaterial({ color, metalness: 0.22, roughness: 0.3 }),
      );
      node.position.set(...point);
      system.add(node);
      return node;
    });
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), new THREE.MeshBasicMaterial({ color: 0xf5f4ef }));
    bead.position.set(0, 0, 0.94);
    system.add(bead);

    scene.add(new THREE.HemisphereLight(0xf5f4ef, 0x392874, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-3, 4, 5); scene.add(key);
    const fill = new THREE.PointLight(0x7557f8, 15, 12); fill.position.set(3, -2, 3); scene.add(fill);

    const resize = () => {
      const width = Math.max(1, host.clientWidth); const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.render(scene, camera);
    };
    const pointer = (event: PointerEvent) => {
      if (reduced) return;
      const bounds = host.getBoundingClientRect();
      gsap.to(system.rotation, { x: -0.12 + ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.26, y: 0.3 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.4, duration: 0.75, ease: 'power3.out', overwrite: true });
    };
    const clearPointer = () => { if (!reduced) gsap.to(system.rotation, { x: -0.12, y: 0.3, duration: 1, ease: 'power3.out' }); };
    host.addEventListener('pointermove', pointer, { passive: true }); host.addEventListener('pointerleave', clearPointer, { passive: true });
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      system.rotation.z += 0.0009;
      idea.rotation.y += 0.0012;
      ideaFrame.rotation.y -= 0.0008;
      satellites.forEach((node, index) => { node.scale.setScalar(1 + Math.sin(performance.now() * 0.0009 + index * 1.7) * 0.035); });
      renderer.render(scene, camera);
    };
    let visibility: IntersectionObserver | undefined;
    if (!reduced) {
      visibility = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { if (!frame) animate(); } else if (frame) { cancelAnimationFrame(frame); frame = 0; } }, { threshold: 0.05 });
      visibility.observe(host);
      gsap.registerPlugin(ScrollTrigger);
      const scrollTween = gsap.to(system.position, { y: -0.28, ease: 'none', scrollTrigger: { trigger: host.closest('.new-hero'), start: 'top top', end: 'bottom top', scrub: 0.8 } });
      return () => { scrollTween.scrollTrigger?.kill(); scrollTween.kill(); visibility?.disconnect(); resizeObserver.disconnect(); cancelAnimationFrame(frame); host.removeEventListener('pointermove', pointer); host.removeEventListener('pointerleave', clearPointer); renderer.dispose(); orbit.geometry.dispose(); returnOrbit.geometry.dispose(); idea.geometry.dispose(); ideaFrame.geometry.dispose(); satellites.forEach(node => node.geometry.dispose()); bead.geometry.dispose(); host.removeChild(renderer.domElement); };
    }
    return () => { resizeObserver.disconnect(); cancelAnimationFrame(frame); host.removeEventListener('pointermove', pointer); host.removeEventListener('pointerleave', clearPointer); renderer.dispose(); orbit.geometry.dispose(); returnOrbit.geometry.dispose(); idea.geometry.dispose(); ideaFrame.geometry.dispose(); satellites.forEach(node => node.geometry.dispose()); bead.geometry.dispose(); host.removeChild(renderer.domElement); };
  }, []);
  return <div ref={canvasHost} className="sculpture-canvas"><div className="webgl-fallback">01</div></div>;
}

/** A compact 3D collaboration graph used by the community invitation. */
export function CollaborationOrbit() {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
    camera.position.set(0, 0, 6.7);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { host.classList.add('webgl-unavailable'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const graph = new THREE.Group(); scene.add(graph);
    const nodePoints = [new THREE.Vector3(-1.35, .6, .2), new THREE.Vector3(1.25, .83, -.1), new THREE.Vector3(1.35, -.64, .14), new THREE.Vector3(-1.18, -.83, -.2)];
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf5f4ef, transparent: true, opacity: .64 });
    const lines = nodePoints.map(point => {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), point]);
      const line = new THREE.Line(geometry, lineMaterial); graph.add(line); return line;
    });
    const sharedOrbit = new THREE.Mesh(new THREE.TorusGeometry(1.85, .012, 6, 100), new THREE.MeshBasicMaterial({ color: 0x91d91b, transparent: true, opacity: .8 }));
    sharedOrbit.rotation.set(.66, -.16, .4); graph.add(sharedOrbit);
    const center = new THREE.Mesh(new THREE.IcosahedronGeometry(.64, 1), new THREE.MeshPhysicalMaterial({ color: 0x7557f8, metalness: .35, roughness: .28, clearcoat: .8 }));
    graph.add(center);
    const nodes = nodePoints.map((point, index) => {
      const palette = [0x91d91b, 0xf5f4ef, 0xc5baff, 0x111111];
      const radius = index === 0 ? .18 : .15;
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), new THREE.MeshStandardMaterial({ color: palette[index], metalness: .18, roughness: .28 }));
      sphere.position.set(point.x, point.y, point.z);
      graph.add(sphere); return sphere;
    });
    scene.add(new THREE.HemisphereLight(0xf5f4ef, 0x3d277f, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-2, 3, 5); scene.add(key);
    const resize = () => { const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.render(scene, camera); };
    const pointer = (event: PointerEvent) => { if (reduced) return; const bounds = host.getBoundingClientRect(); gsap.to(graph.rotation, { x: ((event.clientY - bounds.top) / bounds.height - .5) * .24, y: ((event.clientX - bounds.left) / bounds.width - .5) * .36, duration: .65, ease: 'power3.out', overwrite: true }); };
    const leave = () => { if (!reduced) gsap.to(graph.rotation, { x: 0, y: 0, duration: .8, ease: 'power3.out' }); };
    host.addEventListener('pointermove', pointer, { passive: true }); host.addEventListener('pointerleave', leave, { passive: true });
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();
    let frame = 0;
    const animate = () => { frame = requestAnimationFrame(animate); graph.rotation.z += .00065; center.rotation.y += .001; renderer.render(scene, camera); };
    let visibility: IntersectionObserver | undefined;
    if (!reduced) { visibility = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !frame) animate(); else if (!entry.isIntersecting && frame) { cancelAnimationFrame(frame); frame = 0; } }, { threshold: .05 }); visibility.observe(host); }
    return () => { visibility?.disconnect(); resizeObserver.disconnect(); cancelAnimationFrame(frame); host.removeEventListener('pointermove', pointer); host.removeEventListener('pointerleave', leave); renderer.dispose(); lines.forEach(line => line.geometry.dispose()); lineMaterial.dispose(); sharedOrbit.geometry.dispose(); (sharedOrbit.material as THREE.Material).dispose(); center.geometry.dispose(); (center.material as THREE.Material).dispose(); nodes.forEach(node => { node.geometry.dispose(); (node.material as THREE.Material).dispose(); }); host.removeChild(renderer.domElement); };
  }, []);
  return <div ref={hostRef} className="collaboration-canvas"><div className="community-visual-placeholder"><span>PEOPLE</span><span>IDEAS</span><span>TOGETHER</span></div></div>;
}
