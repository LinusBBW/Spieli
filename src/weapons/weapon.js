// Weapon system management

import { scene, camera, raycaster, mouse } from '../core/scene.js';
import { createSword, updateSwordSpecialAnimation } from './sword.js';
import { 
    createKatana, 
    updateBankaiAnimation,
    checkSenbonzakuraCubeHits
} from './katana.js';
import { 
    createWand,
    createArkanorb,
    removeArkanorb,
    arkanorbAttack,
    updateArkanorbAnimation
} from './wand.js';
import { 
    createZangetsu, 
    createTensaZangetsu,
    updateJuJishoAnimation,
    createJuJisho
} from './zangetsu.js';
import {
    createMugetsu,
    createDarkAura,
    updateMugetsuAnimation,
    animateMugetsu,
    animateDarkAura
} from './mugetsu.js';
import { 
    createScythe,
    animateScythe,
    updateDimensionalRiftAnimation,
    startDimensionalRiftSpecial
} from './scythe.js';
import { cubes } from '../entities/enemies.js';
import { createDestroyEffect, activeFragments } from '../effects/particles.js';
import { createMagicEffect } from '../effects/particles.js';
import { createEnergySlice, createScreenShake } from '../effects/animations.js';
import { showBankaiCutScene } from './bankai-cutscene.js';
import { showJuJishoCutScene } from './ju-jisho-cutscene.js';
import { showMugetsuCutScene } from './mugetsu-cutscene.js';

// Weapon state variables
let activeWeapon = "sword"; // "sword", "katana", "wand", "zangetsu", "mugetsu", or "scythe"
let isSwinging = false;
let swingProgress = 0;
let canDestroy = false;

// References to weapon objects
let sword, katana, wand, zangetsu, tensaZangetsu, mugetsu, darkAura, scythe;

// Original rotation for the sword (used for animations)
let originalSwordRotation = {
    x: Math.PI / 6,
    y: 0,
    z: -Math.PI / 8
};

// Special move variables - General
let isPerformingSpecial = false;
let specialProgress = 0;
let specialCooldown = 0;
let specialMaxCooldown = 180; // 3 seconds at 60 FPS
let originalCameraRotation = 0;

// Special move variables - Sword
let isSwordSpecialActive = false;
let swordSpecialCooldown = 0;
let swordSpecialMaxCooldown = 240; // 4 seconds at 60 FPS

// Special move variables - Wand
let isWandSpecialActive = false;
let wandSpecialDuration = 0;
let wandSpecialMaxDuration = 300; // 5 seconds at 60 FPS
let wandSpecialCooldown = 0;
let wandSpecialMaxCooldown = 240; // 4 seconds at 60 FPS
let arkanorb = null; // Reference to the arkanorb

// Special move variables - Zangetsu
let isZangetsuSpecialActive = false;
let zangetsuSpecialCooldown = 0;
let zangetsuSpecialMaxCooldown = 180; // 3 seconds at 60 FPS

// Special move variables - Mugetsu
let isMugetsuSpecialActive = false;
let mugetsuSpecialCooldown = 0;
let mugetsuSpecialMaxCooldown = 300; // 5 seconds at 60 FPS

// Special move variables - Scythe
let isDimensionalRiftActive = false;
let scytheSpecialCooldown = 0;
let scytheSpecialMaxCooldown = 240; // 4 seconds at 60 FPS

function setupWeaponEventListeners(controls) {
    // Right-click for swinging
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent default context menu
        swingWeapon();
    });
    
    // Middle mouse button for swinging
    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // Middle mouse button
            event.preventDefault();
            swingWeapon();
        }
    });
    
    // Keyboard controls for weapons - removed Q key for cycling
    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case 'KeyE':
                swingWeapon();
                break;
            case 'KeyF':
                activateSpecialMove(controls);
                break;
        }
    });
}

// Add a getter for the active weapon
function getActiveWeapon() {
    return activeWeapon;
}

// Initialize weapons
function initWeapons(camera, controls) {
    // Create weapons and attach to camera
    sword = createSword(camera);
    katana = createKatana(camera);
    wand = createWand(camera);
    zangetsu = createZangetsu(camera);
    tensaZangetsu = createTensaZangetsu(camera);
    mugetsu = createMugetsu(camera);
    darkAura = createDarkAura(camera);
    scythe = createScythe(camera);
    
    // Show initial weapon
    sword.visible = true;
    katana.visible = false;
    wand.visible = false;
    zangetsu.visible = false;
    tensaZangetsu.visible = false;
    mugetsu.visible = false;
    darkAura.visible = false;
    scythe.visible = false;
    
    // Set up event listeners
    setupWeaponEventListeners(controls);
    
    console.log("Weapons initialized successfully!");
}

// With this new function:
function selectWeapon(weaponId) {
    if (!isValidWeapon(weaponId)) {
        console.error(`Invalid weapon ID: ${weaponId}`);
        return;
    }
    
    // Hide all weapons first
    sword.visible = false;
    katana.visible = false;
    wand.visible = false;
    zangetsu.visible = false;
    tensaZangetsu.visible = false;
    mugetsu.visible = false;
    darkAura.visible = false;
    scythe.visible = false;
    
    // Set the active weapon
    activeWeapon = weaponId;
    
    // Show the selected weapon
    switch(weaponId) {
        case "sword":
            sword.visible = true;
            console.log("Sword selected");
            break;
        case "katana":
            katana.visible = true;
            console.log("Katana selected");
            break;
        case "wand":
            wand.visible = true;
            console.log("Wand selected");
            break;
        case "zangetsu":
            zangetsu.visible = true;
            tensaZangetsu.visible = true;
            console.log("Zangetsu and Tensa Zangetsu selected");
            break;
        case "mugetsu":
            mugetsu.visible = true;
            console.log("Mugetsu selected");
            break;
        case "scythe":
            scythe.visible = true;
            console.log("Scythe selected");
            break;
    }
}

// Helper function to validate weapon ID
function isValidWeapon(weaponId) {
    return ["sword", "katana", "wand", "zangetsu", "mugetsu", "scythe"].includes(weaponId);
}

// Get the currently active weapon object
function getActiveWeaponObject() {
    if (activeWeapon === "sword") {
        return sword;
    } else if (activeWeapon === "katana") {
        return katana;
    } else if (activeWeapon === "wand") {
        return wand;
    } else if (activeWeapon === "zangetsu") {
        return zangetsu;
    } else if (activeWeapon === "scythe") {
        return scythe;
    } else {
        return mugetsu;
    }
}

// Activate special move for the current weapon
function activateSpecialMove(controls) {
    if (activeWeapon === "sword" && !isPerformingSpecial && swordSpecialCooldown <= 0) {
        startSwordSpecial(controls);
        console.log("Sword special move activated");
    } else if (activeWeapon === "katana" && !isPerformingSpecial && specialCooldown <= 0) {
        startKatanaSpecial(controls);
        console.log("Katana special move activated");
    } else if (activeWeapon === "wand" && !isWandSpecialActive && wandSpecialCooldown <= 0) {
        startWandSpecial();
        console.log("Wand special move activated");
    } else if (activeWeapon === "zangetsu" && !isPerformingSpecial && zangetsuSpecialCooldown <= 0) {
        startZangetsuSpecial(controls);
        console.log("Zangetsu special move (Ju Jisho) activated");
    } else if (activeWeapon === "mugetsu" && !isPerformingSpecial && mugetsuSpecialCooldown <= 0) {
        startMugetsuSpecial(controls);
        console.log("Mugetsu special move activated");
    } else if (activeWeapon === "scythe" && !isPerformingSpecial && scytheSpecialCooldown <= 0) {
        // Use the callback pattern to update variables
        startDimensionalRiftSpecial(controls, () => {
            isPerformingSpecial = true;
            specialProgress = 0;
            isDimensionalRiftActive = true;
            
            // Save original camera rotation
            originalCameraRotation = camera.rotation.y;
        });
        console.log("Scythe dimensional rift activated");
    }
}

// Start swinging the weapon
function swingWeapon() {
    if (isSwinging) return; // Don't interrupt if already swinging
    
    isSwinging = true;
    swingProgress = 0;
    
    // Store original rotation
    originalSwordRotation = {
        x: Math.PI / 6,
        y: 0,
        z: -Math.PI / 8
    };
    
    console.log("Weapon swing started");
}

// Start the sword special move
function startSwordSpecial(controls) {
    isPerformingSpecial = true;
    specialProgress = 0;
    isSwordSpecialActive = true;
    
    // Save original camera rotation
    originalCameraRotation = camera.rotation.y;
    
    // Temporarily disable controls (for first half of animation)
    controls.enabled = false;
    
    // Apply screen shake for impact effect
    setTimeout(() => {
        createScreenShake(0.1, 0.85);
        controls.enabled = true;
    }, 800); // Timing for when sword hits ground
}

// Start the katana special move with dramatic cut scene
function startKatanaSpecial(controls) {
    // Disable controls immediately
    controls.enabled = false;
    
    // Show the Bankai cut scene
    showBankaiCutScene(() => {
        // This callback runs after the cut scene finishes
        
        // Now start the actual special move
        isPerformingSpecial = true;
        specialProgress = 0;
        
        // Save original camera rotation
        originalCameraRotation = camera.rotation.y;
        
        // Re-enable controls after another second
        setTimeout(() => {
            controls.enabled = true;
        }, 1000);
    });
}

// Start the wand special move
function startWandSpecial() {
    isWandSpecialActive = true;
    wandSpecialDuration = wandSpecialMaxDuration;
    
    // Create the arkanorb
    arkanorb = createArkanorb();
}

// Start the Zangetsu special move (Ju Jisho)
function startZangetsuSpecial(controls) {
    // Disable controls immediately
    controls.enabled = false;
    
    // Show the Ju Jisho cut scene
    showJuJishoCutScene(() => {
        // This callback runs after the cut scene starts to fade out
        
        // Start the special attack immediately
        isPerformingSpecial = true;
        specialProgress = 0;
        isZangetsuSpecialActive = true;
        
        // Save original camera rotation
        originalCameraRotation = camera.rotation.y;
        
        // Re-enable controls immediately to improve responsiveness
        controls.enabled = true;
        
        // Create a dramatic screen shake effect as the attack begins
        createScreenShake(0.1, 0.9);
        
        // Create Ju Jisho immediately after the cutscene
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        
        // Minimal delay to appear right after fade-out
        setTimeout(() => {
            // Position Ju Jisho in front of the player
            const juJishoPosition = camera.position.clone().add(
                cameraDirection.clone().multiplyScalar(2.5)
            );
            
            // Create the Ju Jisho attack
            createJuJisho(juJishoPosition, cameraDirection);
        }, 100);
    });
}

// Start the Mugetsu special move
function startMugetsuSpecial(controls) {
    // Disable controls immediately
    controls.enabled = false;
    
    // Show the Mugetsu cut scene
    showMugetsuCutScene(() => {
        // This callback runs after the cut scene
        
        // Start the actual special move
        isPerformingSpecial = true;
        specialProgress = 0;
        isMugetsuSpecialActive = true;
        
        // Save original camera rotation
        originalCameraRotation = camera.rotation.y;
        
        // Re-enable controls after a short delay
        setTimeout(() => {
            controls.enabled = true;
        }, 500);
    });
}

// Update weapon animations
function updateWeaponAnimations() {
    const activeWeaponObj = getActiveWeaponObject();
    
    // If not swinging, make the weapon hover slightly
    if (!isSwinging) {
        if (activeWeapon === "sword") {
            sword.position.y = -0.2 + Math.sin(Date.now() * 0.003) * 0.01;
            sword.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.002) * 0.05;
        } else if (activeWeapon === "katana") {
            katana.position.y = -0.2 + Math.sin(Date.now() * 0.003) * 0.01;
            katana.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.002) * 0.05;
        } else if (activeWeapon === "wand") {
            // Wand hovers more and rotates slightly
            wand.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.02;
            wand.rotation.y = Math.PI / 10 + Math.sin(Date.now() * 0.001) * 0.1;
            
            // Animation for the crystal on the wand
            const crystal = wand.children[5]; // The crystal is the sixth element
            const pulseFactor = (Math.sin(Date.now() * 0.005) + 1) / 2; // Value between 0 and 1
            
            // Pulsing effect for the crystal
            crystal.scale.set(
                0.8 + pulseFactor * 0.4,
                0.8 + pulseFactor * 0.4,
                0.8 + pulseFactor * 0.4
            );
            
            // Change color slightly for a glowing effect
            crystal.material.color.setHSL(
                0.55 + pulseFactor * 0.1, // Hue (blue to turquoise)
                0.8,                      // Saturation
                0.5 + pulseFactor * 0.3   // Brightness
            );
        } else if (activeWeapon === "zangetsu") {
            // Zangetsu has a more deliberate, weighty hover
            zangetsu.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.01;
            zangetsu.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.001) * 0.03;
        } else if (activeWeapon === "mugetsu") {
            // Enhanced Mugetsu hover animation
            mugetsu.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.015;
            mugetsu.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.001) * 0.03;
            
            // Call our enhanced animation function
            animateMugetsu(mugetsu, 1/60); // Assuming ~60fps
            
            // Animate dark aura if visible
            if (darkAura && darkAura.visible) {
                animateDarkAura(darkAura, 1/60);
            }
        } else if (activeWeapon === "scythe") {
            // Scythe hovers with mystical energy
            animateScythe(scythe, 1/60);
        }
        
        canDestroy = false; // Can't destroy when not swinging
    } else {
        // Weapon swing animation
        swingProgress += 0.05;
        
        if (swingProgress <= 1) {
            // First phase: Wind up
            if (swingProgress < 0.3) {
                const t = swingProgress / 0.3;
                
                if (activeWeapon === "wand") {
                    // Special wand animation
                    wand.rotation.y = Math.PI / 10 - (Math.PI / 4) * t;
                    wand.rotation.z = -Math.PI / 8 - (Math.PI / 6) * t;
                    
                    // Crystal glows brighter during swing
                    const crystal = wand.children[5];
                    crystal.scale.set(1 + t * 0.5, 1 + t * 0.5, 1 + t * 0.5);
                    crystal.material.color.setHSL(0.6, 0.8, 0.5 + t * 0.5);
                } else {
                    // Standard sword/katana/zangetsu/mugetsu animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x - (Math.PI / 4) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z - (Math.PI / 6) * t;
                }
                canDestroy = false; // No destruction in the wind-up phase
            }
            // Second phase: Swing
            else if (swingProgress < 0.7) {
                const t = (swingProgress - 0.3) / 0.4;
                
                if (activeWeapon === "wand") {
                    // Wand swing animation
                    wand.rotation.y = Math.PI / 10 - Math.PI / 4 + (Math.PI / 2) * t;
                    wand.rotation.z = -Math.PI / 8 - Math.PI / 6 + (Math.PI / 3) * t;
                    
                    // Create magic effect (during the main swing phase)
                    if (swingProgress > 0.4 && swingProgress < 0.6 && Math.random() > 0.7) {
                        // Get wand tip position
                        const wandTip = new THREE.Vector3();
                        wand.children[5].getWorldPosition(wandTip);
                        
                        // Get direction from camera
                        const direction = new THREE.Vector3();
                        camera.getWorldDirection(direction);
                        
                        // Create the magic effect
                        createMagicEffect(wandTip, direction);
                    }
                    
                    // Crystal pulses in the main phase
                    const crystal = wand.children[5];
                    const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1.3;
                    crystal.scale.set(pulse, pulse, pulse);
                    crystal.material.color.setHSL(0.6 - t * 0.1, 0.9, 0.7);
                } else {
                    // Standard sword/katana/zangetsu/mugetsu animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x - Math.PI / 4 + (Math.PI / 2) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z - Math.PI / 6 + (Math.PI / 3) * t;
                    
                    // Special trails for Mugetsu when swinging
                    if (activeWeapon === "mugetsu" && Math.random() > 0.7) {
                        // Find blade position
                        const bladePos = new THREE.Vector3();
                        if (mugetsu.children[0]) {
                            mugetsu.children[0].getWorldPosition(bladePos);
                            
                            // Create energy trail particles
                            for (let i = 0; i < 3; i++) {
                                const trailParticle = new THREE.Mesh(
                                    new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 4, 4),
                                    new THREE.MeshBasicMaterial({
                                        color: Math.random() > 0.7 ? 0xFF0000 : 0x000000,
                                        transparent: true,
                                        opacity: 0.5 + Math.random() * 0.3
                                    })
                                );
                                
                                // Position at blade with random offset
                                trailParticle.position.copy(bladePos);
                                trailParticle.position.x += (Math.random() - 0.5) * 0.1;
                                trailParticle.position.y += (Math.random() - 0.5) * 0.3;
                                trailParticle.position.z += (Math.random() - 0.5) * 0.1;
                                
                                // Add velocity properties
                                trailParticle.userData = {
                                    velocity: new THREE.Vector3(
                                        (Math.random() - 0.5) * 0.02,
                                        (Math.random() - 0.5) * 0.02,
                                        (Math.random() - 0.5) * 0.02
                                    ),
                                    lifeTime: 0.3 + Math.random() * 0.2,
                                    createTime: Date.now()
                                };
                                
                                // Add to scene and active fragments
                                scene.add(trailParticle);
                                activeFragments.push(trailParticle);
                            }
                        }
                    }
                }
                
                canDestroy = true; // Destruction possible in the main swing phase
                
                // Check for cube hits
                if (swingProgress > 0.4 && swingProgress < 0.6) {
                    checkCubeHits();
                }
            }
            // Third phase: Return to starting position
            else {
                const t = (swingProgress - 0.7) / 0.3;
                
                if (activeWeapon === "wand") {
                    // Wand return animation
                    wand.rotation.y = Math.PI / 10 + Math.PI / 4 - (Math.PI / 4) * t;
                    wand.rotation.z = -Math.PI / 8 + Math.PI / 6 - (Math.PI / 6) * t;
                    
                    // Crystal calms down
                    const crystal = wand.children[5];
                    crystal.scale.set(1.3 - t * 0.3, 1.3 - t * 0.3, 1.3 - t * 0.3);
                    crystal.material.color.setHSL(0.5, 0.8, 0.7 - t * 0.2);
                } else {
                    // Standard sword/katana/zangetsu/mugetsu animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x + Math.PI / 4 - (Math.PI / 4) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z + Math.PI / 6 - (Math.PI / 6) * t;
                }
                
                canDestroy = false; // No destruction in the return phase
            }
        } else {
            // End animation and return to original position
            if (activeWeapon === "sword") {
                sword.rotation.x = originalSwordRotation.x;
                sword.rotation.z = originalSwordRotation.z;
            } else if (activeWeapon === "katana") {
                katana.rotation.x = originalSwordRotation.x;
                katana.rotation.z = originalSwordRotation.z;
            } else if (activeWeapon === "zangetsu") {
                zangetsu.rotation.x = originalSwordRotation.x;
                zangetsu.rotation.z = originalSwordRotation.z;
            } else if (activeWeapon === "mugetsu") {
                mugetsu.rotation.x = originalSwordRotation.x;
                mugetsu.rotation.z = originalSwordRotation.z;
            } else if (activeWeapon === "scythe") {
                scythe.rotation.x = originalSwordRotation.x;
                scythe.rotation.z = originalSwordRotation.z;
            } else {
                // Reset wand
                wand.rotation.y = Math.PI / 10;
                wand.rotation.z = -Math.PI / 8;
                
                // Reset crystal
                const crystal = wand.children[5];
                crystal.scale.set(1, 1, 1);
                crystal.material.color.setHSL(0.55, 0.8, 0.5);
            }
            isSwinging = false;
        }
    }
}

// Check if a cube is hit by the weapon
function checkCubeHits() {
    if (!canDestroy) return;
    
    // Create a raycaster from the camera position in the direction of view
    raycaster.setFromCamera(mouse, camera);
    
    // Check if a cube is hit
    const intersects = raycaster.intersectObjects(cubes);
    
    if (intersects.length > 0) {
        // The nearest hit cube
        const hitCube = intersects[0].object;
        
        // Remove the cube from the scene
        scene.remove(hitCube);
        
        // Remove the cube from the list of cubes
        const index = cubes.indexOf(hitCube);
        if (index > -1) {
            cubes.splice(index, 1);
        }
        
        // Create a destruction effect at the position of the hit cube
        createDestroyEffect(hitCube.position, hitCube.material.color);
        
        console.log("Cube destroyed!");
    }
}

// Update weapon specials
function updateWeaponSpecials(controls) {
    // Update special move cooldowns
    if (specialCooldown > 0) {
        specialCooldown--;
    }
    
    if (swordSpecialCooldown > 0) {
        swordSpecialCooldown--;
    }
    
    if (wandSpecialCooldown > 0) {
        wandSpecialCooldown--;
    }
    
    if (zangetsuSpecialCooldown > 0) {
        zangetsuSpecialCooldown--;
    }
    
    if (mugetsuSpecialCooldown > 0) {
        mugetsuSpecialCooldown--;
    }
    
    if (scytheSpecialCooldown > 0) {
        scytheSpecialCooldown--;
    }
    
    // Special move animations based on active weapon
    if (isPerformingSpecial) {
        // Update the special progress
        specialProgress += 0.01; // Slower speed for better effects
        
        if (specialProgress <= 1) {
            if (isSwordSpecialActive) {
                // Sword special animation
                updateSwordSpecialAnimation(specialProgress, sword, controls, originalCameraRotation);
            } else if (isZangetsuSpecialActive) {
                // Zangetsu Ju Jisho animation
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                updateJuJishoAnimation(specialProgress, zangetsu, controls, camera.position.clone(), cameraDirection);
            } else if (isMugetsuSpecialActive) {
                // Mugetsu Final Getsuga Tensho animation
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                updateMugetsuAnimation(specialProgress, mugetsu, darkAura, controls, camera.position.clone(), cameraDirection);
            } else if (isDimensionalRiftActive) {
                // Dimensional Rift animation
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                updateDimensionalRiftAnimation(specialProgress, scythe, controls, camera.position.clone(), cameraDirection);
            } else {
                // Katana Bankai animation - Senbonzakura Kageyoshi
                updateBankaiAnimation(specialProgress, katana, controls, originalCameraRotation, camera.position.clone());
                
                // Check for cube hits from the petal fragments
                checkSenbonzakuraCubeHits();
            }
        } else {
            // End special move
            isPerformingSpecial = false;
            
            if (isSwordSpecialActive) {
                swordSpecialCooldown = swordSpecialMaxCooldown;
                isSwordSpecialActive = false;
                
                // Reset sword
                sword.position.set(0.3, -0.2, -0.5);
                sword.rotation.x = Math.PI / 6;
                sword.rotation.z = -Math.PI / 8;
                sword.children[2].material.color.setRGB(0.75, 0.75, 0.75); // Reset blade color
                sword.children[2].scale.set(1, 1, 1); // Reset blade scale
            } else if (isZangetsuSpecialActive) {
                zangetsuSpecialCooldown = zangetsuSpecialMaxCooldown;
                isZangetsuSpecialActive = false;
                
                // Reset zangetsu
                zangetsu.position.set(0.3, -0.2, -0.5);
                zangetsu.rotation.x = Math.PI / 6;
                zangetsu.rotation.z = -Math.PI / 8;
                zangetsu.rotation.y = 0;
                zangetsu.children[1].material.color.setRGB(0.67, 0.67, 0.67); // Reset blade color
            } else if (isMugetsuSpecialActive) {
                mugetsuSpecialCooldown = mugetsuSpecialMaxCooldown;
                isMugetsuSpecialActive = false;
                
                // Reset mugetsu 
                mugetsu.position.set(0.3, -0.2, -0.5);
                mugetsu.rotation.x = Math.PI / 6;
                mugetsu.rotation.z = -Math.PI / 8;
                
                // Reset glow layers and particles
                for (let i = 0; i < mugetsu.children.length; i++) {
                    const child = mugetsu.children[i];
                    if (child.userData && child.userData.baseOpacity !== undefined) {
                        child.material.opacity = child.userData.baseOpacity;
                        child.scale.set(1.0, 1.0, 1.0);
                    }
                    else if (child.userData && child.userData.initialY !== undefined) {
                        child.material.opacity = 0.4;
                        child.scale.set(1.0, 1.0, 1.0);
                    }
                }
                
                // Hide dark aura
                darkAura.visible = false;
            } else if (isDimensionalRiftActive) {
                scytheSpecialCooldown = scytheSpecialMaxCooldown;
                isDimensionalRiftActive = false;
                
                // Reset scythe
                scythe.position.set(0.4, -0.3, -0.6);
                scythe.rotation.x = Math.PI / 6;
                scythe.rotation.z = -Math.PI / 8;
                scythe.userData.riftEnergy = 0;
            } else {
                specialCooldown = specialMaxCooldown;
                
                // Reset katana
                katana.visible = true;
                katana.position.set(0.3, -0.2, -0.5);
                katana.rotation.x = Math.PI / 6;
                katana.rotation.z = -Math.PI / 8;
                katana.children[2].material.color.setRGB(0.75, 0.75, 0.75); // Silver
                katana.children[2].scale.set(1, 1, 1); // Original size
            }
        }
    }
    
    // Wand special move (Arkanorb) animation
    if (isWandSpecialActive) {
        // Decrease special move duration
        wandSpecialDuration--;
        
        // Update the arkanorb
        if (arkanorb) {
            updateArkanorbAnimation(arkanorb, camera);
        }
        
        // End special move if duration is over
        if (wandSpecialDuration <= 0) {
            isWandSpecialActive = false;
            wandSpecialCooldown = wandSpecialMaxCooldown;
            removeArkanorb(arkanorb);
            arkanorb = null;
        }
    }
}

export { 
    initWeapons,
    updateWeaponAnimations,
    updateWeaponSpecials,
    activeWeapon,
    swingWeapon,
    isPerformingSpecial,
    specialProgress,
    specialCooldown,
    specialMaxCooldown,
    isWandSpecialActive,
    wandSpecialDuration,
    wandSpecialMaxDuration,
    wandSpecialCooldown,
    wandSpecialMaxCooldown,
    isSwordSpecialActive,
    swordSpecialCooldown,
    swordSpecialMaxCooldown,
    zangetsuSpecialCooldown,
    zangetsuSpecialMaxCooldown,
    isZangetsuSpecialActive,
    isMugetsuSpecialActive,
    mugetsuSpecialCooldown,
    mugetsuSpecialMaxCooldown,
    scytheSpecialCooldown,
    scytheSpecialMaxCooldown,
    isDimensionalRiftActive,
    originalCameraRotation,
    // Add these two new exports:
    selectWeapon,
    getActiveWeapon
};