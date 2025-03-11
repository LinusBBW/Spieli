// Main animation loop and game state updates

import { scene, camera, renderer } from './scene.js';
import { 
    updateMovement, 
    updateDash, 
    updateJump,
    controls
} from './controls.js';
import { updateHealthSystem } from '../ui/health.js';
import { 
    updateDashIndicator, 
    updateSpecialIndicator, 
    updateWandSpecialIndicator,
    updateSwordSpecialIndicator,
    updateZangetsuSpecialIndicator
} from '../ui/indicators.js';
import { 
    updateWeaponAnimations, 
    updateWeaponSpecials
} from '../weapons/weapon.js';
import { updateFeet } from '../entities/player.js';
import { updateCubes } from '../entities/enemies.js';
import { updateParticles } from '../effects/particles.js';
import { createDashEffect } from '../effects/particles.js';

// Store animation frame ID for potential cancellation
let animationFrameId;

// Step for the step cycle used in walking animation
let stepCycle = 0;

// Main animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update cube rotations
    updateCubes();
    
    // Update player movement
    const { moveX, moveZ } = updateMovement(camera);
    
    // Update dash, jumps, etc.
    const isDashActive = updateDash(camera);
    const isJumpActive = updateJump(camera);
    
    // Create dash effect if dashing
    if (isDashActive) {
        createDashEffect(camera.position);
    }
    
    // Update weapon animations
    updateWeaponAnimations();
    
    // Update weapon special abilities
    updateWeaponSpecials(controls);
    
    // Update active particle effects
    updateParticles();
    
    // Update foot animation based on movement
    const isMoving = (moveX !== 0 || moveZ !== 0);
    if (isMoving && !isJumpActive) {
        // Step speed based on actual movement speed
        const walkSpeed = 0.1 * Math.sqrt(moveX * moveX + moveZ * moveZ) * 5;
        stepCycle += walkSpeed;
    }
    updateFeet(isMoving, isJumpActive, stepCycle, camera.position);
    
    // Update UI indicators
    updateDashIndicator();
    updateSwordSpecialIndicator();
    updateSpecialIndicator();
    updateWandSpecialIndicator();
    updateZangetsuSpecialIndicator();
    
    // Update health system
    updateHealthSystem();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
function startAnimationLoop() {
    if (!animationFrameId) {
        animate();
    }
}

// Stop the animation loop
function stopAnimationLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// Export animation functions
export { startAnimationLoop, stopAnimationLoop };