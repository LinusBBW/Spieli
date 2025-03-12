// src/entities/weaponbench.js

import { scene } from '../core/scene.js';
import { createWeaponBenchUI, hideWeaponBenchUI } from '../ui/weaponbench.js';

// Store reference to the weapon bench
let weaponBench;
// Track if player is near bench
let isNearBench = false;

// Function to get the weapon bench reference
function getWeaponBench() {
    return weaponBench;
}

// Create weapon bench
function createWeaponBench() {
    // Create a group for the weapon bench
    const benchGroup = new THREE.Group();
    
    // Add ambient point light for the bench area
    const benchLight = new THREE.PointLight(0xDDAA22, 0.8, 5);
    benchLight.position.set(0, 2, 0);
    benchGroup.add(benchLight);
    
    // Fancy workbench base with carved design
    const tableGeometry = new THREE.BoxGeometry(2.5, 0.15, 1.2);
    const tableMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8B4513,
        wireframe: false
    });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0.5;
    benchGroup.add(table);
    
    // Table edge trim
    const tableEdgeGeometry = new THREE.BoxGeometry(2.6, 0.04, 1.3);
    const tableEdgeMaterial = new THREE.MeshBasicMaterial({ color: 0xA36834 });
    const tableEdge = new THREE.Mesh(tableEdgeGeometry, tableEdgeMaterial);
    tableEdge.position.y = 0.58;
    benchGroup.add(tableEdge);
    
    // Ornate carved table legs
    const legPositions = [
        { x: -1.1, z: -0.5 }, // Back left
        { x: -1.1, z: 0.5 },  // Front left
        { x: 1.1, z: -0.5 },  // Back right
        { x: 1.1, z: 0.5 }    // Front right
    ];
    
    legPositions.forEach(pos => {
        // Create a nicer leg with multiple segments
        const legGroup = new THREE.Group();
        legGroup.position.set(pos.x, 0, pos.z);
        
        // Main leg segment
        const legMainGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1, 8);
        const legMainMaterial = new THREE.MeshBasicMaterial({ color: 0x5D3A21 });
        const legMain = new THREE.Mesh(legMainGeometry, legMainMaterial);
        legMain.position.y = 0;
        legGroup.add(legMain);
        
        // Decorative top part
        const legTopGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.08, 8);
        const legTopMaterial = new THREE.MeshBasicMaterial({ color: 0x8B5A2B });
        const legTop = new THREE.Mesh(legTopGeometry, legTopMaterial);
        legTop.position.y = 0.5;
        legGroup.add(legTop);
        
        // Decorative bottom part
        const legBottomGeometry = new THREE.CylinderGeometry(0.08, 0.14, 0.1, 8);
        const legBottomMaterial = new THREE.MeshBasicMaterial({ color: 0x8B5A2B });
        const legBottom = new THREE.Mesh(legBottomGeometry, legBottomMaterial);
        legBottom.position.y = -0.5;
        legGroup.add(legBottom);
        
        // Foot
        const footGeometry = new THREE.CylinderGeometry(0.14, 0.15, 0.05, 8);
        const footMaterial = new THREE.MeshBasicMaterial({ color: 0x523920 });
        const foot = new THREE.Mesh(footGeometry, footMaterial);
        foot.position.y = -0.55;
        legGroup.add(foot);
        
        benchGroup.add(legGroup);
    });
    
    // Weapon display back panel with elegant design
    const backPanelGeometry = new THREE.BoxGeometry(2.3, 1.8, 0.1);
    const backPanelMaterial = new THREE.MeshBasicMaterial({ color: 0x3D2617 });
    const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
    backPanel.position.set(0, 1.35, -0.5);
    benchGroup.add(backPanel);
    
    // Back panel decorative frame
    const frameGeometry = new THREE.BoxGeometry(2.5, 2, 0.05);
    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0xC1933D }); // Golden frame
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 1.35, -0.55);
    benchGroup.add(frame);
    
    // Fancy display shelves
    const shelfGeometry = new THREE.BoxGeometry(2, 0.08, 0.3);
    const shelfMaterial = new THREE.MeshBasicMaterial({ color: 0x5D4037 });
    
    // Create three shelves at different heights
    for(let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(0, 0.7 + i * 0.5, -0.3);
        benchGroup.add(shelf);
        
        // Add shelf supports/brackets
        const leftBracket = createBracket();
        leftBracket.position.set(-0.9, 0.7 + i * 0.5, -0.3);
        benchGroup.add(leftBracket);
        
        const rightBracket = createBracket();
        rightBracket.position.set(0.9, 0.7 + i * 0.5, -0.3);
        benchGroup.add(rightBracket);
    }
    
    // Main display pedestal with glowing effect
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, 0.6, 0.2);
    
    // Base pedestal
    const pedestalBaseGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.12, 16);
    const pedestalBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x36454F }); // Charcoal
    const pedestalBase = new THREE.Mesh(pedestalBaseGeometry, pedestalBaseMaterial);
    pedestalBase.position.y = -0.05;
    pedestalGroup.add(pedestalBase);
    
    // Middle section
    const pedestalMiddleGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.1, 16);
    const pedestalMiddleMaterial = new THREE.MeshBasicMaterial({ color: 0x607D8B });
    const pedestalMiddle = new THREE.Mesh(pedestalMiddleGeometry, pedestalMiddleMaterial);
    pedestalMiddle.position.y = 0.06;
    pedestalGroup.add(pedestalMiddle);
    
    // Top display platform
    const pedestalTopGeometry = new THREE.CylinderGeometry(0.28, 0.25, 0.05, 16);
    const pedestalTopMaterial = new THREE.MeshBasicMaterial({ color: 0x263238 });
    const pedestalTop = new THREE.Mesh(pedestalTopGeometry, pedestalTopMaterial);
    pedestalTop.position.y = 0.13;
    pedestalGroup.add(pedestalTop);
    
    // Add glowing ring to pedestal
    const glowRingGeometry = new THREE.TorusGeometry(0.28, 0.02, 8, 32);
    const glowRingMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3498DB, 
        transparent: true,
        opacity: 0.7
    });
    const glowRing = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.15;
    pedestalGroup.add(glowRing);
    
    // Add blue light above pedestal
    const pedestalLight = new THREE.PointLight(0x3498DB, 0.8, 2);
    pedestalLight.position.set(0, 0.5, 0);
    pedestalGroup.add(pedestalLight);
    
    // Add userData for animation
    pedestalGroup.userData = {
        glowRing: glowRing,
        glowPhase: 0,
        light: pedestalLight
    };
    
    benchGroup.add(pedestalGroup);
    benchGroup.userData = {
        pedestalGroup: pedestalGroup
    };
    
    // Add decorative display weapons
    addDecorativeWeapons(benchGroup);
    
    // Add a fancy sign with "Weapon Forge" text
    createWeaponForgeSign(benchGroup);
    
    // Add realistic weapon stands
    addWeaponStands(benchGroup);
    
    // Add decorative elements
    addDecorativeElements(benchGroup);
    
    // Create an invisible collision box for interaction detection
    const interactionBoxGeometry = new THREE.BoxGeometry(4, 3, 3);
    const interactionBoxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        transparent: true,
        opacity: 0.0 // Invisible
    });
    const interactionBox = new THREE.Mesh(interactionBoxGeometry, interactionBoxMaterial);
    interactionBox.position.y = 1;
    benchGroup.name = "weaponBench"; // For raycasting
    interactionBox.name = "weaponBenchTrigger";
    benchGroup.add(interactionBox);
    
    // Position the bench in the room
    benchGroup.position.set(5, -1.9, 0); // Position near a wall
    
    // Add bench to scene
    scene.add(benchGroup);
    
    // Create update function for animations
    benchGroup.update = function(time) {
        // Animate the pedestal's glow ring
        if (this.userData.pedestalGroup) {
            const pedestal = this.userData.pedestalGroup;
            
            // Update glow phase
            pedestal.userData.glowPhase += 0.02;
            
            // Pulse the glow ring
            const pulse = Math.sin(pedestal.userData.glowPhase) * 0.5 + 0.5;
            pedestal.userData.glowRing.material.opacity = 0.4 + pulse * 0.6;
            pedestal.userData.glowRing.scale.set(
                1 + pulse * 0.1,
                1 + pulse * 0.1,
                1 + pulse * 0.1
            );
            
            // Change light intensity
            pedestal.userData.light.intensity = 0.5 + pulse * 1.0;
            
            // Rotate the ring slowly
            pedestal.userData.glowRing.rotation.z += 0.01;
        }
    };
    
    // Store reference
    weaponBench = benchGroup;
    
    return benchGroup;
}

// Helper function to create a decorative bracket
function createBracket() {
    const bracketGroup = new THREE.Group();
    
    // Main support
    const mainGeometry = new THREE.BoxGeometry(0.04, 0.1, 0.25);
    const mainMaterial = new THREE.MeshBasicMaterial({ color: 0x3F302B });
    const main = new THREE.Mesh(mainGeometry, mainMaterial);
    main.position.y = -0.05;
    bracketGroup.add(main);
    
    // Decorative top piece
    const topGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.06);
    const topMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(0, 0, -0.08);
    bracketGroup.add(top);
    
    return bracketGroup;
}

// Add decorative display weapons
function addDecorativeWeapons(benchGroup) {
    // Sword display
    const swordGroup = new THREE.Group();
    swordGroup.position.set(-0.7, 1.2, -0.3);
    
    // Sword blade
    const bladeGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.01);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xE0E0E0 }); // Silvery
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.2;
    swordGroup.add(blade);
    
    // Sword guard
    const guardGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.02);
    const guardMaterial = new THREE.MeshBasicMaterial({ color: 0xB29000 }); // Gold
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.y = -0.1;
    swordGroup.add(guard);
    
    // Sword handle
    const handleGeometry = new THREE.BoxGeometry(0.03, 0.2, 0.015);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 }); // Brown
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.2;
    swordGroup.add(handle);
    
    benchGroup.add(swordGroup);
    
    // Katana display
    const katanaGroup = new THREE.Group();
    katanaGroup.position.set(0, 1.7, -0.3);
    katanaGroup.rotation.z = -Math.PI / 8; // Slight angle
    
    // Katana blade - curved
    const katanaBladeGeometry = new THREE.BoxGeometry(0.04, 0.7, 0.01);
    const katanaBladeMaterial = new THREE.MeshBasicMaterial({ color: 0xE8E8E8 });
    const katanaBlade = new THREE.Mesh(katanaBladeGeometry, katanaBladeMaterial);
    katanaBlade.position.y = 0.2;
    // Create curve by applying small rotation
    katanaBlade.rotation.z = 0.05;
    katanaGroup.add(katanaBlade);
    
    // Katana guard (tsuba)
    const tsubaGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.01, 12);
    const tsubaMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const tsuba = new THREE.Mesh(tsubaGeometry, tsubaMaterial);
    tsuba.rotation.x = Math.PI / 2;
    tsuba.position.y = -0.15;
    katanaGroup.add(tsuba);
    
    // Katana handle
    const katanaHandleGeometry = new THREE.BoxGeometry(0.03, 0.25, 0.015);
    const katanaHandleMaterial = new THREE.MeshBasicMaterial({ color: 0xA31313 }); // Red
    const katanaHandle = new THREE.Mesh(katanaHandleGeometry, katanaHandleMaterial);
    katanaHandle.position.y = -0.3;
    katanaGroup.add(katanaHandle);
    
    benchGroup.add(katanaGroup);
    
    // Magic wand display
    const wandGroup = new THREE.Group();
    wandGroup.position.set(0.7, 1.2, -0.3);
    
    // Wand staff
    const wandStaffGeometry = new THREE.CylinderGeometry(0.01, 0.02, 0.6, 8);
    const wandStaffMaterial = new THREE.MeshBasicMaterial({ color: 0x513D30 });
    const wandStaff = new THREE.Mesh(wandStaffGeometry, wandStaffMaterial);
    wandGroup.add(wandStaff);
    
    // Wand crystal top
    const crystalGeometry = new THREE.OctahedronGeometry(0.06, 0);
    const crystalMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00BFFF,
        transparent: true,
        opacity: 0.8
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.y = 0.35;
    crystal.userData = {
        originalY: 0.35,
        phaseOffset: Math.random() * Math.PI * 2
    };
    wandGroup.add(crystal);
    
    benchGroup.add(wandGroup);
}

// Create sign for the weapon forge
function createWeaponForgeSign(benchGroup) {
    // Sign container
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 2.5, -0.4);
    
    // Sign board
    const signGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.05);
    const signMaterial = new THREE.MeshBasicMaterial({ color: 0x2C3E50 }); // Dark blue
    const signBoard = new THREE.Mesh(signGeometry, signMaterial);
    signGroup.add(signBoard);
    
    // Sign border
    const borderGeometry = new THREE.BoxGeometry(2, 0.7, 0.03);
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xC1933D }); // Gold
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.02;
    signGroup.add(border);
    
    // Sign text (using geometry since we can't use TextGeometry)
    // Creative approximation of text using small boxes
    const textGroup = new THREE.Group();
    textGroup.position.set(-0.7, 0, 0.03);
    
    // "WEAPON FORGE" - represented by thin vertical and horizontal lines
    // W
    createTextPart(textGroup, -0.6, 0, 0.02, 0.2);
    createTextPart(textGroup, -0.5, 0, 0.02, 0.2);
    createTextPart(textGroup, -0.55, -0.08, 0.08, 0.02);
    
    // E
    createTextPart(textGroup, -0.4, 0, 0.02, 0.2);
    createTextPart(textGroup, -0.35, 0.08, 0.08, 0.02);
    createTextPart(textGroup, -0.35, 0, 0.08, 0.02);
    createTextPart(textGroup, -0.35, -0.08, 0.08, 0.02);
    
    // A
    createTextPart(textGroup, -0.2, 0, 0.02, 0.2);
    createTextPart(textGroup, -0.1, 0, 0.02, 0.2);
    createTextPart(textGroup, -0.15, 0.08, 0.08, 0.02);
    createTextPart(textGroup, -0.15, 0, 0.08, 0.02);
    
    // P
    createTextPart(textGroup, 0, 0, 0.02, 0.2);
    createTextPart(textGroup, 0.05, 0.08, 0.08, 0.02);
    createTextPart(textGroup, 0.05, 0, 0.08, 0.02);
    createTextPart(textGroup, 0.1, 0.04, 0.02, 0.06);
    
    // O
    createTextPart(textGroup, 0.25, 0, 0.02, 0.2);
    createTextPart(textGroup, 0.35, 0, 0.02, 0.2);
    createTextPart(textGroup, 0.3, 0.08, 0.08, 0.02);
    createTextPart(textGroup, 0.3, -0.08, 0.08, 0.02);
    
    // N
    createTextPart(textGroup, 0.5, 0, 0.02, 0.2);
    createTextPart(textGroup, 0.6, 0, 0.02, 0.2);
    createTextPart(textGroup, 0.55, 0.04, 0.04, 0.02);
    
    // Add to sign
    signGroup.add(textGroup);
    
    // Add sign to bench
    benchGroup.add(signGroup);
}

// Helper to create text part for sign
function createTextPart(group, x, y, width, height) {
    const geometry = new THREE.BoxGeometry(width, height, 0.01);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold
    const part = new THREE.Mesh(geometry, material);
    part.position.set(x, y, 0);
    group.add(part);
}

// Add weapon stands
function addWeaponStands(benchGroup) {
    // Weapon stand positions
    const standPositions = [
        { x: -0.8, y: 0.65, z: 0.2 },
        { x: 0.8, y: 0.65, z: 0.2 }
    ];
    
    standPositions.forEach(pos => {
        // Stand base
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.18, 0.05, 8);
        const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x36454F });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(pos.x, pos.y - 0.1, pos.z);
        benchGroup.add(base);
        
        // Stand column
        const columnGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
        const columnMaterial = new THREE.MeshBasicMaterial({ color: 0x607D8B });
        const column = new THREE.Mesh(columnGeometry, columnMaterial);
        column.position.set(pos.x, pos.y + 0.05, pos.z);
        benchGroup.add(column);
        
        // Stand mount
        const mountGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const mountMaterial = new THREE.MeshBasicMaterial({ color: 0x263238 });
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.set(pos.x, pos.y + 0.2, pos.z);
        benchGroup.add(mount);
    });
}

// Add decorative elements
function addDecorativeElements(benchGroup) {
    // Add a crafting book
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-1, 0.65, 0.4);
    bookGroup.rotation.y = Math.PI / 6;
    
    // Book base
    const bookBaseGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.25);
    const bookBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x8B0000 }); // Dark red
    const bookBase = new THREE.Mesh(bookBaseGeometry, bookBaseMaterial);
    bookGroup.add(bookBase);
    
    // Book pages
    const pagesGeometry = new THREE.BoxGeometry(0.27, 0.01, 0.22);
    const pagesMaterial = new THREE.MeshBasicMaterial({ color: 0xF5F5DC }); // Beige
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.position.y = 0.03;
    bookGroup.add(pages);
    
    benchGroup.add(bookGroup);
    
    // Add crafting materials
    const materialsGroup = new THREE.Group();
    materialsGroup.position.set(1, 0.65, 0.4);
    
    // Leather roll
    const leatherGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const leatherMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const leather = new THREE.Mesh(leatherGeometry, leatherMaterial);
    leather.rotation.x = Math.PI / 2;
    leather.position.set(-0.1, 0, -0.1);
    materialsGroup.add(leather);
    
    // Metal ingot
    const ingotGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.2);
    const ingotMaterial = new THREE.MeshBasicMaterial({ color: 0xA9A9A9 });
    const ingot = new THREE.Mesh(ingotGeometry, ingotMaterial);
    ingot.position.set(0.1, 0, 0.05);
    materialsGroup.add(ingot);
    
    benchGroup.add(materialsGroup);
    
    // Add a small magical gem
    const gemGeometry = new THREE.OctahedronGeometry(0.07, 0);
    const gemMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFF00FF, 
        transparent: true,
        opacity: 0.7
    });
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.position.set(0, 0.68, 0.4);
    gem.userData = {
        rotationSpeed: 0.02,
        hoverHeight: 0.05,
        hoverSpeed: 0.003,
        phaseOffset: Math.random() * Math.PI * 2,
        originalY: 0.68
    };
    
    // Add light to gem
    const gemLight = new THREE.PointLight(0xFF00FF, 0.5, 1);
    gemLight.position.set(0, 0, 0);
    gem.add(gemLight);
    
    benchGroup.add(gem);
}

// Check if player is near the weapon bench
function checkPlayerNearBench(playerPosition) {
    if (!weaponBench) return false;
    
    // Calculate distance to bench
    const benchPosition = weaponBench.position.clone();
    const distance = playerPosition.distanceTo(benchPosition);
    
    // If player is within range
    const wasNearBench = isNearBench;
    isNearBench = distance < 3; // 3 units range
    
    // Handle state change
    if (isNearBench && !wasNearBench) {
        // Player just entered range
        createWeaponBenchUI();
    } else if (!isNearBench && wasNearBench) {
        // Player just left range
        hideWeaponBenchUI();
    }
    
    return isNearBench;
}

// Check if player is near the bench
function isPlayerNearBench() {
    return isNearBench;
}

export { createWeaponBench, checkPlayerNearBench, isPlayerNearBench, getWeaponBench };