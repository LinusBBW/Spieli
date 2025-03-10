// Katana weapon implementation

import { scene, camera } from '../core/scene.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';
import { createScreenShake, createEnergySlice } from '../effects/animations.js';

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
function createSenbonzakuraEffect(position, fragmentCount = 5000) { // Increased from 2000 to 5000
    // Pink/purple color for the petals
    const baseColor = new THREE.Color(0xF06292); // Pink
    
    // Clear any existing fragments
    clearSenbonzakuraFragments();
    
    // Create new fragments
    for (let i = 0; i < fragmentCount; i++) {
        // Slight color variations - more vibrant range
        const fragColor = baseColor.clone().offsetHSL(
            (Math.random() - 0.5) * 0.2,  // Wider hue variation
            0.1 + Math.random() * 0.4,    // More saturation variation
            (Math.random() - 0.5) * 0.3   // More lightness variation
        );
        
        // Create the fragment at a random position around the source position
        // Use expanded initial burst radius for more dramatic effect
        const burstRadius = 0.1 + Math.random() * 0.5;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const fragmentPos = position.clone().add(new THREE.Vector3(
            burstRadius * Math.sin(theta) * Math.cos(phi),
            burstRadius * Math.sin(theta) * Math.sin(phi),
            burstRadius * Math.cos(theta)
        ));
        
        const fragment = createPetalFragment(fragmentPos, fragColor);
        
        // Set orbit center to player position
        fragment.userData.orbitCenter = position.clone();
        
        // Make velocity more dramatic for initial burst
        fragment.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.08, // Stronger burst
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.08
        );
        
        // Vary orbit speeds and radii more dramatically
        fragment.userData.orbitSpeed = 0.01 + Math.random() * 0.08; // Faster orbits
        fragment.userData.orbitRadius = 0.5 + Math.random() * 3;    // Wider orbits
        
        // Add to the fragments array
        senbonzakuraFragments.push(fragment);
    }
    
    console.log(`Created ${senbonzakuraFragments.length} petal fragments`);
    
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

// Create an energy ring effect (expanding circular wave)
function createEnergyRing(position, color, size = 1.0) {
    const ringGeometry = new THREE.TorusGeometry(0.1, 0.03, 8, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    // Rotate ring to be horizontal
    ring.rotation.x = Math.PI / 2;
    
    // Create group for animation
    const ringGroup = new THREE.Group();
    ringGroup.add(ring);
    
    // Add to scene
    scene.add(ringGroup);
    
    // Add custom animation data
    ringGroup.userData = {
        initialSize: 0.1,
        targetSize: size,
        createTime: Date.now(),
        lifeTime: 0.7, // seconds
        velocity: new THREE.Vector3(0, 0, 0),
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update function for the ring
    ringGroup.update = function(now) {
        // Calculate age
        const age = (now - this.userData.createTime) / 1000;
        const lifeTime = this.userData.lifeTime;
        
        // Calculate expansion progress
        const progress = age / lifeTime;
        
        if (progress >= 1.0) {
            return false; // Animation complete
        }
        
        // Get ring (first child)
        const ring = this.children[0];
        
        const currentSize = this.userData.initialSize + 
            (this.userData.targetSize - this.userData.initialSize) * progress;
        
        // Scale the ring
        ring.scale.set(currentSize, currentSize, 1);
        
        // Fade out gradually
        ring.material.opacity = 0.8 * (1 - progress);
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(ringGroup);
    
    return ringGroup;
}

// Create a ground ripple effect (expanding circles on the ground)
function createGroundRipple(position, color, maxRadius = 5.0) {
    const rippleCount = 3; // Multiple ripples for dramatic effect
    
    for (let i = 0; i < rippleCount; i++) {
        // Create a thin ring on the ground
        const rippleGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
        const rippleMaterial = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        
        // Position at ground level (y = -2 is the floor level in this game)
        const groundPosition = position.clone();
        groundPosition.y = -1.95; // Just above floor to avoid z-fighting
        
        ripple.position.copy(groundPosition);
        // Rotate to lay flat on ground
        ripple.rotation.x = -Math.PI / 2;
        
        // Create group for animation
        const rippleGroup = new THREE.Group();
        rippleGroup.add(ripple);
        
        // Add to scene
        scene.add(rippleGroup);
        
        // Add custom animation data with delay based on ripple index
        rippleGroup.userData = {
            initialSize: 0.1,
            targetSize: maxRadius,
            createTime: Date.now() + i * 200, // Staggered start times
            lifeTime: 1.0, // seconds
            velocity: new THREE.Vector3(0, 0, 0),
            affectedByGravity: false,
            noRotation: true,
            noShrink: true // Don't apply default shrinking
        };
        
        // Custom update function for the ripple
        rippleGroup.update = function(now) {
            // Check if this ripple should start yet
            if (now < this.userData.createTime) {
                return true; // Keep waiting
            }
            
            // Calculate age properly accounting for delayed start
            const age = (now - this.userData.createTime) / 1000;
            const lifeTime = this.userData.lifeTime;
            
            // Calculate expansion progress
            const progress = age / lifeTime;
            
            if (progress >= 1.0) {
                return false; // Animation complete
            }
            
            // Get ripple (first child)
            const ripple = this.children[0];
            
            // Calculate current inner and outer radius
            const currentSize = this.userData.initialSize + 
                (this.userData.targetSize - this.userData.initialSize) * progress;
                
            // Update geometry
            ripple.geometry.dispose(); // Clean up old geometry
            ripple.geometry = new THREE.RingGeometry(
                currentSize - 0.1, // Inner radius
                currentSize, // Outer radius
                32
            );
            
            // Fade out gradually
            ripple.material.opacity = 0.7 * (1 - progress);
            
            return true; // Continue animation
        };
        
        // Add to active fragments with custom update
        activeFragments.push(rippleGroup);
    }
}

// Update Senbonzakura fragment animations
function updateSenbonzakuraFragments(playerPosition) {
    // Add time-based wave effects through all petals
    const now = Date.now();
    const waveSpeed = now * 0.001; // Time-based factor for wave
    
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
            // Apply a wave pattern to all orbiting fragments
            // This creates dynamic motion like "breathing" or pulsing
            const waveOffset = (i % 10) * 0.1; // Offset wave by fragment index
            const waveValue = Math.sin(waveSpeed + waveOffset) * 0.3;
            
            // Orbit behavior with enhanced dynamics
            fragment.userData.orbitOffset += fragment.userData.orbitSpeed;
            
            // 3D orbit calculation with wave effect
            const orbitRadiusWithWave = fragment.userData.orbitRadius * (1 + waveValue * 0.2);
            const x = Math.sin(fragment.userData.orbitOffset) * orbitRadiusWithWave;
            const z = Math.cos(fragment.userData.orbitOffset) * orbitRadiusWithWave;
            
            // More dynamic Y movement
            const y = Math.sin(fragment.userData.orbitY + fragment.userData.orbitOffset * 0.5) * 
                    (orbitRadiusWithWave * 0.5) + waveValue;
            
            // Set position relative to orbit center
            fragment.position.set(
                fragment.userData.orbitCenter.x + x,
                fragment.userData.orbitCenter.y + y,
                fragment.userData.orbitCenter.z + z
            );
            
            // More dynamic rotation for visual effect
            fragment.rotation.x += 0.02 + waveValue * 0.01;
            fragment.rotation.z += 0.03 + waveValue * 0.01;
            
            // Pulsing glow effect - adjust color brightness based on wave
            if (fragment.material && i % 3 === 0) { // Only some fragments for performance
                const hue = 0.9 - Math.abs(waveValue) * 0.1; // Shift hue slightly
                const saturation = 0.7 + waveValue * 0.1;
                const lightness = 0.5 + Math.abs(waveValue) * 0.2;
                fragment.material.color.setHSL(hue, saturation, lightness);
            }
        } else if (fragment.userData.attackTarget) {
            // Attack behavior - move toward target with more aggressive motion
            const direction = new THREE.Vector3();
            direction.subVectors(fragment.userData.attackTarget, fragment.position);
            
            // Normalize and multiply by speed - faster attack speed
            const distanceToTarget = direction.length();
            direction.normalize().multiplyScalar(0.3); // Increased speed from 0.2 to 0.3
            
            // Add some randomness to attack path for more dramatic effect
            direction.x += (Math.random() - 0.5) * 0.02;
            direction.y += (Math.random() - 0.5) * 0.02;
            direction.z += (Math.random() - 0.5) * 0.02;
            
            // Move fragment
            fragment.position.add(direction);
            
            // More aggressive rotation during attack
            fragment.rotation.x += 0.08;
            fragment.rotation.z += 0.08;
            
            // Brighter, more intense color during attack
            if (fragment.material) {
                // Pulse between normal attack color and brighter flash
                const pulseIntensity = (Math.sin(now * 0.01) + 1) * 0.5;
                const attackColor = new THREE.Color(0xFF0066); // Base attack color
                const flashColor = new THREE.Color(0xFF80AB); // Brighter flash color
                fragment.material.color.copy(attackColor).lerp(flashColor, pulseIntensity);
            }
            
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
    // Phase 1: Move sword to vertical position in front of player (0-0.2)
    // Phase 2: Sword dissolves into petals (0.2-0.3)
    // Phase 3: Petals swirl and attack (0.3-0.9)
    // Phase 4: Petals reform into sword (0.9-1.0)
    
    // Phase 1: Transformation start - Move to front and vertical position
    if (specialProgress < 0.2) {
        const phaseProgress = specialProgress / 0.2;
        
        // Move sword from hand position to directly in front of player (vertical)
        katana.position.set(
            0.3 * (1 - phaseProgress),   // Move from side position to center
            -0.2 + phaseProgress * 0.8,  // Move upward to chest level
            -0.5 - phaseProgress * 0.3   // Move slightly closer to player
        );
        
        // Rotate to vertical position (blade pointing upward)
        katana.rotation.x = Math.PI / 6 * (1 - phaseProgress); // Remove x rotation
        katana.rotation.z = -Math.PI / 8 * (1 - phaseProgress); // Remove z rotation
        katana.rotation.y = phaseProgress * Math.PI * 2 * 0.25; // Rotate slightly around y
        
        // Make blade glow with increasing intensity
        const glowIntensity = phaseProgress;
        katana.children[2].material.color.setRGB(
            0.75 + glowIntensity * 0.25,  // More red
            0.75 - glowIntensity * 0.3,   // Less green
            0.75 + glowIntensity * 0.25   // More blue -> purple
        );
        
        // Optional: Add pulsing/glowing effect to the blade
        const pulseScale = 1.0 + (Math.sin(phaseProgress * Math.PI * 6) * 0.1 * phaseProgress);
        katana.children[2].scale.set(
            pulseScale,
            1.0 + glowIntensity * 0.2, // Slightly elongate the blade
            pulseScale
        );
    }
    // Phase 2: Dissolve into petals
    else if (specialProgress < 0.3) {
        const phaseProgress = (specialProgress - 0.2) / 0.1;
        
        // Initial part - katana glows brighter and starts to "disintegrate"
        if (phaseProgress < 0.5) {
            // Maximum glow before breaking apart
            katana.children[2].material.color.setRGB(
                1.0,  // Full red
                0.3 + Math.sin(phaseProgress * Math.PI * 10) * 0.2,  // Pulsing green
                1.0   // Full blue -> bright purple/pink
            );
            
            // Dramatic pulsing effect before shattering
            const pulseFrequency = 15; // Higher frequency for dramatic effect
            const finalPulse = 1.0 + Math.sin(phaseProgress * Math.PI * pulseFrequency) * 0.2 + phaseProgress * 0.7;
            katana.children[2].scale.set(finalPulse, 1.2 + phaseProgress * 0.4, finalPulse);
            
            // Add dramatic rotation movement before shattering
            katana.rotation.y += 0.03;
            
            // Create screen shake when nearing transformation
            if (phaseProgress > 0.4) {
                // Call screen shake with increasing intensity
                createScreenShake(0.01 + (phaseProgress - 0.4) * 0.2, 0.9);
            }
        } 
        // Second part - fade out and release petals with dramatic effects
        else if (katana.visible) {
            // Make katana invisible and create petals
            katana.visible = false;
            
            // Create the Senbonzakura petal effects - spawn from katana position rather than player
            const katanaWorldPos = new THREE.Vector3();
            katana.getWorldPosition(katanaWorldPos);
            console.log("Creating petals at:", katanaWorldPos);
            
            // Create massive ring flash effect
            createEnergyRing(katanaWorldPos, 0xF06292, 2.0);
            
            // Create dramatic screen shake
            createScreenShake(0.15, 0.8);
            
            // Create petals (with increased count)
            createSenbonzakuraEffect(katanaWorldPos, 1000); // Increased petal count
            
            // Add a large flash of light effect at the transformation point
            const flashGeometry = new THREE.SphereGeometry(1.0, 16, 16); // Larger flash
            const flashMaterial = new THREE.MeshBasicMaterial({
                color: 0xFF77BB, // Brighter pink
                transparent: true,
                opacity: 0.9
            });
            const flash = new THREE.Mesh(flashGeometry, flashMaterial);
            flash.position.copy(katanaWorldPos);
            
            // Group for animation
            const flashGroup = new THREE.Group();
            flashGroup.add(flash);
            
            // Add to scene
            scene.add(flashGroup);
            
            // Setup for animation with longer lifetime
            flashGroup.userData = {
                createTime: Date.now(),
                lifeTime: 0.5, // Longer flash
                velocity: new THREE.Vector3(0, 0, 0),
                noShrink: false, // Allow shrinking
                fade: true, // Allow fading
                affectedByGravity: false // No gravity effect
            };
            
            // For the flash effect children, ensure they have proper properties
            for (let i = 0; i < flashGroup.children.length; i++) {
                if (!flashGroup.children[i].userData) {
                    flashGroup.children[i].userData = {};
                }
                flashGroup.children[i].userData.velocity = new THREE.Vector3(0, 0, 0);
            }
            
            // Track for removal
            activeFragments.push(flashGroup);
            
            // Create ground ripple effect
            createGroundRipple(katanaWorldPos, 0xF06292, 5.0);
        }
    }
    // Phase 3: Petals swirling and attacking
    else if (specialProgress < 0.9) {
        // Update fragment positions
        updateSenbonzakuraFragments(playerPosition);
        
        // Attack nearby cubes periodically
        if (specialProgress % 0.1 < 0.01) { // At each 10% interval
            console.log("Petals attacking, fragments count:", senbonzakuraFragments.length); // Debug log
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
            console.log("Petals returning, fragments count:", senbonzakuraFragments.length); // Debug log
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
                // IMPORTANT: Ensure proper userData with velocity
                impactEffect.userData = {
                    lifeTime: 0.3,
                    createTime: Date.now(),
                    velocity: new THREE.Vector3(0, 0, 0)
                };
                
                // Ensure all children have proper userData
                for (let k = 0; k < impactEffect.children.length; k++) {
                    if (!impactEffect.children[k].userData) {
                        impactEffect.children[k].userData = {};
                    }
                    impactEffect.children[k].userData.velocity = new THREE.Vector3(0, 0, 0);
                }
                
                activeFragments.push(impactEffect);
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