// Wand weapon implementation

import { scene, camera } from '../core/scene.js';
import { createMagicEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';

// Create a cool magic wand
function createWand(camera) {
    // Group for the wand
    const wand = new THREE.Group();
    
    // Base of the wand (handle)
    const handleGeometry = new THREE.CylinderGeometry(0.012, 0.018, 0.25, 8);
    const handleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3D0C02, // Dark wood brown
        wireframe: false 
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.x = Math.PI / 2; // Rotate to be horizontal
    
    // Decorations on the handle
    const ringGeometry = new THREE.TorusGeometry(0.02, 0.005, 8, 12);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xD4AF37 }); // Gold
    const ringBottom = new THREE.Mesh(ringGeometry, ringMaterial);
    ringBottom.position.z = 0.11;
    ringBottom.rotation.y = Math.PI / 2;
    
    const ringTop = ringBottom.clone();
    ringTop.position.z = -0.11;
    
    // Main part of the wand
    const mainGeometry = new THREE.CylinderGeometry(0.008, 0.012, 0.35, 8);
    const mainMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x1A0500, // Almost black
        wireframe: false 
    });
    const mainPart = new THREE.Mesh(mainGeometry, mainMaterial);
    mainPart.position.z = -0.3;
    mainPart.rotation.x = Math.PI / 2;
    
    // Tip of the wand with crystal
    const tipGeometry = new THREE.ConeGeometry(0.01, 0.04, 8);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0x3D0C02 });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.z = -0.5;
    tip.rotation.x = Math.PI / 2;
    
    // Glowing crystal at the tip
    const crystalGeometry = new THREE.IcosahedronGeometry(0.03, 0);
    const crystalMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00BFFF, // Light blue glowing
        transparent: true,
        opacity: 0.8
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.z = -0.53;
    
    // Add all parts to the wand
    wand.add(handle);
    wand.add(ringBottom);
    wand.add(ringTop);
    wand.add(mainPart);
    wand.add(tip);
    wand.add(crystal);
    
    // Adjust position and rotation of the wand
    wand.position.set(0.3, -0.2, -0.5);
    wand.rotation.y = Math.PI / 10;
    wand.rotation.z = -Math.PI / 8;
    
    // Add wand to camera
    camera.add(wand);
    
    // Hide by default
    wand.visible = false;
    
    return wand;
}

// Create the Arkanorb for the wand's special move
function createArkanorb() {
    // Group for the Arkanorb and its effects
    const orbGroup = new THREE.Group();
    
    // Core of the orb
    const orbCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x00BFFF, 
            transparent: true, 
            opacity: 0.8
        })
    );
    
    // Outer layer
    const orbOuterLayer = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x1E90FF, 
            transparent: true, 
            opacity: 0.4,
            wireframe: true
        })
    );
    
    // Rings around the orb
    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 8, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x87CEFA, 
            transparent: true, 
            opacity: 0.6
        })
    );
    
    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 8, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x87CEFA, 
            transparent: true, 
            opacity: 0.6
        })
    );
    
    // Align rings
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.z = Math.PI / 2;
    
    // Add everything to the orb
    orbGroup.add(orbCore);
    orbGroup.add(orbOuterLayer);
    orbGroup.add(ring1);
    orbGroup.add(ring2);
    
    // Calculate position in front of the player
    const playerDirection = new THREE.Vector3();
    camera.getWorldDirection(playerDirection);
    
    // Position the orb 2 units in front of the player and slightly higher than eye level
    const orbPosition = camera.position.clone().add(
        playerDirection.multiplyScalar(2).add(new THREE.Vector3(0, 0.5, 0))
    );
    
    orbGroup.position.copy(orbPosition);
    
    // Add to scene
    scene.add(orbGroup);
    
    // Special properties for animation
    orbGroup.userData = {
        rotationSpeed: 0.02,
        pulseSpeed: 0.005,
        lastAttackTime: 0,
        attackInterval: 500, // ms between attacks
        offsetY: 1.2,   // Higher position
        offsetZ: 2.5,   // Somewhat further forward
        offsetX: 1.0    // Offset to the right
    };
    
    return orbGroup;
}

// Remove the Arkanorb
function removeArkanorb(arkanorb) {
    if (arkanorb) {
        scene.remove(arkanorb);
    }
}

// Arkanorb attack function
function arkanorbAttack(arkanorb, cubes) {
    if (!arkanorb || cubes.length === 0) return;
    
    // Find the nearest cube
    let closestCube = null;
    let minDistance = Infinity;
    
    cubes.forEach(cube => {
        const distance = arkanorb.position.distanceTo(cube.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestCube = cube;
        }
    });
    
    // If a cube is nearby (maximum 15 units away)
    if (closestCube && minDistance < 15) {
        // Direction to the cube
        const direction = new THREE.Vector3();
        direction.subVectors(closestCube.position, arkanorb.position).normalize();
        
        // Create an energy beam
        const beamLength = Math.min(minDistance, 15);
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.01, beamLength, 8);
        beamGeometry.rotateX(Math.PI / 2);
        
        const beamMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF, 
            transparent: true, 
            opacity: 0.7
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        
        // Position and orientation of the beam
        beam.position.copy(arkanorb.position);
        beam.position.add(direction.clone().multiplyScalar(beamLength / 2));
        beam.lookAt(closestCube.position);
        
        // Add the beam to the scene
        scene.add(beam);
        
        // Remove the beam after a short time
        setTimeout(() => {
            scene.remove(beam);
        }, 100);
        
        // Apply damage to the cube (with probability)
        if (Math.random() < 0.3) { // 30% chance to destroy the cube
            // Remove the cube from the scene
            scene.remove(closestCube);
            
            // Remove the cube from the list of cubes
            const index = cubes.indexOf(closestCube);
            if (index > -1) {
                cubes.splice(index, 1);
            }
            
            // Create a particle effect at the position of the hit cube
            createDestroyEffect(closestCube.position, closestCube.material.color);
        }
    }
}

// Update the Arkanorb animation
function updateArkanorbAnimation(arkanorb, camera) {
    if (!arkanorb) return;
    
    // Calculate the position in front of the player and offset to the right
    const playerDirection = new THREE.Vector3();
    camera.getWorldDirection(playerDirection);
    
    // Determine the "right" direction relative to the view direction
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(playerDirection, new THREE.Vector3(0, 1, 0)).normalize();
    
    // Combine forward + right + height
    const targetPosition = camera.position.clone()
        .add(playerDirection.clone().multiplyScalar(arkanorb.userData.offsetZ))  // Forward
        .add(rightVector.clone().multiplyScalar(arkanorb.userData.offsetX))      // To the right
        .add(new THREE.Vector3(0, arkanorb.userData.offsetY, 0));                // Upward
    
    // Orb follows this position with smooth movement
    arkanorb.position.x += (targetPosition.x - arkanorb.position.x) * 0.1;
    arkanorb.position.y += (targetPosition.y - arkanorb.position.y) * 0.1;
    arkanorb.position.z += (targetPosition.z - arkanorb.position.z) * 0.1;
    
    // Slight hovering
    arkanorb.position.y += Math.sin(Date.now() * 0.002) * 0.03;
    
    // Orb slightly turns toward the player
    arkanorb.lookAt(camera.position);
    
    // Rotation of the rings
    arkanorb.children[2].rotation.z += arkanorb.userData.rotationSpeed;
    arkanorb.children[3].rotation.x += arkanorb.userData.rotationSpeed;
    
    // Core pulsation
    const pulse = Math.sin(Date.now() * arkanorb.userData.pulseSpeed) * 0.2 + 1;
    arkanorb.children[0].scale.set(pulse, pulse, pulse);
    
    // Color change
    const hue = 0.55 + Math.sin(Date.now() * 0.001) * 0.1;
    arkanorb.children[0].material.color.setHSL(hue, 0.8, 0.6);
    
    // Attack at intervals
    const now = Date.now();
    if (now - arkanorb.userData.lastAttackTime > arkanorb.userData.attackInterval) {
        arkanorbAttack(arkanorb, cubes);
        arkanorb.userData.lastAttackTime = now;
    }
    
    // Particle effects
    if (Math.random() > 0.9) {
        // Create particles around the orb
        // ... (particle effect code)
    }
}

export { 
    createWand, 
    createArkanorb, 
    removeArkanorb, 
    arkanorbAttack, 
    updateArkanorbAnimation 
};