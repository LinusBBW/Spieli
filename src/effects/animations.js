// Special animations and effects

import { scene, camera } from '../core/scene.js';
import { activeFragments } from './particles.js';

// Create a screen shake effect
function createScreenShake(intensity = 0.05, decay = 0.9) {
    const originalPosition = camera.position.clone();
    let shakeAmount = intensity;
    
    const shakeScreen = () => {
        if (shakeAmount <= 0.001) {
            camera.position.copy(originalPosition);
            return;
        }
        
        camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeAmount;
        camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeAmount;
        camera.position.z = originalPosition.z + (Math.random() - 0.5) * shakeAmount;
        
        shakeAmount *= decay;
        requestAnimationFrame(shakeScreen);
    };
    
    shakeScreen();
}

// Create an energy slice for the katana special move
function createEnergySlice(originPosition, direction, size, color) {
    // Create a ring for the energy slice
    const sliceGeometry = new THREE.TorusGeometry(size, size / 10, 8, 24);
    const sliceMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
    
    // Position the slice
    slice.position.copy(originPosition);
    
    // Orient the slice according to the direction
    slice.lookAt(originPosition.clone().add(direction));
    
    // Add the slice to the scene
    scene.add(slice);
    
    // Properties for animation
    slice.userData.velocity = direction.clone().multiplyScalar(0.3);
    slice.userData.lifeTime = 1.0; // 1 second
    slice.userData.createTime = Date.now();
    slice.userData.initialSize = size;
    
    // Group for animation
    const energyGroup = new THREE.Group();
    energyGroup.add(slice);
    
    return energyGroup;
}

// Create a crater effect for the special move finale
function createCraterEffect(position, color, particleCount = 20, radius = 2) {
    const craterGroup = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 1 + Math.random() * radius;
        
        const particle = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.05, 0.2),
            new THREE.MeshBasicMaterial({ 
                color: color, 
                transparent: true, 
                opacity: 0.5 
            })
        );
        
        // Position in a circle around the center
        particle.position.set(
            position.x + Math.cos(angle) * distance,
            position.y + 0.05,
            position.z + Math.sin(angle) * distance
        );
        
        // Outward velocity
        particle.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * 0.05,
            0.01,
            Math.sin(angle) * 0.05
        );
        
        // Lifetime of the crater particle
        particle.userData.lifeTime = 0.5;
        particle.userData.createTime = Date.now();
        
        craterGroup.add(particle);
    }
    
    scene.add(craterGroup);
    activeFragments.push(craterGroup);
    
    return craterGroup;
}

export { createScreenShake, createEnergySlice, createCraterEffect };