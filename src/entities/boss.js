// src/entities/boss.js - Crystal Colossus Implementation

import { scene } from '../core/scene.js';
import { createDestroyEffect } from '../effects/particles.js';
import { activeFragments } from '../effects/particles.js';
import { createScreenShake } from '../effects/animations.js';

// Store reference to boss entity
let boss = null;
let isBossActive = false;

// Boss stats
const BOSS_CONFIG = {
    maxHealth: 500,       // High health pool so it can't be one-shot
    damageThresholds: [0.75, 0.5, 0.25], // Visual change thresholds at 75%, 50%, and 25% health
    size: 4,              // Base size (much larger than regular enemies)
    floatHeight: 0.5,     // How high it floats above ground
    rotationSpeed: 0.005, // Slow rotation for idle animation
    damageFlashDuration: 300, // Ms for damage flash effect
    crystalColors: [
        0x8844FF, // Purple
        0x44AAFF, // Blue
        0xFFAA22  // Orange
    ]
};

// Create the boss entity
function createBoss(position = new THREE.Vector3(0, 0, -15)) {
    // Don't create if already exists
    if (boss) {
        return boss;
    }

    // Create a group for the boss
    const bossGroup = new THREE.Group();
    bossGroup.position.copy(position);
    
    // Core structure - central body
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
        color: 0x6622AA, // Purple glow
        transparent: true,
        opacity: 0.8
    });
    const innerCore = new THREE.Mesh(innerCoreGeometry, innerCoreMaterial);
    bossGroup.add(innerCore);
    
    // Add crystal formations around the core
    const crystalCount = 12; // Number of crystal formations
    
    for (let i = 0; i < crystalCount; i++) {
        const crystalGroup = createCrystalFormation(i, crystalCount);
        bossGroup.add(crystalGroup);
    }
    
    // Create floating shards that orbit around
    const shardCount = 20;
    const shards = [];
    
    for (let i = 0; i < shardCount; i++) {
        const shard = createOrbitingShard(i, shardCount);
        bossGroup.add(shard);
        shards.push(shard);
    }

    // Create the hitbox for collision detection
    const hitboxGeometry = new THREE.SphereGeometry(BOSS_CONFIG.size, 8, 8);
    const hitboxMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.0, // Invisible
        wireframe: true
    });
    const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
    hitbox.name = "hitbox"; // Important for collision detection
    bossGroup.add(hitbox);
    
    // Add boss to scene
    scene.add(bossGroup);
    
    // Store boss state
    bossGroup.userData = {
        type: 'BOSS',
        health: BOSS_CONFIG.maxHealth,
        maxHealth: BOSS_CONFIG.maxHealth,
        damaged: false,
        damageFlashTime: 0,
        currentPhase: 0, // Phase tracking (0 = full health)
        shards: shards,
        innerCore: innerCore,
        coreRotationSpeed: BOSS_CONFIG.rotationSpeed,
        floatOffset: 0,
        isAlive: true
    };
    
    // Add update method for animations
    bossGroup.update = function(time) {
        // Skip if not alive
        if (!this.userData.isAlive) return;
        
        // Get inner core for pulsing
        const innerCore = this.userData.innerCore;
        
        // Floating animation
        this.userData.floatOffset += 0.01;
        this.position.y = BOSS_CONFIG.floatHeight + Math.sin(this.userData.floatOffset) * 0.2;
        
        // Core rotation
        this.rotation.y += this.userData.coreRotationSpeed;
        
        // Pulsing glow effect for the inner core
        if (innerCore) {
            // Pulse intensity increases as health decreases
            const healthPercent = this.userData.health / this.userData.maxHealth;
            const pulseSpeed = 0.002 + (0.004 * (1 - healthPercent));
            const pulseIntensity = 0.2 + (0.4 * (1 - healthPercent));
            
            const pulse = Math.sin(time * pulseSpeed) * pulseIntensity + 1;
            innerCore.scale.set(pulse, pulse, pulse);
            
            // Color shifts as health decreases
            const h = 0.75 - (0.3 * (1 - healthPercent)); // Shift from purple toward red
            const s = 0.8;
            const l = 0.5 + (0.2 * (1 - healthPercent)); // Brighter as health decreases
            
            innerCore.material.color.setHSL(h, s, l);
            
            // Higher opacity as health decreases
            innerCore.material.opacity = 0.6 + (0.4 * (1 - healthPercent));
        }
        
        // Animate orbiting shards
        for (let i = 0; i < this.userData.shards.length; i++) {
            const shard = this.userData.shards[i];
            
            // Skip if shard is not valid
            if (!shard || !shard.userData) continue;
            
            // Update orbit angle
            shard.userData.angle += shard.userData.speed;
            
            // Calculate new position
            const x = Math.cos(shard.userData.angle) * shard.userData.distance;
            const z = Math.sin(shard.userData.angle) * shard.userData.distance;
            const y = Math.sin(shard.userData.angle * 0.5) * shard.userData.verticalRange;
            
            // Apply position
            shard.position.set(x, y, z);
            
            // Rotate shard
            shard.rotation.x += 0.01;
            shard.rotation.y += 0.02;
            
            // Health-based behavior - faster orbit and more erratic as health decreases
            const healthPercent = this.userData.health / this.userData.maxHealth;
            if (healthPercent < 0.5) {
                shard.userData.speed = shard.userData.baseSpeed * (1 + (0.5 - healthPercent) * 2);
                
                // Add slight wobble when heavily damaged
                if (healthPercent < 0.3) {
                    shard.position.x += (Math.random() - 0.5) * 0.05;
                    shard.position.z += (Math.random() - 0.5) * 0.05;
                }
            }
        }
        
        // Handle damage flash effect
        if (this.userData.damaged) {
            if (Date.now() - this.userData.damageFlashTime < BOSS_CONFIG.damageFlashDuration) {
                // Flash the core
                innerCore.material.color.setRGB(1, 0.3, 0.3); // Red flash
            } else {
                this.userData.damaged = false;
            }
        }
    };
    
    // Store boss reference and mark as active
    boss = bossGroup;
    isBossActive = true;
    
    console.log("Boss created:", boss);
    return boss;
}

// Create a crystal formation for the boss
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
    
    // Make the formation point outward from center
    crystalGroup.lookAt(x * 2, y * 2, z * 2);
    
    // Create 3-5 crystals per formation
    const crystalNum = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < crystalNum; i++) {
        // Vary crystal sizes and shapes
        const size = 0.3 + Math.random() * 0.5;
        const length = 0.8 + Math.random() * 1.5;
        
        // Use a cone or similar shape for crystal
        const crystalGeometry = new THREE.ConeGeometry(size, length, 5);
        
        // Randomly select color from boss config
        const colorIndex = Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length);
        const crystalMaterial = new THREE.MeshBasicMaterial({ 
            color: BOSS_CONFIG.crystalColors[colorIndex]
        });
        
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        
        // Position around formation center with variation
        const angle = (i / crystalNum) * Math.PI * 2;
        const formationRadius = 0.2;
        crystal.position.set(
            Math.cos(angle) * formationRadius,
            Math.sin(angle) * formationRadius,
            0
        );
        
        // Rotate to point slightly outward with variation
        crystal.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        crystal.rotation.z = (Math.random() - 0.5) * 0.5;
        
        crystalGroup.add(crystal);
    }
    
    return crystalGroup;
}

// Create an orbiting shard
function createOrbitingShard(index, totalCount) {
    // Select random crystal color
    const colorIndex = Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length);
    const shardColor = BOSS_CONFIG.crystalColors[colorIndex];
    
    // Create a shard with crystal-like shape
    const shardGeometry = new THREE.OctahedronGeometry(0.3 + Math.random() * 0.4, 0);
    const shardMaterial = new THREE.MeshBasicMaterial({ 
        color: shardColor,
        transparent: true,
        opacity: 0.8
    });
    
    const shard = new THREE.Mesh(shardGeometry, shardMaterial);
    
    // Set orbit parameters
    const orbitDistance = BOSS_CONFIG.size * 1.3 + Math.random() * BOSS_CONFIG.size * 0.7;
    const orbitSpeed = (0.005 + Math.random() * 0.01) * (Math.random() < 0.5 ? 1 : -1); // Some clockwise, some counter-clockwise
    const angle = (index / totalCount) * Math.PI * 2; // Distribute around orbit
    const verticalRange = 0.5 + Math.random() * 1.0; // How much it bobs up and down
    
    // Store orbit data for animation
    shard.userData = {
        angle: angle,
        distance: orbitDistance,
        baseSpeed: orbitSpeed,
        speed: orbitSpeed,
        verticalRange: verticalRange,
        isShard: true
    };
    
    return shard;
}

// Apply damage to the boss
function damageBoss(damageAmount) {
    if (!boss || !isBossActive || !boss.userData.isAlive) return false;
    
    // Get current health
    const currentHealth = boss.userData.health;
    
    // Apply damage
    boss.userData.health = Math.max(0, currentHealth - damageAmount);
    
    // Set damaged flag for visual feedback
    boss.userData.damaged = true;
    boss.userData.damageFlashTime = Date.now();
    
    // Calculate health percentage
    const healthPercent = boss.userData.health / boss.userData.maxHealth;
    
    // Check phase transitions (visual changes)
    if (currentHealth > boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[0] && 
        boss.userData.health <= boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[0]) {
        // Transition to phase 1 (75% health)
        transitionToPhase(1);
    }
    else if (currentHealth > boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[1] && 
            boss.userData.health <= boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[1]) {
        // Transition to phase 2 (50% health)
        transitionToPhase(2);
    }
    else if (currentHealth > boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[2] && 
            boss.userData.health <= boss.userData.maxHealth * BOSS_CONFIG.damageThresholds[2]) {
        // Transition to phase 3 (25% health)
        transitionToPhase(3);
    }
    
    // Check for death
    if (boss.userData.health <= 0) {
        killBoss();
        return true; // Boss was destroyed
    }
    
    // Create damage effect
    createBossDamageEffect();
    
    return false; // Boss still alive
}

// Handle boss phase transition
function transitionToPhase(phase) {
    if (!boss) return;
    
    console.log(`Boss transitioning to phase ${phase}`);
    
    // Store current phase
    boss.userData.currentPhase = phase;
    
    // Visual effects for phase transition
    createPhaseTransitionEffect(phase);
    
    // Increase core rotation speed
    boss.userData.coreRotationSpeed = BOSS_CONFIG.rotationSpeed * (1 + phase * 0.5);
    
    // Phase-specific changes
    switch(phase) {
        case 1: // 75% health
            // First damage state - slight changes
            boss.userData.innerCore.material.color.setHSL(0.6, 0.8, 0.5);
            break;
            
        case 2: // 50% health 
            // Second damage state - more intense changes
            boss.userData.innerCore.material.color.setHSL(0.5, 0.9, 0.6);
            
            // Detach some crystals
            detachCrystals(3);
            break;
            
        case 3: // 25% health
            // Final damage state - critical
            boss.userData.innerCore.material.color.setHSL(0.0, 0.9, 0.6); // Red glow
            
            // Detach more crystals
            detachCrystals(5);
            
            // Core becomes unstable - add wobble
            const core = boss.children[0]; // First child is the core
            if (core) {
                core.scale.set(1.1, 0.9, 1.0); // Distort shape
            }
            break;
    }
}

// Create a visual effect for phase transition
function createPhaseTransitionEffect(phase) {
    if (!boss) return;
    
    // Create an energy pulse wave
    const waveGeometry = new THREE.RingGeometry(0.5, 1.0, 32);
    const waveColor = new THREE.Color().setHSL(0.7 - phase * 0.2, 0.9, 0.6);
    
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: waveColor,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    
    // Position at boss center
    wave.position.copy(boss.position);
    
    // Face camera (make ring horizontal)
    wave.rotation.x = Math.PI / 2;
    
    // Add to scene
    scene.add(wave);
    
    // Animation parameters
    wave.userData = {
        expansionRate: 0.2 + phase * 0.1,
        maxRadius: BOSS_CONFIG.size * 5,
        createTime: Date.now(),
        lifeTime: 1.5 // seconds
    };
    
    // Custom update function
    wave.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Remove from scene
        }
        
        // Expand the ring
        const scale = Math.min(this.userData.maxRadius, age * this.userData.expansionRate * 10);
        this.scale.set(scale, scale, scale);
        
        // Fade out gradually
        this.material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    if (typeof activeFragments !== 'undefined') {
        activeFragments.push(wave);
    }
    
    // Screen shake effect (more intense with later phases)
    if (typeof createScreenShake === 'function') {
        createScreenShake(0.05 * phase, 0.9);
    }
    
    return wave;
}

// Detach crystals for damage effect
function detachCrystals(count) {
    if (!boss) return;
    
    // Find crystal formations
    const crystalFormations = [];
    
    // Look for crystal groups (children after core and inner core and hitbox)
    for (let i = 3; i < boss.children.length; i++) {
        const child = boss.children[i];
        
        // Skip shards and non-GROUP objects
        if (child.type !== 'Group' || child.userData.isShard) {
            continue;
        }
        
        crystalFormations.push(child);
    }
    
    // Randomly select formations to detach
    for (let i = 0; i < Math.min(count, crystalFormations.length); i++) {
        // Select a random formation that hasn't been detached
        if (crystalFormations.length === 0) break;
        
        const index = Math.floor(Math.random() * crystalFormations.length);
        const formation = crystalFormations[index];
        
        // Remove from list so it won't be selected again
        crystalFormations.splice(index, 1);
        
        // Detach from boss
        const worldPos = new THREE.Vector3();
        formation.getWorldPosition(worldPos);
        
        // Create a new detached formation
        const detachedFormation = formation.clone();
        
        // Set world position
        detachedFormation.position.copy(worldPos);
        
        // Add velocity and rotation for animation
        detachedFormation.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                0.05 + Math.random() * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            ),
            createTime: Date.now(),
            lifeTime: 3 + Math.random() * 2 // 3-5 seconds
        };
        
        // Custom update method
        detachedFormation.update = function(now) {
            const age = (now - this.userData.createTime) / 1000;
            
            if (age >= this.userData.lifeTime) {
                return false; // Remove from scene
            }
            
            // Move based on velocity
            this.position.add(this.userData.velocity);
            
            // Apply gravity
            this.userData.velocity.y -= 0.002;
            
            // Rotate the formation
            this.rotation.x += this.userData.rotationSpeed.x;
            this.rotation.y += this.userData.rotationSpeed.y;
            this.rotation.z += this.userData.rotationSpeed.z;
            
            // Fade out in last second
            if (age > this.userData.lifeTime - 1) {
                const fadeProgress = (age - (this.userData.lifeTime - 1));
                
                // Apply fade to all children
                for (let i = 0; i < this.children.length; i++) {
                    const child = this.children[i];
                    if (child.material) {
                        if (!child.material.transparent) {
                            child.material.transparent = true;
                        }
                        child.material.opacity = 1 - fadeProgress;
                    }
                }
            }
            
            return true; // Continue animation
        };
        
        // Add to scene and track for animation
        scene.add(detachedFormation);
        
        // Add to active fragments if available
        if (typeof activeFragments !== 'undefined') {
            activeFragments.push(detachedFormation);
        }
        
        // Hide the original formation
        formation.visible = false;
    }
}

// Create damage effect when boss is hit
function createBossDamageEffect() {
    if (!boss) return;
    
    // Random position on boss surface
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI;
    
    const x = boss.position.x + Math.sin(angle2) * Math.cos(angle1) * BOSS_CONFIG.size;
    const y = boss.position.y + Math.sin(angle2) * Math.sin(angle1) * BOSS_CONFIG.size;
    const z = boss.position.z + Math.cos(angle2) * BOSS_CONFIG.size;
    
    const hitPosition = new THREE.Vector3(x, y, z);
    
    // Create small explosion at hit point
    const explosionGroup = new THREE.Group();
    explosionGroup.position.copy(hitPosition);
    
    // Particles for the hit effect
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
        const size = 0.1 + Math.random() * 0.2;
        
        // Create a particle
        const particleGeometry = new THREE.BoxGeometry(size, size, size);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: BOSS_CONFIG.crystalColors[Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length)],
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Add velocity for animation
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            rotationSpeed: Math.random() * 0.1
        };
        
        explosionGroup.add(particle);
    }
    
    // Flash at impact point
    const flashGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 1.0
    });
    
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    explosionGroup.add(flash);
    
    // Add to scene
    scene.add(explosionGroup);
    
    // Animation parameters
    explosionGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.8 // seconds
    };
    
    // Custom update function
    explosionGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Remove effect
        }
        
        // Update particles
        for (let i = 0; i < this.children.length - 1; i++) { // All except the flash
            const particle = this.children[i];
            
            // Move based on velocity
            particle.position.add(particle.userData.velocity);
            
            // Rotate
            particle.rotation.x += particle.userData.rotationSpeed;
            particle.rotation.y += particle.userData.rotationSpeed;
            
            // Fade out
            particle.material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        }
        
        // Flash fades quickly
        const flash = this.children[this.children.length - 1];
        if (flash) {
            flash.material.opacity = 1.0 * Math.max(0, 1 - age * 5); // Fast fade
            
            // Expand slightly
            const expandScale = 1 + age * 2;
            flash.scale.set(expandScale, expandScale, expandScale);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    if (typeof activeFragments !== 'undefined') {
        activeFragments.push(explosionGroup);
    }
    
    return explosionGroup;
}

// Kill the boss (death sequence)
function killBoss() {
    if (!boss || !boss.userData.isAlive) return;
    
    console.log("Boss killed!");
    
    // Mark as not alive
    boss.userData.isAlive = false;
    isBossActive = false;
    
    // Start death animation
    startBossDeathSequence();
}

// Boss death sequence
function startBossDeathSequence() {
    if (!boss) return;
    
    // Create massive explosion
    const explosionGroup = new THREE.Group();
    explosionGroup.position.copy(boss.position);
    
    // Core explosion flash
    const coreFlashGeometry = new THREE.SphereGeometry(BOSS_CONFIG.size, 16, 16);
    const coreFlashMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 1.0
    });
    
    const coreFlash = new THREE.Mesh(coreFlashGeometry, coreFlashMaterial);
    explosionGroup.add(coreFlash);
    
    // Add explosion particles
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        // Vary particle size
        const size = 0.2 + Math.random() * 0.5;
        
        // Create particle
        const particleGeometry = new THREE.BoxGeometry(size, size, size);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: BOSS_CONFIG.crystalColors[Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length)],
            transparent: true,
            opacity: 0.9
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random initial position within core
        const radius = Math.random() * BOSS_CONFIG.size * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particle.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        // Add velocity for animation
        particle.userData = {
            velocity: particle.position.clone().normalize().multiplyScalar(0.1 + Math.random() * 0.2),
            rotationSpeed: Math.random() * 0.1,
            drag: 0.98
        };
        
        explosionGroup.add(particle);
    }
    
    // Add larger crystal shards
    const shardCount = 15;
    
    for (let i = 0; i < shardCount; i++) {
        // Create a larger shard
        const shardGeometry = new THREE.ConeGeometry(0.3 + Math.random() * 0.3, 0.8 + Math.random() * 1.2, 5);
        const shardMaterial = new THREE.MeshBasicMaterial({
            color: BOSS_CONFIG.crystalColors[Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length)],
            transparent: true,
            opacity: 1.0
        });
        
        const shard = new THREE.Mesh(shardGeometry, shardMaterial);
        
        // Position similar to particles but further out
        const radius = BOSS_CONFIG.size * 0.7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        shard.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        // Point outward
        shard.lookAt(
            shard.position.x * 2,
            shard.position.y * 2,
            shard.position.z * 2
        );
        
        // Velocity for animation - more dramatic
        shard.userData = {
            velocity: shard.position.clone().normalize().multiplyScalar(0.15 + Math.random() * 0.25),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            drag: 0.99
        };
        
        explosionGroup.add(shard);
    }
    
    // Add to scene
    scene.add(explosionGroup);
    
    // Hide the boss
    boss.visible = false;
    
    // Animation parameters
    explosionGroup.userData = {
        createTime: Date.now(),
        lifeTime: 5.0, // 5 seconds for full explosion sequence
        hasCreatedSecondaryExplosions: false
    };
    
    // Custom update function
    explosionGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Remove effect
        }
        
        // Core flash animation
        const coreFlash = this.children[0];
        if (coreFlash) {
            if (age < 0.5) {
                // Expand quickly
                const expandScale = 1 + age * 4;
                coreFlash.scale.set(expandScale, expandScale, expandScale);
                
                // Fade out
                coreFlash.material.opacity = 1.0 * (1 - age * 2);
            } else {
                // Hide after initial flash
                coreFlash.visible = false;
            }
        }
        
        // Update particles
        for (let i = 1; i < 1 + particleCount; i++) {
            const particle = this.children[i];
            if (!particle) continue;
            
            // Apply velocity
            particle.position.add(particle.userData.velocity);
            
            // Apply drag
            particle.userData.velocity.multiplyScalar(particle.userData.drag);
            
            // Apply gravity after a delay
            if (age > 0.5) {
                particle.userData.velocity.y -= 0.001;
            }
            
            // Rotate
            particle.rotation.x += particle.userData.rotationSpeed;
            particle.rotation.y += particle.userData.rotationSpeed;
            
            // Fade out in last 2 seconds
            if (age > this.userData.lifeTime - 2) {
                const fadeProgress = (age - (this.userData.lifeTime - 2)) / 2;
                particle.material.opacity = 0.9 * (1 - fadeProgress);
            }
        }
        
        // Update larger shards
        for (let i = 1 + particleCount; i < this.children.length; i++) {
            const shard = this.children[i];
            if (!shard) continue;
            
            // Apply velocity
            shard.position.add(shard.userData.velocity);
            
            // Apply drag
            shard.userData.velocity.multiplyScalar(shard.userData.drag);
            
            // Apply gravity after a delay
            if (age > 0.5) {
                shard.userData.velocity.y -= 0.002;
            }
            
            // Rotate
            shard.rotation.x += shard.userData.rotationSpeed.x;
            shard.rotation.y += shard.userData.rotationSpeed.y;
            shard.rotation.z += shard.userData.rotationSpeed.z;
            
            // Fade out in last 2 seconds
            if (age > this.userData.lifeTime - 2) {
                const fadeProgress = (age - (this.userData.lifeTime - 2)) / 2;
                shard.material.opacity = 1.0 * (1 - fadeProgress);
            }
        }
        
        // Create secondary explosions
        if (!this.userData.hasCreatedSecondaryExplosions && age > 0.3) {
            this.userData.hasCreatedSecondaryExplosions = true;
            
            // Create 3 smaller secondary explosions
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createSecondaryExplosion(this.position.clone(), i);
                }, i * 300); // Stagger the explosions
            }
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    if (typeof activeFragments !== 'undefined') {
        activeFragments.push(explosionGroup);
    }
    
    // Screen shake
    if (typeof createScreenShake === 'function') {
        createScreenShake(0.2, 0.8);
        
        // Additional screen shakes for secondary explosions
        setTimeout(() => createScreenShake(0.15, 0.8), 500);
        setTimeout(() => createScreenShake(0.1, 0.8), 1000);
    }
    
    return explosionGroup;
}

// Create secondary explosion for boss death
function createSecondaryExplosion(position, index) {
    // Offset position
    const offset = new THREE.Vector3(
        (Math.random() - 0.5) * BOSS_CONFIG.size * 1.5,
        (Math.random() - 0.5) * BOSS_CONFIG.size * 1.5,
        (Math.random() - 0.5) * BOSS_CONFIG.size * 1.5
    );
    
    position.add(offset);
    
    // Create explosion group
    const explosionGroup = new THREE.Group();
    explosionGroup.position.copy(position);
    
    // Flash
    const flashGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 1.0
    });
    
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    explosionGroup.add(flash);
    
    // Particles
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const size = 0.1 + Math.random() * 0.3;
        
        const particleGeometry = new THREE.BoxGeometry(size, size, size);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: BOSS_CONFIG.crystalColors[Math.floor(Math.random() * BOSS_CONFIG.crystalColors.length)],
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random positioning within small radius
        particle.position.set(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        
        // Outward velocity
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.15,
                (Math.random() - 0.5) * 0.15,
                (Math.random() - 0.5) * 0.15
            ),
            rotationSpeed: Math.random() * 0.1,
            drag: 0.97
        };
        
        explosionGroup.add(particle);
    }
    
    // Add to scene
    scene.add(explosionGroup);
    
    // Animation data
    explosionGroup.userData = {
        createTime: Date.now(),
        lifeTime: 1.5 // seconds
    };
    
    // Update function
    explosionGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Flash animation
        const flash = this.children[0];
        if (flash) {
            // Expand quickly and fade
            const expandScale = 1 + age * 5;
            flash.scale.set(expandScale, expandScale, expandScale);
            flash.material.opacity = 1.0 * Math.max(0, 1 - age * 3);
        }
        
        // Particles
        for (let i = 1; i < this.children.length; i++) {
            const particle = this.children[i];
            
            // Apply velocity
            particle.position.add(particle.userData.velocity);
            
            // Apply drag
            particle.userData.velocity.multiplyScalar(particle.userData.drag);
            
            // Apply gravity
            particle.userData.velocity.y -= 0.002;
            
            // Rotate
            particle.rotation.x += particle.userData.rotationSpeed;
            particle.rotation.y += particle.userData.rotationSpeed;
            
            // Fade out
            particle.material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    if (typeof activeFragments !== 'undefined') {
        activeFragments.push(explosionGroup);
    }
    
    return explosionGroup;
}

// Function to check if boss is active
function isBossAlive() {
    return isBossActive && boss && boss.userData.isAlive;
}

// Get boss reference
function getBoss() {
    return boss;
}

// Direct collision check for weapons
function checkBossCollision(weaponType, position, damageAmount) {
    if (!boss || !isBossActive || !boss.userData.isAlive) return false;
    
    // Calculate distance to boss
    const distance = position.distanceTo(boss.position);
    
    // If within the boss radius, apply damage
    if (distance < BOSS_CONFIG.size * 1.2) { // Slightly larger than actual size for better hit detection
        return damageBoss(damageAmount);
    }
    
    return false;
}

export {
    createBoss,
    damageBoss,
    isBossAlive,
    getBoss,
    checkBossCollision,
    BOSS_CONFIG
};