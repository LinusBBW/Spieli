// Sword weapon implementation

import { scene } from '../core/scene.js';

// Create a simple sword
function createSword(camera) {
    // Sword handle
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 32);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    
    // Cross-guard
    const guardGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.02);
    const guardMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.y = 0.08;
    
    // Blade
    const bladeGeometry = new THREE.BoxGeometry(0.03, 0.5, 0.01);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 }); // Silver
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.33; // Above the handle
    
    // Group all parts together
    const sword = new THREE.Group();
    sword.add(handle);
    sword.add(guard);
    sword.add(blade);
    
    // Position the sword relative to the camera
    sword.position.set(0.3, -0.2, -0.5); // bottom right of field of view
    sword.rotation.x = Math.PI / 6; // slightly upwards
    sword.rotation.z = -Math.PI / 8; // slightly inward
    
    // Add sword to camera so it moves with it
    camera.add(sword);
    
    return sword;
}

// Sword-specific abilities could be defined here

export { createSword };