// src/core/animation.js - Fixed to resolve weaponBench reference error

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
    updateZangetsuSpecialIndicator,
    updateMugetsuSpecialIndicator
} from '../ui/indicators.js';
import { 
    updateWeaponAnimations, 
    updateWeaponSpecials,
    activeWeapon
} from '../weapons/weapon.js';
import { updateFeet } from '../entities/player.js';
import { updateCubes } from '../entities/enemies.js';
import { updateParticles } from '../effects/particles.js';
import { createDashEffect } from '../effects/particles.js';
import { animateMugetsu, animateDarkAura } from '../weapons/mugetsu.js';
// Import weapon bench check function and getBench
import { checkPlayerNearBench, getWeaponBench } from '../entities/weaponbench.js';

// Store animation frame ID for potential cancellation
let animationFrameId;

// Step for the step cycle used in walking animation
let stepCycle = 0;

// Time for delta calculation
let lastTime = 0;

// Main animation loop
function animate(time) {
    animationFrameId = requestAnimationFrame(animate);
    
    // Calculate delta time for animations
    const deltaTime = (time - lastTime) / 1000; // Convert to seconds
    lastTime = time;
    
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
    updateMugetsuSpecialIndicator();
    
    // Update health system
    updateHealthSystem();
    
    // Check if player is near weapon bench
    checkPlayerNearBench(camera.position);
    
    // Get the weapon bench reference and update if it exists
    const bench = getWeaponBench();
    if (bench && typeof bench.update === 'function') {
        bench.update(time);
    }
    
    // Safely animate Mugetsu and Dark Aura
    if (window.mugetsu) {
        animateMugetsu(window.mugetsu, deltaTime);
    }
    if (window.darkAura) {
        animateDarkAura(window.darkAura, deltaTime);
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
function startAnimationLoop() {
    if (!animationFrameId) {
        lastTime = performance.now();
        animate(lastTime);
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