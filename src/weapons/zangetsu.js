// Zangetsu weapon implementation - A massive cleaver-like weapon that can fire a golden Ju Jisho energy attack

import { scene, camera } from '../core/scene.js';
import { createScreenShake } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';

// Create Zangetsu weapon
function createZangetsu(camera) {
    // Group for the Zangetsu
    const zangetsu = new THREE.Group();
    
    // Handle - longer than other weapons
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 32);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 }); // Dark gray
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    
    // Blade - cleaver-like design
    const bladeGeometry = new THREE.BoxGeometry(0.06, 0.7, 0.01);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA }); // Silver gray
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.5; // Above the handle
    
    // Add wrapping around the handle
    const wrappingGeometry = new THREE.CylinderGeometry(0.022, 0.022, 0.3, 16);
    const wrappingMaterial = new THREE.MeshBasicMaterial({ color: 0x880000 }); // Dark red
    const wrapping = new THREE.Mesh(wrappingGeometry, wrappingMaterial);
    
    // Chain at the end of the handle
    const chainLinkCount = 5;
    const chainLinks = new THREE.Group();
    
    for (let i = 0; i < chainLinkCount; i++) {
        const linkGeometry = new THREE.TorusGeometry(0.02, 0.005, 8, 16);
        const linkMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        const link = new THREE.Mesh(linkGeometry, linkMaterial);
        
        // Position each link below the handle with appropriate spacing
        link.position.y = -0.2 - (i * 0.04);
        
        // Alternate the rotation to make them look like chain links
        if (i % 2 === 0) {
            link.rotation.x = Math.PI / 2;
        } else {
            link.rotation.y = Math.PI / 2;
        }
        
        chainLinks.add(link);
    }
    
    // Add all parts to Zangetsu
    zangetsu.add(handle);
    zangetsu.add(blade);
    zangetsu.add(wrapping);
    zangetsu.add(chainLinks);
    
    // Position the weapon
    zangetsu.position.set(0.3, -0.2, -0.5);
    zangetsu.rotation.x = Math.PI / 6;
    zangetsu.rotation.z = -Math.PI / 8;
    
    // Add to camera
    camera.add(zangetsu);
    
    // Hide by default
    zangetsu.visible = false;
    
    return zangetsu;
}

// Create Ju Jisho energy blast - X-shaped with a ball in the middle
function createJuJisho(position, direction, color = 0xFFD700) { // Gold color
    // Gruppe für den gesamten Ju Jisho-Effekt
    const juJishoGroup = new THREE.Group();
    
    // Zentraler Energieball - VERGRÖSSERT
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16); // Von 0.3 auf 0.5 vergrößert
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700, // Gold
        transparent: true,
        opacity: 0.9
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    juJishoGroup.add(core);
    
    // X-förmige Energiestrahlen erstellen - VERGRÖSSERT
    const beamLength = 5.0; // Von 1.8 auf 3.0 vergrößert
    const beamWidth = 0.5;  // Von 0.15 auf 0.25 vergrößert
    
    // Energiestrahl 1 (von links oben nach rechts unten)
    const beam1Geometry = new THREE.BoxGeometry(beamWidth, beamWidth, beamLength);
    const beam1Material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    
    const beam1 = new THREE.Mesh(beam1Geometry, beam1Material);
    beam1.rotation.y = Math.PI / 4; // 45 Grad Drehung
    beam1.rotation.x = Math.PI / 4; // 45 Grad nach unten/oben
    juJishoGroup.add(beam1);
    
    // Energiestrahl 2 (von links unten nach rechts oben)
    const beam2Geometry = new THREE.BoxGeometry(beamWidth, beamWidth, beamLength);
    const beam2Material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    
    const beam2 = new THREE.Mesh(beam2Geometry, beam2Material);
    beam2.rotation.y = Math.PI / 4; // 45 Grad Drehung
    beam2.rotation.x = -Math.PI / 4; // -45 Grad nach oben/unten (entgegengesetzt zu beam1)
    juJishoGroup.add(beam2);
    
    // Zusätzliche "Spitzen" am Ende jedes Strahls für besseres X-Aussehen - VERGRÖSSERT
    const tipSize = 0; // Von 0.25 auf 0.4 vergrößert
    // Positionen der Spitzen - VERGRÖSSERT
    const tipPositions = [
        new THREE.Vector3(1.5, 1.5, 0),   // Oben rechts
        new THREE.Vector3(-1.5, -1.5, 0), // Unten links
        new THREE.Vector3(-1.5, 1.5, 0),  // Oben links
        new THREE.Vector3(1.5, -1.5, 0)   // Unten rechts
    ];
    
    for (let i = 0; i < tipPositions.length; i++) {
        const tipGeometry = new THREE.ConeGeometry(tipSize, tipSize * 2, 8);
        const tipMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        
        // Position setzen
        tip.position.copy(tipPositions[i]);
        
        // Ausrichtung anpassen
        if (i < 2) {
            // Die ersten beiden Tipps für beam1
            tip.lookAt(new THREE.Vector3(
                -tipPositions[i].x * 2,
                -tipPositions[i].y * 2,
                0
            ));
        } else {
            // Die letzten beiden Tipps für beam2
            tip.lookAt(new THREE.Vector3(
                -tipPositions[i].x * 2,
                -tipPositions[i].y * 2,
                0
            ));
        }
        
        juJishoGroup.add(tip);
    }
    
    // Äußeren Glüheffekt hinzufügen - VERGRÖSSERT
    const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16); // Von 0.5 auf 0.8 vergrößert
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF, // Weißes Glühen
        transparent: true,
        opacity: 0.3
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    juJishoGroup.add(glow);
    
    // Position and orient the Ju Jisho
    juJishoGroup.position.copy(position);
    
    // Die gesamte Gruppe so ausrichten, dass sie in Bewegungsrichtung zeigt
    const lookTarget = new THREE.Vector3().copy(position).add(direction);
    juJishoGroup.lookAt(lookTarget);
    
    // Um sicherzustellen, dass das X flach vor dem Spieler erscheint und nicht seitlich
    juJishoGroup.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
    
    // Add to scene
    scene.add(juJishoGroup);
    
    // Add animation properties
    juJishoGroup.userData = {
        velocity: direction.clone().multiplyScalar(0.7), // Schnelle Vorwärtsbewegung
        rotationSpeed: 0, // Auf 0 gesetzt, damit keine Rotation stattfindet
        lifeTime: 3.0, // Lebensdauer in Sekunden
        createTime: Date.now(),
        trailInterval: 120, // Zeit zwischen Trail-Effekten in ms
        lastTrailTime: Date.now(),
        hitObjects: new Set(), // Bereits getroffene Objekte
    };
    
    // Custom update function for the Ju Jisho
    juJishoGroup.update = function(now) {
        // Check if lifetime is over
        const age = (now - this.userData.createTime) / 1000;
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Move based on velocity
        this.position.add(this.userData.velocity);
        
        // ROTATION ENTFERNT - Keine Drehung mehr
        
        // Pulsate the core
        const pulse = 1.0 + Math.sin(now * 0.01) * 0.2;
        this.children[0].scale.set(pulse, pulse, pulse);
        
        // Add trailing effect
        if (now - this.userData.lastTrailTime > this.userData.trailInterval) {
            this.userData.lastTrailTime = now;
            
            // Create trail effect
            createJuJishoTrail(this.position.clone(), this.rotation.clone(), color);
        }
        
        // Check for collisions with cubes
        checkJuJishoCollisions(this);
        
        // Scale up slightly over time for dramatic effect
        const growFactor = 1.0 + age * 0.1;
        this.scale.set(growFactor, growFactor, growFactor);
        
        // Fade out slightly near the end of lifespan
        if (age > this.userData.lifeTime * 0.7) {
            const fadeProgress = (age - this.userData.lifeTime * 0.7) / (this.userData.lifeTime * 0.3);
            this.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = Math.max(0, child.material.opacity - fadeProgress * 0.02);
                }
            });
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(juJishoGroup);
    
    return juJishoGroup;
}

// Create trail effect for the Ju Jisho
function createJuJishoTrail(position, rotation, color) {
    const trailGroup = new THREE.Group();
    
    // Vereinfachte X-Form für den Trail
    const trailCoreGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const trailCoreMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3
    });
    
    const trailCore = new THREE.Mesh(trailCoreGeometry, trailCoreMaterial);
    trailGroup.add(trailCore);
    
    // Vereinfachte X-Strahlen
    const trailBeamGeometry = new THREE.BoxGeometry(0.1, 0.1, 1.2);
    
    // Erster Strahl
    const trailBeam1 = new THREE.Mesh(
        trailBeamGeometry,
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2
        })
    );
    trailBeam1.rotation.y = Math.PI / 4;
    trailBeam1.rotation.x = Math.PI / 4;
    trailGroup.add(trailBeam1);
    
    // Zweiter Strahl
    const trailBeam2 = new THREE.Mesh(
        trailBeamGeometry,
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2
        })
    );
    trailBeam2.rotation.y = Math.PI / 4;
    trailBeam2.rotation.x = -Math.PI / 4;
    trailGroup.add(trailBeam2);
    
    // Copy position and rotation
    trailGroup.position.copy(position);
    trailGroup.rotation.copy(rotation);
    
    // Add to scene
    scene.add(trailGroup);
    
    // Setup the trail for fading
    trailGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.4, // Short lifetime
        velocity: new THREE.Vector3(0, 0, 0), // Static trail
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update function for fading out
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

// Check collisions between Ju Jisho and cubes
function checkJuJishoCollisions(juJisho) {
    // Check each cube
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Skip cubes that have already been hit by this juJisho
        if (juJisho.userData.hitObjects.has(cube.id)) {
            continue;
        }
        
        // Calculate distance (using rough approximation for performance)
        const distance = juJisho.position.distanceTo(cube.position);
        
        // If close enough, count as a hit - VERGRÖSSERTER RADIUS
        const hitRadius = 2.0; // Von 1.2 auf 2.0 erhöht
        if (distance < hitRadius) {
            // Mark as hit to avoid multiple hits
            juJisho.userData.hitObjects.add(cube.id);
            
            // Create destruction effect for the cube
            createDestroyEffect(cube.position, cube.material.color);
            
            // Remove the cube
            scene.remove(cube);
            cubes.splice(i, 1);
            
            // Create impact flash at the position
            createJuJishoImpact(cube.position, 0xFFD700);
        }
    }
}

// Create impact effect when Ju Jisho hits a target
function createJuJishoImpact(position, color) {
    // Impact group
    const impactGroup = new THREE.Group();
    
    // Central explosion
    const explosionGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF, // Bright center
        transparent: true,
        opacity: 0.8
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    impactGroup.add(explosion);
    
    // Add X-shaped energy rays shooting outward
    const rayCount = 8; // 4 rays forming X, plus 4 more for fuller effect
    
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const length = 0.8 + Math.random() * 0.6;
        
        const rayGeometry = new THREE.BoxGeometry(0.1, 0.1, length);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        
        // Position ray to start at center and point outward
        ray.position.set(
            Math.cos(angle) * (length / 2),
            Math.sin(angle) * (length / 2),
            0
        );
        
        // Rotate to point outward
        ray.rotation.z = angle;
        
        impactGroup.add(ray);
    }
    
    // Position at impact point
    impactGroup.position.copy(position);
    
    // Add to scene
    scene.add(impactGroup);
    
    // Setup animation properties
    impactGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.5, // Half-second effect
        velocity: new THREE.Vector3(0, 0, 0),
        affectedByGravity: false
    };
    
    // Custom update function
    impactGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Expand rays outward
        const expandFactor = 1.0 + age * 5.0;
        
        // Explosion grows quickly then fades
        this.children[0].scale.set(expandFactor, expandFactor, expandFactor);
        this.children[0].material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        
        // Rays grow and fade
        for (let i = 1; i < this.children.length; i++) {
            const ray = this.children[i];
            ray.scale.x = 1.0 + age * 2.0;
            ray.scale.y = 1.0 + age * 2.0;
            ray.scale.z = expandFactor;
            
            // Update position to maintain connection to center
            const angle = ray.rotation.z;
            const newDist = (ray.geometry.parameters.depth * expandFactor) / 2;
            ray.position.set(
                Math.cos(angle) * newDist,
                Math.sin(angle) * newDist,
                0
            );
            
            ray.material.opacity = 0.7 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(impactGroup);
    
    // Create screen shake
    createScreenShake(0.05, 0.9);
    
    return impactGroup;
}

// Create charging effect for Ju Jisho
function createJuJishoChargingEffect(position, color) {
    // Create a group for the charging effect
    const chargingGroup = new THREE.Group();
    
    // Central orb
    const orbGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
    });
    
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    chargingGroup.add(orb);
    
    // Energy gathering particles
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle
        const particleSize = 0.05 + Math.random() * 0.1;
        const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position around the center
        const radius = 1.5 + Math.random() * 2.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.set(
            position.x + radius * Math.sin(phi) * Math.cos(theta),
            position.y + radius * Math.sin(phi) * Math.sin(theta),
            position.z + radius * Math.cos(phi)
        );
        
        // Add to group
        chargingGroup.add(particle);
        
        // Add movement data
        particle.userData = {
            startPosition: particle.position.clone(),
            speed: 0.05 + Math.random() * 0.1,
            targetPosition: position.clone(),
            startTime: Date.now(),
            delay: Math.random() * 300 // Staggered start
        };
    }
    
    // Add energy rings that pulse outward
    const ringCount = 3;
    
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 24);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFA500,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        
        // Rotate to face random direction
        ring.rotation.x = Math.random() * Math.PI * 2;
        ring.rotation.y = Math.random() * Math.PI * 2;
        
        chargingGroup.add(ring);
        
        // Add animation data
        ring.userData = {
            startDelay: i * 300, // Staggered start
            expansionRate: 0.15,
            maxSize: 2.5,
            currentSize: 0.1
        };
    }
    
    // Position the group
    chargingGroup.position.copy(position);
    
    // Add to scene
    scene.add(chargingGroup);
    
    // Setup animation
    chargingGroup.userData = {
        createTime: Date.now(),
        lifeTime: 1.5, // seconds
        targetPosition: position.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        affectedByGravity: false
    };
    
    // Custom update function for the charging effect
    chargingGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Pulse the central orb
        const orbPulse = 1.0 + Math.sin(now * 0.01) * 0.3;
        this.children[0].scale.set(orbPulse, orbPulse, orbPulse);
        
        // Change orb color gradually
        const colorProgress = age / this.userData.lifeTime;
        const orbColor = new THREE.Color().setHSL(
            0.14, // Gold hue
            0.9,
            0.5 + colorProgress * 0.3 // Increasing lightness
        );
        this.children[0].material.color.copy(orbColor);
        
        // Update each particle
        for (let i = 1; i < this.children.length - 3; i++) { // Skip the orb and rings
            const particle = this.children[i];
            
            // Wait for delay to start moving
            if (now - this.userData.createTime < particle.userData.delay) {
                continue;
            }
            
            // Calculate progress (0 to 1)
            const particleAge = now - (this.userData.createTime + particle.userData.delay);
            const particleProgress = Math.min(1.0, particleAge / (this.userData.lifeTime * 1000 - particle.userData.delay));
            
            // Move particle toward center with acceleration
            const easeInQuad = particleProgress * particleProgress;
            
            // Update position
            particle.position.lerpVectors(
                particle.userData.startPosition,
                this.userData.targetPosition,
                easeInQuad
            );
            
            // Shrink particle as it approaches center
            const scale = 1.0 - easeInQuad * 0.7;
            particle.scale.set(scale, scale, scale);
            
            // Increase opacity until midpoint, then decrease
            if (particleProgress < 0.5) {
                particle.material.opacity = 0.7 * (particleProgress * 2);
            } else {
                particle.material.opacity = 0.7 * (1 - (particleProgress - 0.5) * 2);
            }
        }
        
        // Update expanding rings
        for (let i = this.children.length - 3; i < this.children.length; i++) {
            const ring = this.children[i];
            
            // Wait for delay
            if (now - this.userData.createTime < ring.userData.startDelay) {
                continue;
            }
            
            // Calculate ring age
            const ringAge = now - (this.userData.createTime + ring.userData.startDelay);
            
            if (ringAge < 0) continue;
            
            // Expand the ring
            ring.userData.currentSize += ring.userData.expansionRate;
            
            if (ring.userData.currentSize <= ring.userData.maxSize) {
                ring.scale.set(
                    ring.userData.currentSize,
                    ring.userData.currentSize,
                    ring.userData.currentSize
                );
                
                // Fade in then out based on size
                const sizeFactor = ring.userData.currentSize / ring.userData.maxSize;
                if (sizeFactor < 0.2) {
                    // Fade in
                    ring.material.opacity = sizeFactor * 5 * 0.7;
                } else {
                    // Fade out
                    ring.material.opacity = 0.7 * (1 - (sizeFactor - 0.2) / 0.8);
                }
                
                // Rotate slightly
                ring.rotation.z += 0.02;
            } else {
                // Reset ring to start a new cycle
                ring.userData.currentSize = 0.1;
                ring.scale.set(0.1, 0.1, 0.1);
                ring.material.opacity = 0;
                
                // Rotate to a new random orientation
                ring.rotation.x = Math.random() * Math.PI * 2;
                ring.rotation.y = Math.random() * Math.PI * 2;
            }
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(chargingGroup);
    
    return chargingGroup;
}

// Update Zangetsu special animation for Ju Jisho
function updateJuJishoAnimation(specialProgress, zangetsu, controls, playerPosition, cameraDirection) {
    // Phases of the Ju Jisho special
    // Phase 1: Wind up (0-0.3) - Charge energy
    // Phase 2: Release (0.3-0.5) - Release the energy
    // Phase 3: Follow through (0.5-1.0) - Return to idle
    
    // Phase 1: Charge energy
    if (specialProgress < 0.3) {
        const phaseProgress = specialProgress / 0.3;
        
        // Move sword into charging position - raising up with both hands
        zangetsu.position.set(
            0.0, // Center position
            -0.2 + 0.7 * phaseProgress, // Raise higher than before
            -0.5 + 0.2 * phaseProgress // Slightly forward
        );
        
        // Rotate the sword to a vertical position
        zangetsu.rotation.x = Math.PI / 6 + (Math.PI / 2) * phaseProgress; // Point upward
        zangetsu.rotation.z = -Math.PI / 8 * (1 - phaseProgress); // Remove z rotation
        
        // Blade starts to glow with energy - golden for Ju Jisho
        const intensity = phaseProgress;
        zangetsu.children[1].material.color.setRGB(
            0.67 + intensity * 0.33, // Increase red
            0.67 + intensity * 0.33, // Increase green for gold
            0.67 - intensity * 0.37  // Decrease blue for gold
        );
        
        // Create energy charging effect at specific moments
        if (specialProgress > 0.1 && specialProgress < 0.11) {
            // Get blade position in world space
            const bladePos = new THREE.Vector3();
            zangetsu.children[1].getWorldPosition(bladePos);
            
            // Create charging effect
            createJuJishoChargingEffect(bladePos, 0xFFD700); // Gold color
        }
        
        // Screen shake intensifies as charge completes
        if (specialProgress > 0.25) {
            createScreenShake(0.01 + (specialProgress - 0.25) * 0.2, 0.9);
        }
    }
    // Phase 2: Release energy
    else if (specialProgress < 0.5) {
        const phaseProgress = (specialProgress - 0.3) / 0.2;
        
        // Sword thrusts forward for a powerful attack
        zangetsu.position.set(
            0.0, // Stay centered
            -0.2 + 0.7 - phaseProgress * 0.3, // Move down slightly
            -0.5 + 0.2 - phaseProgress * 0.2 // Thrust forward
        );
        
        // Rotate during the thrust
        zangetsu.rotation.x = Math.PI / 6 + Math.PI / 2 - phaseProgress * (Math.PI / 3);
        
        // Maximum glow at the moment of release
        const glowIntensity = 1.0 - phaseProgress * 0.5; // Fade from full glow
        zangetsu.children[1].material.color.setRGB(
            1.0,                         // Full red
            1.0,                         // Full green
            0.3 * (1 - glowIntensity)    // Low blue for golden color
        );
        
        // Create Ju Jisho at the moment of release
        if (specialProgress > 0.35 && specialProgress < 0.36) {
            // Get position well in front of the player to ensure it flies forward properly
            const juJishoPosition = playerPosition.clone().add(
                cameraDirection.clone().multiplyScalar(2.5) // 2.5 units in front instead of 1.5
            );
            
            // Create the Ju Jisho
            createJuJisho(juJishoPosition, cameraDirection);
            
            // More dramatic screen shake
            createScreenShake(0.2, 0.85);
        }
    }
    // Phase 3: Follow through and return to normal
    else {
        const phaseProgress = (specialProgress - 0.5) / 0.5;
        
        // Return sword to original position
        zangetsu.position.set(
            0.3 * phaseProgress, // Back to side position
            -0.2 + 0.4 * (1 - phaseProgress), // Back down
            -0.5 - 0.1 * (1 - phaseProgress) // Back to original distance
        );
        
        // Rotate back to normal
        zangetsu.rotation.x = Math.PI / 6 + (Math.PI / 4) * (1 - phaseProgress);
        zangetsu.rotation.z = -Math.PI / 8 * phaseProgress;
        
        // Fade glow back to normal
        zangetsu.children[1].material.color.setRGB(
            0.67 + (1.0 - 0.67) * (1 - phaseProgress),
            0.67 + (1.0 - 0.67) * (1 - phaseProgress),
            0.67
        );
    }
}

export {
    createZangetsu,
    updateJuJishoAnimation,
    createJuJisho
};