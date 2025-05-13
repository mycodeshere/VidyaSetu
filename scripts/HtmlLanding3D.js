// Three.js 3D Landing Page for HTML Course
let scene, camera, renderer, htmlText, shapes = [], animationId;
let book, bookTextMesh;
let mouse = { x: 0, y: 0 };

function createBookWithText(font) {
    // Book base (a box)
    const bookGeometry = new THREE.BoxGeometry(8, 1.2, 11); // Larger size
    const bookMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2196f3,
        metalness: 0.5,
        roughness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        emissive: 0x1565c0,
        emissiveIntensity: 0.12
    });
    book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(0, 0, 0); // Centered
    book.castShadow = true;
    book.receiveShadow = true;
    scene.add(book);

    // Book "pages" (a slightly smaller white box)
    const pagesGeometry = new THREE.BoxGeometry(7.4, 0.8, 10.4);
    const pagesMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.7,
        clearcoat: 0.2
    });
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.position.set(0, 0.25, 0);
    book.add(pages);

    // 3D Text: 'HTML' on the book cover
    const textGeo = new THREE.TextGeometry('HTML', {
        font: font,
        size: 2.2, // Larger text
        height: 0.28,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.12,
        bevelOffset: 0,
        bevelSegments: 3
    });
    const textMat = new THREE.MeshPhysicalMaterial({
        color: 0x4caf50,
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
        emissive: 0x1b5e20,
        emissiveIntensity: 0.2
    });
    bookTextMesh = new THREE.Mesh(textGeo, textMat);
    textGeo.center();
    bookTextMesh.position.set(0, 0.55, 4.1); // On the cover
    bookTextMesh.rotation.x = -Math.PI / 2.1;
    bookTextMesh.rotation.z = 0;
    book.add(bookTextMesh);
}

function init3DLanding() {
    const container = document.getElementById('threejs-bg');
    if (container.firstChild) container.removeChild(container.firstChild);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181a20);
    const aspect = container.offsetWidth / container.offsetHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.set(0, 0, 30); // Move camera back for big book
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    const ambient = new THREE.AmbientLight(0xffffff, 1.1); // Brighter
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(10, 20, 40);
    scene.add(dir);
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.152.2/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        // 3D Book with HTML text (main focus)
        createBookWithText(font);
        // Optionally, comment out the floating HTML text for now:
        // const textGeo = new THREE.TextGeometry('HTML', { ... });
        // ...
        // scene.add(htmlText);
    });
    // Floating/Orbiting Shapes (keep as before)
    const shapeColors = [0xff9800, 0x8bc34a, 0x2196f3, 0xf44336, 0xffeb3b];
    for (let i = 0; i < 8; i++) {
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
            Math.cos((i / 8) * Math.PI * 2) * 14 + (Math.random() - 0.5) * 2,
            Math.sin((i / 8) * Math.PI * 2) * 7 + (Math.random() - 0.5) * 2,
            -1 + Math.random() * 2
        );
        mesh.userData = {
            angle: (i / 8) * Math.PI * 2,
            radius: 14 + Math.random() * 2.5,
            speed: 0.003 + Math.random() * 0.002
        };
        scene.add(mesh);
        shapes.push(mesh);
    }
    animate3DLanding();
}

function animate3DLanding() {
    animationId = requestAnimationFrame(animate3DLanding);
    // Animate shapes in orbits
    shapes.forEach((shape, i) => {
        shape.userData.angle += shape.userData.speed;
        shape.position.x = Math.cos(shape.userData.angle) * shape.userData.radius;
        shape.position.y = Math.sin(shape.userData.angle) * (shape.userData.radius * 0.5);
        shape.rotation.x += 0.01 + i * 0.001;
        shape.rotation.y += 0.012 + i * 0.001;
    });
    // Animate text
    if (htmlText) {
        htmlText.rotation.y += 0.008;
        htmlText.position.y = Math.sin(Date.now() * 0.001) * 0.3;
    }
    // Animate book tilt with mouse
    if (book) {
        // Smoothly interpolate to mouse position
        const targetX = (mouse.x - 0.5) * Math.PI / 6; // max ~30deg
        const targetY = (mouse.y - 0.5) * Math.PI / 8; // max ~22deg
        book.rotation.y += (targetX - book.rotation.y) * 0.08;
        book.rotation.x += (targetY - book.rotation.x) * 0.08;
        // Add a little floating effect
        book.position.y = 2.5 + Math.sin(Date.now() * 0.001) * 0.25;
    }
    renderer.render(scene, camera);
}

function resize3DLanding() {
    const container = document.getElementById('threejs-bg');
    if (!container || !renderer || !camera) return;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize3DLanding);

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('threejs-bg')) {
        init3DLanding();
        setTimeout(resize3DLanding, 100);
    }
});

// Stop animation when leaving landing page
window.startLearning = function() {
    if (animationId) cancelAnimationFrame(animationId);
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
};

// Mouse move parallax effect
window.addEventListener('mousemove', (e) => {
    const container = document.getElementById('threejs-bg');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
}); 