import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const Lenis = window.Lenis;
const SplitType = window.SplitType;

const canvas = document.getElementById("bg-canvas");
const root = document.documentElement;
const body = document.body;
const main = document.querySelector("main");
const scenes = [...document.querySelectorAll(".cinema-scene[data-scene]")];
const header = document.querySelector(".site-header");
const chapterDots = [...document.querySelectorAll(".chapter-indicator__dot[data-index]")];
const chapterLabel = document.querySelector(".chapter-indicator__label");
const progressBar = document.querySelector(".load-curtain__progress span");
const loadCurtain = document.querySelector(".load-curtain");
const toastContainer = document.querySelector(".toast-container");
const cursorGlow = document.querySelector(".cursor-glow");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
  mobile: window.innerWidth < 900,
};

const flavors = {
  classic: {
    bottle: 0xd4a853,
    liquid: 0xc98936,
    accent: "#d4a853",
    glow: "#f7d77c",
    light: 0xffc46c,
  },
  berry: {
    bottle: 0xc44d6e,
    liquid: 0xf05f91,
    accent: "#c44d6e",
    glow: "#ff9abb",
    light: 0xff7aa6,
  },
  citrus: {
    bottle: 0xe8943a,
    liquid: 0xffa83a,
    accent: "#e8943a",
    glow: "#ffc66d",
    light: 0xffa64a,
  },
  ginger: {
    bottle: 0x8bb84e,
    liquid: 0xbad96a,
    accent: "#8bb84e",
    glow: "#d2f276",
    light: 0xc8f06b,
  },
};

const sceneState = {
  activeScene: 0,
  flavor: "classic",
  bubbleDensity: viewport.mobile ? 0.4 : 0.56,
  bubbleSize: viewport.mobile ? 0.027 : 0.038,
  bubbleSpread: {
    x: viewport.mobile ? 3.6 : 5.8,
    z: viewport.mobile ? 1.5 : 2.4,
    offsetX: 0,
    biasX: 1,
    biasChance: 0.45,
  },
  dropletDensity: 0.68,
  pourAmount: 0,
  cupFill: 0,
  scrollProgress: 0,
  iceSpread: 1,
  ready: false,
};

const pointer = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
};

const reusableVectorA = new THREE.Vector3();
const reusableVectorB = new THREE.Vector3();
const reusableVectorC = new THREE.Vector3();
const feedbackTimers = new WeakMap();

let sceneConfigs = buildSceneConfigs();
let three = null;
try {
  three = canvas ? createMainScene(canvas) : null;
} catch (e) {
  console.warn("3D scene unavailable, falling back to DOM-only.", e.message);
  three = null;
  body.classList.add("no-webgl");
}
const miniScenes = [];
let lenis = null;
let loadFinished = false;
let lastFrame = performance.now();
let rafId = 0;
let masterTimeline = null;
let masterScrollTrigger = null;
let processScrollTrigger = null;
let sceneBoundaryTriggers = [];
let resizeRaf = 0;

init();

function init() {
  body.classList.add("is-loading");

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  setupLenis();
  setupHeaderBehavior();
  setupChapterIndicator();
  setupTextAnimations();
  setupEntranceAnimations();
  setupStatNumbers();
  setupScrollButtons();
  setupFlavorCards();
  setupProcessTimeline();
  setupDragScroll();
  setupCartToasts();
  setupPurchaseButtons();
  setupMagneticElements();
  setupProductCards();
  setupPointerParallax();
  setupScrollChoreography();
  setupMiniScenes();
  setupLoader();

  window.addEventListener("resize", onResize, { passive: true });

  if (three && !reducedMotion) {
    requestRenderLoop();
  } else if (three) {
    applySceneConfig(0, true);
    updateMainScene(0, 0);
  }
}

function buildSceneConfigs() {
  const mobile = viewport.mobile;
  const bubbleBase = mobile ? 0.027 : 0.038;
  const flavor = flavors[sceneState?.flavor || "classic"] || flavors.classic;
  const bubbleSpread = (overrides = {}) => ({
    x: mobile ? 3.6 : 5.8,
    z: mobile ? 1.5 : 2.4,
    offsetX: 0,
    biasX: 1,
    biasChance: 0.45,
    ...overrides,
  });

  return [
    {
      name: "hero",
      camera: { x: 0, y: 0.1, z: mobile ? 6.15 : 5.5 },
      lookAt: { x: 0, y: 0, z: 0 },
      group: { x: mobile ? -0.36 : -0.72, y: mobile ? -0.1 : -0.06, z: 0 },
      bottlePosition: { x: mobile ? 0.68 : 0.74, y: -0.04, z: 0 },
      bottleRotation: { x: 0.02, y: 0.18, z: -0.02 },
      cupPosition: { x: mobile ? 1.02 : 1.42, y: mobile ? -1.52 : -1.42, z: 0.3 },
      bubbleDensity: mobile ? 0.35 : 0.52,
      bubbleSize: bubbleBase,
      bubbleSpread: bubbleSpread({ x: mobile ? 3.2 : 5.1, biasX: 0.72 }),
      dropletDensity: 0.72,
      iceSpread: 1,
      pourAmount: 0,
      cupFill: 0,
      bloom: mobile ? 0.28 : 0.78,
      lights: {
        ambient: 0.28,
        warm: { color: 0xffbd76, intensity: 7.2 },
        cool: { color: 0x456a88, intensity: 0.65 },
        gold: { color: 0xffc46c, intensity: 5.6 },
        spot: { color: 0xffefcb, intensity: 8.2 },
      },
    },
    {
      name: "water",
      camera: { x: mobile ? 0.42 : 1.28, y: mobile ? 0.12 : 0.28, z: mobile ? 6.45 : 5.9 },
      lookAt: { x: mobile ? 0.22 : 0.32, y: -0.02, z: 0 },
      group: { x: mobile ? 0.18 : 0.56, y: mobile ? -0.12 : -0.08, z: 0.05 },
      bottlePosition: { x: mobile ? 0.56 : 0.62, y: -0.04, z: 0 },
      bottleRotation: { x: 0.02, y: -0.34, z: -0.05 },
      cupPosition: { x: mobile ? 1.04 : 1.44, y: mobile ? -1.5 : -1.38, z: 0.28 },
      bubbleDensity: mobile ? 0.42 : 0.58,
      bubbleSize: bubbleBase * 0.94,
      bubbleSpread: bubbleSpread({
        x: mobile ? 2.7 : 3.7,
        z: mobile ? 1.2 : 1.8,
        offsetX: mobile ? 0.32 : 0.7,
        biasX: 0.42,
        biasChance: 0.34,
      }),
      dropletDensity: 1,
      iceSpread: 0.72,
      pourAmount: 0,
      cupFill: 0,
      bloom: mobile ? 0.25 : 0.58,
      lights: {
        ambient: 0.36,
        warm: { color: 0xffbd76, intensity: 3.4 },
        cool: { color: 0x4488cc, intensity: 5.8 },
        gold: { color: 0x9dcfff, intensity: 2.4 },
        spot: { color: 0xd8f0ff, intensity: 5.2 },
      },
    },
    {
      name: "craft",
      camera: { x: mobile ? -0.05 : -0.18, y: mobile ? 0.08 : 0.18, z: mobile ? 5.75 : 4.35 },
      lookAt: { x: mobile ? -0.1 : -0.18, y: -0.2, z: 0 },
      group: { x: mobile ? -0.52 : -1.55, y: mobile ? -0.12 : -0.05, z: -0.05 },
      bottlePosition: { x: mobile ? 0.48 : 0.52, y: -0.02, z: 0 },
      bottleRotation: { x: -0.03, y: 0.1, z: 0.55 },
      cupPosition: { x: mobile ? 0.96 : 1.28, y: mobile ? -1.26 : -1.08, z: 0.32 },
      bubbleDensity: mobile ? 0.36 : 0.48,
      bubbleSize: bubbleBase * 0.86,
      bubbleSpread: bubbleSpread({
        x: mobile ? 2.35 : 3.35,
        z: mobile ? 1.15 : 1.7,
        offsetX: mobile ? -0.24 : -0.8,
        biasX: 0.14,
        biasChance: 0.28,
      }),
      dropletDensity: 0.62,
      iceSpread: 1.36,
      pourAmount: 1,
      cupFill: 0.72,
      bloom: mobile ? 0.26 : 0.66,
      lights: {
        ambient: 0.44,
        warm: { color: 0x9ebad2, intensity: 2.4 },
        cool: { color: 0xd8f0ff, intensity: 6.4 },
        gold: { color: 0x8fc6ff, intensity: 3.1 },
        spot: { color: 0xd8f0ff, intensity: 7.6 },
      },
    },
    {
      name: "spark",
      camera: { x: mobile ? -0.05 : -0.18, y: mobile ? 0.02 : -0.04, z: mobile ? 5.4 : 4.2 },
      lookAt: { x: 0.08, y: 0.08, z: 0 },
      group: { x: mobile ? -0.28 : -0.78, y: mobile ? -0.14 : -0.12, z: 0.08 },
      bottlePosition: { x: mobile ? 0.58 : 0.64, y: -0.02, z: 0 },
      bottleRotation: { x: 0.04, y: 0.58, z: 0.01 },
      cupPosition: { x: mobile ? 1 : 1.3, y: mobile ? -1.22 : -1.04, z: 0.26 },
      bubbleDensity: mobile ? 0.84 : 0.92,
      bubbleSize: mobile ? 0.036 : 0.052,
      bubbleSpread: bubbleSpread({
        x: mobile ? 2.0 : 2.8,
        z: mobile ? 1.05 : 1.55,
        biasX: 0.18,
        biasChance: 0.24,
      }),
      dropletDensity: 0.82,
      iceSpread: 0.96,
      pourAmount: 0.22,
      cupFill: 0.84,
      bloom: mobile ? 0.42 : 1.08,
      lights: {
        ambient: 0.36,
        warm: { color: 0xffc46c, intensity: 7.6 },
        cool: { color: 0x8dbbff, intensity: 2 },
        gold: { color: 0xffc46c, intensity: 7.4 },
        spot: { color: 0xffe3a5, intensity: 8.1 },
      },
    },
    {
      name: "flavor",
      camera: mobile
        ? { x: 0.18, y: 0.05, z: 5.75 }
        : { x: 0.18, y: 0.12, z: 4.85 },
      lookAt: { x: mobile ? -0.12 : -0.26, y: 0.02, z: 0 },
      group: { x: mobile ? -0.54 : 0.1, y: mobile ? -0.13 : -0.08, z: 0.04 },
      bottlePosition: { x: mobile ? 0.48 : 0.5, y: -0.03, z: 0 },
      bottleRotation: { x: 0, y: mobile ? 0.84 : 0.8, z: 0.03 },
      cupPosition: { x: mobile ? 1.04 : 1.38, y: mobile ? -1.42 : -1.25, z: 0.32 },
      bubbleDensity: mobile ? 0.56 : 0.72,
      bubbleSize: bubbleBase * 1.02,
      bubbleSpread: bubbleSpread({
        x: mobile ? 2.3 : 3.2,
        z: mobile ? 1.15 : 1.68,
        offsetX: mobile ? -0.28 : 0.58,
        biasX: 0.12,
        biasChance: 0.24,
      }),
      dropletDensity: 0.76,
      iceSpread: 1.04,
      pourAmount: 0,
      cupFill: 0.38,
      bloom: mobile ? 0.31 : 0.72,
      flavorDriven: true,
      lights: {
        ambient: 0.42,
        warm: { color: flavor.light, intensity: 4.8 },
        cool: { color: flavor.light, intensity: 2.2 },
        gold: { color: flavor.light, intensity: 5.2 },
        spot: { color: flavor.light, intensity: 5.8 },
      },
    },
    {
      name: "products",
      camera: { x: mobile ? 0.18 : 0.28, y: mobile ? 0.08 : 0.14, z: mobile ? 6.35 : 6.2 },
      lookAt: { x: 0.04, y: -0.04, z: 0 },
      group: { x: mobile ? -0.3 : -0.48, y: mobile ? -0.16 : -0.11, z: -0.1 },
      bottlePosition: { x: mobile ? 0.62 : 0.66, y: -0.04, z: 0 },
      bottleRotation: { x: 0.02, y: 1.12, z: 0 },
      cupPosition: { x: mobile ? 1.04 : 1.34, y: mobile ? -1.48 : -1.38, z: 0.26 },
      bubbleDensity: mobile ? 0.26 : 0.36,
      bubbleSize: bubbleBase * 0.82,
      bubbleSpread: bubbleSpread({ x: mobile ? 2.7 : 3.6, z: mobile ? 1.2 : 1.7, biasX: 0.42 }),
      dropletDensity: 0.34,
      iceSpread: 1.12,
      pourAmount: 0,
      cupFill: 0.18,
      bloom: mobile ? 0.22 : 0.42,
      lights: {
        ambient: 0.62,
        warm: { color: 0xffdfb6, intensity: 3.6 },
        cool: { color: 0xfff1df, intensity: 2.8 },
        gold: { color: 0xffca78, intensity: 3.4 },
        spot: { color: 0xffead2, intensity: 4.2 },
      },
    },
    {
      name: "finale",
      camera: { x: 0, y: 0.1, z: mobile ? 6.15 : 5.5 },
      lookAt: { x: 0, y: 0, z: 0 },
      group: { x: mobile ? -0.36 : -0.72, y: mobile ? -0.1 : -0.06, z: 0 },
      bottlePosition: { x: mobile ? 0.68 : 0.74, y: -0.04, z: 0 },
      bottleRotation: { x: 0.02, y: Math.PI * 2 + 0.18, z: -0.02 },
      cupPosition: { x: mobile ? 1.02 : 1.42, y: mobile ? -1.52 : -1.42, z: 0.3 },
      bubbleDensity: mobile ? 0.32 : 0.46,
      bubbleSize: bubbleBase * 0.96,
      bubbleSpread: bubbleSpread({ x: mobile ? 3.0 : 4.6, biasX: 0.64 }),
      dropletDensity: 0.7,
      iceSpread: 1,
      pourAmount: 0,
      cupFill: 0,
      bloom: mobile ? 0.3 : 0.82,
      lights: {
        ambient: 0.3,
        warm: { color: 0xffbd76, intensity: 7.4 },
        cool: { color: 0x456a88, intensity: 0.7 },
        gold: { color: 0xffc46c, intensity: 5.8 },
        spot: { color: 0xffefcb, intensity: 8.4 },
      },
    },
  ];
}

function createMainScene(targetCanvas) {
  const width = Math.max(1, viewport.width);
  const height = Math.max(1, viewport.height);
  const renderer = new THREE.WebGLRenderer({
    canvas: targetCanvas,
    alpha: true,
    antialias: !viewport.mobile,
    powerPreference: "high-performance",
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(getMainPixelRatio());
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0807, viewport.mobile ? 0.022 : 0.032);

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0.1, viewport.mobile ? 6.15 : 5.5);
  const cameraTarget = new THREE.Vector3(0, 0, 0);

  const mainGroup = new THREE.Group();
  mainGroup.position.set(viewport.mobile ? -0.36 : -0.72, viewport.mobile ? -0.1 : -0.06, 0);
  mainGroup.scale.setScalar(viewport.mobile ? 0.92 : 1.08);
  scene.add(mainGroup);

  const bottleRig = new THREE.Group();
  bottleRig.position.set(viewport.mobile ? 0.68 : 0.74, -0.04, 0);
  bottleRig.rotation.set(0.02, 0.18, -0.02);
  mainGroup.add(bottleRig);

  const bottle = createBottle();
  const liquid = createLiquid();
  const bubbles = createBubbles();
  const ice = createIce();
  const pour = createGlassTumbler();
  const props = createSceneProps();

  bottleRig.add(bottle.group);
  bottleRig.add(liquid.group);
  mainGroup.add(bubbles.points);
  mainGroup.add(ice.group);
  mainGroup.add(pour.group);
  mainGroup.add(pour.stream.points);
  mainGroup.add(props.group);

  const lights = createLights(scene, bottleRig);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(getMainPixelRatio());
  composer.setSize(width, height);

  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    viewport.mobile ? 0.35 : 0.7,
    0.4,
    0.55,
  );
  composer.addPass(renderPass);
  composer.addPass(bloomPass);

  return {
    renderer,
    composer,
    renderPass,
    bloomPass,
    scene,
    camera,
    cameraTarget,
    mainGroup,
    bottleRig,
    bottle,
    liquid,
    bubbles,
    ice,
    pour,
    props,
    lights,
  };
}

function createBottle() {
  const geometry = createBottleGeometry(viewport.mobile ? 40 : 72);
  const material = new THREE.MeshPhysicalMaterial({
    color: flavors.classic.bottle,
    roughness: 0.15,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.04,
    transmission: 0.58,
    thickness: 0.62,
    ior: 1.46,
    transparent: true,
    opacity: 0.46,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  const condensation = createCondensationShell(geometry.clone());

  const capMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf0d28b,
    roughness: 0.22,
    metalness: 0.35,
    clearcoat: 0.3,
  });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.28, 48), capMaterial);
  cap.position.y = 1.93;

  const neckRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.018, 12, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xffe4a4,
      roughness: 0.2,
      metalness: 0.18,
      clearcoat: 0.25,
    }),
  );
  neckRing.position.y = 1.66;
  neckRing.rotation.x = Math.PI / 2;

  const labelBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.516, 0.516, 0.36, 72, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xf0e8db,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  labelBand.position.y = -0.42;

  const group = new THREE.Group();
  group.add(mesh, condensation.mesh, cap, neckRing, labelBand);
  group.scale.setScalar(viewport.mobile ? 0.62 : 1);

  return {
    group,
    mesh,
    material,
    capMaterial,
    labelBand,
    condensation,
  };
}

function createBottleGeometry(segments = 72) {
  const points = [
    [0.18, -1.82],
    [0.39, -1.74],
    [0.48, -1.58],
    [0.52, -1.25],
    [0.51, -0.64],
    [0.48, -0.18],
    [0.39, 0.12],
    [0.27, 0.38],
    [0.18, 0.66],
    [0.17, 1.42],
    [0.23, 1.54],
    [0.23, 1.68],
    [0.17, 1.78],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const geometry = new THREE.LatheGeometry(points, segments);
  geometry.computeVertexNormals();
  return geometry;
}

function createCondensationShell(geometry) {
  const uniforms = {
    uTime: { value: 0 },
    uDensity: { value: sceneState.dropletDensity },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uDensity;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      #define TAU 6.28318530718

      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      vec2 hash22(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.xx + p3.yz) * p3.zy);
      }

      vec2 dropletLayer(vec2 uv, float scale, float speed) {
        vec2 grid = uv * scale;
        vec2 id = floor(grid);
        vec2 gv = fract(grid);
        float body = 0.0;
        float glint = 0.0;

        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cell = id + offset;
            vec2 random = hash22(cell);
            float alive = step(random.x, uDensity);
            float falling = step(0.62, hash12(cell + 7.13));
            float fallSpeed = mix(0.05, 0.19, hash12(cell + 19.71)) * speed;
            vec2 center = offset + 0.16 + random * 0.68;
            center.y = fract(center.y - falling * uTime * fallSpeed);

            vec2 delta = gv - center;
            float radius = mix(0.028, 0.085, hash12(cell + 3.47));
            float orb = smoothstep(radius, radius * 0.43, length(delta * vec2(1.0, 1.16)));
            float trail = falling
              * smoothstep(radius * 0.52, 0.0, abs(delta.x))
              * smoothstep(radius * 3.6, 0.0, abs(delta.y + radius * 1.25))
              * 0.26;
            float shine = smoothstep(radius * 0.42, 0.0, length(delta - vec2(-radius * 0.24, radius * 0.23)));

            body = max(body, alive * max(orb, trail));
            glint = max(glint, alive * shine * orb);
          }
        }

        return vec2(body, glint);
      }

      void main() {
        float angle = atan(vWorldPosition.z, vWorldPosition.x) / TAU + 0.5;
        vec2 uv = vec2(angle, vWorldPosition.y * 0.31 + 0.55);
        uv.y += sin(angle * TAU * 3.0) * 0.025;

        vec2 fineDrops = dropletLayer(uv, 34.0, 1.0);
        vec2 largeDrops = dropletLayer(uv + vec2(0.17, 0.31), 18.0, 0.72);
        vec2 droplets = max(fineDrops, largeDrops * vec2(0.9, 1.2));

        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float facing = smoothstep(-0.22, 0.88, dot(normalize(vNormal), viewDirection));
        float alpha = droplets.x * (0.18 + uDensity * 0.56) * facing;
        alpha += droplets.y * 0.24 * facing;

        if (alpha < 0.012) {
          discard;
        }

        vec3 color = mix(vec3(0.78, 0.9, 1.0), vec3(1.0), droplets.y);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(1.02);
  mesh.renderOrder = 6;

  return { mesh, material, uniforms };
}

function createLiquid() {
  const bodyGeometry = createLiquidGeometry(viewport.mobile ? 36 : 64);
  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(flavors.classic.liquid) },
    uOpacity: { value: 0.7 },
  };

  const bodyMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform float uTime;
      varying float vWave;
      varying vec3 vWorldPosition;

      void main() {
        vec3 p = position;
        float topMask = smoothstep(0.12, 0.56, p.y);
        float wave = sin((p.x * 7.0) + (uTime * 1.7)) * cos((p.z * 6.0) - (uTime * 1.25));
        p.y += wave * 0.018 * topMask;
        vWave = wave;
        vec4 worldPosition = modelMatrix * vec4(p, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vWave;
      varying vec3 vWorldPosition;

      void main() {
        float verticalGlow = smoothstep(-1.55, 0.58, vWorldPosition.y);
        vec3 color = uColor * (0.78 + verticalGlow * 0.35 + vWave * 0.04);
        gl_FragColor = vec4(color, uOpacity);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = -0.08;

  const surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: uniforms.uTime,
      uColor: uniforms.uColor,
      uOpacity: { value: 0.88 },
    },
    vertexShader: `
      uniform float uTime;
      varying float vRipple;

      void main() {
        vec3 p = position;
        float dist = length(p.xy);
        float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.018;
        ripple += sin((p.x - p.y) * 12.0 + uTime * 2.2) * 0.012;
        p.z += ripple * smoothstep(0.42, 0.02, dist);
        vRipple = ripple;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vRipple;

      void main() {
        vec3 color = uColor + vec3(0.18, 0.12, 0.06) + (vRipple * 2.0);
        gl_FragColor = vec4(color, uOpacity);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const surface = new THREE.Mesh(new THREE.CircleGeometry(0.35, viewport.mobile ? 48 : 96), surfaceMaterial);
  surface.position.y = 0.5;
  surface.rotation.x = -Math.PI / 2;

  const group = new THREE.Group();
  group.add(body, surface);
  group.scale.set(0.94, 0.96, 0.94);

  return {
    group,
    body,
    surface,
    uniforms,
    bodyMaterial,
    surfaceMaterial,
  };
}

function createLiquidGeometry(segments = 64) {
  const points = [
    [0.11, -1.62],
    [0.33, -1.55],
    [0.42, -1.34],
    [0.43, -0.62],
    [0.4, -0.12],
    [0.34, 0.2],
    [0.28, 0.46],
    [0.08, 0.54],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const geometry = new THREE.LatheGeometry(points, segments);
  geometry.computeVertexNormals();
  return geometry;
}

function createBubbles() {
  const maxCount = viewport.mobile ? 320 : 680;
  const positions = new Float32Array(maxCount * 3);
  const speeds = new Float32Array(maxCount);
  const drift = new Float32Array(maxCount * 2);
  const phases = new Float32Array(maxCount);

  for (let i = 0; i < maxCount; i += 1) {
    resetBubble(i, positions, speeds, drift, phases, true);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, viewport.mobile ? 260 : 620);

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(1.8, 1.95, 2.15),
    size: sceneState.bubbleSize,
    map: createBubbleTexture(),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.position.set(-0.05, 0, -0.45);

  return {
    points,
    geometry,
    material,
    positions,
    speeds,
    drift,
    phases,
    maxCount,
  };
}

function resetBubble(index, positions, speeds, drift, phases, initial = false) {
  const i3 = index * 3;
  const spread = sceneState.bubbleSpread;
  const spreadX = spread?.x ?? (viewport.mobile ? 3.6 : 5.8);
  const spreadZ = spread?.z ?? (viewport.mobile ? 1.5 : 2.4);
  const offsetX = spread?.offsetX ?? 0;
  const biasX = spread?.biasX ?? 1;
  const biasChance = spread?.biasChance ?? 0.45;
  const lowerY = -2.55;
  const upperY = 2.75;
  const bias = Math.random() < biasChance ? 1 : 0;

  positions[i3] = offsetX + (Math.random() - 0.5) * spreadX + bias * biasX * (0.55 + Math.random() * 1.35);
  positions[i3 + 1] = initial ? lowerY + Math.random() * (upperY - lowerY) : lowerY - Math.random() * 0.4;
  positions[i3 + 2] = (Math.random() - 0.5) * spreadZ;

  speeds[index] = 0.16 + Math.random() * 0.42;
  drift[index * 2] = (Math.random() - 0.5) * 0.12;
  drift[index * 2 + 1] = (Math.random() - 0.5) * 0.12;
  phases[index] = Math.random() * Math.PI * 2;
}

function createBubbleTexture() {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 96;
  textureCanvas.height = 96;

  const ctx = textureCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(38, 30, 8, 48, 48, 45);
  gradient.addColorStop(0, "rgba(255,255,255,0.95)");
  gradient.addColorStop(0.28, "rgba(255,255,255,0.35)");
  gradient.addColorStop(0.58, "rgba(255,255,255,0.12)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(48, 48, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.38)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(48, 48, 34, -0.4, Math.PI * 1.35);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createIce() {
  const group = new THREE.Group();
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xdff8ff,
    roughness: 0.1,
    metalness: 0,
    transmission: 0.8,
    transparent: true,
    opacity: 0.5,
    thickness: 0.55,
    ior: 1.31,
    clearcoat: 0.45,
    clearcoatRoughness: 0.08,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.16,
  });

  const count = viewport.mobile ? 5 : 8;
  const cubes = [];

  for (let i = 0; i < count; i += 1) {
    const size = 0.22 + Math.random() * 0.18;
    const geometry = new THREE.BoxGeometry(size, size * (0.82 + Math.random() * 0.35), size);
    const cube = new THREE.Mesh(geometry, material);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const radius = 0.88 + Math.random() * 0.9;

    cube.position.set(
      Math.cos(angle) * radius + 0.55,
      -0.95 + Math.random() * 2.25,
      Math.sin(angle) * 0.7 - 0.25,
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
    cube.add(edges);

    cube.userData = {
      basePosition: cube.position.clone(),
      spin: new THREE.Vector3(
        (Math.random() - 0.5) * 0.28,
        (Math.random() - 0.5) * 0.34,
        (Math.random() - 0.5) * 0.26,
      ),
      phase: Math.random() * Math.PI * 2,
    };

    cubes.push(cube);
    group.add(cube);
  }

  return {
    group,
    material,
    cubes,
  };
}

function createGlassTumbler() {
  const group = new THREE.Group();
  group.position.set(viewport.mobile ? 0.98 : 1.42, viewport.mobile ? -1.42 : -1.28, 0.3);
  group.rotation.set(0.02, viewport.mobile ? -0.2 : -0.36, 0.02);
  group.scale.setScalar(viewport.mobile ? 0.72 : 0.92);

  const profile = [
    [0.28, -0.58],
    [0.39, -0.52],
    [0.45, -0.28],
    [0.52, 0.18],
    [0.62, 0.58],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe7fbff,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.7,
    thickness: 0.22,
    ior: 1.33,
    transparent: true,
    opacity: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.04,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const glass = new THREE.Mesh(new THREE.LatheGeometry(profile, viewport.mobile ? 36 : 64), glassMaterial);
  glass.renderOrder = 4;

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.018, 12, viewport.mobile ? 48 : 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      metalness: 0,
      transmission: 0.65,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }),
  );
  rim.position.y = 0.58;
  rim.rotation.x = Math.PI / 2;

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.34, 0.08, viewport.mobile ? 36 : 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      transmission: 0.62,
      transparent: true,
      opacity: 0.32,
      ior: 1.33,
      depthWrite: false,
    }),
  );
  base.position.y = -0.56;

  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: flavors.classic.liquid,
    roughness: 0.18,
    metalness: 0,
    transmission: 0.18,
    transparent: true,
    opacity: 0,
    clearcoat: 0.18,
    depthWrite: false,
  });

  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.47, 0.36, 0.86, viewport.mobile ? 36 : 64),
    liquidMaterial,
  );
  liquid.position.y = -0.54;
  liquid.scale.y = 0.001;
  liquid.renderOrder = 3;

  const surface = new THREE.Mesh(
    new THREE.CircleGeometry(0.47, viewport.mobile ? 36 : 64),
    new THREE.MeshBasicMaterial({
      color: flavors.classic.liquid,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  surface.position.y = -0.52;
  surface.rotation.x = -Math.PI / 2;
  surface.renderOrder = 5;

  const stream = createPourStream();
  group.add(liquid, surface, glass, rim, base);

  return {
    group,
    glass,
    rim,
    base,
    liquid,
    surface,
    liquidMaterial,
    surfaceMaterial: surface.material,
    stream,
    fillHeight: 0.86,
    fillBaseY: -0.54,
  };
}

function createPourStream() {
  const count = viewport.mobile ? 22 : 28;
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const offsets = new Float32Array(count * 2);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = -10;
    positions[i * 3 + 2] = 0;
    phases[i] = Math.random();
    speeds[i] = 1.8 + Math.random() * 1.7;
    offsets[i * 2] = (Math.random() - 0.5) * 0.08;
    offsets[i * 2 + 1] = (Math.random() - 0.5) * 0.08;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(1.8, 1.9, 2.1),
    size: viewport.mobile ? 0.046 : 0.064,
    map: createBubbleTexture(),
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = 8;
  points.frustumCulled = false;

  return {
    points,
    geometry,
    material,
    positions,
    phases,
    speeds,
    offsets,
    count,
  };
}

function createSceneProps() {
  const group = new THREE.Group();
  const floaters = [];

  const lemon = createLemonSlice();
  lemon.position.set(viewport.mobile ? 0.78 : 1.38, viewport.mobile ? 0.32 : 0.46, 0.82);
  lemon.rotation.set(0.45, -0.25, 0.28);
  lemon.userData = {
    basePosition: lemon.position.clone(),
    baseRotation: lemon.rotation.clone(),
    phase: 0.7,
    float: 0.06,
  };
  floaters.push(lemon);
  group.add(lemon);

  const mint = createMintLeaves();
  mint.position.set(viewport.mobile ? 0.86 : 1.58, viewport.mobile ? -1.2 : -1.04, 0.76);
  mint.rotation.set(-0.18, 0.28, -0.2);
  mint.userData = {
    basePosition: mint.position.clone(),
    baseRotation: mint.rotation.clone(),
    phase: 2.1,
    float: 0.045,
  };
  floaters.push(mint);
  group.add(mint);

  return { group, floaters, lemon, mint };
}

function createLemonSlice() {
  const group = new THREE.Group();
  const fleshMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8d976,
    roughness: 0.4,
    metalness: 0,
    emissive: 0x221600,
    emissiveIntensity: 0.18,
  });
  const rindMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff0a5,
    roughness: 0.45,
    metalness: 0,
  });
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff7ca,
    roughness: 0.35,
    metalness: 0,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 8), fleshMaterial);
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const rind = new THREE.Mesh(new THREE.TorusGeometry(0.283, 0.018, 8, 8), rindMaterial);
  group.add(rind);

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.24, 8), lineMaterial);
    segment.position.set(Math.sin(angle) * 0.06, Math.cos(angle) * 0.06, 0.038);
    segment.rotation.z = -angle;
    group.add(segment);
  }

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.066, 16), lineMaterial);
  core.rotation.x = Math.PI / 2;
  core.position.z = 0.04;
  group.add(core);

  return group;
}

function createMintLeaves() {
  const group = new THREE.Group();
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x5fb662,
    roughness: 0.35,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const veinMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8f0a0,
    roughness: 0.42,
    metalness: 0,
  });

  const leafConfigs = [
    { x: -0.12, y: 0.02, z: 0.02, rz: -0.48, scale: [0.38, 0.12, 0.035] },
    { x: 0.08, y: 0.08, z: 0.04, rz: 0.38, scale: [0.34, 0.11, 0.032] },
    { x: 0.0, y: -0.06, z: -0.02, rz: 0.02, scale: [0.3, 0.1, 0.03] },
  ];

  leafConfigs.forEach((config, index) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), leafMaterial);
    leaf.scale.set(...config.scale);
    leaf.position.set(config.x, config.y, config.z);
    leaf.rotation.set(0.12 + index * 0.08, 0.28 - index * 0.16, config.rz);

    const vein = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.48, 8), veinMaterial);
    vein.scale.set(1, config.scale[0] * 1.8, 1);
    vein.rotation.z = Math.PI / 2;
    leaf.add(vein);

    group.add(leaf);
  });

  return group;
}

function createLights(scene, bottleTarget) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.42);
  scene.add(ambient);

  const warm = new THREE.PointLight(0xffbd76, 6.2, 9.5, 1.8);
  warm.position.set(-2.7, 2.4, 3.2);

  const cool = new THREE.PointLight(0x88cfff, 2.4, 8.5, 2);
  cool.position.set(2.6, 1.2, 2.6);

  const gold = new THREE.PointLight(flavors.classic.light, 4.4, 7.8, 1.7);
  gold.position.set(1.45, -1.42, 2.2);

  const goldGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 18, 18),
    new THREE.MeshBasicMaterial({
      color: flavors.classic.light,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  goldGlow.position.copy(gold.position);

  const spot = new THREE.SpotLight(0xffefcb, 7.2, 8, Math.PI * 0.14, 0.42, 1.25);
  spot.position.set(-1.2, 3.4, 3.2);
  spot.target = bottleTarget;

  scene.add(warm, cool, gold, goldGlow, spot);
  return { ambient, warm, cool, gold, goldGlow, spot };
}

function setupLenis() {
  if (!Lenis || reducedMotion) {
    return;
  }

  lenis = new Lenis({
    duration: 1.2,
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 0.9,
  });

  if (gsap) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  if (ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }
}

function setupHeaderBehavior() {
  if (!header) {
    return;
  }

  const navToggle = document.getElementById("nav-toggle");

  let lastY = window.scrollY;
  const update = () => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastY;
    header.classList.toggle("is-compact", currentY > 42 && scrollingDown);

    if (currentY < 24 || currentY < lastY) {
      header.classList.remove("is-compact");
    }

    if (navToggle && (scrollingDown || currentY > 42)) {
      navToggle.checked = false;
    }

    lastY = currentY;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });

  if (navToggle) {
    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.checked = false;
      });
    });
  }
}

function setupChapterIndicator() {
  setChapter(0);

  chapterDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      const scene = scenes[index];
      if (!scene) {
        return;
      }

      if (lenis) {
        lenis.scrollTo(scene, { duration: 1.05 });
      } else {
        scene.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  if (!ScrollTrigger || !scenes.length) {
    return;
  }

  sceneBoundaryTriggers = scenes.map((scene) => ScrollTrigger.create({
    trigger: scene,
    start: "top center",
    end: "bottom center",
    onEnter: () => setChapter(Number(scene.dataset.scene)),
    onEnterBack: () => setChapter(Number(scene.dataset.scene)),
  }));
}

function setChapter(activeIndex = 0) {
  const activeScene = scenes[activeIndex];
  sceneState.activeScene = activeIndex;

  if (chapterLabel && activeScene) {
    chapterLabel.textContent = activeScene.dataset.chapter || sceneConfigs[activeIndex]?.name?.toUpperCase() || "";
  }

  chapterDots.forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.index) === activeIndex);
  });
}

function setupTextAnimations() {
  const targets = [...document.querySelectorAll("[data-split]")];

  if (!gsap || !ScrollTrigger || !SplitType || reducedMotion) {
    targets.forEach((element) => {
      element.style.opacity = "1";
    });
    return;
  }

  targets.forEach((element) => {
    let split;

    try {
      split = new SplitType(element, { types: "chars" });
    } catch (error) {
      element.style.opacity = "1";
      return;
    }

    gsap.set(split.chars, {
      autoAlpha: 0,
      yPercent: 112,
      rotateX: -28,
      transformOrigin: "50% 80%",
    });

    gsap.to(split.chars, {
      autoAlpha: 1,
      yPercent: 0,
      rotateX: 0,
      duration: 0.95,
      ease: "power4.out",
      stagger: 0.016,
      scrollTrigger: {
        trigger: element,
        start: "top 82%",
        once: true,
      },
    });
  });
}

function setupEntranceAnimations() {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (!gsap || !ScrollTrigger || reducedMotion) {
    revealItems.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  revealItems.forEach((element) => {
    gsap.to(element, {
      autoAlpha: 1,
      y: 0,
      duration: 0.82,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true,
      },
    });
  });
}

function runInitialEntrance() {
  if (!gsap || reducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  const heroItems = document.querySelectorAll("[data-scene='0'] [data-reveal]");

  gsap.to(heroItems, {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.06,
    delay: 0.08,
  });
}

function setupStatNumbers() {
  const numbers = [...document.querySelectorAll(".stat-number[data-count]")];

  numbers.forEach((element) => {
    const target = Number(element.dataset.count || 0);
    const hasDecimal = !Number.isInteger(target);
    const render = (value) => {
      element.textContent = hasDecimal ? value.toFixed(1) : String(Math.round(value));
    };

    render(0);

    if (!gsap || !ScrollTrigger || reducedMotion) {
      render(target);
      return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => render(counter.value),
      scrollTrigger: {
        trigger: element,
        start: "top 84%",
        once: true,
      },
    });
  });
}

function setupScrollChoreography() {
  if (!three) {
    return;
  }

  applySceneConfig(0, true);

  if (!gsap || !ScrollTrigger || reducedMotion) {
    return;
  }

  createMasterTimeline();
}

function createMasterTimeline() {
  if (masterScrollTrigger) {
    masterScrollTrigger.kill();
    masterScrollTrigger = null;
  }

  if (masterTimeline) {
    masterTimeline.kill();
    masterTimeline = null;
  }

  masterTimeline = gsap.timeline({
    defaults: { ease: "power1.inOut" },
    scrollTrigger: {
      trigger: main || body,
      start: "top top",
      end: "bottom bottom",
      scrub: viewport.mobile ? 0.38 : 1.15,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        sceneState.scrollProgress = self.progress;
        setChapter(progressToSceneIndex(self.progress));
      },
    },
  });

  masterScrollTrigger = masterTimeline.scrollTrigger;

  for (let i = 1; i < sceneConfigs.length; i += 1) {
    addSceneTween(masterTimeline, sceneConfigs[i], i - 1);
  }
}

function rebuildMasterTimelineAtCurrentProgress() {
  if (!three || !gsap || !ScrollTrigger || reducedMotion || !masterTimeline) {
    return;
  }

  const progress = masterScrollTrigger?.progress ?? sceneState.scrollProgress;
  createMasterTimeline();

  if (masterTimeline) {
    masterTimeline.progress(progress);
  }
}

function addSceneTween(timeline, config, position) {
  const duration = 1;
  const isBottleWalkTransition = ["spark", "flavor", "products"].includes(config.name);
  const ease = isBottleWalkTransition ? "power2.inOut" : "power1.inOut";
  const tween = { duration, ease };

  timeline
    .to(three.camera.position, { ...config.camera, ...tween }, position)
    .to(three.cameraTarget, { ...config.lookAt, ...tween }, position)
    .to(three.mainGroup.position, { ...config.group, ...tween }, position)
    .to(three.bottleRig.position, { ...config.bottlePosition, ...tween }, position)
    .to(three.bottleRig.rotation, { ...config.bottleRotation, ...tween }, position)
    .to(three.pour.group.position, { ...config.cupPosition, ...tween }, position)
    .to(sceneState, {
      bubbleDensity: config.bubbleDensity,
      bubbleSize: config.bubbleSize,
      dropletDensity: config.dropletDensity,
      iceSpread: config.iceSpread,
      pourAmount: config.pourAmount,
      cupFill: config.cupFill,
      ...tween,
    }, position)
    .to(sceneState.bubbleSpread, { ...config.bubbleSpread, ...tween }, position)
    .to(three.bloomPass, { strength: config.bloom, ...tween }, position);

  addLightTween(timeline, "ambient", config.lights.ambient, position, ease);
  addLightTween(timeline, "warm", config.lights.warm, position, ease);
  addLightTween(timeline, "cool", config.lights.cool, position, ease);
  addLightTween(timeline, "gold", config.lights.gold, position, ease);
  addLightTween(timeline, "spot", config.lights.spot, position, ease);
}

function addLightTween(timeline, lightName, config, position, ease = "none") {
  const light = three.lights[lightName];

  if (!light) {
    return;
  }

  if (typeof config === "number") {
    timeline.to(light, { intensity: config, duration: 1, ease }, position);
    return;
  }

  const color = new THREE.Color(config.color);
  timeline
    .to(light, { intensity: config.intensity, duration: 1, ease }, position)
    .to(light.color, { r: color.r, g: color.g, b: color.b, duration: 1, ease }, position);

  if (lightName === "gold") {
    timeline
      .to(three.lights.goldGlow.material.color, {
        r: color.r,
        g: color.g,
        b: color.b,
        duration: 1,
        ease,
      }, position)
      .to(three.lights.goldGlow.material, {
        opacity: Math.min(1, 0.24 + config.intensity / 9),
        duration: 1,
        ease,
      }, position);
  }
}

function applySceneConfig(index, immediate = false) {
  const config = sceneConfigs[index] || sceneConfigs[0];

  if (!three || !config) {
    return;
  }

  const set = immediate || !gsap
    ? (target, values) => Object.assign(target, values)
    : (target, values) => gsap.to(target, { ...values, duration: 0.6, ease: "power2.out" });

  set(three.camera.position, config.camera);
  set(three.cameraTarget, config.lookAt);
  set(three.mainGroup.position, config.group);
  set(three.bottleRig.position, config.bottlePosition);
  set(three.bottleRig.rotation, config.bottleRotation);
  set(three.pour.group.position, config.cupPosition);
  set(sceneState, {
    bubbleDensity: config.bubbleDensity,
    bubbleSize: config.bubbleSize,
    dropletDensity: config.dropletDensity,
    iceSpread: config.iceSpread,
    pourAmount: config.pourAmount,
    cupFill: config.cupFill,
  });
  set(sceneState.bubbleSpread, config.bubbleSpread);

  three.bloomPass.strength = config.bloom;
  applyLightConfig(config.lights);
}

function applyLightConfig(lights) {
  if (!three || !lights) {
    return;
  }

  three.lights.ambient.intensity = lights.ambient;
  ["warm", "cool", "gold", "spot"].forEach((name) => {
    const lightConfig = lights[name];
    const light = three.lights[name];
    if (!lightConfig || !light) {
      return;
    }

    light.intensity = lightConfig.intensity;
    light.color.set(lightConfig.color);
  });

  three.lights.goldGlow.material.color.copy(three.lights.gold.color);
}

function progressToSceneIndex(progress) {
  const count = Math.max(sceneConfigs.length - 1, 1);
  return Math.max(0, Math.min(sceneConfigs.length - 1, Math.round(progress * count)));
}

function setupProcessTimeline() {
  const craftScene = document.querySelector(".cinema-scene[data-scene='2']");
  const steps = [...document.querySelectorAll(".process-timeline .process-step")];

  if (!craftScene || !steps.length) {
    return;
  }

  const updateStep = (progress) => {
    const index = Math.min(steps.length - 1, Math.floor(THREE.MathUtils.clamp(progress, 0, 0.9999) * steps.length));
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("is-active", stepIndex === index);
    });
  };

  updateStep(0);

  if (!ScrollTrigger || reducedMotion) {
    return;
  }

  processScrollTrigger = ScrollTrigger.create({
    trigger: craftScene,
    start: "top center",
    end: "bottom center",
    onEnter: () => updateStep(0),
    onEnterBack: () => updateStep(steps.length - 1),
    onUpdate: (self) => updateStep(self.progress),
  });
}

function setupScrollButtons() {
  document.querySelectorAll("[data-scroll-to], a[href^='#']").forEach((element) => {
    element.addEventListener("click", (event) => {
      const id = element.dataset.scrollTo || element.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;

      if (!target) {
        return;
      }

      event.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.15 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });
}

function setupFlavorCards() {
  document.querySelectorAll(".flavor-card[data-flavor]").forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const activate = () => {
      const flavor = card.dataset.flavor;
      if (!flavor || !flavors[flavor]) {
        return;
      }

      updateFlavor(flavor, { syncCards: true });
    };

    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });
}

function updateFlavor(flavorName, options = {}) {
  const flavor = flavors[flavorName] || flavors.classic;
  const { syncCards = true, quick = false } = options;
  sceneState.flavor = flavorName;

  root.style.setProperty("--accent", flavor.accent);
  root.style.setProperty("--accent-glow", flavor.glow);

  if (syncCards) {
    document.querySelectorAll(".flavor-card[data-flavor]").forEach((card) => {
      const active = card.dataset.flavor === flavorName;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-pressed", String(active));
    });
  }

  sceneConfigs = buildSceneConfigs();
  rebuildMasterTimelineAtCurrentProgress();

  if (!three) {
    return;
  }

  const duration = quick ? 0.35 : 0.75;
  const bottleColor = new THREE.Color(flavor.bottle);
  const liquidColor = new THREE.Color(flavor.liquid);
  const lightColor = new THREE.Color(flavor.light);

  if (gsap) {
    gsap.to(three.bottle.material.color, {
      r: bottleColor.r,
      g: bottleColor.g,
      b: bottleColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.liquid.uniforms.uColor.value, {
      r: liquidColor.r,
      g: liquidColor.g,
      b: liquidColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.pour.liquidMaterial.color, {
      r: liquidColor.r,
      g: liquidColor.g,
      b: liquidColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.pour.surfaceMaterial.color, {
      r: liquidColor.r,
      g: liquidColor.g,
      b: liquidColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.lights.gold.color, {
      r: lightColor.r,
      g: lightColor.g,
      b: lightColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.lights.warm.color, {
      r: lightColor.r,
      g: lightColor.g,
      b: lightColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.lights.cool.color, {
      r: lightColor.r,
      g: lightColor.g,
      b: lightColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.lights.spot.color, {
      r: lightColor.r,
      g: lightColor.g,
      b: lightColor.b,
      duration,
      ease: "power2.out",
    });
    gsap.to(three.lights.goldGlow.material.color, {
      r: lightColor.r,
      g: lightColor.g,
      b: lightColor.b,
      duration,
      ease: "power2.out",
    });
  } else {
    three.bottle.material.color.copy(bottleColor);
    three.liquid.uniforms.uColor.value.copy(liquidColor);
    three.pour.liquidMaterial.color.copy(liquidColor);
    three.pour.surfaceMaterial.color.copy(liquidColor);
    three.lights.gold.color.copy(lightColor);
    three.lights.warm.color.copy(lightColor);
    three.lights.cool.color.copy(lightColor);
    three.lights.spot.color.copy(lightColor);
    three.lights.goldGlow.material.color.copy(lightColor);
  }
}

function setupDragScroll() {
  document.querySelectorAll(".product-track[data-drag-scroll]").forEach((track) => {
    let active = false;
    let startX = 0;
    let scrollStart = 0;
    let previousX = 0;
    let previousTime = 0;
    let velocity = 0;
    let dragged = false;
    let frame = 0;

    const getClientX = (event) => event.touches?.[0]?.clientX ?? event.clientX;
    const stopMomentum = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const momentum = () => {
      if (Math.abs(velocity) < 0.08) {
        frame = 0;
        return;
      }

      track.scrollLeft -= velocity;
      velocity *= 0.92;
      frame = requestAnimationFrame(momentum);
    };
    const start = (event) => {
      active = true;
      dragged = false;
      startX = getClientX(event);
      previousX = startX;
      previousTime = performance.now();
      scrollStart = track.scrollLeft;
      velocity = 0;
      stopMomentum();
      track.classList.add("is-dragging");
    };
    const move = (event) => {
      if (!active) {
        return;
      }

      const clientX = getClientX(event);
      const now = performance.now();
      const delta = clientX - startX;
      const elapsed = Math.max(16, now - previousTime);

      if (Math.abs(delta) > 5) {
        dragged = true;
      }

      velocity = ((clientX - previousX) / elapsed) * 16.67;
      track.scrollLeft = scrollStart - delta;
      previousX = clientX;
      previousTime = now;

      if (event.cancelable) {
        event.preventDefault();
      }
    };
    const end = () => {
      if (!active) {
        return;
      }

      active = false;
      track.classList.remove("is-dragging");
      momentum();

      if (dragged) {
        track.dataset.dragged = "true";
        window.setTimeout(() => {
          delete track.dataset.dragged;
        }, 160);
      }
    };

    track.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    track.addEventListener("touchstart", start, { passive: true });
    track.addEventListener("touchmove", move, { passive: false });
    track.addEventListener("touchend", end);
    track.addEventListener("click", (event) => {
      if (track.dataset.dragged === "true") {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  });
}

function setupCartToasts() {
  document.querySelectorAll("button.add-to-cart[data-product-name]").forEach((button) => {
    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim();
    }

    button.addEventListener("click", (event) => {
      const track = button.closest("[data-drag-scroll]");
      if (track?.dataset.dragged === "true") {
        event.preventDefault();
        return;
      }

      setButtonFeedback(button, "已加入 ✓", { className: "is-added" });
      showToast(`已加入购物车 · ${button.dataset.productName || "饮品"}`);
    });
  });
}

function setupPurchaseButtons() {
  const candidates = [
    ...document.querySelectorAll("button[data-purchase-action]"),
    ...document.querySelectorAll("button"),
  ];
  const buttons = [...new Set(candidates)].filter((button) => (
    button.matches("[data-purchase-action]")
    || button.textContent.trim().startsWith("立即购买")
  ));

  buttons.forEach((button) => {
    button.dataset.purchaseAction = "";
    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim();
    }

    button.addEventListener("click", () => {
      setButtonFeedback(button, "已加入购物车 ✓", {
        className: "is-purchased",
        duration: 1500,
      });
      showToast("订单已提交 · 预计 2-3 日送达");
    });
  });
}

function setButtonFeedback(button, label, options = {}) {
  const {
    className = "is-added",
    duration = 1500,
  } = options;

  const originalLabel = button.dataset.defaultLabel || button.textContent.trim();
  button.dataset.defaultLabel = originalLabel;
  button.textContent = label;
  button.classList.add(className);

  const existingTimer = feedbackTimers.get(button);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  const timer = window.setTimeout(() => {
    button.textContent = originalLabel;
    button.classList.remove(className);
    feedbackTimers.delete(button);
  }, duration);

  feedbackTimers.set(button, timer);
}

function showToast(message) {
  if (!toastContainer) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2500);
}

function setupMagneticElements() {
  if (!gsap || viewport.mobile || reducedMotion) {
    return;
  }

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.22,
        y: y * 0.22,
        scale: 1.025,
        duration: 0.38,
        ease: "power3.out",
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "elastic.out(1, 0.36)",
      });
    });
  });
}

function setupProductCards() {
  if (!gsap || reducedMotion) {
    return;
  }

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: px * 8,
        rotateX: py * -7,
        y: -8,
        transformPerspective: 900,
        transformOrigin: "center",
        duration: 0.35,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    });
  });
}

function setupPointerParallax() {
  window.addEventListener("pointermove", (event) => {
    pointer.targetX = (event.clientX / viewport.width - 0.5) * 2;
    pointer.targetY = (event.clientY / viewport.height - 0.5) * 2;

    if (cursorGlow && !viewport.mobile) {
      cursorGlow.classList.add("is-active");
      cursorGlow.style.transform = `translate(${event.clientX - 150}px, ${event.clientY - 150}px)`;
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    cursorGlow?.classList.remove("is-active");
  }, { passive: true });
}

function setupMiniScenes() {
  const targets = [...document.querySelectorAll("[data-3d-mini]")];

  if (!targets.length) {
    return;
  }

  if (body.classList.contains("no-webgl") || !three) {
    targets.forEach((target) => {
      target.style.background = "radial-gradient(circle at center, rgba(240,232,219,.12), transparent 70%)";
    });
    return;
  }

  targets.forEach((target) => {
    try {
      const flavorName = target.dataset["3dMini"] || "classic";
      const miniScene = createMiniScene(target, flavorName);
      if (miniScene) {
        miniScenes.push(miniScene);
      }
    } catch (error) {
      target.style.background = "radial-gradient(circle at center, rgba(240,232,219,.12), transparent 70%)";
    }
  });
}

function createMiniScene(target, flavorName) {
  const width = Math.max(1, target.clientWidth || 220);
  const height = Math.max(1, target.clientHeight || 180);
  const flavor = flavors[flavorName] || flavors.classic;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !viewport.mobile,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.max(1, Math.min(window.devicePixelRatio || 1, 1.4)));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  target.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 20);
  camera.position.set(0, 0.05, 5);

  const group = new THREE.Group();
  group.rotation.y = -0.35;
  scene.add(group);

  const bottle = new THREE.Mesh(
    createBottleGeometry(viewport.mobile ? 28 : 44),
    new THREE.MeshPhysicalMaterial({
      color: flavor.bottle,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.3,
      transmission: 0.48,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    }),
  );
  bottle.scale.setScalar(0.72);

  const liquid = new THREE.Mesh(
    createLiquidGeometry(viewport.mobile ? 24 : 36),
    new THREE.MeshPhysicalMaterial({
      color: flavor.liquid,
      roughness: 0.25,
      metalness: 0,
      clearcoat: 0.12,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    }),
  );
  liquid.position.y = -0.06;
  liquid.scale.set(0.68, 0.68, 0.68);

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.17, 0.2, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xf0d28b,
      roughness: 0.24,
      metalness: 0.32,
      clearcoat: 0.25,
    }),
  );
  cap.position.y = 1.39;
  cap.scale.setScalar(0.72);

  group.add(liquid, bottle, cap);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const light = new THREE.PointLight(flavor.light, 3.2, 6);
  light.position.set(-1.8, 2.4, 3);
  scene.add(light);

  return {
    target,
    renderer,
    scene,
    camera,
    group,
    flavorName,
  };
}

function setupLoader() {
  if (progressBar) {
    if (gsap) {
      gsap.fromTo(progressBar, { width: "0%" }, { width: "82%", duration: 1.25, ease: "power2.out" });
    } else {
      progressBar.style.width = "82%";
    }
  }

  const loadPromise = document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

  Promise.race([loadPromise, delay(1500)]).then(finishLoading);
}

function finishLoading() {
  if (loadFinished) {
    return;
  }

  loadFinished = true;
  sceneState.ready = true;

  if (progressBar) {
    if (gsap) {
      gsap.to(progressBar, { width: "100%", duration: 0.25, ease: "power1.out" });
    } else {
      progressBar.style.width = "100%";
    }
  }

  window.setTimeout(() => {
    body.classList.remove("is-loading");
    body.classList.add("is-ready");

    if (gsap && loadCurtain) {
      gsap.to(loadCurtain, {
        autoAlpha: 0,
        duration: 0.75,
        ease: "power2.out",
      });
    }

    runInitialEntrance();

    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }, 180);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function requestRenderLoop() {
  const tick = (now) => {
    const delta = Math.min((now - lastFrame) / 1000, 0.04);
    lastFrame = now;

    updateMainScene(now * 0.001, delta);
    updateMiniScenes(now * 0.001);

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

function updateMainScene(time, delta) {
  if (!three) {
    return;
  }

  const motionFactor = reducedMotion ? 0.12 : 1;
  pointer.x += (pointer.targetX - pointer.x) * 0.055;
  pointer.y += (pointer.targetY - pointer.y) * 0.055;

  three.liquid.uniforms.uTime.value = time;
  three.bottle.condensation.uniforms.uTime.value = time;
  three.bottle.condensation.uniforms.uDensity.value = sceneState.dropletDensity;

  three.mainGroup.rotation.y += ((pointer.x * 0.085 * motionFactor) - three.mainGroup.rotation.y) * 0.045;
  three.mainGroup.rotation.x += ((-pointer.y * 0.045 * motionFactor) - three.mainGroup.rotation.x) * 0.045;

  three.bottle.group.rotation.y = Math.sin(time * 0.45) * 0.035 * motionFactor;
  three.bottle.group.rotation.z = Math.sin(time * 0.32) * 0.012 * motionFactor;
  three.liquid.surface.rotation.z = Math.sin(time * 0.6) * 0.08 * motionFactor;

  updateBubbles(time, delta);
  updateIce(time, delta);
  updatePour(time);
  updateSceneProps(time);

  three.camera.lookAt(three.cameraTarget);
  three.composer.render();
}

function updateBubbles(time, delta) {
  const bubbles = three.bubbles;
  const positions = bubbles.positions;
  const visibleCount = Math.max(
    80,
    Math.min(
      bubbles.maxCount,
      Math.round((viewport.mobile ? 240 : 620) * sceneState.bubbleDensity),
    ),
  );

  bubbles.geometry.setDrawRange(0, visibleCount);
  bubbles.material.size = sceneState.bubbleSize * (1 + Math.sin(time * 2.4) * 0.11);
  bubbles.material.opacity = 0.28 + sceneState.bubbleDensity * 0.5;

  for (let i = 0; i < bubbles.maxCount; i += 1) {
    const i3 = i * 3;
    const phase = bubbles.phases[i];
    const spread = sceneState.bubbleSpread;
    const spreadX = spread?.x ?? (viewport.mobile ? 3.6 : 5.8);
    const offsetX = spread?.offsetX ?? 0;
    const safeMinX = offsetX - spreadX * 0.5;
    const safeMaxX = offsetX + spreadX * 0.5 + (spread?.biasX ?? 1) * 1.9;
    positions[i3 + 1] += bubbles.speeds[i] * delta * (0.7 + sceneState.bubbleDensity * 0.55);
    positions[i3] += Math.sin(time * 0.9 + phase) * bubbles.drift[i * 2] * delta;
    positions[i3 + 2] += Math.cos(time * 0.75 + phase) * bubbles.drift[i * 2 + 1] * delta;
    positions[i3] = THREE.MathUtils.lerp(
      positions[i3],
      THREE.MathUtils.clamp(positions[i3], safeMinX, safeMaxX),
      Math.min(1, delta * 1.8),
    );

    if (positions[i3 + 1] > 2.85) {
      resetBubble(i, positions, bubbles.speeds, bubbles.drift, bubbles.phases, false);
    }
  }

  bubbles.geometry.attributes.position.needsUpdate = true;
}

function updateIce(time, delta) {
  three.ice.cubes.forEach((cube, index) => {
    const { basePosition, spin, phase } = cube.userData;
    cube.rotation.x += spin.x * delta;
    cube.rotation.y += spin.y * delta;
    cube.rotation.z += spin.z * delta;
    cube.position.x = basePosition.x * sceneState.iceSpread + Math.sin(time * 0.65 + phase) * 0.035;
    cube.position.y = basePosition.y + Math.sin(time * 0.85 + phase + index) * 0.055;
    cube.position.z = basePosition.z * sceneState.iceSpread + Math.cos(time * 0.55 + phase) * 0.035;
  });
}

function updatePour(time) {
  const pour = three.pour;
  const fill = THREE.MathUtils.clamp(sceneState.cupFill, 0, 1);
  const streamAmount = THREE.MathUtils.clamp(sceneState.pourAmount, 0, 1);

  pour.liquid.scale.y = Math.max(0.001, fill);
  pour.liquid.position.y = pour.fillBaseY + (pour.fillHeight * fill * 0.5);
  pour.liquidMaterial.opacity = fill * 0.64;
  pour.surface.position.y = pour.fillBaseY + pour.fillHeight * fill;
  pour.surfaceMaterial.opacity = fill * 0.56;
  pour.surface.rotation.z = time * 0.12;

  updatePourStream(time, streamAmount);
}

function updatePourStream(time, amount) {
  const stream = three.pour.stream;
  stream.geometry.setDrawRange(0, amount > 0.025 ? stream.count : 0);
  stream.material.opacity = amount * 0.92;

  if (amount <= 0.025) {
    return;
  }

  three.bottleRig.updateMatrixWorld(true);
  three.pour.group.updateMatrixWorld(true);
  reusableVectorA.set(0.24, 1.8, 0.16).applyMatrix4(three.bottleRig.matrixWorld);
  reusableVectorB.set(-0.14, 0.58, 0.18).applyMatrix4(three.pour.group.matrixWorld);
  three.mainGroup.worldToLocal(reusableVectorA);
  three.mainGroup.worldToLocal(reusableVectorB);

  const positions = stream.positions;
  for (let i = 0; i < stream.count; i += 1) {
    const i3 = i * 3;
    const t = (stream.phases[i] + time * stream.speeds[i]) % 1;
    reusableVectorC.lerpVectors(reusableVectorA, reusableVectorB, t);

    const arc = Math.sin(t * Math.PI);
    positions[i3] = reusableVectorC.x + stream.offsets[i * 2] * arc;
    positions[i3 + 1] = reusableVectorC.y - arc * (0.18 + amount * 0.12);
    positions[i3 + 2] = reusableVectorC.z + stream.offsets[i * 2 + 1] * arc + 0.08;
  }

  stream.geometry.attributes.position.needsUpdate = true;
}

function updateSceneProps(time) {
  three.props.floaters.forEach((object, index) => {
    const { basePosition, baseRotation, phase, float } = object.userData;
    object.position.x = basePosition.x + Math.sin(time * 0.38 + phase) * 0.025;
    object.position.y = basePosition.y + Math.sin(time * 0.74 + phase) * float;
    object.position.z = basePosition.z + Math.cos(time * 0.46 + phase) * 0.025;
    object.rotation.x = baseRotation.x + Math.sin(time * 0.42 + index) * 0.035;
    object.rotation.y = baseRotation.y + Math.cos(time * 0.36 + phase) * 0.05;
    object.rotation.z = baseRotation.z + Math.sin(time * 0.32 + phase) * 0.045;
  });
}

function updateMiniScenes(time) {
  miniScenes.forEach((mini, index) => {
    mini.group.rotation.y = -0.38 + Math.sin(time * 0.65 + index) * 0.18;
    mini.group.rotation.x = Math.sin(time * 0.5 + index * 0.7) * 0.04;
    mini.renderer.render(mini.scene, mini.camera);
  });
}

function getMainPixelRatio() {
  return Math.max(1, Math.min(window.devicePixelRatio || 1, viewport.mobile ? 1.25 : 1.75));
}

function onResize() {
  if (resizeRaf) {
    cancelAnimationFrame(resizeRaf);
  }

  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0;
    viewport.width = Math.max(1, window.innerWidth);
    viewport.height = Math.max(1, window.innerHeight);
    viewport.mobile = window.innerWidth < 900;
    sceneConfigs = buildSceneConfigs();

    if (three) {
      const pixelRatio = getMainPixelRatio();
      three.camera.aspect = viewport.width / viewport.height;
      three.camera.updateProjectionMatrix();
      three.renderer.setPixelRatio(pixelRatio);
      three.renderer.setSize(viewport.width, viewport.height, false);
      three.composer.setPixelRatio(pixelRatio);
      three.composer.setSize(viewport.width, viewport.height);
      three.bloomPass.setSize(viewport.width, viewport.height);
      three.scene.fog.density = viewport.mobile ? 0.022 : 0.032;
      three.mainGroup.scale.setScalar(viewport.mobile ? 0.92 : 1.08);
      three.bottle.group.scale.setScalar(viewport.mobile ? 0.62 : 1);
      three.pour.group.scale.setScalar(viewport.mobile ? 0.72 : 0.92);
      applySceneConfig(sceneState.activeScene, true);
    }

    miniScenes.forEach((mini) => {
      const width = Math.max(1, mini.target.clientWidth || 220);
      const height = Math.max(1, mini.target.clientHeight || 180);
      mini.camera.aspect = width / height;
      mini.camera.updateProjectionMatrix();
      mini.renderer.setSize(width, height, false);
    });

    if (three && gsap && ScrollTrigger && !reducedMotion) {
      createMasterTimeline();
      ScrollTrigger.refresh();
    } else if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
}

window.addEventListener("beforeunload", () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  if (lenis?.destroy) {
    lenis.destroy();
  }
});
