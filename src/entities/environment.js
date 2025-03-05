// Environment objects like floor and walls

import { scene } from '../core/scene.js';

// Create floor
function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    // Simple material instead of texture
    const floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444,  // Dark gray
        side: THREE.DoubleSide
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2; // Orient horizontally
    floor.position.y = -2; // Position below the cubes
    scene.add(floor);
    
    return floor;
}

// Create walls
function createWalls() {
    const walls = new THREE.Group();
    
    // Material for the walls
    const wallMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8888aa,
        side: THREE.DoubleSide
    });
    
    // Wall dimensions
    const wallHeight = 5;
    const roomSize = 15;
    
    // Create four walls
    const wallGeometry1 = new THREE.PlaneGeometry(roomSize, wallHeight);
    const wall1 = new THREE.Mesh(wallGeometry1, wallMaterial);
    wall1.position.z = -roomSize/2;
    wall1.position.y = wallHeight/2 - 2;
    
    const wallGeometry2 = new THREE.PlaneGeometry(roomSize, wallHeight);
    const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial);
    wall2.position.z = roomSize/2;
    wall2.position.y = wallHeight/2 - 2;
    wall2.rotation.y = Math.PI;
    
    const wallGeometry3 = new THREE.PlaneGeometry(roomSize, wallHeight);
    const wall3 = new THREE.Mesh(wallGeometry3, wallMaterial);
    wall3.position.x = -roomSize/2;
    wall3.position.y = wallHeight/2 - 2;
    wall3.rotation.y = Math.PI/2;
    
    const wallGeometry4 = new THREE.PlaneGeometry(roomSize, wallHeight);
    const wall4 = new THREE.Mesh(wallGeometry4, wallMaterial);
    wall4.position.x = roomSize/2;
    wall4.position.y = wallHeight/2 - 2;
    wall4.rotation.y = -Math.PI/2;
    
    walls.add(wall1);
    walls.add(wall2);
    walls.add(wall3);
    walls.add(wall4);
    
    scene.add(walls);
    
    return walls;
}

// Create the environment
function createEnvironment() {
    const floor = createFloor();
    const walls = createWalls();
    
    return { floor, walls };
}

export { createEnvironment, createFloor, createWalls };