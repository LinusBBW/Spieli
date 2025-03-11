// Main entry point for the game

// Import core modules
import { initScene, scene, camera, renderer } from './src/core/scene.js';
import { initControls, controls } from './src/core/controls.js';
import { startAnimationLoop } from './src/core/animation.js';

// Import entity modules
import { createPlayer } from './src/entities/player.js';
import { createEnvironment } from './src/entities/environment.js';
import { setupCubes } from './src/entities/enemies.js';

// Import weapon modules
import { initWeapons } from './src/weapons/weapon.js';

// Import UI modules
import { createHealthSystem } from './src/ui/health.js';
import { 
    createDashIndicator, 
    createSpecialIndicator, 
    createWandSpecialIndicator,
    createSwordSpecialIndicator,
    createZangetsuSpecialIndicator,
    createMugetsuSpecialIndicator
} from './src/ui/indicators.js';
import { createCrosshair } from './src/ui/crosshair.js';

// Import weapon modules
import { 
    createMugetsu, 
    createDarkAura 
} from './src/weapons/mugetsu.js';  // Add this import

// Initialize the game
function initGame() {
    // Setup the scene, renderer, and camera
    initScene();
    
    // Setup player controls
    const playerControls = initControls(camera);
    
    // Create environment (floor, walls)
    const { floor, walls } = createEnvironment();
    
    // Create player and setup weapons
    const player = createPlayer(camera, controls);
    initWeapons(camera, controls);
    
    const mugetsu = createMugetsu(camera);
    const darkAura = createDarkAura(camera);

    // Expose these globally if needed
    window.mugetsu = mugetsu;
    window.darkAura = darkAura;

    // Create enemy cubes
    const cubes = setupCubes();
    
    // Create UI elements
    createCrosshair(camera);
    createHealthSystem();
    createDashIndicator();
    createSwordSpecialIndicator();
    createSpecialIndicator();
    createWandSpecialIndicator();
    createZangetsuSpecialIndicator();
    createMugetsuSpecialIndicator();
    
    // Add renderer to the DOM
    document.body.appendChild(renderer.domElement);
    
    // Start the animation loop
    startAnimationLoop();
    
    // Lock pointer on click
    document.addEventListener("click", () => {
        controls.lock();
    });
    
    // Add a small CSS for cutscene animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes sway {
            0% { transform: rotate(70deg); }
            50% { transform: rotate(90deg); }
            100% { transform: rotate(70deg); }
        }
        
        @keyframes fall {
            from { transform: translateY(-100vh); }
            to { transform: translateY(100vh); }
        }
    `;
    document.head.appendChild(styleElement);
    
    console.log("Game initialized successfully!");
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);