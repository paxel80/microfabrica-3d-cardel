/**
 * Three.js Hero Scene - Industrial 3D Printer Visualization
 * Runs in the hero section canvas (uses global THREE)
 */
export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  const frame = document.getElementById('hero-frame');
  if (!canvas || !frame) return;

  // Wait for THREE to be available
  const waitForTHREE = () => {
    if (window.THREE) {
      initScene();
    } else {
      setTimeout(waitForTHREE, 50);
    }
  };
  waitForTHREE();

  function initScene() {
    const THREE = window.THREE;
    const canvas = document.getElementById('hero-canvas');
    const frame = document.getElementById('hero-frame');
    if (!canvas || !frame) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent, we handle bg via CSS

    // Camera
    const aspect = frame.clientWidth / frame.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0.8, 3.2);
    camera.lookAt(0, 0.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(frame.clientWidth, frame.clientHeight);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Materials - Industrial aesthetic
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a4a,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.2
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xe87722,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0xe87722,
      emissiveIntensity: 0.15
    });

    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 0.5,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2
    });

    const printedPartMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a4a,
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 1.5
    });

    // Build printer geometry
    const printer = new THREE.Group();
    scene.add(printer);

    // Frame - industrial gantry
    const frameGeo = new THREE.BoxGeometry(2.8, 2.2, 2.4);
    const frameEdges = new THREE.EdgesGeometry(frameGeo);
    const frameLines = new THREE.LineSegments(
      frameEdges,
      new THREE.LineBasicMaterial({ color: 0x1a2a4a, linewidth: 2 })
    );
    frameLines.position.y = 1.1;
    printer.add(frameLines);

    // Vertical columns (4 corners)
    const columnGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16);
    const columns = [];
    const corners = [
      [-1.3, 1.1, -1.1],
      [1.3, 1.1, -1.1],
      [1.3, 1.1, 1.1],
      [-1.3, 1.1, 1.1]
    ];
    corners.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(columnGeo, frameMat);
      col.position.set(x, y, z);
      printer.add(col);
      columns.push(col);
    });

    // Top gantry beam
    const gantryGeo = new THREE.BoxGeometry(2.6, 0.12, 0.12);
    const gantry = new THREE.Mesh(gantryGeo, frameMat);
    gantry.position.set(0, 2.18, 0);
    printer.add(gantry);

    // X-axis carriage
    const carriageGeo = new THREE.BoxGeometry(0.28, 0.18, 0.22);
    const carriage = new THREE.Mesh(carriageGeo, accentMat);
    carriage.position.set(0, 2.05, 0);
    printer.add(carriage);

    // Print head / hotend
    const hotendGeo = new THREE.CylinderGeometry(0.06, 0.03, 0.25, 16);
    const hotend = new THREE.Mesh(hotendGeo, new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.9,
      roughness: 0.1
    }));
    hotend.position.set(0, 1.85, 0);
    printer.add(hotend);

    // Heated bed
    const bedGeo = new THREE.BoxGeometry(1.6, 0.03, 1.4);
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, 0.35, 0);
    printer.add(bed);

    // Glass plate on bed
    const glassGeo = new THREE.BoxGeometry(1.5, 0.015, 1.3);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0.37, 0);
    printer.add(glass);

    // Printed part (growing)
    const partGeo = new THREE.BoxGeometry(0.6, 0, 0.6);
    const part = new THREE.Mesh(partGeo, printedPartMat);
    part.position.set(0, 0.38, 0);
    printer.add(part);

    // Layer lines geometry
    const layerGroup = new THREE.Group();
    const layerMat = new THREE.LineBasicMaterial({
      color: 0xe87722,
      transparent: true,
      opacity: 0.6,
      linewidth: 1
    });
    for (let i = 0; i < 20; i++) {
      const lineGeo = new THREE.BufferGeometry();
      const points = [];
      const y = 0.38 + i * 0.025;
      for (let x = -0.3; x <= 0.3; x += 0.02) {
        points.push(new THREE.Vector3(x, y, -0.3), new THREE.Vector3(x, y, 0.3));
      }
      lineGeo.setFromPoints(points);
      const line = new THREE.LineSegments(lineGeo, layerMat);
      layerGroup.add(line);
    }
    layerGroup.visible = false;
    printer.add(layerGroup);

    // Ambient environment
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a2a4a, 0.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe87722, 0.4);
    fillLight.position.set(-2, 1, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x1a2a4a, 0.6);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Animation state
    let printProgress = 0;
    let targetProgress = 0;
    let isPrinting = false;
    let mouseX = 0, mouseY = 0;

    // Interaction
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.3;
    });

    frame.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    // Click to start/stop print animation
    frame.addEventListener('click', () => {
      if (prefersReduced) return;
      isPrinting = !isPrinting;
      targetProgress = isPrinting ? 1 : 0;
      layerGroup.visible = isPrinting;
    });

    // Resize handler
    function resize() {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', resize);

    // Animation loop
    let lastTime = 0;
    function animate(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      if (!prefersReduced) {
        // Gentle floating
        printer.rotation.y += dt * 0.02;
        printer.rotation.x = Math.sin(time * 0.0004) * 0.02 + mouseY;
        printer.rotation.z = mouseX;

        // Carriage movement
        if (isPrinting) {
          printProgress += dt * 0.15;
          if (printProgress >= 1) {
            printProgress = 1;
            isPrinting = false;
            targetProgress = 0;
            setTimeout(() => { layerGroup.visible = false; }, 800);
          }
          carriage.position.x = THREE.MathUtils.lerp(-1.1, 1.1, (Math.sin(printProgress * Math.PI * 4) + 1) / 2);
          hotend.position.x = carriage.position.x;

          // Grow printed part
          const height = printProgress * 0.8;
          part.scale.y = height / 0.001;
          part.position.y = 0.38 + height / 2;

          // Layer lines fade in
          layerGroup.children.forEach((line, i) => {
            const layerY = 0.38 + i * 0.025;
            if (layerY < 0.38 + height) {
              line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, 0.6, dt * 8);
            } else {
              line.material.opacity = THREE.MathUtils.lerp(line.material.opacity, 0, dt * 4);
            }
          });
        } else {
          // Idle gentle movement
          carriage.position.x = Math.sin(time * 0.0003) * 0.8;
          hotend.position.x = carriage.position.x;
        }

        // Bed gentle rotate
        bed.rotation.y += dt * 0.01;
        glass.rotation.y += dt * 0.01;
        part.rotation.y += dt * 0.01;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

  }
}

// Auto-init fallback
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initHeroScene());
} else {
  setTimeout(() => initHeroScene(), 100);
}