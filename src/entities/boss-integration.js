// src/entities/boss.js - Ultra simple implementation with no dependencies

import { scene } from '../core/scene.js';
import { createScreenShake } from '../effects/animations.js';

// Store reference to boss entity
let boss = null;

// Boss stats
const BOSS_CONFIG = {
    maxHealth: 500,
    size: 4,
    floatHeight: 0.5,
    crystalColors: [
        0x8844FF, // Purple
        0x44AAFF, // Blue
        0xFFAA22  // Orange
    ]
};

// Create the boss entity
function createBoss(position = new THREE.Vector3(0, 0, -15)) {
    // Create a group for the boss
    const bossGroup = new THREE.Group();
    bossGroup.position.copy(position);
    
    // Core structure
    const coreGeometry = new THREE.IcosahedronGeometry(BOSS_CONFIG.size * 0.8, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x222222, 
        wireframe: true
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    bossGroup.add(core);
    
    // Inner core that will glow
    const innerCoreGeometry = new THREE.IcosahedronGeometry(BOSS_CONFIG.size * 0.7, 0);
    const innerCoreMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6622AA,
        transparent: true,
        opacity: 0.8
    });
    const innerCore = new THREE.Mesh(innerCoreGeometry, innerCoreMaterial);
    bossGroup.add(innerCore);
    
    // Add crystal formations
    for (let i = 0; i < 12; i++) {
        const crystalGroup = createCrystalFormation(i, 12);
        bossGroup.add(crystalGroup);
    }
    
    // Add to scene
    scene.add(bossGroup);
    
    // Store boss state
    bossGroup.userData = {
        type: 'BOSS',
        health: BOSS_CONFIG.maxHealth,
        maxHealth: BOSS_CONFIG.maxHealth,
        innerCore: innerCore,
        floatOffset: 0,
        isAlive: true
    };
    
    // Animation function
    bossGroup.update = function(time) {
        if (!this.userData.isAlive) return;
        
        // Floating animation
        this.userData.floatOffset += 0.01;
        this.position.y = BOSS_CONFIG.floatHeight + Math.sin(this.userData.floatOffset) * 0.2;
        
        // Rotate slowly
        this.rotation.y += 0.005;
        
        // Pulse inner core
        const pulse = Math.sin(time * 0.002) * 0.2 + 1;
        innerCore.scale.set(pulse, pulse, pulse);
    };
    
    // Store reference
    boss = bossGroup;
    
    console.log("Simple boss created");
    return boss;
}

// Create a crystal formation
function createCrystalFormation(index, totalCount) {
    const crystalGroup = new THREE.Group();
    
    // Calculate position around the sphere
    const phi = Math.acos(-1 + (2 * index) / totalCount);
    const theta = Math.sqrt(totalCount * Math.PI) * phi;
    
    // Convert to cartesian coordinates on sphere surface
    const radius = BOSS_CONFIG.size;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    crystalGroup.position.set(x, y, z);
    
    // Make the formation point outward
    crystalGroup.lookAt(x * 2, y * 2, z * 2);
    
    // Create crystals
    const crystalNum = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < crystalNum; i++) {
        // Vary crystal sizes and shapes
        const size = 0.3 + Math.random() * 0.5;
        const length = 0.8 + Math.random() * 1.5;
        
        const crystalGeometry = new THREE.ConeGeometry(size, length, 5);
        const colorIndex = Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length);
        const crystalMaterial = new THREE.MeshBasicMaterial({ 
            color: BOSS_CONFIG.crystalColors[colorIndex]
        });
        
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        
        // Position around formation center
        const angle = (i / crystalNum) * Math.PI * 2;
        const formationRadius = 0.2;
        crystal.position.set(
            Math.cos(angle) * formationRadius,
            Math.sin(angle) * formationRadius,
            0
        );
        
        // Rotate to point outward
        crystal.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        crystal.rotation.z = (Math.random() - 0.5) * 0.5;
        
        crystalGroup.add(crystal);
    }
    
    return crystalGroup;
}

// Damage the boss (to be called from wherever you need)
function damageBoss(damageAmount) {
    if (!boss || !boss.userData.isAlive) return false;
    
    // Apply damage
    boss.userData.health -= damageAmount;
    
    // Check for phase changes
    const healthPercent = boss.userData.health / boss.userData.maxHealth;
    
    // Visual feedback based on damage
    if (healthPercent <= 0.75 && healthPercent > 0.5) {
        boss.userData.innerCore.material.color.setHSL(0.6, 0.8, 0.5);
    } else if (healthPercent <= 0.5 && healthPercent > 0.25) {
        boss.userData.innerCore.material.color.setHSL(0.5, 0.9, 0.6);
    } else if (healthPercent <= 0.25) {
        boss.userData.innerCore.material.color.setHSL(0.0, 0.9, 0.6);
    }
    
    // Screen shake for feedback
    if (typeof createScreenShake === 'function') {
        createScreenShake(0.05, 0.9);
    }
    
    // Check for death
    if (boss.userData.health <= 0) {
        killBoss();
        return true; // Boss was destroyed
    }
    
    return false; // Boss still alive
}

// Kill the boss
function killBoss() {
    if (!boss || !boss.userData.isAlive) return;
    
    console.log("Boss killed!");
    
    // Mark as dead
    boss.userData.isAlive = false;
    
    // Simple death animation - just fade out
    fadeOutBoss();
}

// Fade out the boss on death
function fadeOutBoss() {
    if (!boss) return;
    
    // Screen shake
    if (typeof createScreenShake === 'function') {
        createScreenShake(0.2, 0.8);
    }
    
    // Make all materials transparent
    boss.traverse(child => {
        if (child.material) {
            child.material.transparent = true;
        }
    });
    
    // Animation
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            scene.remove(boss);
            return;
        }
        
        // Apply opacity to all materials
        boss.traverse(child => {
            if (child.material) {
                child.material.opacity = opacity;
            }
        });
    }, 100);
}

// Get boss reference
function getBoss() {
    return boss;
}

// Simple collision check for weapons
function checkBossCollision(position, damageAmount) {
    if (!boss || !boss.userData.isAlive) return false;
    
    // Calculate distance to boss
    const distance = position.distanceTo(boss.position);
    
    // If within range, apply damage
    if (distance < BOSS_CONFIG.size * 1.2) {
        return damageBoss(damageAmount);
    }
    
    return false;
}

export {
    createBoss,
    damageBoss,
    getBoss,
    checkBossCollision,
    BOSS_CONFIG
};