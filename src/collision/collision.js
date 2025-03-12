// Enhanced collision detection system
import { scene, camera, raycaster } from '../core/scene.js';
import { createDestroyEffect } from '../effects/particles.js';
import { enemies, damageEnemy, findIntersectedEnemy, isPointInHitbox } from '../entities/enemies.js';
import { playerCurrentHealth, takeDamage } from '../ui/health.js';

// Collision detection settings
const COLLISION_SETTINGS = {
    weaponDamage: {
        sword: 25,
        katana: 30,
        wand: 20,
        zangetsu: 35,
        mugetsu: 50
    },
    specialDamage: {
        swordSpecial: 50,
        katanaSpecial: 10, // Per petal hit
        wandSpecial: 5,    // Per attack tick
        zangetsuSpecial: 75,
        mugetsuSpecial: 150
    },
    hitRange: {
        sword: 2.5,
        katana: 2.7,
        wand: 10.0,  // Wand has ranged attacks
        zangetsu: 3.0,
        mugetsu: 3.5
    },
    // How wide the weapon swing hitbox is in radians
    hitAngle: {
        sword: Math.PI / 3,  // 60 degrees
        katana: Math.PI / 2.5, // ~72 degrees
        wand: Math.PI / 6,   // 30 degrees
        zangetsu: Math.PI / 2, // 90 degrees
        mugetsu: Math.PI / 1.5 // 120 degrees
    }
};

// Player collision settings
const PLAYER_COLLISION = {
    radius: 0.5,       // Player collision radius
    height: 1.8,       // Player height
    feetOffset: -0.9,  // Offset from camera to feet
    headOffset: 0.9,   // Offset from camera to head
    damageImmunityTime: 1000 // ms of immunity after taking damage
};

// Last time player took damage
let lastDamageTime = 0;

// Prepare an Axis-Aligned Bounding Box for the player
const playerBoundingBox = new THREE.Box3();

// Create a visualization of the player's hitbox (for debugging)
let playerHitboxMesh = null;

// Initialize player hitbox visualization for debugging
function createPlayerHitboxVisualization() {
    // Create a simple mesh to represent player hitbox
    const geometry = new THREE.CylinderGeometry(
        PLAYER_COLLISION.radius, 
        PLAYER_COLLISION.radius, 
        PLAYER_COLLISION.height, 
        8
    );
    
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.3,
        wireframe: true
    });
    
    playerHitboxMesh = new THREE.Mesh(geometry, material);
    playerHitboxMesh.visible = false; // Hidden by default
    scene.add(playerHitboxMesh);
}

// Toggle player hitbox visibility
function togglePlayerHitbox() {
    if (!playerHitboxMesh) {
        createPlayerHitboxVisualization();
    }
    
    playerHitboxMesh.visible = !playerHitboxMesh.visible;
    console.log(`Player hitbox ${playerHitboxMesh.visible ? 'visible' : 'hidden'}`);
}

// Update player hitbox position based on camera
function updatePlayerHitbox(playerPosition) {
    // Update the bounding box
    const minY = playerPosition.y + PLAYER_COLLISION.feetOffset;
    const maxY = playerPosition.y + PLAYER_COLLISION.headOffset;
    
    playerBoundingBox.min.set(
        playerPosition.x - PLAYER_COLLISION.radius,
        minY,
        playerPosition.z - PLAYER_COLLISION.radius
    );
    
    playerBoundingBox.max.set(
        playerPosition.x + PLAYER_COLLISION.radius,
        maxY,
        playerPosition.z + PLAYER_COLLISION.radius
    );
    
    // Update visualization if it exists
    if (playerHitboxMesh && playerHitboxMesh.visible) {
        playerHitboxMesh.position.set(
            playerPosition.x,
            playerPosition.y + (PLAYER_COLLISION.feetOffset + PLAYER_COLLISION.headOffset) / 2,
            playerPosition.z
        );
    }
}

// Enhanced weapon swing collision detection
function checkWeaponCollision(playerPosition, cameraDirection, activeWeapon, swingProgress) {
    // Only check when the weapon is in the main strike phase (0.4-0.6)
    if (swingProgress < 0.4 || swingProgress > 0.6) {
        return false;
    }
    
    // Get weapon settings
    const weaponRange = COLLISION_SETTINGS.hitRange[activeWeapon];
    const weaponAngle = COLLISION_SETTINGS.hitAngle[activeWeapon];
    const baseDamage = COLLISION_SETTINGS.weaponDamage[activeWeapon];
    
    // Create a weapon swing arc
    const hitEnemies = [];
    
    enemies.forEach(enemy => {
        // Direction to enemy
        const directionToEnemy = new THREE.Vector3();
        directionToEnemy.subVectors(enemy.position, playerPosition).normalize();
        
        // Distance to enemy
        const distanceToEnemy = playerPosition.distanceTo(enemy.position);
        
        // Angle between camera direction and enemy direction
        const angleToEnemy = cameraDirection.angleTo(directionToEnemy);
        
        // Check if enemy is within range and angle
        if (distanceToEnemy <= weaponRange && angleToEnemy <= weaponAngle) {
            // Critical hit if enemy is directly in front
            const isCritical = angleToEnemy < weaponAngle / 3;
            
            // Apply damage
            const damage = isCritical ? baseDamage * 1.5 : baseDamage;
            const destroyed = damageEnemy(enemy, damage);
            
            hitEnemies.push({
                enemy,
                critical: isCritical,
                destroyed
            });
        }
    });
    
    return hitEnemies.length > 0 ? hitEnemies : false;
}

// Check for ray weapon collision (wand blasts, etc.)
function checkRayCollision(origin, direction, range, damage) {
    // Create a ray
    const ray = new THREE.Ray(origin, direction);
    
    // Find intersected enemy
    const result = findIntersectedEnemy(ray);
    
    if (result.enemy && result.distance <= range) {
        // Apply damage
        const destroyed = damageEnemy(result.enemy, damage);
        
        return {
            enemy: result.enemy,
            destroyed,
            point: result.point
        };
    }
    
    return false;
}

// Check for area of effect collision (explosions, etc.)
function checkAreaCollision(center, radius, damage) {
    const hitEnemies = [];
    
    enemies.forEach(enemy => {
        // Distance to center of explosion
        const distance = enemy.position.distanceTo(center);
        
        // Check if within radius
        if (distance <= radius) {
            // Damage falls off with distance
            const falloff = 1 - (distance / radius);
            const actualDamage = damage * falloff;
            
            // Apply damage
            const destroyed = damageEnemy(enemy, actualDamage);
            
            hitEnemies.push({
                enemy,
                destroyed,
                distance
            });
        }
    });
    
    return hitEnemies.length > 0 ? hitEnemies : false;
}

// Check for player collisions with enemies
function checkPlayerCollisions(playerPosition) {
    // Don't check if player is still in immunity period
    if (Date.now() - lastDamageTime < PLAYER_COLLISION.damageImmunityTime) {
        return false;
    }
    
    // Update player hitbox
    updatePlayerHitbox(playerPosition);
    
    // Check collision with each enemy
    for (const enemy of enemies) {
        // Skip if enemy doesn't have userData
        if (!enemy.userData) continue;
        
        // Only do collision check if enemy is in attack range
        if (enemy.position.distanceTo(playerPosition) > 2) continue;
        
        // Get enemy hitbox
        const enemyHitbox = enemy.getObjectByName("hitbox");
        if (!enemyHitbox) continue;
        
        // Create a bounding box for the enemy
        const enemyBox = new THREE.Box3().setFromObject(enemyHitbox);
        
        // Check intersection between player and enemy boxes
        if (playerBoundingBox.intersectsBox(enemyBox)) {
            // Calculate damage based on enemy type
            let damage = 10; // Default damage
            
            switch (enemy.userData.type) {
                case 'BASIC':
                    damage = 10;
                    break;
                case 'FAST':
                    damage = 5;
                    break;
                case 'TANK':
                    damage = 20;
                    break;
                case 'FLYING':
                    damage = 15;
                    break;
            }
            
            // Apply damage to player
            takeDamage(damage);
            lastDamageTime = Date.now();
            
            // Knockback effect can be added here
            
            return {
                enemy,
                damage
            };
        }
    }
    
    return false;
}

// Check collision with projectile (for enemy attacks)
function checkProjectileCollision(projectile, playerPosition) {
    // Update player hitbox
    updatePlayerHitbox(playerPosition);
    
    // Create a bounding sphere for the projectile
    const projectileSphere = new THREE.Sphere(
        projectile.position.clone(),
        projectile.userData.radius || 0.5
    );
    
    // Check if projectile intersects with player box
    if (playerBoundingBox.intersectsSphere(projectileSphere)) {
        // Don't check if player is still in immunity period
        if (Date.now() - lastDamageTime < PLAYER_COLLISION.damageImmunityTime) {
            return false;
        }
        
        // Apply damage to player
        takeDamage(projectile.userData.damage || 10);
        lastDamageTime = Date.now();
        
        return true;
    }
    
    return false;
}

// Check for wall collisions (prevent walking through walls)
function checkWallCollisions(playerPosition, moveVector, wallObjects) {
    // Calculate future position
    const futurePosition = playerPosition.clone().add(moveVector);
    
    // Create a ray from current to future position
    const rayDirection = moveVector.clone().normalize();
    const ray = new THREE.Ray(playerPosition, rayDirection);
    
    // Check collision with all walls
    for (const wall of wallObjects) {
        // Skip if not a wall
        if (!wall.isMesh) continue;
        
        // Create a box for this wall
        const wallBox = new THREE.Box3().setFromObject(wall);
        
        // Check intersection
        const intersects = ray.intersectsBox(wallBox);
        
        if (intersects) {
            const distance = playerPosition.distanceTo(intersects);
            const playerRadius = PLAYER_COLLISION.radius;
            
            // If the wall is closer than the movement distance + player radius
            if (distance < moveVector.length() + playerRadius) {
                // Adjust movement to stop at the wall
                const stopDistance = Math.max(0, distance - playerRadius);
                moveVector.setLength(stopDistance);
                
                // Return true to indicate collision
                return true;
            }
        }
    }
    
    return false;
}

// Export collision system
export {
    checkWeaponCollision,
    checkRayCollision,
    checkAreaCollision,
    checkPlayerCollisions,
    checkProjectileCollision,
    checkWallCollisions,
    updatePlayerHitbox,
    togglePlayerHitbox,
    COLLISION_SETTINGS,
    PLAYER_COLLISION
};