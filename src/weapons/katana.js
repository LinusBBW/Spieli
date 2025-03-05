// Katana weapon implementation

import { scene, camera } from '../core/scene.js';
import { createEnergySlice } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';

// Create a katana weapon
function createKatana(camera) {
    // Group for the katana
    const katana = new THREE.Group();
    
    // Handle (Tsuka)
    const tsukaGeometry = new THREE.CylinderGeometry(0.02, 0.015, 0.25, 32);
    const tsukaMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black
    const tsuka = new THREE.Mesh(tsukaGeometry, tsukaMaterial);
    
    // Hand guard (Tsuba)
    const tsubaGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 32);
    const tsubaMaterial = new THREE.MeshBasicMaterial({ color: 0x303030 }); // Dark gray
    const tsuba = new THREE.Mesh(tsubaGeometry, tsubaMaterial);
    tsuba.position.y = 0.12;
    tsuba.rotation.x = Math.PI / 2; // Rotate to be horizontal
    
    // Blade (long, slender, and slightly curved)
    const bladeGeometry = new THREE.BoxGeometry(0.025, 0.6, 0.005);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 }); // Silver
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.42; // Above the handle
    // Simulate slight curve of the blade with rotation
    blade.rotation.z = 0.05;
    
    // Add all parts to the katana
    katana.add(tsuka);
    katana.add(tsuba);
    katana.add(blade);
    
    // Position similarly to the sword
    katana.position.set(0.3, -0.2, -0.5);
    katana.rotation.x = Math.PI / 6;
    katana.rotation.z = -Math.PI / 8;
    
    // Add katana to camera so it moves with it
    camera.add(katana);
    
    // Hide by default
    katana.visible = false;
    
    return katana;
}

// Update katana special move animation
function updateKatanaSpecialAnimation(specialProgress, katana, controls, originalCameraRotation) {
    // Current camera position and direction
    const cameraPos = camera.position.clone();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Katana position (for energy effects)
    const katanaPos = new THREE.Vector3();
    katana.children[2].getWorldPosition(katanaPos); // Blade position
    
    // Phase 1: Charging phase (0-0.3)
    if (specialProgress < 0.3) {
        // Katana glows increasingly brighter
        const glowIntensity = specialProgress / 0.3;
        katana.children[2].material.color.setRGB(
            1.0, 
            0.5 + glowIntensity * 0.5, 
            0.5 + glowIntensity * 0.5
        );
        
        // Scale the blade slightly larger during charging
        katana.children[2].scale.set(
            1.0 + glowIntensity * 0.2,
            1.0 + glowIntensity * 0.2,
            1.0 + glowIntensity * 0.2
        );
        
        // Small particle effects around the katana
        if (Math.random() > 0.7) {
            // Create a particle effect
            // ... (particle effect code)
        }
    }
    // Phase 2: Spinning phase with energy bubbles (0.3-0.7)
    else if (specialProgress < 0.7) {
        // Normalized progress within this phase
        const phaseProgress = (specialProgress - 0.3) / 0.4;
        
        // Calculate the rotation angle (0 to 2*PI for a complete rotation)
        const rotationAngle = originalCameraRotation + phaseProgress * Math.PI * 2;
        
        // Fixed: Rotate the camera directly instead of using controls.object
        camera.rotation.y = rotationAngle;
        
        // The katana follows the camera automatically since it's attached to it
        
        // Special animation for the katana
        katana.rotation.z = -Math.PI / 8 + Math.sin(phaseProgress * Math.PI * 4) * 0.5;
        
        // Generate energy slices
        if (phaseProgress % 0.1 < 0.02) { // Every 10% of the phase
            const sliceDirection = new THREE.Vector3(
                Math.sin(rotationAngle), 
                0, 
                Math.cos(rotationAngle)
            );
            
            // Random color in red/orange spectrum
            const hue = 0.95 + Math.random() * 0.1; // Red to orange
            const sliceColor = new THREE.Color().setHSL(hue, 0.8, 0.6);
            
            // Create an energy slice
            const energySlice = createEnergySlice(
                katanaPos.clone(), 
                sliceDirection, 
                0.5 + Math.random() * 0.3, 
                sliceColor
            );
            
            // Add to active particles
            activeFragments.push(energySlice);
            
            // Check if cubes nearby are hit
            const tempRaycaster = new THREE.Raycaster(
                katanaPos.clone(),
                sliceDirection,
                0,
                3.0 // Maximum range
            );
            
            const intersects = tempRaycaster.intersectObjects(cubes);
            if (intersects.length > 0) {
                // The nearest hit cube
                const hitCube = intersects[0].object;
                
                // Remove the cube from the scene
                scene.remove(hitCube);
                
                // Remove the cube from the list of cubes
                const index = cubes.indexOf(hitCube);
                if (index > -1) {
                    cubes.splice(index, 1);
                }
                
                // Create an enhanced particle effect at the position of the hit cube
                createDestroyEffect(hitCube.position, hitCube.material.color);
                createDestroyEffect(hitCube.position, hitCube.material.color); // Double effect
            }
        }
    }
    // Phase 3: Finishing phase (0.7-1.0)
    else {
        // Normalized progress within this phase
        const phaseProgress = (specialProgress - 0.7) / 0.3;
        
        // Back to starting position
        katana.rotation.z = -Math.PI / 8;
        
        // Reset katana color
        katana.children[2].material.color.setRGB(0.75, 0.75, 0.75); // Silver
        katana.children[2].scale.set(1, 1, 1); // Original size
        
        // Stelle sicher, dass die Kamera zum Ende der Animation zur ursprünglichen Rotation zurückkehrt
        if (phaseProgress > 0.9) {
            camera.rotation.y = originalCameraRotation;
        }
        
        // Optional: final crater
        if (phaseProgress < 0.1) {
            const craterCenter = camera.position.clone();
            craterCenter.y = -2; // At floor level
            
            // Create a large, flat "crater" effect
            // ... (crater effect code)
        }
    }
}

export { createKatana, updateKatanaSpecialAnimation };