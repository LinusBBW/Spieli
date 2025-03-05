// Sword weapon implementation

import { scene, camera } from '../core/scene.js';
import { createCraterEffect } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';

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

// Update sword special move animation
function updateSwordSpecialAnimation(specialProgress, sword, controls, originalCameraRotation) {
    // Current camera position and direction
    const cameraPos = camera.position.clone();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Phase 1: Wind up & blade glowing (0-0.4)
    if (specialProgress < 0.4) {
        // Normalize progress within this phase
        const phaseProgress = specialProgress / 0.4;
        
        // Raise sword above head with both hands
        sword.position.set(0, 0.3 * phaseProgress, -0.5);
        
        // Rotate to be above player's head
        sword.rotation.x = Math.PI / 6 - (Math.PI / 2) * phaseProgress;
        sword.rotation.z = -Math.PI / 8 * (1 - phaseProgress);
        
        // Sword blade glows
        const glowIntensity = phaseProgress;
        const blade = sword.children[2];
        blade.material.color.setRGB(
            0.75 + glowIntensity * 0.25, 
            0.75 + glowIntensity * 0.25, 
            0.75 - glowIntensity * 0.25  // yellowish glow
        );
        
        // Scale blade during charge
        blade.scale.set(
            1.0,
            1.0 + glowIntensity * 0.5, // stretch vertically
            1.0
        );
    }
    // Phase 2: Slam down (0.4-0.6)
    else if (specialProgress < 0.6) {
        // Normalize progress within this phase
        const phaseProgress = (specialProgress - 0.4) / 0.2;
        
        // Move sword down toward ground quickly
        sword.position.set(
            0, 
            0.3 - (0.8 * phaseProgress), 
            -0.5 + (0.2 * phaseProgress)
        );
        
        // Rotate to point downward
        sword.rotation.x = Math.PI / 6 - Math.PI / 2 + (Math.PI * phaseProgress);
        
        // Intensity peaks at middle of slam
        const intensity = 1 - Math.abs(phaseProgress - 0.5) * 2;
        
        // Blade continues to glow, but stronger
        const blade = sword.children[2];
        blade.material.color.setRGB(
            1.0, 
            1.0, 
            0.5 * (1 - intensity)
        );
        
        // Screen shake if at the moment of impact
        if (phaseProgress > 0.9 && phaseProgress < 1.0) {
            // This would be the point where the sword hits the ground
            // Create crater effect
            const impactPosition = cameraPos.clone();
            impactPosition.y = -2; // Floor level
            
            // Create crater
            createCraterEffect(
                impactPosition,
                new THREE.Color(0xFFA500), // Orange
                30, // More particles
                3 // Larger radius
            );
            
            // Create crater wave that travels forward
            createGroundWave(impactPosition, cameraDirection);
        }
    }
    // Phase 3: After-effects and return to normal (0.6-1.0)
    else {
        // Normalize progress within this phase
        const phaseProgress = (specialProgress - 0.6) / 0.4;
        
        // Return sword to original position
        sword.position.set(
            0.3 * phaseProgress, 
            -0.2 * phaseProgress - 0.5 * (1 - phaseProgress), 
            -0.5
        );
        
        // Return rotation to normal
        sword.rotation.x = Math.PI / 6 * phaseProgress + Math.PI / 2 * (1 - phaseProgress);
        sword.rotation.z = -Math.PI / 8 * phaseProgress;
        
        // Fade blade glow back to normal
        const blade = sword.children[2];
        blade.material.color.setRGB(
            0.75 + (1.0 - 0.75) * (1 - phaseProgress),
            0.75 + (1.0 - 0.75) * (1 - phaseProgress),
            0.75 - (0.75 - 0.5) * (1 - phaseProgress)
        );
        
        // Scale back to normal
        blade.scale.set(
            1.0,
            1.0 + (0.5 * (1 - phaseProgress)),
            1.0
        );
    }
}

// Create a ground wave effect in front of the player
function createGroundWave(position, direction) {
    // Create particles moving forward in a wave pattern
    const waveParticleCount = 40;
    const waveParticles = new THREE.Group();
    const waveLength = 15; // How far the wave will travel
    
    // Create particles in a semi-circle fan shape in front of the player
    for (let i = 0; i < waveParticleCount; i++) {
        // Angle spread in front (-60 to 60 degrees from forward)
        const angle = (i / (waveParticleCount - 1) - 0.5) * Math.PI * 0.8;
        
        // Calculate wave direction with spread
        const waveDir = direction.clone();
        waveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        
        // Create the particle
        const size = 0.3 + Math.random() * 0.2;
        const geometry = new THREE.BoxGeometry(size, size * 0.3, size);
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(0xFFA500).lerp(new THREE.Color(0xFF4500), Math.random() * 0.5),
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position at ground level
        particle.position.set(
            position.x,
            -1.95, // Just above floor
            position.z
        );
        
        // Set velocity for animation
        const speed = 0.15 + Math.random() * 0.1;
        particle.userData.velocity = new THREE.Vector3(
            waveDir.x * speed,
            Math.random() * 0.02, // Slight upward velocity
            waveDir.z * speed
        );
        
        // Lifetime is based on distance to travel
        const dist = 5 + Math.random() * 5;
        particle.userData.maxDistance = dist;
        particle.userData.distanceTraveled = 0;
        
        // Add to wave group
        waveParticles.add(particle);
    }
    
    // Add to scene
    scene.add(waveParticles);
    
    // Update function for the wave - returns true if wave should continue
    const updateWave = () => {
        let anyParticlesAlive = false;
        
        // Update each particle
        for (let i = 0; i < waveParticles.children.length; i++) {
            const particle = waveParticles.children[i];
            
            // Move particle according to velocity
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;
            
            // Apply gravity
            particle.userData.velocity.y -= 0.001;
            
            // Keep above ground
            if (particle.position.y < -1.95) {
                particle.position.y = -1.95;
                particle.userData.velocity.y = Math.abs(particle.userData.velocity.y) * 0.4; // Bounce
            }
            
            // Increase distance traveled
            const dist = Math.sqrt(
                particle.userData.velocity.x * particle.userData.velocity.x + 
                particle.userData.velocity.z * particle.userData.velocity.z
            );
            particle.userData.distanceTraveled += dist;
            
            // Destroy cubes in path
            const hitRadius = 0.8;
            cubes.forEach((cube, index) => {
                // Check distance in horizontal plane (x-z)
                const dx = cube.position.x - particle.position.x;
                const dz = cube.position.z - particle.position.z;
                const distToCube = Math.sqrt(dx * dx + dz * dz);
                
                // If cube is close enough to wave particle
                if (distToCube < hitRadius && cube.position.y < 1.0) { // Only hit cubes near the ground
                    // Remove cube
                    scene.remove(cube);
                    cubes.splice(index, 1);
                    
                    // Create destruction effect
                    createDestroyEffect(cube.position, cube.material.color);
                }
            });
            
            // Check if particle is still alive
            if (particle.userData.distanceTraveled < particle.userData.maxDistance) {
                anyParticlesAlive = true;
                
                // Scale down and reduce opacity as it moves
                const lifeProgress = particle.userData.distanceTraveled / particle.userData.maxDistance;
                const scale = 1.0 - lifeProgress * 0.7;
                particle.scale.set(scale, scale * 0.5, scale);
                particle.material.opacity = 0.8 * (1 - lifeProgress);
            } else {
                // Kill this particle
                particle.visible = false;
            }
        }
        
        // Return true if any particles are still alive
        return anyParticlesAlive;
    };
    
    // Animation loop for the wave
    const animateWave = () => {
        if (updateWave()) {
            requestAnimationFrame(animateWave);
        } else {
            // All particles are dead, remove the group
            scene.remove(waveParticles);
        }
    };
    
    // Start the animation
    animateWave();
}

export { createSword, updateSwordSpecialAnimation };