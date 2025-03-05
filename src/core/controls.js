// Player movement and controls
import { scene } from './scene.js';
import { createDashEffect } from '../effects/particles.js';

// Control variables
let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveSpeed = 0.2;
let movementVector = new THREE.Vector3();

// Jump variables
let isJumping = false;
let jumpHeight = 0;
let jumpVelocity = 0.15;
let gravity = 0.008;
let playerHeight = 0;

// Dash variables
let isDashing = false;
let dashDuration = 0;
let dashMaxDuration = 10; // Frames
let dashSpeed = 0.8;
let dashCooldown = 0;
let dashMaxCooldown = 45; // ~0.75 seconds at 60 FPS
let dashDirection = new THREE.Vector3();

// Initialize controls
function initControls(camera) {
    controls = new THREE.PointerLockControls(camera, document.body);
    
    // Set up event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    return controls;
}

// Key down handler
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW': case 'ArrowUp':
            moveForward = true;
            break;
        case 'KeyS': case 'ArrowDown':
            moveBackward = true;
            break;
        case 'KeyA': case 'ArrowLeft':
            moveLeft = true;
            break;
        case 'KeyD': case 'ArrowRight':
            moveRight = true;
            break;
        case 'Space':
            if (!isJumping) {
                isJumping = true;
                jumpHeight = 0;
                jumpVelocity = 0.15;
                console.log("Jump initiated");
            }
            break;
        case 'ShiftLeft': case 'ShiftRight':
            if (!isDashing && dashCooldown <= 0 && (moveForward || moveBackward || moveLeft || moveRight)) {
                isDashing = true;
                dashDuration = dashMaxDuration;
                
                // Save current movement direction for dash
                dashDirection.copy(movementVector).normalize();
                
                console.log("Dash initiated");
            }
            break;
    }
    
    // Update movement status
    updateMovementStatus();
}

// Key up handler
function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW': case 'ArrowUp':
            moveForward = false;
            break;
        case 'KeyS': case 'ArrowDown':
            moveBackward = false;
            break;
        case 'KeyA': case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'KeyD': case 'ArrowRight':
            moveRight = false;
            break;
    }
    
    // Update movement status
    updateMovementStatus();
}

// Update movement status
function updateMovementStatus() {
    return moveForward || moveBackward || moveLeft || moveRight;
}

// Update player movement based on controls
function updateMovement(camera) {
    // Calculate movement direction based on camera orientation
    const speed = moveSpeed;
    
    // Reset movement vector
    movementVector.x = 0;
    movementVector.z = 0;
    
    // Update movement based on keys
    if (moveForward) movementVector.z += speed;
    if (moveBackward) movementVector.z -= speed;
    if (moveLeft) movementVector.x -= speed;
    if (moveRight) movementVector.x += speed;
    
    // Normalize for consistent speed in all directions
    if (movementVector.length() > 0) {
        movementVector.normalize().multiplyScalar(speed);
    }
    
    // Apply camera rotation to movement
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;  // Only horizontal movement
    cameraDirection.normalize();
    
    // Calculate movement direction relative to camera orientation
    const forward = cameraDirection.clone();
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    const moveX = movementVector.x * right.x + movementVector.z * forward.x;
    const moveZ = movementVector.x * right.z + movementVector.z * forward.z;
    
    // Apply movement
    camera.position.x += moveX;
    camera.position.z += moveZ;
    
    return { moveX, moveZ };
}

// Update dash state
function updateDash(camera) {
    // Update dash cooldown
    if (dashCooldown > 0) {
        dashCooldown--;
    }
    
    // Handle active dash
    if (isDashing) {
        // Calculate dash direction based on camera orientation
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        let dashX = 0;
        let dashZ = 0;
        
        if (moveForward) dashZ += 1;
        if (moveBackward) dashZ -= 1;
        if (moveLeft) dashX -= 1;
        if (moveRight) dashX += 1;
        
        // If there's movement, dash in that direction
        if (dashX !== 0 || dashZ !== 0) {
            const dashVector = new THREE.Vector3(dashX, 0, dashZ).normalize();
            dashX = dashVector.x * right.x + dashVector.z * forward.x;
            dashZ = dashVector.x * right.z + dashVector.z * forward.z;
        } 
        // Otherwise dash in the direction the player is facing
        else {
            dashX = forward.x;
            dashZ = forward.z;
        }
        
        // Apply dash movement
        camera.position.x += dashX * dashSpeed;
        camera.position.z += dashZ * dashSpeed;
        
        // Create dash effect (moved to animation loop for consistency)
        if (dashDuration % 2 === 0) {
            createDashEffect(camera.position);
        }
        
        // Decrease dash duration
        dashDuration--;
        
        // End dash if duration is over
        if (dashDuration <= 0) {
            isDashing = false;
            dashCooldown = dashMaxCooldown;
        }
        
        return true; // Dash is active
    }
    
    return false; // Dash is not active
}

// Update jumping
function updateJump(camera) {
    if (isJumping) {
        // Jump movement
        jumpHeight += jumpVelocity;
        jumpVelocity -= gravity;
        
        // If jump is over (back on the ground)
        if (jumpHeight <= 0) {
            jumpHeight = 0;
            isJumping = false;
            jumpVelocity = 0;
        }
        
        // Update player height based on jump
        playerHeight = jumpHeight;
    } else {
        playerHeight = 0;
    }
    
    // Update camera height based on jump
    camera.position.y = playerHeight;
    
    return isJumping;
}

// Export controls and functions
export { 
    controls, initControls, updateMovement, updateDash, updateJump,
    moveForward, moveBackward, moveLeft, moveRight,
    isJumping, isDashing, dashCooldown, dashMaxCooldown,
    playerHeight
};