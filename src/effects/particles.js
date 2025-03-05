// Particle effects system

import { scene } from '../core/scene.js';

// Store active particle fragments
let activeFragments = [];

// Create a destruction effect when a cube is destroyed
function createDestroyEffect(position, color) {
    // Create multiple small cubes as "fragments"
    const fragments = new THREE.Group();
    
    // Number of fragments
    const fragmentCount = 8;
    
    for (let i = 0; i < fragmentCount; i++) {
        // Create small cubes
        const size = 0.2 + Math.random() * 0.1;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color: color.getHex() });
        const fragment = new THREE.Mesh(geometry, material);
        
        // Position somewhat randomly in the area of the original cube
        fragment.position.set(
            position.x + (Math.random() - 0.5) * 0.5,
            position.y + (Math.random() - 0.5) * 0.5,
            position.z + (Math.random() - 0.5) * 0.5
        );
        
        // Random rotation and velocity
        fragment.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Velocity for animation
        fragment.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            Math.random() * 0.1,
            (Math.random() - 0.5) * 0.1
        );
        
        // Fragment lifetime
        fragment.userData.lifeTime = 2; // seconds
        fragment.userData.createTime = Date.now();
        
        fragments.add(fragment);
    }
    
    // Add the group to the scene
    scene.add(fragments);
    
    // Save the fragments for animation
    activeFragments.push(fragments);
    
    return fragments;
}

// Create a magic effect from the wand
function createMagicEffect(position, direction) {
    // Create multiple particles
    const particles = new THREE.Group();
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        // Random particle size
        const size = 0.05 + Math.random() * 0.1;
        
        // Different particle shapes for more variation
        let geometry;
        const shapeType = Math.floor(Math.random() * 3);
        
        if (shapeType === 0) {
            geometry = new THREE.SphereGeometry(size, 6, 6);
        } else if (shapeType === 1) {
            geometry = new THREE.IcosahedronGeometry(size, 0);
        } else {
            geometry = new THREE.TetrahedronGeometry(size, 0);
        }
        
        // Random color in the blue/turquoise spectrum
        const hue = 0.5 + Math.random() * 0.2; // Between blue and turquoise
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(hue, saturation, lightness),
            transparent: true,
            opacity: 0.7 + Math.random() * 0.3
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position around tip with slight scatter
        particle.position.copy(position);
        particle.position.x += (Math.random() - 0.5) * 0.2;
        particle.position.y += (Math.random() - 0.5) * 0.2;
        particle.position.z += (Math.random() - 0.5) * 0.2;
        
        // Random rotation
        particle.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Velocity - mainly in view direction
        const speed = 0.1 + Math.random() * 0.2;
        particle.userData.velocity = new THREE.Vector3(
            direction.x * speed + (Math.random() - 0.5) * 0.05,
            direction.y * speed + (Math.random() - 0.5) * 0.05,
            direction.z * speed + (Math.random() - 0.5) * 0.05
        );
        
        // Particle lives shorter than cube fragments
        particle.userData.lifeTime = 0.5 + Math.random() * 0.5; // 0.5-1 seconds
        particle.userData.createTime = Date.now();
        
        particles.add(particle);
    }
    
    scene.add(particles);
    activeFragments.push(particles);
    
    return particles;
}

// Create dash effect particles
function createDashEffect(position) {
    // Create particles at player
    const particleCount = 5;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00aaff,
            transparent: true,
            opacity: 0.7
        });
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position around the player
        particle.position.set(
            position.x + (Math.random() - 0.5) * 0.5,
            position.y - 0.5 + (Math.random() - 0.5) * 0.5,
            position.z + (Math.random() - 0.5) * 0.5
        );
        
        // Lifetime and animation
        particle.userData.lifeTime = 0.5; // seconds
        particle.userData.createTime = Date.now();
        
        // Add velocity for animation
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            Math.random() * 0.05,
            (Math.random() - 0.5) * 0.05
        );
        
        particles.add(particle);
    }
    
    scene.add(particles);
    activeFragments.push(particles);
    
    return particles;
}

// Update all active particle effects
function updateParticles() {
    const now = Date.now();
    
    for (let i = activeFragments.length - 1; i >= 0; i--) {
        const fragments = activeFragments[i];
        let allDead = true;
        
        // Animate each fragment
        for (let j = 0; j < fragments.children.length; j++) {
            const fragment = fragments.children[j];
            
            // Move the fragment according to its velocity
            fragment.position.x += fragment.userData.velocity.x;
            fragment.position.y += fragment.userData.velocity.y;
            fragment.position.z += fragment.userData.velocity.z;
            
            // Simulate gravity
            fragment.userData.velocity.y -= 0.002;
            
            // Rotate the fragment
            fragment.rotation.x += 0.02;
            fragment.rotation.y += 0.03;
            
            // Check if the fragment is still alive
            const age = (now - fragment.userData.createTime) / 1000;
            if (age < fragment.userData.lifeTime) {
                allDead = false;
                
                // Shrink the fragment over time
                const scale = 1.0 - (age / fragment.userData.lifeTime);
                fragment.scale.set(scale, scale, scale);
            } else {
                // Make the fragment invisible if it's dead
                fragment.visible = false;
            }
        }
        
        // Remove the fragment group if all fragments are dead
        if (allDead) {
            scene.remove(fragments);
            activeFragments.splice(i, 1);
        }
    }
}

// Export particle system functions
export {
    activeFragments,
    createDestroyEffect,
    createMagicEffect,
    createDashEffect,
    updateParticles
};