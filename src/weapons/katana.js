// Katana weapon implementation

import { scene, camera } from '../core/scene.js';
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

// Senbonzakura Kageyoshi Bankai effects
// Store the fragments of Senbonzakura's blade
let senbonzakuraFragments = [];

// Create cherry blossom petal fragment
function createPetalFragment(position, color, size = 0.04) {
    // Create a petal-like shape using a flattened octahedron geometry
    const petalGeometry = new THREE.OctahedronGeometry(size, 0);
    const petalMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.9 
    });
    
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    
    // Flatten to make it more petal-like
    petal.scale.y = 0.2;
    
    // Random rotation for variety
    petal.rotation.x = Math.random() * Math.PI * 2;
    petal.rotation.y = Math.random() * Math.PI * 2;
    petal.rotation.z = Math.random() * Math.PI * 2;
    
    // Set position
    petal.position.copy(position);
    
    // Add custom data for animation
    petal.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.03
        ),
        orbiting: true,
        orbitSpeed: 0.01 + Math.random() * 0.05,
        orbitRadius: 0.5 + Math.random() * 2,
        orbitOffset: Math.random() * Math.PI * 2,
        orbitCenter: new THREE.Vector3(),
        orbitY: Math.random() * Math.PI * 2,
        attackTarget: null,
        destroyWhenReached: false,
        returnToOrbit: false,
        originalColor: color.clone()
    };
    
    // Add to scene
    scene.add(petal);
    
    return petal;
}

// Create the swirling petal cloud for Senbonzakura
function createSenbonzakuraEffect(position, fragmentCount = 1000) {
    // Pink/purple color for the petals
    const baseColor = new THREE.Color(0xF06292); // Pink
    
    // Clear any existing fragments
    clearSenbonzakuraFragments();
    
    // Create new fragments
    for (let i = 0; i < fragmentCount; i++) {
        // Slight color variations
        const fragColor = baseColor.clone().offsetHSL(
            (Math.random() - 0.5) * 0.1,  // Slight hue variation
            Math.random() * 0.2,          // Saturation variation
            (Math.random() - 0.5) * 0.2   // Lightness variation
        );
        
        // Create the fragment at a random position around the player
        const fragmentPos = position.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        ));
        
        const fragment = createPetalFragment(fragmentPos, fragColor);
        
        // Set orbit center to player position
        fragment.userData.orbitCenter = position.clone();
        
        // Add to the fragments array
        senbonzakuraFragments.push(fragment);
    }
    
    // Return the array of fragments
    return senbonzakuraFragments;
}

// Clear all Senbonzakura fragments
function clearSenbonzakuraFragments() {
    senbonzakuraFragments.forEach(fragment => {
        if (fragment) {
            scene.remove(fragment);
        }
    });
    
    senbonzakuraFragments = [];
}

// Update Senbonzakura fragment animations
function updateSenbonzakuraFragments(playerPosition) {
    // Update each fragment
    for (let i = senbonzakuraFragments.length - 1; i >= 0; i--) {
        const fragment = senbonzakuraFragments[i];
        
        if (!fragment) {
            senbonzakuraFragments.splice(i, 1);
            continue;
        }
        
        // Update the orbit center to follow the player
        fragment.userData.orbitCenter.copy(playerPosition);
        
        // Update fragment behavior
        if (fragment.userData.orbiting) {
            // Orbit behavior
            fragment.userData.orbitOffset += fragment.userData.orbitSpeed;
            
            // 3D orbit calculation
            const x = Math.sin(fragment.userData.orbitOffset) * fragment.userData.orbitRadius;
            const z = Math.cos(fragment.userData.orbitOffset) * fragment.userData.orbitRadius;
            const y = Math.sin(fragment.userData.orbitY + fragment.userData.orbitOffset * 0.5) * 
                      (fragment.userData.orbitRadius * 0.5);
            
            // Set position relative to orbit center
            fragment.position.set(
                fragment.userData.orbitCenter.x + x,
                fragment.userData.orbitCenter.y + y,
                fragment.userData.orbitCenter.z + z
            );
            
            // Update rotation for visual effect
            fragment.rotation.x += 0.02;
            fragment.rotation.z += 0.03;
        } else if (fragment.userData.attackTarget) {
            // Attack behavior - move toward target
            const direction = new THREE.Vector3();
            direction.subVectors(fragment.userData.attackTarget, fragment.position);
            
            // Normalize and multiply by speed
            direction.normalize().multiplyScalar(0.2);
            
            // Move fragment
            fragment.position.add(direction);
            
            // Check if fragment reached target
            if (fragment.position.distanceTo(fragment.userData.attackTarget) < 0.2) {
                if (fragment.userData.destroyWhenReached) {
                    // Remove this fragment
                    scene.remove(fragment);
                    senbonzakuraFragments.splice(i, 1);
                } else if (fragment.userData.returnToOrbit) {
                    // Return to orbiting mode
                    fragment.userData.orbiting = true;
                    fragment.userData.attackTarget = null;
                    fragment.userData.returnToOrbit = false;
                    
                    // Reset color
                    fragment.material.color.copy(fragment.userData.originalColor);
                }
            }
        }
        
        // Apply velocity if any
        fragment.position.add(fragment.userData.velocity);
        
        // Reduce velocity (drag)
        fragment.userData.velocity.multiplyScalar(0.95);
    }
}

// Send fragments to attack targets
function attackWithSenbonzakura(targets, percentToSend = 0.2) {
    if (!targets || targets.length === 0 || senbonzakuraFragments.length === 0) {
        return;
    }
    
    // Number of fragments to send
    const fragCount = Math.min(
        Math.floor(senbonzakuraFragments.length * percentToSend),
        senbonzakuraFragments.length
    );
    
    // Get available orbiting fragments
    const orbitingFragments = senbonzakuraFragments.filter(f => f.userData.orbiting);
    
    if (orbitingFragments.length === 0) return;
    
    // Randomly select fragments to attack with
    const attackFragments = [];
    for (let i = 0; i < fragCount && orbitingFragments.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * orbitingFragments.length);
        attackFragments.push(orbitingFragments.splice(randomIndex, 1)[0]);
    }
    
    // Send each fragment to a target
    attackFragments.forEach((fragment, index) => {
        // Cycle through targets
        const target = targets[index % targets.length];
        
        // Stop orbiting
        fragment.userData.orbiting = false;
        
        // Set attack target position
        fragment.userData.attackTarget = target.position.clone();
        
        // Set what happens when target is reached
        fragment.userData.destroyWhenReached = true;
        fragment.userData.returnToOrbit = false;
        
        // Change color to indicate attack mode
        fragment.material.color.set(0xFF0066); // Brighter pink for attacking
    });
}

// Update bankai special move animation
function updateBankaiAnimation(specialProgress, katana, controls, originalCameraRotation, playerPosition) {
    // Phases of the Bankai special
    // Phase 1: Dropping the sword & transformation (0-0.2)
    // Phase 2: Sword dissolves into petals (0.2-0.3)
    // Phase 3: Petals swirl and attack (0.3-0.9)
    // Phase 4: Petals reform into sword (0.9-1.0)
    
    // Phase 1: Transformation start - Dropping the sword
    if (specialProgress < 0.2) {
        const phaseProgress = specialProgress / 0.2;
        
        // Move sword from hand position to a dropped position
        katana.position.set(
            0.3 * (1 - phaseProgress),  // Move from side position to center
            -0.2 - phaseProgress * 0.8, // Drop lower
            -0.5 + phaseProgress * 0.3  // Move slightly forward
        );
        
        // Rotate to face downward
        katana.rotation.x = Math.PI / 6 + phaseProgress * Math.PI / 2;
        
        // Make blade glow
        katana.children[2].material.color.setRGB(
            0.75 + phaseProgress * 0.25, // More red
            0.75 - phaseProgress * 0.3,  // Less green
            0.75 + phaseProgress * 0.25  // More blue -> purple
        );
    }
    // Phase 2: Dissolve into petals
    else if (specialProgress < 0.3) {
        // Hide the katana at the start of this phase
        if (specialProgress <= 0.21 && katana.visible) {
            katana.visible = false;
            
            // Create the Senbonzakura petal effects
            createSenbonzakuraEffect(playerPosition);
        }
    }
    // Phase 3: Petals swirling and attacking
    else if (specialProgress < 0.9) {
        // Update fragment positions
        updateSenbonzakuraFragments(playerPosition);
        
        // Attack nearby cubes periodically
        if (specialProgress % 0.1 < 0.01) { // At each 10% interval
            attackWithSenbonzakura(cubes, 0.3); // Send 30% of petals to attack
        }
    }
    // Phase 4: Petals reform into sword
    else {
        // Make fragments return to katana position
        const katanaPosition = new THREE.Vector3();
        katana.getWorldPosition(katanaPosition);
        
        // On start of this phase, make all fragments return
        if (specialProgress >= 0.9 && specialProgress <= 0.91) {
            senbonzakuraFragments.forEach(fragment => {
                fragment.userData.orbiting = false;
                fragment.userData.attackTarget = katanaPosition;
                fragment.userData.destroyWhenReached = true;
            });
        }
        
        // Show the katana again at the very end
        if (specialProgress > 0.95 && !katana.visible) {
            katana.visible = true;
            katana.position.set(0.3, -0.2, -0.5); // Reset position
            katana.rotation.x = Math.PI / 6;      // Reset rotation
            katana.rotation.z = -Math.PI / 8;     // Reset rotation
            
            // Clear remaining fragments
            clearSenbonzakuraFragments();
        }
    }
}

// Detect and destroy cubes with Senbonzakura
function checkSenbonzakuraCubeHits() {
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Keep track of how many fragments hit this cube
        let hitCount = 0;
        
        // Check each fragment
        for (let j = senbonzakuraFragments.length - 1; j >= 0; j--) {
            const fragment = senbonzakuraFragments[j];
            
            // Skip fragments that are orbiting
            if (fragment.userData.orbiting) continue;
            
            // Check distance
            const distance = fragment.position.distanceTo(cube.position);
            if (distance < 0.5) { // Hit radius
                hitCount++;
                
                // Remove the fragment if it hits
                scene.remove(fragment);
                senbonzakuraFragments.splice(j, 1);
                
                // Create a small effect at the impact
                const impactEffect = new THREE.Group();
                
                // Create a small flash
                const flashGeometry = new THREE.SphereGeometry(0.05, 8, 8);
                const flashMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFF77BB,
                    transparent: true,
                    opacity: 0.7
                });
                const flash = new THREE.Mesh(flashGeometry, flashMaterial);
                flash.position.copy(fragment.position);
                impactEffect.add(flash);
                
                // Add to scene
                scene.add(impactEffect);
                
                // Add to active fragments for animation
                activeFragments.push(impactEffect);
                
                // Set lifetime properties
                impactEffect.userData = {
                    lifeTime: 0.3,
                    createTime: Date.now()
                };
            }
        }
        
        // If enough fragments hit, destroy the cube (threshold: 3 fragments)
        if (hitCount >= 3) {
            // Create destruction effect
            createDestroyEffect(cube.position, cube.material.color);
            
            // Remove cube
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }
}

export { 
    createKatana, 
    updateBankaiAnimation,
    createSenbonzakuraEffect,
    updateSenbonzakuraFragments,
    checkSenbonzakuraCubeHits
};