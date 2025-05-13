// Three.js 3D HTML Tag Landing for Quiz
let scene, camera, renderer, htmlTagMesh, shapes = [], animationId;

function createHTMLTag(font) {
    // 3D Text: '<HTML />' as centerpiece
    const textGeo = new THREE.TextGeometry('<HTML />', {
        font: font,
        size: 2.8,
        height: 0.38,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.13,
        bevelSize: 0.13,
        bevelOffset: 0,
        bevelSegments: 4
    });
    const textMat = new THREE.MeshPhysicalMaterial({
        color: 0xff5722,
        metalness: 0.7,
        roughness: 0.18,
        clearcoat: 0.8,
        clearcoatRoughness: 0.08,
        emissive: 0xff7043,
        emissiveIntensity: 0.18
    });
    htmlTagMesh = new THREE.Mesh(textGeo, textMat);
    textGeo.center();
    htmlTagMesh.position.set(0, 2.2, 0);
    htmlTagMesh.castShadow = true;
    htmlTagMesh.receiveShadow = true;
    scene.add(htmlTagMesh);
}

function init3DQuizLanding() {
    const container = document.getElementById('quiz-threejs-bg');
    if (container.firstChild) container.removeChild(container.firstChild);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181a20);
    // Gradient background using fog
    scene.fog = new THREE.FogExp2(0x181a20, 0.08);
    const aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.set(0, 2, 16);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xfff8e1, 1.1);
    dir.position.set(10, 20, 40);
    scene.add(dir);
    // 3D HTML Tag
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.152.2/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        createHTMLTag(font);
    });
    // Floating/Orbiting Shapes
    const shapeColors = [0x4caf50, 0x2196f3, 0xff9800, 0xf44336, 0xffeb3b];
    for (let i = 0; i < 7; i++) {
        let geometry, mesh;
        if (i % 2 === 0) {
            geometry = new THREE.IcosahedronGeometry(0.7 + Math.random() * 0.5, 0);
        } else {
            geometry = new THREE.TorusKnotGeometry(0.5, 0.18, 80, 16);
        }
        const material = new THREE.MeshPhysicalMaterial({
            color: shapeColors[i % shapeColors.length],
            metalness: 0.6,
            roughness: 0.3,
            clearcoat: 0.5,
            emissive: shapeColors[i % shapeColors.length],
            emissiveIntensity: 0.08
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.cos((i / 7) * Math.PI * 2) * 7 + (Math.random() - 0.5) * 2,
            Math.sin((i / 7) * Math.PI * 2) * 3.5 + (Math.random() - 0.5) * 2 + 2,
            -1 + Math.random() * 2
        );
        mesh.userData = {
            angle: (i / 7) * Math.PI * 2,
            radius: 7 + Math.random() * 1.5,
            speed: 0.003 + Math.random() * 0.002
        };
        scene.add(mesh);
        shapes.push(mesh);
    }
    animate3DQuizLanding();
}

function animate3DQuizLanding() {
    animationId = requestAnimationFrame(animate3DQuizLanding);
    // Animate shapes in orbits
    shapes.forEach((shape, i) => {
        shape.userData.angle += shape.userData.speed;
        shape.position.x = Math.cos(shape.userData.angle) * shape.userData.radius;
        shape.position.y = Math.sin(shape.userData.angle) * (shape.userData.radius * 0.5) + 2;
        shape.rotation.x += 0.01 + i * 0.001;
        shape.rotation.y += 0.012 + i * 0.001;
    });
    // Animate HTML tag
    if (htmlTagMesh) {
        htmlTagMesh.rotation.y += 0.012;
        htmlTagMesh.position.y = 2.2 + Math.sin(Date.now() * 0.001) * 0.25;
        htmlTagMesh.material.emissiveIntensity = 0.18 + 0.08 * Math.abs(Math.sin(Date.now() * 0.0015));
    }
    renderer.render(scene, camera);
}

function resize3DQuizLanding() {
    const container = document.getElementById('quiz-threejs-bg');
    if (!container || !renderer || !camera) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize3DQuizLanding);

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-threejs-bg')) {
        init3DQuizLanding();
        setTimeout(resize3DQuizLanding, 100);
    }
});

// Stop animation when leaving landing page
window.startQuiz = function() {
    if (animationId) cancelAnimationFrame(animationId);
    document.getElementById('quiz-landing').style.display = 'none';
    document.getElementById('quiz-main').style.display = 'block';
}; 