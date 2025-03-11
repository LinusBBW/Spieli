// Mugetsu weapon implementation - Ichigo's Final Getsuga Tensho form

import { scene, camera } from '../core/scene.js';
import { createScreenShake } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';
import { showMugetsuCutScene } from './mugetsu-cutscene.js';

// Create Mugetsu weapon
function createMugetsu(camera) {
    // Group for the Mugetsu
    const mugetsu = new THREE.Group();
    
    // Simple blade - pure black with no guard, representing Final Getsuga Tensho
    const bladeGeometry = new THREE.BoxGeometry(0.05, 0.9, 0.01);
    const bladeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,  // Pure black
        side: THREE.DoubleSide
    });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    
    // Handle/grip - wrapped in bandages
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 16);
    const handleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xEEEEEE  // Off-white for bandages
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.55; // At the bottom of the blade
    
    // Bandage wrappings effect
    const wrappingCount = 6;
    for (let i = 0; i < wrappingCount; i++) {
        const wrappingGeometry = new THREE.BoxGeometry(0.025, 0.01, 0.03);
        const wrappingMaterial = new THREE.MeshBasicMaterial({ color: 0xEEEEEE });
        const wrapping = new THREE.Mesh(wrappingGeometry, wrappingMaterial);
        
        // Position along the handle with slight offset
        wrapping.position.y = -0.55 + (i / wrappingCount) * 0.25;
        wrapping.rotation.x = (i * Math.PI) / 3; // Rotate for a wrapped look
        
        mugetsu.add(wrapping);
    }
    
    // Add red glow/effects around the blade (subtle)
    const glowGeometry = new THREE.BoxGeometry(0.055, 0.91, 0.005);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = 0.008; // Slightly offset from the blade
    
    // Add the blade and handle to the group
    mugetsu.add(blade);
    mugetsu.add(handle);
    mugetsu.add(glow);
    
    // Position the weapon
    mugetsu.position.set(0.3, -0.2, -0.5);
    mugetsu.rotation.x = Math.PI / 6;
    mugetsu.rotation.z = -Math.PI / 8;
    
    // Add to camera
    camera.add(mugetsu);
    
    // Hide by default
    mugetsu.visible = false;
    
    return mugetsu;
}

// Create bandaged arm effect for Mugetsu
function createBandagedArm(camera) {
    const armGroup = new THREE.Group();
    
    // Forearm
    const forearmGeometry = new THREE.CylinderGeometry(0.04, 0.03, 0.4, 8);
    const forearmMaterial = new THREE.MeshBasicMaterial({ color: 0xEEEEEE });
    const forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    forearm.rotation.z = Math.PI / 2; // Align horizontally
    forearm.position.set(0.2, -0.3, -0.3);
    
    // Bandage wrapping details
    const wrappingCount = 8;
    for (let i = 0; i < wrappingCount; i++) {
        const bandageGeometry = new THREE.BoxGeometry(0.015, 0.06, 0.42);
        const bandageMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xDDDDDD,
            transparent: true,
            opacity: 0.9
        });
        const bandage = new THREE.Mesh(bandageGeometry, bandageMaterial);
        
        const angle = (i / wrappingCount) * Math.PI * 2;
        bandage.position.set(
            0.2,
            -0.3 + Math.sin(angle) * 0.042,
            -0.3 + Math.cos(angle) * 0.042
        );
        
        bandage.rotation.x = angle;
        armGroup.add(bandage);
    }
    
    // Loose bandage ends
    for (let i = 0; i < 3; i++) {
        const endGeometry = new THREE.BoxGeometry(0.01, 0.2, 0.03);
        const endMaterial = new THREE.MeshBasicMaterial({ color: 0xEEEEEE });
        const end = new THREE.Mesh(endGeometry, endMaterial);
        
        // Position at the end of the arm with different angles
        end.position.set(
            0.01 + i * 0.04,
            -0.3 - 0.05 * i,
            -0.4
        );
        
        // Random rotation for loose look
        end.rotation.set(
            Math.random() * 0.5,
            Math.random() * 0.5,
            Math.random() * 0.5
        );
        
        armGroup.add(end);
    }
    
    armGroup.add(forearm);
    camera.add(armGroup);
    
    // Hide by default
    armGroup.visible = false;
    
    return armGroup;
}

// Create Mugetsu attack effect - massive black wave of destruction
function createMugetsuAttack(position, direction) {
    // Group for the entire attack effect
    const attackGroup = new THREE.Group();
    
    // Central dark energy mass
    const coreGeometry = new THREE.BoxGeometry(4, 6, 4);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000, // Pure black
        transparent: true,
        opacity: 0.9
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    attackGroup.add(core);
    
    // Red energy outlining the black mass
    const outlineGeometry = new THREE.BoxGeometry(4.2, 6.2, 4.2);
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red
        transparent: true,
        opacity: 0.3,
        wireframe: true // Creates a grid-like effect
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    attackGroup.add(outline);
    
    // Create trailing dark energy particles
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const size = 0.5 + Math.random() * 2;
        
        // Different shapes for variety
        let geometry;
        if (Math.random() > 0.5) {
            geometry = new THREE.BoxGeometry(size, size, size);
        } else {
            geometry = new THREE.TetrahedronGeometry(size, 0);
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.8 ? 0xFF0000 : 0x000000, // Occasional red
            transparent: true,
            opacity: 0.6 + Math.random() * 0.4
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position near the back of the core
        particle.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 5,
            -2 - Math.random() * 3
        );
        
        // Random rotation
        particle.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Add to attack group
        attackGroup.add(particle);
        
        // Add properties for animation
        particle.userData = {
            speed: 0.01 + Math.random() * 0.05,
            rotationSpeed: 0.02 + Math.random() * 0.05,
            originalOpacity: particle.material.opacity
        };
    }
    
    // Position the attack
    attackGroup.position.copy(position);
    
    // Orient in the direction of attack
    const lookAt = position.clone().add(direction);
    attackGroup.lookAt(lookAt);
    
    // Add to scene
    scene.add(attackGroup);
    
    // Animation properties
    attackGroup.userData = {
        velocity: direction.clone().multiplyScalar(0.6), // Fast movement
        rotationSpeed: 0.01,
        lifeTime: 2.0, // seconds
        createTime: Date.now(),
        lastTrailTime: Date.now(),
        trailInterval: 50, // ms between trail effects
        hitObjects: new Set() // Track hit objects
    };
    
    // Custom update function
    attackGroup.update = function(now) {
        // Check lifetime
        const age = (now - this.userData.createTime) / 1000;
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Move forward
        this.position.add(this.userData.velocity);
        
        // Grow larger over time for growing destruction effect
        const scaleFactor = 1 + age * 0.5;
        this.children[0].scale.set(scaleFactor, 1, scaleFactor);
        this.children[1].scale.set(scaleFactor, 1, scaleFactor);
        
        // Rotate the red outline for energy effect
        this.children[1].rotation.y += this.userData.rotationSpeed;
        this.children[1].rotation.z += this.userData.rotationSpeed / 2;
        
        // Animate particles
        for (let i = 2; i < this.children.length; i++) {
            const particle = this.children[i];
            
            // Move particle backward for trailing effect
            particle.position.z -= particle.userData.speed;
            
            // If particle goes too far back, reset position
            if (particle.position.z < -10) {
                particle.position.z = -2 - Math.random() * 3;
                particle.position.x = (Math.random() - 0.5) * 3 * scaleFactor;
                particle.position.y = (Math.random() - 0.5) * 5;
            }
            
            // Random rotation
            particle.rotation.x += particle.userData.rotationSpeed;
            particle.rotation.y += particle.userData.rotationSpeed;
            
            // Pulse opacity
            particle.material.opacity = particle.userData.originalOpacity * 
                (0.7 + Math.sin(now * 0.003 + i) * 0.3);
        }
        
        // Create trail effect
        if (now - this.userData.lastTrailTime > this.userData.trailInterval) {
            this.userData.lastTrailTime = now;
            
            // Create fading trail behind the attack
            createMugetsuTrail(this.position.clone(), this.rotation.clone(), this.scale.clone());
        }
        
        // Check for collisions with cubes
        checkMugetsuCollisions(this);
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(attackGroup);
    
    return attackGroup;
}

// Create twin energy spike attacks from the Mugetsu
function createMugetsuSpikes(originPosition, mainDirection) {
    // Group for both spikes
    const spikesGroup = new THREE.Group();
    
    // Create two spikes that extend from the main attack
    for (let i = 0; i < 2; i++) {
        // Create spike group (for easier manipulation)
        const spikeGroup = new THREE.Group();
        
        // Base spike geometry - long and sharp
        const spikeGeometry = new THREE.CylinderGeometry(0.05, 0.6, 8, 8);
        const spikeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000, // Pure black
            transparent: true,
            opacity: 0.9
        });
        
        // Rotate to point forward
        spikeGeometry.rotateX(Math.PI / 2);
        
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spikeGroup.add(spike);
        
        // Add red energy around the spike
        const energyGeometry = new THREE.CylinderGeometry(0.15, 0.7, 8.2, 8);
        const energyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000, // Red energy
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        // Rotate to match spike
        energyGeometry.rotateX(Math.PI / 2);
        
        const energy = new THREE.Mesh(energyGeometry, energyMaterial);
        spikeGroup.add(energy);
        
        // Add jagged details to make it look more menacing
        for (let j = 0; j < 5; j++) {
            const jaggedPartGeometry = new THREE.ConeGeometry(0.3, 1.2, 4);
            const jaggedPartMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.8
            });
            
            const jaggedPart = new THREE.Mesh(jaggedPartGeometry, jaggedPartMaterial);
            
            // Position along the spike
            jaggedPart.position.z = -3 + j * 1.5;
            
            // Random rotation for more chaotic look
            jaggedPart.rotation.z = Math.random() * Math.PI;
            
            // Alternate sides for the jagged parts
            if (j % 2 === 0) {
                jaggedPart.position.y = 0.5;
            } else {
                jaggedPart.position.y = -0.5;
            }
            
            spikeGroup.add(jaggedPart);
        }
        
        // Position and direction - spread the spikes at angles from the main direction
        const angle = (i === 0) ? -Math.PI/6 : Math.PI/6; // 30 degrees to each side
        
        // Create a new direction vector for this spike by rotating the main direction
        const spikeDirection = mainDirection.clone();
        
        // Create rotation axis (up vector for horizontal spread)
        const rotationAxis = new THREE.Vector3(0, 1, 0);
        
        // Apply rotation to the direction vector
        spikeDirection.applyAxisAngle(rotationAxis, angle);
        
        // Set position slightly behind the origin point
        const startPosition = originPosition.clone().sub(mainDirection.clone().multiplyScalar(1));
        spikeGroup.position.copy(startPosition);
        
        // Orient spike to point in its direction
        spikeGroup.lookAt(startPosition.clone().add(spikeDirection));
        
        // Set custom data for animation
        spikeGroup.userData = {
            velocity: spikeDirection.clone().multiplyScalar(0.7), // Slightly faster than main attack
            rotationSpeed: 0.02,
            lifeTime: 2.5, // Slightly longer than main attack
            createTime: Date.now(),
            hitObjects: new Set(), // Track what this spike has hit
            targetingDelay: i * 300 // Stagger the targeting of the spikes
        };
        
        // Add to the parent group
        spikesGroup.add(spikeGroup);
    }
    
    // Add to scene
    scene.add(spikesGroup);
    
    // Custom update function for the spikes group
    spikesGroup.update = function(now) {
        let anyActive = false;
        
        // Update each spike
        for (let i = 0; i < this.children.length; i++) {
            const spike = this.children[i];
            const age = (now - spike.userData.createTime) / 1000;
            
            // Check if lifetime is over
            if (age >= spike.userData.lifeTime) {
                continue; // Skip this spike
            }
            
            anyActive = true;
            
            // Initial delay for each spike to create staggered effect
            if (now - spike.userData.createTime < spike.userData.targetingDelay) {
                continue;
            }
            
            // Move spike forward
            spike.position.add(spike.userData.velocity);
            
            // Slight rotation for dynamic effect
            spike.rotation.z += 0.01;
            
            // Check for collisions with cubes
            checkSpikeCollisions(spike);
            
            // Create trail effect occasionally
            if (Math.random() > 0.8) {
                createSpikeTrail(spike.position.clone(), spike.quaternion.clone());
            }
        }
        
        return anyActive; // Continue animation if any spike is still active
    };
    
    // Add to active fragments
    activeFragments.push(spikesGroup);
    
    return spikesGroup;
}

// Create a trail effect behind the Mugetsu attack
function createMugetsuTrail(position, rotation, scale) {
    const trailGroup = new THREE.Group();
    
    // Create a simpler version of the attack effect
    const trailGeometry = new THREE.BoxGeometry(4, 6, 1);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4
    });
    
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trailGroup.add(trail);
    
    // Red outline (simpler than the main attack)
    const outlineGeometry = new THREE.BoxGeometry(4.2, 6.2, 1.1);
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    trailGroup.add(outline);
    
    // Copy position and rotation
    trailGroup.position.copy(position);
    trailGroup.rotation.copy(rotation);
    trailGroup.scale.copy(scale);
    
    // Add to scene
    scene.add(trailGroup);
    
    // Setup trail for fading
    trailGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.5, // Short lifetime
        velocity: new THREE.Vector3(0, 0, 0), // Static trail
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update function
    trailGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Fade out
        const fadeProgress = age / this.userData.lifeTime;
        this.children.forEach(child => {
            if (child.material) {
                child.material.opacity = child.material.opacity * (1 - fadeProgress);
            }
        });
        
        // Slowly stretch and thin the trail as it fades
        const stretchFactor = 1 + fadeProgress * 0.2;
        this.scale.z = Math.max(0.01, 1 - fadeProgress * 0.9);
        this.scale.x *= stretchFactor;
        this.scale.y *= stretchFactor;
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(trailGroup);
    
    return trailGroup;
}

// Create trail effect for the spike
function createSpikeTrail(position, rotation) {
    const trailGroup = new THREE.Group();
    
    // Simple black fragment
    const trailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6
    });
    
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trailGroup.add(trail);
    
    // Red energy effect
    const energyGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
    const energyMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    const energy = new THREE.Mesh(energyGeometry, energyMaterial);
    trailGroup.add(energy);
    
    // Copy position and rotation
    trailGroup.position.copy(position);
    trailGroup.quaternion.copy(rotation);
    
    // Add to scene
    scene.add(trailGroup);
    
    // Setup for fading
    trailGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.3, // Short lifetime
        velocity: new THREE.Vector3(0, 0, 0), // Static trail
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update
    trailGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Fade out
        const fadeProgress = age / this.userData.lifeTime;
        this.children.forEach(child => {
            if (child.material) {
                child.material.opacity = child.material.opacity * (1 - fadeProgress);
            }
        });
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(trailGroup);
    
    return trailGroup;
}

// Check collisions between Mugetsu attack and cubes
function checkMugetsuCollisions(mugetsuAttack) {
    // The Mugetsu attack is so powerful it destroys all cubes in the path
    // Check each cube
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Skip cubes that have already been hit
        if (mugetsuAttack.userData.hitObjects.has(cube.id)) {
            continue;
        }
        
        // Calculate distance - Mugetsu has much larger hit radius
        const distance = mugetsuAttack.position.distanceTo(cube.position);
        
        // Large hit radius - Mugetsu is devastating
        const hitRadius = 4.0;
        if (distance < hitRadius) {
            // Mark as hit
            mugetsuAttack.userData.hitObjects.add(cube.id);
            
            // Create dramatic destruction effect
            createMugetsuDestructionEffect(cube.position, cube.material.color);
            
            // Remove the cube
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }
}

// Check collisions between spike and cubes
function checkSpikeCollisions(spike) {
    // Larger hit radius for the spike
    const hitRadius = 2.0;
    
    // Check each cube
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Skip cubes that have already been hit
        if (spike.userData.hitObjects.has(cube.id)) {
            continue;
        }
        
        // Calculate distance
        const distance = spike.position.distanceTo(cube.position);
        
        if (distance < hitRadius) {
            // Mark as hit
            spike.userData.hitObjects.add(cube.id);
            
            // Create special spike impact effect
            createSpikeImpactEffect(cube.position, cube.material.color);
            
            // Remove the cube
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }
}

// Create more dramatic destruction effect for Mugetsu
function createMugetsuDestructionEffect(position, originalColor) {
    // Create a group for the effect
    const effectGroup = new THREE.Group();
    
    // Central explosion
    const explosionGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red core
        transparent: true,
        opacity: 0.8
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    effectGroup.add(explosion);
    
    // Dark energy engulfing the explosion
    const darkEnergyGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const darkEnergyMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    
    const darkEnergy = new THREE.Mesh(darkEnergyGeometry, darkEnergyMaterial);
    effectGroup.add(darkEnergy);
    
    // Fragments flying outward
    const fragmentCount = 12;
    
    for (let i = 0; i < fragmentCount; i++) {
        // Create fragment with original cube color
        const fragmentGeometry = new THREE.TetrahedronGeometry(0.2, 0);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: originalColor,
            transparent: true,
            opacity: 0.9
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Position at center
        fragment.position.copy(position);
        
        // Add velocity in random direction
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.2;
        
        fragment.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * speed,
                Math.sin(elevation) * Math.sin(angle) * speed,
                Math.cos(elevation) * speed
            ),
            rotationSpeed: Math.random() * 0.2,
            gravity: 0.002
        };
        
        effectGroup.add(fragment);
    }
    
    // Position the effect
    effectGroup.position.copy(position);
    
    // Add to scene
    scene.add(effectGroup);
    
    // Setup animation properties
    effectGroup.userData = {
        createTime: Date.now(),
        lifeTime: 1.0, // 1 second
        velocity: new THREE.Vector3(0, 0, 0)
    };
    
    // Custom update function
    effectGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Explosion grows quickly then fades
        const explosionGrowth = Math.min(3.0, 1.0 + age * 4.0);
        this.children[0].scale.set(explosionGrowth, explosionGrowth, explosionGrowth);
        this.children[0].material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        
        // Dark energy grows faster and rotates
        const darkEnergyGrowth = Math.min(5.0, 1.0 + age * 8.0);
        this.children[1].scale.set(darkEnergyGrowth, darkEnergyGrowth, darkEnergyGrowth);
        this.children[1].rotation.y += 0.05;
        this.children[1].rotation.z += 0.03;
        this.children[1].material.opacity = 0.6 * (1 - age / this.userData.lifeTime);
        
        // Update fragments
        for (let i = 2; i < this.children.length; i++) {
            const fragment = this.children[i];
            
            // Move according to velocity
            fragment.position.add(fragment.userData.velocity);
            
            // Apply gravity
            fragment.userData.velocity.y -= fragment.userData.gravity;
            
            // Rotate fragment
            fragment.rotation.x += fragment.userData.rotationSpeed;
            fragment.rotation.y += fragment.userData.rotationSpeed;
            
            // Fade out
            fragment.material.opacity = 0.9 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(effectGroup);
    
    // Create screen shake
    createScreenShake(0.1, 0.9);
    
    return effectGroup;
}

// Create special impact effect for spike hit
function createSpikeImpactEffect(position, originalColor) {
    // Impact group
    const impactGroup = new THREE.Group();
    
    // Center explosion
    const explosionGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red core
        transparent: true,
        opacity: 0.7
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    impactGroup.add(explosion);
    
    // Black energy tendrils
    const tendrilCount = 6;
    
    for (let i = 0; i < tendrilCount; i++) {
        const tendrilGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.7 + Math.random() * 0.5);
        const tendrilMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        const tendril = new THREE.Mesh(tendrilGeometry, tendrilMaterial);
        
        // Random direction
        const angle = (i / tendrilCount) * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        
        // Position at center
        tendril.position.copy(position);
        
        // Orient in random direction
        tendril.rotation.x = Math.random() * Math.PI * 2;
        tendril.rotation.y = Math.random() * Math.PI * 2;
        tendril.rotation.z = Math.random() * Math.PI * 2;
        
        // Velocity for animation
        tendril.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * 0.1,
                Math.sin(elevation) * Math.sin(angle) * 0.1,
                Math.cos(elevation) * 0.1
            )
        };
        
        impactGroup.add(tendril);
    }
    
    // Add fragments of the original cube
    const fragmentCount = 8;
    
    for (let i = 0; i < fragmentCount; i++) {
        const fragmentGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: originalColor,
            transparent: true,
            opacity: 0.9
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Random position near impact
        fragment.position.set(
            position.x + (Math.random() - 0.5) * 0.2,
            position.y + (Math.random() - 0.5) * 0.2,
            position.z + (Math.random() - 0.5) * 0.2
        );
        
        // Velocity for animation
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        const speed = 0.05 + Math.random() * 0.1;
        
        fragment.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * speed,
                Math.sin(elevation) * Math.sin(angle) * speed,
                Math.cos(elevation) * speed
            ),
            gravity: 0.002
        };
        
        impactGroup.add(fragment);
    }
    
    // Position the effect
    impactGroup.position.copy(position);
    
    // Add to scene
    scene.add(impactGroup);
    
    // Setup animation properties
    impactGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.8, // Shorter than main effect
        velocity: new THREE.Vector3(0, 0, 0)
    };
    
    // Custom update function
    impactGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Explosion grows then fades
        const explosionGrowth = 1.0 + age * 3.0;
        this.children[0].scale.set(explosionGrowth, explosionGrowth, explosionGrowth);
        this.children[0].material.opacity = 0.7 * (1 - age / this.userData.lifeTime);
        
        // Update tendrils
        for (let i = 1; i < tendrilCount + 1; i++) {
            const tendril = this.children[i];
            
            // Move according to velocity
            tendril.position.add(tendril.userData.velocity);
            
            // Scale up slightly
            const scaleGrowth = 1.0 + age * 1.5;
            tendril.scale.set(1, 1, scaleGrowth);
            
            // Fade out
            tendril.material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        }
        
        // Update fragments
        for (let i = tendrilCount + 1; i < this.children.length; i++) {
            const fragment = this.children[i];
            
            // Move according to velocity
            fragment.position.add(fragment.userData.velocity);
            
            // Apply gravity
            fragment.userData.velocity.y -= fragment.userData.gravity;
            
            // Rotate fragment
            fragment.rotation.x += 0.05;
            fragment.rotation.y += 0.05;
            
            // Fade out
            fragment.material.opacity = 0.9 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(impactGroup);
    
    // Small screen shake
    createScreenShake(0.05, 0.9);
    
    return impactGroup;
}

// Create a dark screen vignette effect for Mugetsu
function createDarkScreenOverlay() {
    // Create an overlay div
    const overlay = document.createElement('div');
    overlay.id = 'mugetsuOverlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1500';
    
    // Create a dark vignette effect
    overlay.style.boxShadow = 'inset 0 0 100px 60px rgba(0, 0, 0, 0.8)';
    overlay.style.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.8) 100%)';
    
    // Initial opacity
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1s';
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Function to remove overlay
    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 1000);
    }
    
    // Function to show overlay
    function showOverlay() {
        overlay.style.opacity = '1';
    }
    
    return {
        element: overlay,
        show: showOverlay,
        remove: removeOverlay
    };
}

// Update Mugetsu special animation
function updateMugetsuAnimation(specialProgress, mugetsu, bandagedArm, controls, playerPosition, cameraDirection) {
    // Phases of the Mugetsu special
    // Phase 1: Preparation (0-0.3) - Raise arm & weapon
    // Phase 2: Activation (0.3-0.5) - Dark energy gathers
    // Phase 3: Release (0.5-0.6) - Launch attack
    // Phase 4: Aftermath (0.6-1.0) - Return to normal
    
    // Show bandaged arm during the special
    bandagedArm.visible = true;
    
    // Phase 1: Preparation
    if (specialProgress < 0.3) {
        const phaseProgress = specialProgress / 0.3;
        
        // Raise the sword and arm
        mugetsu.position.set(
            0.3 - 0.3 * phaseProgress, // Move to center
            -0.2 + 0.6 * phaseProgress, // Raise up
            -0.5 // Keep same distance
        );
        
        // Rotate to more vertical position
        mugetsu.rotation.x = Math.PI / 6 + (Math.PI / 3) * phaseProgress;
        mugetsu.rotation.z = -Math.PI / 8 * (1 - phaseProgress);
        
        // Blade starts to darken with energy
        mugetsu.children[0].material.color.setRGB(
            0.3 * (1 - phaseProgress), // Fade to black
            0.3 * (1 - phaseProgress),
            0.3 * (1 - phaseProgress)
        );
        
        // Red glow intensifies
        mugetsu.children[2].material.opacity = 0.2 + phaseProgress * 0.3;
        
        // Move bandaged arm with weapon
        bandagedArm.position.y = -0.3 + 0.6 * phaseProgress;
    }
    // Phase 2: Activation
    else if (specialProgress < 0.5) {
        const phaseProgress = (specialProgress - 0.3) / 0.2;
        
        // Hold position with slight movements for charging effect
        mugetsu.position.set(
            0.0 + Math.sin(phaseProgress * Math.PI * 4) * 0.02, // Slight shake
            0.4 + Math.sin(phaseProgress * Math.PI * 6) * 0.02,
            -0.5
        );
        
        // Blade gets pure black
        mugetsu.children[0].material.color.setRGB(0, 0, 0);
        
        // Red glow pulses
        mugetsu.children[2].material.opacity = 0.5 + Math.sin(phaseProgress * Math.PI * 8) * 0.3;
        
        // Dramatic shake as energy builds
        if (phaseProgress > 0.7) {
            createScreenShake(0.02, 0.9);
        }
        
        // Bandaged arm follows
        bandagedArm.position.y = 0.3 + Math.sin(phaseProgress * Math.PI * 6) * 0.02;
    }
    // Phase 3: Release
    else if (specialProgress < 0.6) {
        const phaseProgress = (specialProgress - 0.5) / 0.1;
        
        // Swing downward to release attack
        mugetsu.position.set(
            0.0,
            0.4 - phaseProgress * 0.6,
            -0.5 - phaseProgress * 0.1
        );
        
        // Rotate during swing
        mugetsu.rotation.x = Math.PI / 6 + Math.PI / 3 - phaseProgress * (Math.PI / 2);
        
        // Maximum glow at release
        mugetsu.children[2].material.opacity = 0.8;
        
        // Create the attack at the key moment
        if (specialProgress > 0.52 && specialProgress < 0.53) {
            // Get position in front of the player
            const attackPosition = playerPosition.clone().add(
                cameraDirection.clone().multiplyScalar(3)
            );
            
            // Create the main Mugetsu attack
            const mainAttack = createMugetsuAttack(attackPosition, cameraDirection);
            
            // Add twin spike attacks that emerge after a short delay
            setTimeout(() => {
                createMugetsuSpikes(attackPosition, cameraDirection);
            }, 300);
            
            // Dramatic screen shake
            createScreenShake(0.3, 0.85);
            
            // Create dark screen overlay
            const overlay = createDarkScreenOverlay();
            overlay.show();
            
            // Remove overlay after 4 seconds
            setTimeout(() => {
                overlay.remove();
            }, 4000);
        }
        
        // Bandaged arm follows sword movement
        bandagedArm.position.y = 0.3 - phaseProgress * 0.6;
    }
    // Phase 4: Aftermath
    else {
        const phaseProgress = (specialProgress - 0.6) / 0.4;
        
        // Return to original position
        mugetsu.position.set(
            0.3 * phaseProgress, // Back to side
            -0.2 + 0.2 * (1 - phaseProgress), // Lower
            -0.5
        );
        
        // Rotate back to normal
        mugetsu.rotation.x = Math.PI / 6;
        mugetsu.rotation.z = -Math.PI / 8 * phaseProgress;
        
        // Return glow to normal
        mugetsu.children[2].material.opacity = 0.8 - phaseProgress * 0.6;
        
        // Bandaged arm returns, then disappears at end
        bandagedArm.position.y = -0.3 * phaseProgress;
        bandagedArm.visible = (phaseProgress < 0.8);
    }
}

export {
    createMugetsu,
    createBandagedArm,
    updateMugetsuAnimation,
    createMugetsuAttack
};