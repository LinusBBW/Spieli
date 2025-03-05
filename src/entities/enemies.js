// Enemy entities (cubes)

import { scene } from '../core/scene.js';

// Array to store all cubes for raycasting
let cubes = [];

// Create a cube
function createCube(color, position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(...position);
    scene.add(cube);
    return cube;
}

// Setup initial cubes
function setupCubes() {
    // Original cubes
    const cube1 = createCube(0x00ff10, [-1.5, 0, 0]); // Green
    const cube2 = createCube(0xff0000, [1.5, 0, 0]);  // Red
    const cube3 = createCube(0x0000ff, [0, 0, 0]);    // Blue

    // Additional cubes
    const cube4 = createCube(0xffff00, [-3, 0, -3]); // Yellow
    const cube5 = createCube(0xff00ff, [3, 0, -3]);  // Magenta
    const cube6 = createCube(0x00ffff, [0, 0, -6]);  // Cyan
    const cube7 = createCube(0x888888, [-4, 0, 2]);  // Gray
    const cube8 = createCube(0xffa500, [4, 0, 2]);   // Orange

    // Store all cubes in the array
    cubes = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8];
    
    return cubes;
}

// Update cube animations
function updateCubes() {
    if (cubes.length > 0) {
        // Animate the first three cubes if they exist
        if (cubes[0]) cubes[0].rotation.y += 0.01;
        if (cubes[1]) cubes[1].rotation.y -= 0.01;
        if (cubes[2]) cubes[2].rotation.x += 0.02;
    }
}

export { cubes, setupCubes, createCube, updateCubes };