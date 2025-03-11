// Scene setup and management

// Create basic Three.js objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add lighting to the scene
function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Point light in the center of the room
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);
    
    // Light helper (optional)
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);
}

// Initialize scene, camera, and renderer
function initScene() {
    // Setup renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add camera to scene
    scene.add(camera);
    
    // Set camera initial position
    camera.position.set(0, 0, 5);
    
    // Add lighting
    addLighting();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    return { scene, camera, renderer };
}

// Update renderer and camera on window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Export scene components
export { scene, camera, renderer, raycaster, mouse, initScene };