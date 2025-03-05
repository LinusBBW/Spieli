// Crosshair UI element

// Create a crosshair
function createCrosshair(camera) {
    const crosshairSize = 0.01; // Small size for the crosshair
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [
        new THREE.Vector3(-crosshairSize, 0, -0.5), new THREE.Vector3(crosshairSize, 0, -0.5), // Horizontal line
        new THREE.Vector3(0, -crosshairSize, -0.5), new THREE.Vector3(0, crosshairSize, -0.5)  // Vertical line
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const crosshair = new THREE.LineSegments(geometry, material);
    
    // Add crosshair to camera so it stays in view
    camera.add(crosshair);
    
    return crosshair;
}

export { createCrosshair };