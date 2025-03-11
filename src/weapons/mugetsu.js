// Mugetsu weapon implementation - Ichigo's Final Getsuga Tensho form (without bandages)

import { scene, camera } from '../core/scene.js';
import { createScreenShake } from '../effects/animations.js';
import { createDestroyEffect } from '../effects/particles.js';
import { cubes } from '../entities/enemies.js';
import { activeFragments } from '../effects/particles.js';
import { showMugetsuCutScene } from './mugetsu-cutscene.js';

function createMugetsu(camera) {
    // Gruppe für die Mugetsu-Waffe
    const mugetsu = new THREE.Group();
    
    // Erstelle eine authentischere Klinge – länger, leicht gekrümmt und rein schwarz
    const points = [];
    for (let i = 0; i < 10; i++) {
        const t = i / 9;
        points.push(new THREE.Vector3(
            0.03 * Math.sin(t * Math.PI), // leichte Krümmung
            t * 1.2 - 0.6,                // Länge: 1.2 statt 0.9
            0
        ));
    }
    
    // Erzeuge die Klingen-Geometrie mittels LatheGeometry
    const bladeGeometry = new THREE.LatheGeometry(
        points, 
        12,             // Segmente um die Achse
        0,              // Startwinkel
        Math.PI * 0.3   // Teilrotation – Klinge ist nur ein Abschnitt
    );
    
    const bladeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,  // Reines Schwarz
        side: THREE.DoubleSide
    });
    
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    // Rotiere die Klinge um Z, sodass sie entlang der X-Achse verläuft
    blade.rotation.z = Math.PI / 2;
    // Dadurch zeigt der untere Rand (ursprünglich bei y = -0.6) nun in X-Richtung (ca. x = 0.6)
    
    // Erzeuge mehrere rote Glüh-Ebenen für dramatischen Effekt
    const glowCount = 3;
    for (let i = 0; i < glowCount; i++) {
        const scale = 1.1 + (i * 0.1);
        const glowGeometry = new THREE.LatheGeometry(
            points.map(p => new THREE.Vector3(p.x * scale, p.y, p.z * scale)), 
            12, 0, Math.PI * 0.3
        );
        
        const opacity = 0.2 - (i * 0.05);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.z = Math.PI / 2;
        
        // Speichere Animationsparameter in userData (wird z. B. in animateMugetsu genutzt)
        glow.userData = {
            pulseRate: 0.003 + (i * 0.001),
            baseOpacity: opacity
        };
        
        mugetsu.add(glow);
    }
    
    // Erstelle den Handle (Griff) – Standardmäßig liegt der Zylinder entlang der Y-Achse
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.025, 0.35, 16);
    const handleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x111111  // Dunkles Grau
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    // Damit der Griff entlang der X-Achse verläuft, rotiere ihn um -90° um die Z-Achse:
    handle.rotation.z = -Math.PI / 2;
    // Positioniere den Handle so, dass er an der Basis der Klinge ansetzt:
    // Die Basis der Klinge (unterer Rand) liegt bei ca. x = 0.6. Der Griff hat eine Länge von 0.35, 
    // sein Mittelpunkt sollte also bei 0.6 + 0.35/2 = 0.775 liegen.
    handle.position.set(0.775, 0, 0);
    
    // Füge Akzent-Ringe zum Handle hinzu – ebenfalls entlang der X-Achse positioniert.
    const ringCount = 5;
    for (let i = 0; i < ringCount; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.022, 0.004, 8, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x3A0000, // Dunkelrot
            transparent: true,
            opacity: 0.9
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        // Positioniere die Ringe entlang der X-Achse, beginnend ab ca. x = 0.6,
        // verteilt über einen Bereich von ca. 0.3 Einheiten (Offset -0.15 zur feinen Abstimmung)
        ring.position.x = 0.6 + (i / (ringCount - 1)) * 0.3 - 0.15;
        // Rotiere den Ring, damit er den Griff umschließt (Rotation um Y-Achse)
        ring.rotation.y = Math.PI / 2;
        
        mugetsu.add(ring);
    }
    
    // Füge Klinge und Handle zur Gruppe hinzu
    mugetsu.add(blade);
    mugetsu.add(handle);
    
    // (Optional: Weitere Elemente wie Partikel, dunkle Energie-Stränge etc. hier hinzufügen)
    
    // Positioniere die gesamte Waffe in der Szene
    mugetsu.position.set(0.3, -0.2, -0.5);
    mugetsu.rotation.x = Math.PI / 6;
    mugetsu.rotation.z = -Math.PI / 8;
    
    // Hänge die Waffe an die Kamera und verstecke sie standardmäßig
    camera.add(mugetsu);
    mugetsu.visible = false;
    
    return mugetsu;
}


// Create dark energy aura (instead of bandaged arm)
function createDarkAura(camera) {
    const auraGroup = new THREE.Group();
    
    // Create floating black energy wisps
    const wispCount = 15;
    for (let i = 0; i < wispCount; i++) {
        // Create curved wisps
        const points = [];
        const wispLength = 0.3 + Math.random() * 0.7; // Variable length strands
        const segments = 10;
        
        for (let j = 0; j < segments; j++) {
            const t = j / (segments-1);
            points.push(new THREE.Vector3(
                Math.sin(t * Math.PI * 0.5) * (Math.random() * 0.1), // Some curve
                t * wispLength, 
                Math.sin(t * Math.PI * 0.7) * (Math.random() * 0.05)
            ));
        }
        
        const wispGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            12, // Path segments
            0.003 + Math.random() * 0.002, // Thickness
            8,  // Radial segments
            false // Closed
        );
        
        const wispMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000, // Pure black
            transparent: true,
            opacity: 0.7 + Math.random() * 0.3
        });
        
        const wisp = new THREE.Mesh(wispGeometry, wispMaterial);
        
        // Position wisps around player
        const angle = (i / wispCount) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.2;
        
        wisp.position.set(
            Math.cos(angle) * radius,
            -0.3 + Math.random() * 0.5,
            Math.sin(angle) * radius
        );
        
        // Rotate to point outward
        wisp.rotation.x = Math.PI / 2;
        wisp.rotation.y = Math.random() * Math.PI * 0.2;
        wisp.rotation.z = angle + Math.PI / 2;
        
        // Add to group
        auraGroup.add(wisp);
        
        // Add animation parameters
        wisp.userData = {
            swaySpeed: 0.002 + Math.random() * 0.002,
            swayAmount: Math.random() * 0.05,
            phase: Math.random() * Math.PI * 2
        };
    }
    
    // Add smoky particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const size = 0.04 + Math.random() * 0.08;
        const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.3
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position around player
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.3;
        const height = -0.4 + Math.random() * 0.8;
        
        particle.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        // Animation parameters
        particle.userData = {
            floatSpeed: 0.0005 + Math.random() * 0.001,
            rotateSpeed: 0.001 + Math.random() * 0.002,
            originalY: height,
            originalOpacity: particle.material.opacity,
            phase: Math.random() * Math.PI * 2
        };
        
        auraGroup.add(particle);
    }
    
    // Add subtle red glow spots
    const glowCount = 8;
    for (let i = 0; i < glowCount; i++) {
        const size = 0.05 + Math.random() * 0.1;
        const glowGeometry = new THREE.SphereGeometry(size, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            transparent: true,
            opacity: 0.1 + Math.random() * 0.2
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        // Random position
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.15 + Math.random() * 0.25;
        
        glow.position.set(
            Math.cos(angle) * radius,
            -0.2 + Math.random() * 0.4,
            Math.sin(angle) * radius
        );
        
        // Animation parameters
        glow.userData = {
            pulseSpeed: 0.002 + Math.random() * 0.003,
            phase: Math.random() * Math.PI * 2,
            originalOpacity: glowMaterial.opacity
        };
        
        auraGroup.add(glow);
    }
    
    camera.add(auraGroup);
    
    // Hide by default
    auraGroup.visible = false;
    
    return auraGroup;
}

function animateMugetsu(mugetsu, deltaTime) {
    if (!mugetsu || !mugetsu.visible) return;
    
    // Gehe alle Kinder der Mugetsu-Gruppe durch und animiere nur diejenigen,
    // die spezifische Animationsparameter in userData besitzen.
    for (let i = 0; i < mugetsu.children.length; i++) {
        const child = mugetsu.children[i];
        
        // Falls das Kind einen Glow-Layer darstellt
        if (child.userData && child.userData.baseOpacity !== undefined) {
            const pulse = Math.sin(Date.now() * child.userData.pulseRate) * 0.3 + 0.7;
            child.material.opacity = child.userData.baseOpacity * pulse;
        }
        // Falls es sich um ein Partikel handelt (z. B. Energiepartikel)
        else if (child.userData && child.userData.initialY !== undefined) {
            child.userData.angle += child.userData.speed;
            child.position.set(
                Math.cos(child.userData.angle) * child.userData.radius,
                child.userData.initialY + Math.sin(Date.now() * child.userData.pulseSpeed) * 0.05,
                Math.sin(child.userData.angle) * child.userData.radius
            );
            child.rotation.x += child.userData.rotationSpeed;
            child.rotation.y += child.userData.rotationSpeed;
            const opacityPulse = Math.sin(Date.now() * 0.002 + i) * 0.3 + 0.7;
            child.material.opacity = (0.3 + Math.random() * 0.3) * opacityPulse;
        }
        // Falls es sich um einen dark energy Strand handelt
        else if (child.userData && child.userData.waveFactor !== undefined) {
            const time = Date.now() * child.userData.waveFactor;
            const wave = Math.sin(time + child.userData.phase) * child.userData.waveAmplitude;
            child.rotation.x = wave * 0.5;
            child.rotation.z = wave * 0.3;
        }
        // Kinder ohne spezifische Animationsparameter (z. B. Blade, Handle, Ringe) werden übersprungen.
    }
}


// Update dark aura animation
function animateDarkAura(aura, deltaTime) {
    if (!aura || !aura.visible) return;
    
    // Animate each wisp and particle
    for (let i = 0; i < aura.children.length; i++) {
        const child = aura.children[i];
        
        // Animate energy wisps
        if (child.userData && child.userData.swaySpeed !== undefined) {
            // Swaying motion
            const time = Date.now() * child.userData.swaySpeed;
            const sway = Math.sin(time + child.userData.phase) * child.userData.swayAmount;
            
            // Apply rotation sway
            child.rotation.y = (child.userData.phase * 0.1) + sway;
        }
        
        // Animate smoke particles
        else if (child.userData && child.userData.floatSpeed !== undefined) {
            // Floating motion
            const time = Date.now() * child.userData.floatSpeed;
            const float = Math.sin(time + child.userData.phase) * 0.1;
            
            // Move up and down slightly
            child.position.y = child.userData.originalY + float;
            
            // Rotate slowly
            child.rotation.y += child.userData.rotateSpeed;
            
            // Pulse opacity
            const opacity = child.userData.originalOpacity * (0.8 + Math.sin(time * 5) * 0.2);
            child.material.opacity = opacity;
        }
        
        // Animate red glow spots
        else if (child.userData && child.userData.pulseSpeed !== undefined) {
            // Pulsing effect
            const time = Date.now() * child.userData.pulseSpeed;
            const pulse = Math.sin(time + child.userData.phase) * 0.5 + 0.5;
            
            // Pulse opacity and size
            child.material.opacity = child.userData.originalOpacity * pulse;
            const scale = 0.8 + pulse * 0.4;
            child.scale.set(scale, scale, scale);
        }
    }
}

// Create a dark screen vignette effect for Mugetsu
function createDarkScreenOverlay() {
    // Create an overlay div
    const overlay = document.createElement('div');
    overlay.id = 'mugetsuOverlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1500';
    
    // Create a more dramatic vignette effect
    overlay.style.boxShadow = 'inset 0 0 150px 100px rgba(0, 0, 0, 0.9)';
    overlay.style.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)';
    
    // Add subtle red highlight
    const redGlow = document.createElement('div');
    redGlow.style.position = 'absolute';
    redGlow.style.top = '0';
    redGlow.style.left = '0';
    redGlow.style.width = '100%';
    redGlow.style.height = '100%';
    redGlow.style.background = 'radial-gradient(ellipse at center, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 30%, rgba(0,0,0,0) 70%)';
    redGlow.style.pointerEvents = 'none';
    overlay.appendChild(redGlow);
    
    // Add pulsing effect
    const pulseEffect = () => {
        let intensity = 0;
        let increasing = true;
        
        const pulse = () => {
            if (increasing) {
                intensity += 0.01;
                if (intensity >= 1) increasing = false;
            } else {
                intensity -= 0.01;
                if (intensity <= 0) increasing = true;
            }
            
            redGlow.style.opacity = 0.1 + intensity * 0.1;
            
            if (overlay.parentNode) {
                requestAnimationFrame(pulse);
            }
        };
        
        pulse();
    };
    
    // Initial opacity
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1s';
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Function to remove overlay
    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 1000);
    }
    
    // Function to show overlay
    function showOverlay() {
        overlay.style.opacity = '1';
        pulseEffect();
    }
    
    return {
        element: overlay,
        show: showOverlay,
        remove: removeOverlay
    };
}

// Enhanced Mugetsu attack effect
function createMugetsuAttack(position, direction) {
    // Group for the entire attack effect
    const attackGroup = new THREE.Group();
    
    // Create a more dramatic slashing wave effect
    // This shape will be more like a crescent/moon slash
    const slashShape = new THREE.Shape();
    
    // Draw a crescent shape
    slashShape.moveTo(0, -3);
    slashShape.bezierCurveTo(2, -2, 4, 0, 4, 3);    // Outer curve
    slashShape.bezierCurveTo(2, 5, -2, 5, -4, 3);   // Top curve
    slashShape.bezierCurveTo(-2, 0, -2, -2, 0, -3); // Inner curve
    
    // Extrude the shape to create a 3D slash
    const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.3,
        bevelSegments: 3
    };
    
    const slashGeometry = new THREE.ExtrudeGeometry(slashShape, extrudeSettings);
    const slashMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000, // Pure black
        transparent: true,
        opacity: 0.9
    });
    
    const slash = new THREE.Mesh(slashGeometry, slashMaterial);
    
    // Scale and position the slash
    slash.scale.set(1.5, 1.5, 1);
    slash.position.z = -0.5;
    attackGroup.add(slash);
    
    // Create a red glow outline following the slash shape
    const outlineGeometry = slashGeometry.clone();
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outline.scale.set(1.6, 1.6, 1.1); // Slightly larger than slash
    outline.position.z = -0.55;
    attackGroup.add(outline);
    
    // Add a black energy aura effect
    const auraParticleCount = 150;
    for (let i = 0; i < auraParticleCount; i++) {
        // Determine if this is a close or distant particle
        const isClose = Math.random() > 0.7;
        const size = isClose ? 0.4 + Math.random() * 0.8 : 0.1 + Math.random() * 0.3;
        
        // Different shapes for variety
        let geometry;
        const shapeType = Math.floor(Math.random() * 3);
        
        if (shapeType === 0) {
            geometry = new THREE.BoxGeometry(size, size, size * 0.5);
        } else if (shapeType === 1) {
            geometry = new THREE.TetrahedronGeometry(size);
        } else {
            geometry = new THREE.OctahedronGeometry(size * 0.7, 0);
        }
        
        // Color - mostly black, some red
        const isRed = Math.random() > 0.85;
        const material = new THREE.MeshBasicMaterial({
            color: isRed ? 0xFF0000 : 0x000000,
            transparent: true,
            opacity: isClose ? 0.8 : 0.4
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position around the slash with randomness
        // Follow crescent shape
        const t = Math.random(); // Parameter along curve
        const angle = t * Math.PI; // 0 to π
        const radius = 3 + Math.random() * 2;
        
        // Base position along slash crescent
        let xBase = Math.cos(angle) * radius * (1 - t * 0.3); // Crescent shape
        let yBase = Math.sin(angle) * radius;
        
        // Add randomness
        const randomOffset = isClose ? 0.5 : 2;
        particle.position.set(
            xBase + (Math.random() - 0.5) * randomOffset,
            yBase + (Math.random() - 0.5) * randomOffset,
            (Math.random() - 0.5) * 2 - 1
        );
        
        // Add slight rotation
        particle.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Add to attack group
        attackGroup.add(particle);
        
        // Add properties for animation
        particle.userData = {
            basePosition: particle.position.clone(),
            speed: 0.01 + Math.random() * 0.03,
            rotationSpeed: 0.01 + Math.random() * 0.04,
            pulseRange: 0.05 + Math.random() * 0.3,
            pulseFrequency: 0.001 + Math.random() * 0.003,
            phaseOffset: Math.random() * Math.PI * 2,
            originalOpacity: material.opacity
        };
    }
    
    // Position the attack
    attackGroup.position.copy(position);
    
    // Orient in the direction of attack
    const lookAt = position.clone().add(direction);
    attackGroup.lookAt(lookAt);
    
    // Add to scene
    scene.add(attackGroup);
    
    // Animation properties
    attackGroup.userData = {
        velocity: direction.clone().multiplyScalar(0.7), // Fast movement
        rotationSpeed: 0.01,
        lifeTime: 2.0, // seconds
        createTime: Date.now(),
        lastTrailTime: Date.now(),
        trailInterval: 40, // ms between trail effects
        hitObjects: new Set(), // Track hit objects
        angle: 0 // Initial angle for slash animation
    };
    
    // Custom update function
    attackGroup.update = function(now) {
        // Check lifetime
        const age = (now - this.userData.createTime) / 1000;
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Move forward
        this.position.add(this.userData.velocity);
        
        // Slightly rotate attack for dramatic effect
        this.rotation.z += this.userData.rotationSpeed;
        
        // Animate slash
        this.userData.angle += 0.03;
        const slashFactor = Math.sin(this.userData.angle) * 0.2 + 1;
        this.children[0].scale.set(1.5 * slashFactor, 1.5, 1);
        this.children[1].scale.set(1.6 * slashFactor, 1.6, 1.1);
        
        // Animate particles
        for (let i = 2; i < this.children.length; i++) {
            const particle = this.children[i];
            
            // Skip particles without userData
            if (!particle.userData || !particle.userData.basePosition) continue;
            
            // Calculate pulsing motion
            const pulse = Math.sin(now * particle.userData.pulseFrequency + particle.userData.phaseOffset);
            
            // Apply pulsing motion to position
            particle.position.x = particle.userData.basePosition.x + pulse * particle.userData.pulseRange;
            particle.position.y = particle.userData.basePosition.y + pulse * particle.userData.pulseRange;
            
            // Rotate particles
            particle.rotation.x += particle.userData.rotationSpeed;
            particle.rotation.y += particle.userData.rotationSpeed * 0.7;
            particle.rotation.z += particle.userData.rotationSpeed * 0.4;
            
            // Pulse opacity
            particle.material.opacity = particle.userData.originalOpacity * 
                (0.7 + Math.sin(now * 0.002 + i) * 0.3);
        }
        
        // Create trail effect
        if (now - this.userData.lastTrailTime > this.userData.trailInterval) {
            this.userData.lastTrailTime = now;
            createMugetsuTrail(this.position.clone(), this.quaternion.clone());
        }
        
        // Check for collisions with cubes
        checkMugetsuCollisions(this);
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(attackGroup);
    
    return attackGroup;
}

// Create twin energy spike attacks from the Mugetsu
function createMugetsuSpikes(originPosition, mainDirection) {
    // Group for both spikes
    const spikesGroup = new THREE.Group();
    
    // Create two spikes that extend from the main attack
    for (let i = 0; i < 2; i++) {
        // Create spike group (for easier manipulation)
        const spikeGroup = new THREE.Group();
        
        // Base spike geometry - long and sharp
        const spikeGeometry = new THREE.CylinderGeometry(0.05, 0.6, 8, 8);
        const spikeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000, // Pure black
            transparent: true,
            opacity: 0.9
        });
        
        // Rotate to point forward
        spikeGeometry.rotateX(Math.PI / 2);
        
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spikeGroup.add(spike);
        
        // Add red energy around the spike
        const energyGeometry = new THREE.CylinderGeometry(0.15, 0.7, 8.2, 8);
        const energyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000, // Red energy
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        
        // Rotate to match spike
        energyGeometry.rotateX(Math.PI / 2);
        
        const energy = new THREE.Mesh(energyGeometry, energyMaterial);
        spikeGroup.add(energy);
        
        // Add jagged details to make it look more menacing
        for (let j = 0; j < 5; j++) {
            const jaggedPartGeometry = new THREE.ConeGeometry(0.3, 1.2, 4);
            const jaggedPartMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.8
            });
            
            const jaggedPart = new THREE.Mesh(jaggedPartGeometry, jaggedPartMaterial);
            
            // Position along the spike
            jaggedPart.position.z = -3 + j * 1.5;
            
            // Random rotation for more chaotic look
            jaggedPart.rotation.z = Math.random() * Math.PI;
            
            // Alternate sides for the jagged parts
            if (j % 2 === 0) {
                jaggedPart.position.y = 0.5;
            } else {
                jaggedPart.position.y = -0.5;
            }
            
            spikeGroup.add(jaggedPart);
        }
        
        // Position and direction - spread the spikes at angles from the main direction
        const angle = (i === 0) ? -Math.PI/6 : Math.PI/6; // 30 degrees to each side
        
        // Create a new direction vector for this spike by rotating the main direction
        const spikeDirection = mainDirection.clone();
        
        // Create rotation axis (up vector for horizontal spread)
        const rotationAxis = new THREE.Vector3(0, 1, 0);
        
        // Apply rotation to the direction vector
        spikeDirection.applyAxisAngle(rotationAxis, angle);
        
        // Set position slightly behind the origin point
        const startPosition = originPosition.clone().sub(mainDirection.clone().multiplyScalar(1));
        spikeGroup.position.copy(startPosition);
        
        // Orient spike to point in its direction
        spikeGroup.lookAt(startPosition.clone().add(spikeDirection));
        
        // Set custom data for animation
        spikeGroup.userData = {
            velocity: spikeDirection.clone().multiplyScalar(0.7), // Slightly faster than main attack
            rotationSpeed: 0.02,
            lifeTime: 2.5, // Slightly longer than main attack
            createTime: Date.now(),
            hitObjects: new Set(), // Track what this spike has hit
            targetingDelay: i * 300 // Stagger the targeting of the spikes
        };
        
        // Add to the parent group
        spikesGroup.add(spikeGroup);
    }
    
    // Add to scene
    scene.add(spikesGroup);
    
    // Custom update function for the spikes group
    spikesGroup.update = function(now) {
        let anyActive = false;
        
        // Update each spike
        for (let i = 0; i < this.children.length; i++) {
            const spike = this.children[i];
            const age = (now - spike.userData.createTime) / 1000;
            
            // Check if lifetime is over
            if (age >= spike.userData.lifeTime) {
                continue; // Skip this spike
            }
            
            anyActive = true;
            
            // Initial delay for each spike to create staggered effect
            if (now - spike.userData.createTime < spike.userData.targetingDelay) {
                continue;
            }
            
            // Move spike forward
            spike.position.add(spike.userData.velocity);
            
            // Slight rotation for dynamic effect
            spike.rotation.z += 0.01;
            
            // Check for collisions with cubes
            checkSpikeCollisions(spike);
            
            // Create trail effect occasionally
            if (Math.random() > 0.8) {
                createSpikeTrail(spike.position.clone(), spike.quaternion.clone());
            }
        }
        
        return anyActive; // Continue animation if any spike is still active
    };
    
    // Add to active fragments
    activeFragments.push(spikesGroup);
    
    return spikesGroup;
}

// Create a trail effect behind the Mugetsu attack
function createMugetsuTrail(position, rotation) {
    const trailGroup = new THREE.Group();
    
    // Create a simpler version of the attack effect
    const trailGeometry = new THREE.BoxGeometry(4, 6, 1);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4
    });
    
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trailGroup.add(trail);
    
    // Red outline (simpler than the main attack)
    const outlineGeometry = new THREE.BoxGeometry(4.2, 6.2, 1.1);
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    trailGroup.add(outline);
    
    // Copy position and rotation
    trailGroup.position.copy(position);
    trailGroup.rotation.copy(rotation);
    
    // Add to scene
    scene.add(trailGroup);
    
    // Setup trail for fading
    trailGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.5, // Short lifetime
        velocity: new THREE.Vector3(0, 0, 0), // Static trail
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update function
    trailGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Fade out
        const fadeProgress = age / this.userData.lifeTime;
        this.children.forEach(child => {
            if (child.material) {
                child.material.opacity = child.material.opacity * (1 - fadeProgress);
            }
        });
        
        // Slowly stretch and thin the trail as it fades
        const stretchFactor = 1 + fadeProgress * 0.2;
        this.scale.z = Math.max(0.01, 1 - fadeProgress * 0.9);
        this.scale.x *= stretchFactor;
        this.scale.y *= stretchFactor;
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(trailGroup);
    
    return trailGroup;
}

// Create trail effect for the spike
function createSpikeTrail(position, rotation) {
    const trailGroup = new THREE.Group();
    
    // Simple black fragment
    const trailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6
    });
    
    const trail = new THREE.Mesh(trailGeometry, trailMaterial);
    trailGroup.add(trail);
    
    // Red energy effect
    const energyGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
    const energyMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    const energy = new THREE.Mesh(energyGeometry, energyMaterial);
    trailGroup.add(energy);
    
    // Copy position and rotation
    trailGroup.position.copy(position);
    trailGroup.quaternion.copy(rotation);
    
    // Add to scene
    scene.add(trailGroup);
    
    // Setup for fading
    trailGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.3, // Short lifetime
        velocity: new THREE.Vector3(0, 0, 0), // Static trail
        affectedByGravity: false,
        noRotation: true
    };
    
    // Custom update
    trailGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Fade out
        const fadeProgress = age / this.userData.lifeTime;
        this.children.forEach(child => {
            if (child.material) {
                child.material.opacity = child.material.opacity * (1 - fadeProgress);
            }
        });
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(trailGroup);
    
    return trailGroup;
}

// Check collisions between Mugetsu attack and cubes
function checkMugetsuCollisions(mugetsuAttack) {
    // The Mugetsu attack is so powerful it destroys all cubes in the path
    // Check each cube
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Skip cubes that have already been hit
        if (mugetsuAttack.userData.hitObjects.has(cube.id)) {
            continue;
        }
        
        // Calculate distance - Mugetsu has much larger hit radius
        const distance = mugetsuAttack.position.distanceTo(cube.position);
        
        // Large hit radius - Mugetsu is devastating
        const hitRadius = 4.0;
        if (distance < hitRadius) {
            // Mark as hit
            mugetsuAttack.userData.hitObjects.add(cube.id);
            
            // Create dramatic destruction effect
            createMugetsuDestructionEffect(cube.position, cube.material.color);
            
            // Remove the cube
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }
}

// Check collisions between spike and cubes
function checkSpikeCollisions(spike) {
    // Larger hit radius for the spike
    const hitRadius = 2.0;
    
    // Check each cube
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        
        // Skip cubes that have already been hit
        if (spike.userData.hitObjects.has(cube.id)) {
            continue;
        }
        
        // Calculate distance
        const distance = spike.position.distanceTo(cube.position);
        
        if (distance < hitRadius) {
            // Mark as hit
            spike.userData.hitObjects.add(cube.id);
            
            // Create special spike impact effect
            createSpikeImpactEffect(cube.position, cube.material.color);
            
            // Remove the cube
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }
}

// Create more dramatic destruction effect for Mugetsu
function createMugetsuDestructionEffect(position, originalColor) {
    // Create a group for the effect
    const effectGroup = new THREE.Group();
    
    // Central explosion
    const explosionGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red core
        transparent: true,
        opacity: 0.8
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    effectGroup.add(explosion);
    
    // Dark energy engulfing the explosion
    const darkEnergyGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const darkEnergyMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    
    const darkEnergy = new THREE.Mesh(darkEnergyGeometry, darkEnergyMaterial);
    effectGroup.add(darkEnergy);
    
    // Fragments flying outward
    const fragmentCount = 12;
    
    for (let i = 0; i < fragmentCount; i++) {
        // Create fragment with original cube color
        const fragmentGeometry = new THREE.TetrahedronGeometry(0.2, 0);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: originalColor,
            transparent: true,
            opacity: 0.9
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Position at center
        fragment.position.copy(position);
        
        // Add velocity in random direction
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.2;
        
        fragment.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * speed,
                Math.sin(elevation) * Math.sin(angle) * speed,
                Math.cos(elevation) * speed
            ),
            rotationSpeed: Math.random() * 0.2,
            gravity: 0.002
        };
        
        effectGroup.add(fragment);
    }
    
    // Position the effect
    effectGroup.position.copy(position);
    
    // Add to scene
    scene.add(effectGroup);
    
    // Setup animation properties
    effectGroup.userData = {
        createTime: Date.now(),
        lifeTime: 1.0, // 1 second
        velocity: new THREE.Vector3(0, 0, 0)
    };
    
    // Custom update function
    effectGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Explosion grows quickly then fades
        const explosionGrowth = Math.min(3.0, 1.0 + age * 4.0);
        this.children[0].scale.set(explosionGrowth, explosionGrowth, explosionGrowth);
        this.children[0].material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        
        // Dark energy grows faster and rotates
        const darkEnergyGrowth = Math.min(5.0, 1.0 + age * 8.0);
        this.children[1].scale.set(darkEnergyGrowth, darkEnergyGrowth, darkEnergyGrowth);
        this.children[1].rotation.y += 0.05;
        this.children[1].rotation.z += 0.03;
        this.children[1].material.opacity = 0.6 * (1 - age / this.userData.lifeTime);
        
        // Update fragments
        for (let i = 2; i < this.children.length; i++) {
            const fragment = this.children[i];
            
            // Move according to velocity
            fragment.position.add(fragment.userData.velocity);
            
            // Apply gravity
            fragment.userData.velocity.y -= fragment.userData.gravity;
            
            // Rotate fragment
            fragment.rotation.x += fragment.userData.rotationSpeed;
            fragment.rotation.y += fragment.userData.rotationSpeed;
            
            // Fade out
            fragment.material.opacity = 0.9 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(effectGroup);
    
    // Create screen shake
    createScreenShake(0.1, 0.9);
    
    return effectGroup;
}

// Create special impact effect for spike hit
function createSpikeImpactEffect(position, originalColor) {
    // Impact group
    const impactGroup = new THREE.Group();
    
    // Center explosion
    const explosionGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const explosionMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000, // Red core
        transparent: true,
        opacity: 0.7
    });
    
    const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
    impactGroup.add(explosion);
    
    // Black energy tendrils
    const tendrilCount = 6;
    
    for (let i = 0; i < tendrilCount; i++) {
        const tendrilGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.7 + Math.random() * 0.5);
        const tendrilMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        const tendril = new THREE.Mesh(tendrilGeometry, tendrilMaterial);
        
        // Random direction
        const angle = (i / tendrilCount) * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        
        // Position at center
        tendril.position.copy(position);
        
        // Orient in random direction
        tendril.rotation.x = Math.random() * Math.PI * 2;
        tendril.rotation.y = Math.random() * Math.PI * 2;
        tendril.rotation.z = Math.random() * Math.PI * 2;
        
        // Velocity for animation
        tendril.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * 0.1,
                Math.sin(elevation) * Math.sin(angle) * 0.1,
                Math.cos(elevation) * 0.1
            )
        };
        
        impactGroup.add(tendril);
    }
    
    // Add fragments of the original cube
    const fragmentCount = 8;
    
    for (let i = 0; i < fragmentCount; i++) {
        const fragmentGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
            color: originalColor,
            transparent: true,
            opacity: 0.9
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Random position near impact
        fragment.position.set(
            position.x + (Math.random() - 0.5) * 0.2,
            position.y + (Math.random() - 0.5) * 0.2,
            position.z + (Math.random() - 0.5) * 0.2
        );
        
        // Velocity for animation
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI;
        const speed = 0.05 + Math.random() * 0.1;
        
        fragment.userData = {
            velocity: new THREE.Vector3(
                Math.sin(elevation) * Math.cos(angle) * speed,
                Math.sin(elevation) * Math.sin(angle) * speed,
                Math.cos(elevation) * speed
            ),
            gravity: 0.002
        };
        
        impactGroup.add(fragment);
    }
    
    // Position the effect
    impactGroup.position.copy(position);
    
    // Add to scene
    scene.add(impactGroup);
    
    // Setup animation properties
    impactGroup.userData = {
        createTime: Date.now(),
        lifeTime: 0.8, // Shorter than main effect
        velocity: new THREE.Vector3(0, 0, 0)
    };
    
    // Custom update function
    impactGroup.update = function(now) {
        const age = (now - this.userData.createTime) / 1000;
        
        if (age >= this.userData.lifeTime) {
            return false; // Animation complete
        }
        
        // Explosion grows then fades
        const explosionGrowth = 1.0 + age * 3.0;
        this.children[0].scale.set(explosionGrowth, explosionGrowth, explosionGrowth);
        this.children[0].material.opacity = 0.7 * (1 - age / this.userData.lifeTime);
        
        // Update tendrils
        for (let i = 1; i < tendrilCount + 1; i++) {
            const tendril = this.children[i];
            
            // Move according to velocity
            tendril.position.add(tendril.userData.velocity);
            
            // Scale up slightly
            const scaleGrowth = 1.0 + age * 1.5;
            tendril.scale.set(1, 1, scaleGrowth);
            
            // Fade out
            tendril.material.opacity = 0.8 * (1 - age / this.userData.lifeTime);
        }
        
        // Update fragments
        for (let i = tendrilCount + 1; i < this.children.length; i++) {
            const fragment = this.children[i];
            
            // Move according to velocity
            fragment.position.add(fragment.userData.velocity);
            
            // Apply gravity
            fragment.userData.velocity.y -= fragment.userData.gravity;
            
            // Rotate fragment
            fragment.rotation.x += 0.05;
            fragment.rotation.y += 0.05;
            
            // Fade out
            fragment.material.opacity = 0.9 * (1 - age / this.userData.lifeTime);
        }
        
        return true; // Continue animation
    };
    
    // Add to active fragments
    activeFragments.push(impactGroup);
    
    // Small screen shake
    createScreenShake(0.05, 0.9);
    
    return impactGroup;
}

// Update Mugetsu special animation
function updateMugetsuAnimation(specialProgress, mugetsu, darkAura, controls, playerPosition, cameraDirection) {
    // Phases of the Mugetsu special
    // Phase 1: Preparation (0-0.3) - Raise arm & weapon
    // Phase 2: Activation (0.3-0.5) - Dark energy gathers
    // Phase 3: Release (0.5-0.6) - Launch attack
    // Phase 4: Aftermath (0.6-1.0) - Return to normal
    
    // Show dark aura during the special
    darkAura.visible = true;
    
    // Phase 1: Preparation
    if (specialProgress < 0.3) {
        const phaseProgress = specialProgress / 0.3;
        
        // Raise the sword
        mugetsu.position.set(
            0.3 - 0.3 * phaseProgress, // Move to center
            -0.2 + 0.8 * phaseProgress, // Raise higher
            -0.5 // Keep same distance
        );
        
        // Rotate to more vertical position
        mugetsu.rotation.x = Math.PI / 6 + (Math.PI / 3) * phaseProgress;
        mugetsu.rotation.z = -Math.PI / 8 * (1 - phaseProgress);
        
        // Dark energy strands more visible
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            // Identify strands by waveFactor in userData
            if (child.userData && child.userData.waveFactor !== undefined) {
                // Gradually increase length and opacity
                child.material.opacity = 0.4 + phaseProgress * 0.5;
                
                // Scale up strands
                const growFactor = 1.0 + phaseProgress * 2.0;
                child.scale.set(1.0, growFactor, 1.0);
                
                // Increase wave amount
                child.userData.waveAmplitude = 0.02 + phaseProgress * 0.08;
            }
        }
        
        // Blade starts to darken with energy
        if (mugetsu.children[0]) { // The blade
            mugetsu.children[0].material.color.setRGB(
                0.3 * (1 - phaseProgress), // Fade to black
                0.3 * (1 - phaseProgress),
                0.3 * (1 - phaseProgress)
            );
        }
        
        // Red glow intensifies - find glow layers
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            // Identify glow layers by checking for baseOpacity in userData
            if (child.userData && child.userData.baseOpacity !== undefined) {
                // Increase opacity for more intense glow
                child.material.opacity = child.userData.baseOpacity + phaseProgress * 0.5;
            }
        }
        
        // Position dark aura around player
        darkAura.position.set(0, -0.3 + 0.8 * phaseProgress, 0);
        
        // Gradually increase aura intensity
        for (let i = 0; i < darkAura.children.length; i++) {
            const child = darkAura.children[i];
            
            // Identify wisps
            if (child.userData && child.userData.swaySpeed !== undefined) {
                // Gradually increase opacity
                child.material.opacity = phaseProgress * 0.9;
                
                // Increase length/scale
                const growFactor = 0.2 + phaseProgress * 0.8;
                child.scale.set(1.0, growFactor, 1.0);
            }
            // Smoke particles
            else if (child.userData && child.userData.floatSpeed !== undefined) {
                child.material.opacity = 0.1 + phaseProgress * 0.3;
                
                // Increase size
                const scaleFactor = 0.5 + phaseProgress * 0.5;
                child.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
            // Red glow spots
            else if (child.userData && child.userData.pulseSpeed !== undefined) {
                child.material.opacity = 0.05 + phaseProgress * 0.25;
            }
        }
    }
    // Phase 2: Activation
    else if (specialProgress < 0.5) {
        const phaseProgress = (specialProgress - 0.3) / 0.2;
        
        // Hold position with more dramatic movements
        mugetsu.position.set(
            0.0 + Math.sin(phaseProgress * Math.PI * 6) * 0.03, // More intense shake
            0.6 + Math.sin(phaseProgress * Math.PI * 8) * 0.04, // More vertical movement
            -0.5 + Math.sin(phaseProgress * Math.PI * 4) * 0.02 // Add depth movement
        );
        
        // Increase rotation for more dramatics
        mugetsu.rotation.y = Math.sin(phaseProgress * Math.PI * 4) * 0.15; // Add side-to-side rotation
        
        // Blade gets pure black with pulsing intensity
        if (mugetsu.children[0]) {
            const pulseIntensity = Math.sin(phaseProgress * Math.PI * 12) * 0.2 + 0.8;
            mugetsu.children[0].material.color.setRGB(0, 0, 0);
            mugetsu.children[0].material.opacity = pulseIntensity;
        }
        
        // Red glow pulses more dramatically
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.baseOpacity !== undefined) {
                const pulseIntensity = Math.sin(phaseProgress * Math.PI * 15) * 0.5 + 0.5;
                child.material.opacity = (child.userData.baseOpacity + 0.5) * pulseIntensity;
                
                // Scale pulse for more dramatic effect
                const scalePulse = 1.0 + Math.sin(phaseProgress * Math.PI * 15) * 0.2;
                child.scale.set(scalePulse, 1.0, scalePulse);
            }
        }
        
        // More dramatic particles
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            // Identify particles
            if (child.userData && child.userData.initialY !== undefined) {
                // More erratic movement
                child.position.x += (Math.random() - 0.5) * 0.01;
                child.position.y += (Math.random() - 0.5) * 0.01;
                child.position.z += (Math.random() - 0.5) * 0.01;
                
                // Faster rotation
                child.rotation.x += 0.1;
                child.rotation.y += 0.1;
                child.rotation.z += 0.1;
                
                // Pulsing opacity
                child.material.opacity = 0.5 + Math.sin(Date.now() * 0.01 + i) * 0.5;
            }
        }
        
        // Dramatic shake as energy builds
        if (phaseProgress > 0.5) {
            createScreenShake(0.03 + (phaseProgress - 0.5) * 0.1, 0.85);
        }
        
        // Dark energy strands move more erratically
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.waveFactor !== undefined) {
                // Increase wave speed
                child.userData.waveFactor = 0.003 + phaseProgress * 0.004;
                child.userData.waveAmplitude = 0.1 + Math.sin(phaseProgress * Math.PI * 10) * 0.1;
            }
        }
        
        // Dark aura becomes more intense
        darkAura.position.set(
            0.0 + Math.sin(phaseProgress * Math.PI * 6) * 0.025,
            0.5 + Math.sin(phaseProgress * Math.PI * 8) * 0.035,
            0.0 + Math.sin(phaseProgress * Math.PI * 4) * 0.015
        );
        
        // More dramatic aura movement
        for (let i = 0; i < darkAura.children.length; i++) {
            const child = darkAura.children[i];
            
            // Energy wisps
            if (child.userData && child.userData.swaySpeed !== undefined) {
                // Increase sway speed and amount
                child.userData.swaySpeed += 0.0001;
                child.userData.swayAmount = Math.min(0.15, child.userData.swayAmount + 0.001);
                
                // Apply stronger rotation
                child.rotation.y += Math.sin(Date.now() * 0.005) * 0.05;
            }
            // Smoke particles
            else if (child.userData && child.userData.floatSpeed !== undefined) {
                // Faster float speed
                child.userData.floatSpeed += 0.0001;
                
                // More erratic movement
                child.position.x += (Math.random() - 0.5) * 0.01;
                child.position.z += (Math.random() - 0.5) * 0.01;
            }
            // Red glow spots
            else if (child.userData && child.userData.pulseSpeed !== undefined) {
                // Faster pulse
                child.userData.pulseSpeed += 0.0001;
                
                // Increase brightness
                child.material.opacity = Math.min(0.4, child.material.opacity + 0.005);
            }
        }
    }
    // Phase.3: Release - Enhanced with more dramatic positioning
    else if (specialProgress < 0.6) {
        const phaseProgress = (specialProgress - 0.5) / 0.1;
        
        // More dramatic sword position for the slash
        mugetsu.position.set(
            0.0,
            0.6 - phaseProgress * 1.0, // More dramatic downward movement
            -0.5 - phaseProgress * 0.3  // More forward movement
        );
        
        // More dramatic rotation during swing
        mugetsu.rotation.x = Math.PI / 6 + Math.PI / 3 - phaseProgress * (Math.PI / 1.5);
        mugetsu.rotation.z = phaseProgress * (Math.PI / 6); // Add twisting motion
        mugetsu.rotation.y = (1 - phaseProgress) * 0.2; // Reduce side rotation
        
        // Maximum glow intensity at release point
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.baseOpacity !== undefined) {
                child.material.opacity = 1.0;
                
                // Stretch glow during swing
                const stretchFactor = 1.0 + phaseProgress * 1.0;
                child.scale.set(1.0, stretchFactor, 1.0);
            }
        }
        
        // Dark energy strands stretch during slash
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.waveFactor !== undefined) {
                const stretchFactor = 1.0 + phaseProgress * 3.0;
                child.scale.set(1.0, stretchFactor, 1.0);
            }
        }
        
        // Energy particles streak during slash
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.initialY !== undefined) {
                // Create trailing effect on particles
                const trailFactor = 1.0 + phaseProgress * 3.0;
                child.scale.set(1.0, trailFactor, 1.0);
                
                // Align to swing direction
                child.rotation.x = -mugetsu.rotation.x;
            }
        }
        
        // Create the attack at the key moment with more dramatic timing
        if (specialProgress > 0.52 && specialProgress < 0.53) {
            // Get position in front of the player
            const attackPosition = playerPosition.clone().add(
                cameraDirection.clone().multiplyScalar(4) // Further away for better visibility
            );
            
            // Create the main Mugetsu attack
            const mainAttack = createMugetsuAttack(attackPosition, cameraDirection);
            
            // Add twin spike attacks that emerge after a short delay
            setTimeout(() => {
                createMugetsuSpikes(attackPosition, cameraDirection);
            }, 200); // Reduced delay for better timing
            
            // More dramatic screen shake
            createScreenShake(0.4, 0.85);
            
            // Create dark screen overlay - using the enhanced version
            const overlay = createDarkScreenOverlay();
            overlay.show();
            
            // Remove overlay after 4 seconds
            setTimeout(() => {
                overlay.remove();
            }, 4000);
        }
        
        // Dark aura expands during slash
        darkAura.position.set(
            0.0,
            0.5 - phaseProgress * 0.5,
            0.0
        );
        
        // Aura expands during attack
        for (let i = 0; i < darkAura.children.length; i++) {
            const child = darkAura.children[i];
            
            // Energy wisps
            if (child.userData && child.userData.swaySpeed !== undefined) {
                // Create trailing effect
                const trailFactor = 1.0 + phaseProgress * 2.0;
                child.scale.set(1.0, trailFactor, 1.0);
                
                // Align with swing
                child.rotation.x = Math.PI / 2 - phaseProgress * (Math.PI / 3);
            }
            // Smoke particles
            else if (child.userData && child.userData.floatSpeed !== undefined) {
                // Expand
                const expandFactor = 1.0 + phaseProgress * 3.0;
                child.scale.set(expandFactor, expandFactor, expandFactor);
                
                // Increase opacity briefly
                child.material.opacity = Math.min(0.8, child.material.opacity + 0.01);
            }
            // Red glow spots
            else if (child.userData && child.userData.pulseSpeed !== undefined) {
                // Expand
                const expandFactor = 1.0 + phaseProgress * 4.0;
                child.scale.set(expandFactor, expandFactor, expandFactor);
                
                // Increase brightness then fade
                if (phaseProgress < 0.5) {
                    child.material.opacity = Math.min(0.8, child.material.opacity + 0.03);
                } else {
                    child.material.opacity = Math.max(0.1, child.material.opacity - 0.03);
                }
            }
        }
    }
    // Phase 4: Aftermath - Enhanced to be more dramatic
    else {
        const phaseProgress = (specialProgress - 0.6) / 0.4;
        
        // Return to original position with subtle pulse
        mugetsu.position.set(
            0.3 * phaseProgress, // Back to side
            -0.2 + 0.2 * (1 - phaseProgress) + Math.sin(Date.now() * 0.003) * 0.02, // Subtle pulse
            -0.5
        );
        
        // Rotate back to normal with subtle movement
        mugetsu.rotation.x = Math.PI / 6 + Math.sin(Date.now() * 0.002) * 0.01;
        mugetsu.rotation.z = -Math.PI / 8 * phaseProgress + Math.sin(Date.now() * 0.002) * 0.01;
        
        // Energy strands gradually return to normal
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.waveFactor !== undefined) {
                // Return to normal scale
                const scaleFactor = Math.max(1.0, 4.0 - phaseProgress * 4.0);
                child.scale.set(1.0, scaleFactor, 1.0);
                
                // Reduce wave amplitude
                child.userData.waveAmplitude = Math.max(0.02, 0.1 - phaseProgress * 0.08);
                
                // Reduce opacity
                child.material.opacity = Math.max(0.4, 0.9 - phaseProgress * 0.5);
            }
        }
        
        // Particles gradually fade
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.initialY !== undefined) {
                // Fade opacity
                child.material.opacity = Math.max(0, 0.8 - phaseProgress * 0.8);
                
                // Return to normal scale
                const scaleFactor = Math.max(1.0, 2.0 - phaseProgress * 2.0);
                child.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
        }
        
        // Glow fades more gradually
        for (let i = 0; i < mugetsu.children.length; i++) {
            const child = mugetsu.children[i];
            if (child.userData && child.userData.baseOpacity !== undefined) {
                child.material.opacity = Math.max(
                    child.userData.baseOpacity, 
                    1.0 - phaseProgress * 0.8
                );
                
                // Return scale to normal
                const scaleFactor = Math.max(1.0, 2.0 - phaseProgress * 2.0);
                child.scale.set(scaleFactor, 1.0, scaleFactor);
            }
        }
        
        // Dark aura gradually fades
        for (let i = 0; i < darkAura.children.length; i++) {
            const child = darkAura.children[i];
            
            // Fade all elements
            if (child.material) {
                child.material.opacity = Math.max(0.05, child.material.opacity - 0.005);
            }
        }
        
        // Position aura back to normal
        darkAura.position.y = -0.3 * phaseProgress;
        
        // Only hide at the very end
        darkAura.visible = (phaseProgress < 0.98);
    }
}

export {
    createMugetsu,
    createDarkAura,
    updateMugetsuAnimation,
    createMugetsuAttack,
    animateMugetsu,
    animateDarkAura
};