// Player-related code and animations

import { scene } from '../core/scene.js';
import { playerHeight } from '../core/controls.js';

// Create player feet for movement animation
function createFeet() {
    // Group for both feet
    const feet = new THREE.Group();
    
    // Material for the feet
    const footMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown
    
    // Left foot - bigger and positioned further forward
    const leftFootGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.3);
    const leftFoot = new THREE.Mesh(leftFootGeometry, footMaterial);
    leftFoot.position.set(-0.2, -1.9, -0.5); // Significantly lower and further forward
    
    // Right foot - bigger and positioned further forward
    const rightFootGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.3);
    const rightFoot = new THREE.Mesh(rightFootGeometry, footMaterial);
    rightFoot.position.set(0.2, -1.9, -0.5); // Significantly lower and further forward
    
    // Add feet to the group
    feet.add(leftFoot);
    feet.add(rightFoot);
    
    // Add feet to the scene (not to the camera)
    scene.add(feet);
    
    return feet;
}

// Update foot animation based on movement
function updateFeet(isMoving, isJumping, stepCycle, cameraPosition) {
    const feet = scene.getObjectByName('playerFeet');
    
    if (feet) {
        if (isMoving && !isJumping) {
            // Left foot - movement adapted to new position
            feet.children[0].position.y = -1.9 + Math.max(0, Math.sin(stepCycle)) * 0.15;
            // Right foot - movement adapted to new position
            feet.children[1].position.y = -1.9 + Math.max(0, Math.sin(stepCycle + Math.PI)) * 0.15;
            
            // Feet move with the camera
            feet.position.x = cameraPosition.x;
            feet.position.z = cameraPosition.z;
        } else if (isJumping) {
            // During jump, both feet are in the air
            feet.children[0].position.y = -1.9 + playerHeight;
            feet.children[1].position.y = -1.9 + playerHeight;
            
            // Feet move with the camera
            feet.position.x = cameraPosition.x;
            feet.position.z = cameraPosition.z;
        } else {
            // Reset position when not moving
            feet.children[0].position.y = -1.9;
            feet.children[1].position.y = -1.9;
            
            // Feet move with the camera
            feet.position.x = cameraPosition.x;
            feet.position.z = cameraPosition.z;
        }
    }
}

// Initialize player
function createPlayer(camera, controls) {
    // Create feet for the player
    const feet = createFeet();
    feet.name = 'playerFeet'; // Name for easy retrieval
    
    return {
        feet,
        // Add other player properties here as needed
    };
}

export { createPlayer, updateFeet };