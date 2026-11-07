// Small typed surface for the scene APIs used here. Replace with @types/three
// when registry access is available in the deployment environment.
declare module 'three' {
  export const SRGBColorSpace: string;
  export class Vector3 { x: number; y: number; z: number; constructor(x?: number, y?: number, z?: number); set(x: number, y: number, z: number): this; setScalar(value: number): this }
  export class Euler { x: number; y: number; z: number; set(x: number, y: number, z: number): this }
  export class Object3D { position: Vector3; rotation: Euler; scale: Vector3; add(...objects: Object3D[]): void }
  export class BufferGeometry { setFromPoints(points: Vector3[]): this; dispose(): void }
  export class Material { dispose(): void }
  export class Scene extends Object3D { }
  export class Group extends Object3D { }
  export class PerspectiveCamera extends Object3D { aspect: number; constructor(fov: number, aspect: number, near: number, far: number); updateProjectionMatrix(): void }
  export class WebGLRenderer { domElement: HTMLCanvasElement; outputColorSpace: string; constructor(options: { alpha?: boolean; antialias?: boolean; powerPreference?: string }); setPixelRatio(value: number): void; setClearColor(color: number, alpha: number): void; setSize(width: number, height: number, updateStyle?: boolean): void; render(scene: Scene, camera: PerspectiveCamera): void; dispose(): void }
  export class Mesh<G extends BufferGeometry = BufferGeometry, M extends Material = Material> extends Object3D { geometry: G; material: M; constructor(geometry: G, material: M) }
  export class TorusKnotGeometry extends BufferGeometry { constructor(radius: number, tube: number, tubularSegments: number, radialSegments: number, p?: number, q?: number) }
  export class TorusGeometry extends BufferGeometry { constructor(radius: number, tube: number, radialSegments: number, tubularSegments: number) }
  export class IcosahedronGeometry extends BufferGeometry { constructor(radius?: number, detail?: number) }
  export class SphereGeometry extends BufferGeometry { constructor(radius?: number, widthSegments?: number, heightSegments?: number) }
  export class LineBasicMaterial extends Material { constructor(options: Record<string, unknown>) }
  export class Line extends Object3D { constructor(geometry: BufferGeometry, material: Material); geometry: BufferGeometry; material: Material }
  export class MeshPhysicalMaterial extends Material { constructor(options: Record<string, unknown>) }
  export class MeshBasicMaterial extends Material { constructor(options: Record<string, unknown>) }
  export class MeshStandardMaterial extends Material { constructor(options: Record<string, unknown>) }
  export class HemisphereLight extends Object3D { constructor(skyColor: number, groundColor: number, intensity?: number) }
  export class DirectionalLight extends Object3D { constructor(color?: number, intensity?: number) }
  export class PointLight extends Object3D { constructor(color?: number, intensity?: number, distance?: number) }
}
