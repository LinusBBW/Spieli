// Scythe weapon implementation

import { scene, camera } from '../core/scene.js';
import { createScreenShake } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';
import { showRiftCutScene } from './rift-cutscene.js';

// Create the scythe weapon
function createScythe(camera) {
    // Main group for the scythe
    const scythe = new THREE.Group();
    
    // Handle (Staff) - long for the oversized scythe
    const handleGeometry = new THREE.CylinderGeometry(0.025, 0.03, 1.5, 16);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x3D0C02 }); // Dark wood
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.x = Math.PI / 2; // Make horizontal
    
    // Connecting piece between handle and blade
    const connectorGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 12);
    const connectorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 }); // Dark metal
    const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    connector.rotation.z = Math.PI / 2; // Rotate to connect properly
    connector.position.set(0.7, 0, 0); // Position at the end of the handle
    
    // Create the blade using a custom curved shape
    const bladeShape = new THREE.Shape();
    // Start at the connection point
    bladeShape.moveTo(0, 0);
    // Draw the inner curve
    bladeShape.bezierCurveTo(0.3, 0.05, 0.5, 0.2, 0.7, 0.6);
    // Draw the blade tip
    bladeShape.lineTo(0.8, 0.8);
    // Draw the outer edge (slightly thicker)
    bladeShape.bezierCurveTo(0.6, 0.3, 0.3, 0.1, 0.1, 0.06);
    // Close the shape
    bladeShape.lineTo(0, 0);
    
    // Extrude the blade shape to make it 3D
    const extrudeSettings = {
        steps: 1,
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
    };
    
    const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 }); // Near black
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    
    // Scale up the blade to make it massive
    blade.scale.set(1.2, 1.2, 1.2);
    // Position and rotate the blade to attach to the connector
    blade.rotation.z = -Math.PI / 2;
    blade.position.set(0.7, 0.1, 0);
    
    // Create glowing runes on the blade
    const runeGeometry = new THREE.PlaneGeometry(0.6, 0.05);
    const runeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8A2BE2, // Purple
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    // Add multiple runes across the blade
    const runeCount = 3;
    const runes = [];
    
    for (let i = 0; i < runeCount; i++) {
        const rune = new THREE.Mesh(runeGeometry, runeMaterial);
        // Position runes along the blade
        rune.position.set(0.7, 0.2 + i * 0.2, 0.03);
        rune.rotation.set(0, 0, Math.PI / 4 - (i * Math.PI / 12)); // Varied angles
        rune.scale.set(0.7 + i * 0.1, 0.5 + i * 0.1, 1); // Different sizes
        
        // Store original position and rotation for animation
        rune.userData = {
            originalPos: rune.position.clone(),
            originalRot: rune.rotation.clone(),
            pulseRate: 0.002 + (i * 0.001)
        };
        
        runes.push(rune);
        scythe.add(rune);
    }
    
    // Add all parts to the scythe
    scythe.add(handle);
    scythe.add(connector);
    scythe.add(blade);
    
    // Position the scythe in view
    scythe.position.set(0.4, -0.3, -0.6);
    scythe.rotation.x = Math.PI / 6;
    scythe.rotation.z = -Math.PI / 8;
    
    // Add to camera
    camera.add(scythe);
    
    // Hide by default
    scythe.visible = false;
    
    // Add custom data for animations
    scythe.userData = {
        runes: runes,
        riftEnergy: 0 // Used during special attack
    };
    
    return scythe;
}

// Animate the scythe
function animateScythe(scythe, deltaTime) {
    if (!scythe || !scythe.visible) return;
    
    // Subtle blade pulse and rune glow
    if (scythe.userData && scythe.userData.runes) {
        for (let i = 0; i < scythe.userData.runes.length; i++) {
            const rune = scythe.userData.runes[i];
            
            // Pulsing glow effect
            const pulseIntensity = Math.sin(Date.now() * rune.userData.pulseRate) * 0.3 + 0.7;
            rune.material.opacity = 0.5 * pulseIntensity;
            
            // Slight position shifting for mystical effect
            rune.position.x = rune.userData.originalPos.x + Math.sin(Date.now() * 0.001 + i) * 0.005;
            rune.position.y = rune.userData.originalPos.y + Math.cos(Date.now() * 0.001 + i) * 0.005;
            
            // Color shift during rift energy charging
            if (scythe.userData.riftEnergy > 0) {
                const energyLevel = Math.min(1, scythe.userData.riftEnergy / 100);
                rune.material.color.setHSL(
                    0.75 - energyLevel * 0.1, // Shift from purple to darker purple
                    0.8 + energyLevel * 0.2,
                    0.5 + energyLevel * 0.3
                );
                
                // More dramatic pulse when charged
                const energyPulse = Math.sin(Date.now() * (rune.userData.pulseRate + energyLevel * 0.005)) * 0.5 + 0.5;
                rune.scale.set(
                    (0.7 + i * 0.1) * (1 + energyPulse * energyLevel * 0.5),
                    (0.5 + i * 0.1) * (1 + energyPulse * energyLevel * 0.5),
                    1
                );
            } else {
                // Reset color and scale when not charged
                rune.material.color.setHSL(0.75, 0.8, 0.5);
                rune.scale.set(0.7 + i * 0.1, 0.5 + i * 0.1, 1);
            }
        }
    }
    
    // Handle blade/handle animations
    // Get the blade (third child)
    const blade = scythe.children[2];
    if (blade) {
        // Subtle movement for idle animation
        blade.rotation.y = Math.sin(Date.now() * 0.0015) * 0.02;
    }
}

// Create dimensional rift effect
function createDimensionalRift(position, direction) {
    // Create group to hold all rift components
    const riftGroup = new THREE.Group();
    
    // Vertical tear in space (main rift)
    const riftGeometry = new THREE.PlaneGeometry(6, 8, 20, 20);
    
    // Distort the geometry to look like a jagged tear
    const positions = riftGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        // Skip vertices at the exact edges to maintain the overall shape
        if (i % 6 !== 0) {
            // Add random displacement to vertices
            positions[i] += (Math.random() - 0.5) * 0.4; // X jitter
            positions[i + 1] += (Math.random() - 0.5) * 0.4; // Y jitter
        }
    }
    riftGeometry.computeVertexNormals();
    
    const riftMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000, // Black base
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    
    const rift = new THREE.Mesh(riftGeometry, riftMaterial);
    riftGroup.add(rift);
    
    // Glowing edge effect
    const edgeGeometry = new THREE.PlaneGeometry(6.2, 8.2, 20, 20);
    // Apply similar distortion to the edge
    const edgePositions = edgeGeometry.attributes.position.array;
    for (let i = 0; i < edgePositions.length; i += 3) {
        if (i % 6 !== 0) {
            edgePositions[i] += (Math.random() - 0.5) * 0.4;
            edgePositions[i + 1] += (Math.random() - 0.5) * 0.4;
        }
    }
    edgeGeometry.computeVertexNormals();
    
    const edgeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8A2BE2, // Purple glow
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    // Position slightly behind the main rift
    edge.position.z = -0.05;
    riftGroup.add(edge);
    
    // Inner rift swirl effect using particles
    const particleCount = 300;
    for (let i = 0; i < particleCount; i++) {
        // Vary particle size
        const size = 0.05 + Math.random() * 0.2;
        
        // Different shapes for more organic look
        let geometry;
        const shapeType = Math.floor(Math.random() * 3);
        
        if (shapeType === 0) {
            geometry = new THREE.BoxGeometry(size, size, size * 0.1);
        } else if (shapeType === 1) {
            geometry = new THREE.CircleGeometry(size, 5);
        } else {
            geometry = new THREE.TetrahedronGeometry(size);
        }
        
        // Different colors: dark purples, blues, and black
        const colorType = Math.floor(Math.random() * 3);
        let color;
        
        if (colorType === 0) {
            color = 0x8A2BE2; // Purple
        } else if (colorType === 1) {
            color = 0x000000; // Black
        } else {
            color = 0x4B0082; // Indigo
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.7,
            side: THREE.DoubleSide
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position particles within the rift area
        // Use spiral formation for swirling effect
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2.5;
        const xPos = Math.cos(angle) * radius;
        const yPos = Math.sin(angle) * radius;
        const zPos = (Math.random() - 0.5) * 0.2;
        
        particle.position.set(xPos, yPos, zPos);
        
        // Random rotation for varied appearance
        particle.rotation.x = Math.random() * Math.PI * 2;
        particle.rotation.y = Math.random() * Math.PI * 2;
        particle.rotation.z = Math.random() * Math.PI * 2;
        
        // Add particle to rift
        riftGroup.add(particle);
        
        // Add properties for animation
        particle.userData = {
            originalPos: new THREE.Vector3(xPos, yPos, zPos),
            angle: angle,
            radius: radius,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            orbitSpeed: 0.001 + Math.random() * 0.003,
            pulseSpeed: 0.005 + Math.random() * 0.01
        };
    }
    
    // Add gravitational pull particles that orbit outside the rift
    const attractorCount = 50;
    for (let i = 0; i < attractorCount; i++) {
        const size = 0.1 + Math.random() * 0.3;
        const geometry = new THREE.BoxGeometry(size * 3, size * 0.5, size * 0.2);
        
        // Streaking effect with elongated particles
        const material = new THREE.MeshBasicMaterial({
            color: 0x8A2BE2, // Purple
            transparent: true,
            opacity: 0.3 + Math.random() * 0.4
        });
        
        const attractor = new THREE.Mesh(geometry, material);
        
        // Position in wider radius around the rift
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 4; // Further out
        const xPos = Math.cos(angle) * radius;
        const yPos = Math.sin(angle) * radius;
        
        attractor.position.set(xPos, yPos, (Math.random() - 0.5) * 0.5);
        
        // Point toward center to create "being pulled in" effect
        attractor.lookAt(0, 0, 0);
        
        // Add to group
        riftGroup.add(attractor);
        
        // Add properties for animation
        attractor.userData = {
            angle: angle,
            radius: radius,
            orbitSpeed: 0.01 + Math.random() * 0.02,
            accelerateRate: 0.001 + Math.random() * 0.002,
            originalScale: attractor.scale.clone()
        };
    }
    
    // Position and orient the rift
    riftGroup.position.copy(position);
    
    // Orient in the direction
    const lookAt = position.clone().add(direction);
    riftGroup.lookAt(lookAt);
    
    // Add to scene
    scene.add(riftGroup);
    
    // Animation and lifecycle properties
    riftGroup.userData = {
        createTime: Date.now(),
        lifeTime: 10.0, // 10 seconds duration
        openingDuration: 2.0, // 2 seconds to fully open
        closingDuration: 2.0, // 2 seconds to close
        state: "opening", // "opening", "open", "closing", "closed"
        pullForce: 0.05, // Force to pull enemies
        pullRadius: 10, // How far the pull affects enemies
        damagePerSecond: 20, // Damage per second to enemies in the rift
        lastDamageTime: Date.now(),
        damageInterval: 250, // ms between damage ticks
        hitObjects: new Set() // Track hit objects
    };
    
    // Custom update function
    riftGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000; // Age in seconds
        
        // Check if lifetime is over
        if (age >= this.userData.lifeTime) {
            return false; // Remove from scene
        }
        
        // Handle different states
        if (this.userData.state === "opening" && age < this.userData.openingDuration) {
            // Opening animation
            const openingProgress = age / this.userData.openingDuration;
            
            // Scale the rift from 0 to full size
            this.scale.set(
                openingProgress, 
                openingProgress, 
                openingProgress
            );
            
            // Increase opacity as it opens
            this.children[0].material.opacity = 0.9 * openingProgress;
            this.children[1].material.opacity = 0.6 * openingProgress;
            
            // Start with heavy distortion that settles
            if (age % 0.2 < 0.1) {
                createScreenShake(0.05 * (1 - openingProgress), 0.9);
            }
            
        } else if (this.userData.state === "opening" && age >= this.userData.openingDuration) {
            // Transition to open state
            this.userData.state = "open";
        } else if (this.userData.state === "open" && age < this.userData.lifeTime - this.userData.closingDuration) {
            // Fully open rift
            
            // Animate inner particles
            for (let i = 2; i < 2 + 300; i++) { // 2 is offset for the rift planes
                const particle = this.children[i];
                if (!particle || !particle.userData) continue;
                
                // Swirling motion
                particle.userData.angle += particle.userData.orbitSpeed;
                const newX = Math.cos(particle.userData.angle) * particle.userData.radius;
                const newY = Math.sin(particle.userData.angle) * particle.userData.radius;
                
                particle.position.set(
                    newX,
                    newY,
                    particle.userData.originalPos.z + Math.sin(now * 0.001) * 0.1
                );
                
                // Rotate particles
                particle.rotation.x += particle.userData.rotationSpeed;
                particle.rotation.y += particle.userData.rotationSpeed;
                
                // Pulsing effect
                const pulse = Math.sin(now * particle.userData.pulseSpeed) * 0.2 + 0.8;
                particle.scale.set(pulse, pulse, pulse);
            }
            
            // Animate attractor particles
            for (let i = 2 + 300; i < this.children.length; i++) {
                const attractor = this.children[i];
                if (!attractor || !attractor.userData) continue;
                
                // Orbit and accelerate toward the center
                attractor.userData.angle += attractor.userData.orbitSpeed;
                attractor.userData.radius = Math.max(0.5, attractor.userData.radius - attractor.userData.accelerateRate);
                
                const newX = Math.cos(attractor.userData.angle) * attractor.userData.radius;
                const newY = Math.sin(attractor.userData.angle) * attractor.userData.radius;
                
                attractor.position.set(newX, newY, attractor.position.z);
                
                // Point toward center
                attractor.lookAt(0, 0, 0);
                
                // Stretching effect as they approach the center
                const stretchFactor = 1 + (3 / attractor.userData.radius);
                attractor.scale.set(
                    attractor.userData.originalScale.x * stretchFactor,
                    attractor.userData.originalScale.y,
                    attractor.userData.originalScale.z
                );
                
                // If it gets too close to the center, reset to outer orbit
                if (attractor.userData.radius < 1) {
                    attractor.userData.radius = 3 + Math.random() * 4;
                    attractor.userData.angle = Math.random() * Math.PI * 2;
                    
                    // Reset position
                    const newX = Math.cos(attractor.userData.angle) * attractor.userData.radius;
                    const newY = Math.sin(attractor.userData.angle) * attractor.userData.radius;
                    attractor.position.set(newX, newY, (Math.random() - 0.5) * 0.5);
                    
                    // Reset scale
                    attractor.scale.copy(attractor.userData.originalScale);
                    
                    // Fade out and in for smoother transition
                    attractor.material.opacity = 0;
                    setTimeout(() => {
                        if (attractor.material) {
                            attractor.material.opacity = 0.3 + Math.random() * 0.4;
                        }
                    }, 100);
                }
            }
            
            // Edge animation
            const edge = this.children[1];
            if (edge) {
                const pulseIntensity = Math.sin(now * 0.002) * 0.3 + 0.7;
                edge.material.opacity = 0.6 * pulseIntensity;
                
                // Slight scale pulsing for the edge
                const edgeScale = 1 + Math.sin(now * 0.001) * 0.02;
                edge.scale.set(edgeScale, edgeScale, 1);
            }
            
            // Pull and damage nearby enemies
            this.pullEnemies();
            this.damageEnemiesInRift(now);
            
        } else if (this.userData.state === "open" && age >= this.userData.lifeTime - this.userData.closingDuration) {
            // Transition to closing state
            this.userData.state = "closing";
        } else if (this.userData.state === "closing") {
            // Closing animation
            const closingProgress = (this.userData.lifeTime - age) / this.userData.closingDuration;
            
            // Scale down as it closes
            this.scale.set(
                closingProgress, 
                closingProgress, 
                closingProgress
            );
            
            // Fade out
            this.children[0].material.opacity = 0.9 * closingProgress;
            this.children[1].material.opacity = 0.6 * closingProgress;
            
            // Final distortion effects as it closes
            if (age % 0.2 < 0.1) {
                createScreenShake(0.03 * (1 - closingProgress), 0.9);
            }
        }
        
        return true; // Continue animation
    };
    
    // Method to pull enemies toward the rift
    riftGroup.pullEnemies = function() {
        // Get all enemies
        for (let i = 0; i < cubes.length; i++) {
            const enemy = cubes[i];
            
            // Calculate distance to rift
            const distance = enemy.position.distanceTo(this.position);
            
            // Apply pull force if within radius
            if (distance < this.userData.pullRadius) {
                // Create direction vector toward rift
                const pullDirection = new THREE.Vector3().subVectors(this.position, enemy.position).normalize();
                
                // Pull force decreases with distance
                const pullStrength = this.userData.pullForce * (1 - distance / this.userData.pullRadius);
                
                // Apply movement
                enemy.position.add(pullDirection.multiplyScalar(pullStrength));
                
                // Add visual feedback - stretching toward rift
                if (enemy.scale.z !== 1.5) {
                    enemy.userData.originalScale = enemy.scale.clone();
                    
                    // Stretch in the direction of the rift
                    const stretchAxis = new THREE.Vector3().subVectors(this.position, enemy.position).normalize();
                    enemy.lookAt(this.position);
                    enemy.scale.z = 1.5;
                }
            } else if (enemy.userData && enemy.userData.originalScale) {
                // Reset scale when out of range
                enemy.scale.copy(enemy.userData.originalScale);
            }
        }
    };
    
    // Method to damage enemies in the rift
    riftGroup.damageEnemiesInRift = function(now) {
        // Check if it's time to deal damage
        if (now - this.userData.lastDamageTime < this.userData.damageInterval) {
            return;
        }
        
        // Update last damage time
        this.userData.lastDamageTime = now;
        
        // Get damage amount for this tick (damage per second converted to damage per tick)
        const damageTick = this.userData.damagePerSecond * (this.userData.damageInterval / 1000);
        
        // Check all enemies
        for (let i = cubes.length - 1; i >= 0; i--) {
            const enemy = cubes[i];
            
            // Calculate distance to rift center
            const distance = enemy.position.distanceTo(this.position);
            
            // Enemies very close to the center take damage
            if (distance < 1.5) {
                // Create destruction effect
                createRiftDestructionEffect(enemy.position, enemy.material.color);
                
                // Remove the enemy
                scene.remove(enemy);
                cubes.splice(i, 1);
            }
        }
    };
    
    // Add to active fragments for animation
    activeFragments.push(riftGroup);
    
    return riftGroup;
}

// Create special destruction effect for rifts
function createRiftDestructionEffect(position, originalColor) {
    // Create effect group
    const effectGroup = new THREE.Group();
    
    // Color distortion effect
    const distortionGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const distortionMaterial = new THREE.MeshBasicMaterial({
        color: 0x8A2BE2, // Purple
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    
    const distortion = new THREE.Mesh(distortionGeometry, distortionMaterial);
    effectGroup.add(distortion);
    
    // Create cube fragments that get pulled into the rift
    const fragmentCount = 8;
    
    for (let i = 0; i < fragmentCount; i++) {
        // Create fragment with original cube color
        const fragmentGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: originalColor,
            transparent: true,
            opacity: 0.9
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Position around the center
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.3;
        
        fragment.position.set(
            position.x + Math.cos(angle) * radius,
            position.y + Math.sin(angle) * radius,
            position.z
        );
        
        // Add motion data
        fragment.userData = {
            angle: angle,
            radius: radius,
            shrinkRate: 0.02 + Math.random() * 0.03,
            rotationSpeed: Math.random() * 0.2
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
        
        // Distortion effect grows then shrinks
        const distortionSize = 0.5 + Math.sin(age * Math.PI) * 1.0;
        this.children[0].scale.set(distortionSize, distortionSize, distortionSize);
        this.children[0].material.opacity = 0.7 * (1 - age / this.userData.lifeTime);
        
        // Rotate distortion for more dynamic effect
        this.children[0].rotation.x += 0.05;
        this.children[0].rotation.y += 0.05;
        
        // Animate fragments getting pulled into a spiral
        for (let i = 1; i < this.children.length; i++) {
            const fragment = this.children[i];
            
            // Spiral inward
            fragment.userData.radius = Math.max(0.05, fragment.userData.radius - fragment.userData.shrinkRate);
            fragment.userData.angle += 0.1 + (0.2 / fragment.userData.radius); // Rotate faster as it gets closer
            
            // Update position
            fragment.position.set(
                this.position.x + Math.cos(fragment.userData.angle) * fragment.userData.radius,
                this.position.y + Math.sin(fragment.userData.angle) * fragment.userData.radius,
                this.position.z
            );
            
            // Rotate fragment
            fragment.rotation.x += fragment.userData.rotationSpeed;
            fragment.rotation.y += fragment.userData.rotationSpeed;
            
            // Shrink as it approaches the center
            const shrinkFactor = fragment.userData.radius / 0.3;
            fragment.scale.set(shrinkFactor, shrinkFactor, shrinkFactor);
            
            // Fade out at the center
            fragment.material.opacity = 0.9 * shrinkFactor;
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(effectGroup);
    
    return effectGroup;
}

// Update Dimensional Rift special animation
function updateDimensionalRiftAnimation(specialProgress, scythe, controls, playerPosition, cameraDirection) {
    // Phases:
    // 1. Preparation (0-0.3) - Scythe gathering energy
    // 2. Slice (0.3-0.5) - Cutting open the rift
    // 3. Aftermath (0.5-1.0) - Rift is open and player returns to normal stance
    
    // Phase 1: Preparation - Scythe gathering energy
    if (specialProgress < 0.3) {
        const phaseProgress = specialProgress / 0.3;
        
        // Raise scythe overhead
        scythe.position.set(
            0.0, // Center
            -0.3 + phaseProgress * 1.1, // Raise higher
            -0.6 + phaseProgress * 0.2 // Slightly forward
        );
        
        // Rotate to overhead position
        scythe.rotation.x = Math.PI / 6 + phaseProgress * (Math.PI / 2); // More vertical
        scythe.rotation.z = -Math.PI / 8 + phaseProgress * (Math.PI / 8); // Straighten
        
        // Gather rift energy
        scythe.userData.riftEnergy = phaseProgress * 100;
        
        // Add energy build-up particles
        if (Math.random() > 0.8) {
            createRiftEnergyParticle(scythe);
        }
        
        // Screen distortion intensifies
        if (phaseProgress > 0.5 && Math.random() > 0.8) {
            createScreenShake(0.02 * (phaseProgress - 0.5), 0.9);
        }
    }
    // Phase 2: Slice - Cutting open the rift
    else if (specialProgress < 0.5) {
        const phaseProgress = (specialProgress - 0.3) / 0.2;
        
        // Slicing motion
        scythe.position.set(
            0.0, // Center
            0.8 - phaseProgress * 1.2, // Downward slice
            -0.4 // Same distance
        );
        
        // Rotate during slice
        scythe.rotation.x = Math.PI / 6 + Math.PI / 2 - phaseProgress * Math.PI; // Rotate down
        scythe.rotation.y = phaseProgress * (Math.PI / 4); // Twist slightly
        
        // Maximum energy at the moment of slice
        scythe.userData.riftEnergy = 100;
        
        // Create the dimensional rift at the key moment
        if (specialProgress > 0.4 && specialProgress < 0.41) {
            // Position in front of the player
            const riftPosition = playerPosition.clone().add(
                cameraDirection.clone().multiplyScalar(5) // 5 units in front
            );
            
            // Create the rift
            createDimensionalRift(riftPosition, cameraDirection);
            
            // Heavy screen shake
            createScreenShake(0.2, 0.85);
        }
    }
    // Phase 3: Aftermath - Rift is open and player returns to normal stance
    else {
        const phaseProgress = (specialProgress - 0.5) / 0.5;
        
        // Return to normal position
        scythe.position.set(
            0.4 * phaseProgress, // Back to side
            -0.3 * phaseProgress, // Back down
            -0.6 // Normal distance
        );
        
        // Rotate back to normal
        scythe.rotation.x = Math.PI / 6 * phaseProgress + Math.PI / 2 * (1 - phaseProgress);
        scythe.rotation.z = -Math.PI / 8 * phaseProgress;
        scythe.rotation.y = Math.PI / 4 * (1 - phaseProgress);
        
        // Energy fades
        scythe.userData.riftEnergy = 100 * (1 - phaseProgress);
    }
}

// Create energy particle during rift charging
function createRiftEnergyParticle(scythe) {
    // Get position of the blade
    const bladePosition = new THREE.Vector3();
    scythe.children[2].getWorldPosition(bladePosition);
    
    // Create particle
    const particleSize = 0.05 + Math.random() * 0.1;
    const particleGeometry = new THREE.SphereGeometry(particleSize, 6, 6);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x8A2BE2, // Purple
        transparent: true,
        opacity: 0.7
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Random position around the blade
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.5;
    
    // Position around the blade
    particle.position.set(
        bladePosition.x + Math.cos(angle) * radius,
        bladePosition.y + Math.sin(angle) * radius,
        bladePosition.z + (Math.random() - 0.5) * 0.3
    );
    
    // Add to scene
    scene.add(particle);
    
    // Setup for animation
    particle.userData = {
        targetPos: bladePosition,
        speed: 0.05 + Math.random() * 0.1,
        createTime: Date.now(),
        lifeTime: 0.5 + Math.random() * 0.5, // 0.5-1.0 seconds
        rotationSpeed: Math.random() * 0.2
    };
    
    // Custom update function
    particle.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Remove particle
        }
        
        // Move toward the blade
        const direction = new THREE.Vector3().subVectors(this.userData.targetPos, this.position).normalize();
        this.position.add(direction.multiplyScalar(this.userData.speed));
        
        // Rotate particle
        this.rotation.x += this.userData.rotationSpeed;
        this.rotation.y += this.userData.rotationSpeed;
        
        // Fade out as it approaches the target
        const distanceToTarget = this.position.distanceTo(this.userData.targetPos);
        if (distanceToTarget < 0.5) {
            this.material.opacity = 0.7 * (distanceToTarget / 0.5);
        }
        
        // Shrink as it approaches
        const scaleFactor = Math.min(1, distanceToTarget / 0.5);
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        return true; // Continue animation
    };
    
    // Add to active fragments for animation
    activeFragments.push(particle);
    
    return particle;
}

// Start the Dimensional Rift special - FIXED using callback approach
function startDimensionalRiftSpecial(controls, onSpecialActivated) {
    // Disable controls immediately
    controls.enabled = false;
    
    // Show the rift cutscene
    showRiftCutScene(() => {
        // Call the callback function from weapon.js to handle variable updates
        if (onSpecialActivated) onSpecialActivated();
        
        // Re-enable controls after a short delay
        setTimeout(() => {
            controls.enabled = true;
        }, 1000);
    });
}

export {
    createScythe,
    animateScythe,
    createDimensionalRift,
    updateDimensionalRiftAnimation,
    startDimensionalRiftSpecial
};