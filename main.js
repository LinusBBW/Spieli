// Funktion zum Erstellen der HP-Bar
const createHealthBar = () => {
    // Container für die HP-Bar
    const healthBarContainer = document.createElement('div');
    healthBarContainer.id = 'healthBarContainer';
    healthBarContainer.style.position = 'absolute';
    healthBarContainer.style.top = '20px';
    healthBarContainer.style.left = '20px';
    healthBarContainer.style.width = '200px';
    healthBarContainer.style.height = '20px';
    healthBarContainer.style.backgroundColor = '#333';
    healthBarContainer.style.border = '2px solid #fff';
    healthBarContainer.style.borderRadius = '10px';
    healthBarContainer.style.overflow = 'hidden';
    
    // Innerer Balken für die aktuelle Gesundheit
    const healthFill = document.createElement('div');
    healthFill.id = 'healthFill';
    healthFill.style.width = '100%';
    healthFill.style.height = '100%';
    healthFill.style.backgroundColor = '#2ecc71'; // Grün
    healthFill.style.transition = 'width 0.2s, background-color 0.5s';
    
    // Numerischer HP-Wert
    const healthText = document.createElement('div');
    healthText.id = 'healthText';
    healthText.style.position = 'absolute';
    healthText.style.width = '100%';
    healthText.style.textAlign = 'center';
    healthText.style.lineHeight = '20px';
    healthText.style.color = '#fff';
    healthText.style.fontFamily = 'Arial, sans-serif';
    healthText.style.fontWeight = 'bold';
    healthText.style.textShadow = '1px 1px 2px #000';
    healthText.innerText = `${playerCurrentHealth}/${playerMaxHealth}`;
    
    // Zusammensetzen
    healthBarContainer.appendChild(healthFill);
    healthBarContainer.appendChild(healthText);
    document.body.appendChild(healthBarContainer);
};

// Funktion zum Aktualisieren der HP-Bar
const updateHealthBar = () => {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    
    if (healthFill && healthText) {
        // Prozentsatz der aktuellen Gesundheit berechnen
        const healthPercentage = (playerCurrentHealth / playerMaxHealth) * 100;
        
        // Farbe der HP-Bar basierend auf der Gesundheit anpassen
        let healthColor;
        if (healthPercentage > 70) {
            healthColor = '#2ecc71'; // Grün
        } else if (healthPercentage > 30) {
            healthColor = '#f39c12'; // Orange
        } else {
            healthColor = '#e74c3c'; // Rot
        }
        
        // Blinkeffekt, wenn der Spieler unverwundbar ist
        if (isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            healthColor = '#3498db'; // Blaues Blinken für Unverwundbarkeit
        }
        
        // HP-Bar aktualisieren
        healthFill.style.width = `${healthPercentage}%`;
        healthFill.style.backgroundColor = healthColor;
        
        // Text aktualisieren
        healthText.innerText = `${Math.ceil(playerCurrentHealth)}/${playerMaxHealth}`;
    }
};

// Funktion zum Empfangen von Schaden
const takeDamage = (amount) => {
    // Wenn der Spieler unverwundbar ist, keinen Schaden nehmen
    if (isInvulnerable) return;
    
    // Schaden nehmen
    playerCurrentHealth -= amount;
    
    // Auf 0 begrenzen
    if (playerCurrentHealth < 0) {
        playerCurrentHealth = 0;
    }
    
    // Zeit des letzten Schadens speichern
    lastDamageTime = Date.now();
    
    // Kurze Unverwundbarkeitsphase
    isInvulnerable = true;
    invulnerabilityTime = invulnerabilityDuration;
    
    // Bildschirm-Feedback für Schaden
    createDamageEffect();
    
    // Prüfen, ob der Spieler tot ist
    if (playerCurrentHealth <= 0) {
        gameOver();
    }
};

// Funktion zum Heilen
const heal = (amount) => {
    playerCurrentHealth += amount;
    
    // Auf Maximum begrenzen
    if (playerCurrentHealth > playerMaxHealth) {
        playerCurrentHealth = playerMaxHealth;
    }
};

// Funktion für die Gesundheitsregeneration
const regenerateHealth = () => {
    // Nur regenerieren, wenn der Spieler in den letzten 5 Sekunden keinen Schaden genommen hat
    if (Date.now() - lastDamageTime > 5000 && playerCurrentHealth < playerMaxHealth) {
        playerCurrentHealth += healthRegenerationRate;
        
        // Auf Maximum begrenzen
        if (playerCurrentHealth > playerMaxHealth) {
            playerCurrentHealth = playerMaxHealth;
        }
    }
};

// Funktion für visuelles Feedback bei Schaden
const createDamageEffect = () => {
    // Roter Overlay-Effekt als Schadensfeedback
    const damageOverlay = document.createElement('div');
    damageOverlay.style.position = 'absolute';
    damageOverlay.style.top = '0';
    damageOverlay.style.left = '0';
    damageOverlay.style.width = '100%';
    damageOverlay.style.height = '100%';
    damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    damageOverlay.style.pointerEvents = 'none';
    damageOverlay.style.transition = 'opacity 0.5s';
    damageOverlay.style.zIndex = '1000';
    document.body.appendChild(damageOverlay);
    
    // Screen-Shake-Effekt
    const originalPosition = camera.position.clone();
    const shakeIntensity = 0.05;
    const shakeDecay = 0.9;
    let shakeAmount = shakeIntensity;
    
    const shakeScreen = () => {
        if (shakeAmount <= 0.001) {
            camera.position.copy(originalPosition);
            return;
        }
        
        camera.position.x = originalPosition.x + (Math.random() - 0.5) * shakeAmount;
        camera.position.y = originalPosition.y + (Math.random() - 0.5) * shakeAmount;
        camera.position.z = originalPosition.z + (Math.random() - 0.5) * shakeAmount;
        
        shakeAmount *= shakeDecay;
        requestAnimationFrame(shakeScreen);
    };
    
    shakeScreen();
    
    // Overlay nach einer Sekunde entfernen
    setTimeout(() => {
        damageOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(damageOverlay);
        }, 500);
    }, 1000);
};

// Game Over Funktion
const gameOver = () => {
    // Erstelle einen Game Over Bildschirm
    const gameOverScreen = document.createElement('div');
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.zIndex = '2000';
    
    // Text
    const gameOverText = document.createElement('h1');
    gameOverText.innerText = 'GAME OVER';
    gameOverText.style.color = '#e74c3c';
    gameOverText.style.fontFamily = 'Arial, sans-serif';
    gameOverText.style.fontSize = '50px';
    gameOverText.style.marginBottom = '20px';
    
    // Neustart-Button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Neustart';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '20px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.backgroundColor = '#3498db';
    restartButton.style.color = '#fff';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    
    // Event-Listener für den Neustart
    restartButton.addEventListener('click', () => {
        // Spieler wiederbeleben
        playerCurrentHealth = playerMaxHealth;
        document.body.removeChild(gameOverScreen);
        
        // Steuerung wieder aktivieren
        controls.enabled = true;
    });
    
    // Zum Game Over Bildschirm hinzufügen
    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(restartButton);
    document.body.appendChild(gameOverScreen);
    
    // Steuerung deaktivieren
    controls.enabled = false;
};

// Funktion zum Aktualisieren des Gesundheitssystems
const updateHealthSystem = () => {
    // Unverwundbarkeitszeit aktualisieren
    if (isInvulnerable) {
        invulnerabilityTime--;
        if (invulnerabilityTime <= 0) {
            isInvulnerable = false;
        }
    }
    
    // Gesundheitsregeneration
    regenerateHealth();
    
    // HP-Bar aktualisieren
    updateHealthBar();
};

// Erstelle einen Test-Schadensknopf
const createTestDamageButton = () => {
    const damageButton = document.createElement('button');
    damageButton.innerText = '10 Schaden nehmen (Test)';
    damageButton.style.position = 'absolute';
    damageButton.style.bottom = '20px';
    damageButton.style.right = '20px';
    damageButton.style.padding = '10px';
    damageButton.style.cursor = 'pointer';
    
    damageButton.addEventListener('click', () => {
        takeDamage(10);
    });
    
    document.body.appendChild(damageButton);
};// Funktion zum Erstellen des Arkanorbs
const createArkanorb = () => {
    // Gruppe für den Arkanorb und seine Effekte
    const orbGroup = new THREE.Group();
    
    // Kern des Orbs
    const orbCore = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x00BFFF, 
            transparent: true, 
            opacity: 0.8
        })
    );
    
    // Äußere Schicht
    const orbOuterLayer = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ 
            color: 0x1E90FF, 
            transparent: true, 
            opacity: 0.4,
            wireframe: true
        })
    );
    
    // Ringe um den Orb
    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 8, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x87CEFA, 
            transparent: true, 
            opacity: 0.6
        })
    );
    
    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.03, 8, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x87CEFA, 
            transparent: true, 
            opacity: 0.6
        })
    );
    
    // Ringe ausrichten
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.z = Math.PI / 2;
    
    // Alles zum Orb hinzufügen
    orbGroup.add(orbCore);
    orbGroup.add(orbOuterLayer);
    orbGroup.add(ring1);
    orbGroup.add(ring2);
    
    // Berechne Position vor dem Spieler
    const playerDirection = new THREE.Vector3();
    camera.getWorldDirection(playerDirection);
    
    // Position den Orb 2 Einheiten vor dem Spieler und etwas höher als Augenhöhe
    const orbPosition = camera.position.clone().add(
        playerDirection.multiplyScalar(2).add(new THREE.Vector3(0, 0.5, 0))
    );
    
    orbGroup.position.copy(orbPosition);
    
    // Zur Szene hinzufügen
    scene.add(orbGroup);
    
    // Referenz speichern
    arkanorb = orbGroup;
    
    // Spezielle Eigenschaften für Animation
    arkanorb.userData = {
        rotationSpeed: 0.02,
        pulseSpeed: 0.005,
        lastAttackTime: 0,
        attackInterval: 500, // ms zwischen Angriffen
        offsetY: 1.2,   // Höher positionieren
        offsetZ: 2.5,   // Etwas weiter vorne
        offsetX: 1.0    // Nach rechts versetzt
    };
};

// Funktion zum Entfernen des Arkanorbs
const removeArkanorb = () => {
    if (arkanorb) {
        scene.remove(arkanorb);
        arkanorb = null;
    }
};

// Funktion für einen Angriff des Arkanorbs
const arkanorbAttack = () => {
    if (!arkanorb || cubes.length === 0) return;
    
    // Finde den nächsten Würfel
    let closestCube = null;
    let minDistance = Infinity;
    
    cubes.forEach(cube => {
        const distance = arkanorb.position.distanceTo(cube.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestCube = cube;
        }
    });
    
    // Wenn ein Würfel in der Nähe ist (maximal 15 Einheiten entfernt)
    if (closestCube && minDistance < 15) {
        // Richtung zum Würfel
        const direction = new THREE.Vector3();
        direction.subVectors(closestCube.position, arkanorb.position).normalize();
        
        // Erstelle einen Energiestrahl
        const beamLength = Math.min(minDistance, 15);
        const beamGeometry = new THREE.CylinderGeometry(0.05, 0.01, beamLength, 8);
        beamGeometry.rotateX(Math.PI / 2);
        
        const beamMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FFFF, 
            transparent: true, 
            opacity: 0.7
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        
        // Position und Ausrichtung des Strahls
        beam.position.copy(arkanorb.position);
        beam.position.add(direction.clone().multiplyScalar(beamLength / 2));
        beam.lookAt(closestCube.position);
        
        // Strahl zur Szene hinzufügen
        scene.add(beam);
        
        // Entferne den Strahl nach kurzer Zeit
        setTimeout(() => {
            scene.remove(beam);
        }, 100);
        
        // Würfel Schaden zufügen (mit Wahrscheinlichkeit)
        if (Math.random() < 0.3) { // 30% Chance, den Würfel zu zerstören
            // Entferne den Würfel aus der Szene
            scene.remove(closestCube);
            
            // Entferne den Würfel aus der Liste der Würfel
            const index = cubes.indexOf(closestCube);
            if (index > -1) {
                cubes.splice(index, 1);
            }
            
            // Schaffe einen Partikeleffekt an der Stelle des getroffenen Würfels
            createDestroyEffect(closestCube.position, closestCube.material.color);
        }
    }
};

// Funktion zum Starten des Zauberstab-Spezial-Moves
const startWandSpecial = () => {
    isWandSpecialActive = true;
    wandSpecialDuration = wandSpecialMaxDuration;
    
    // Erstelle den Arkanorb
    createArkanorb();
};// Funktion zum Erstellen einer Energie-Scheibe für den Katana-Spezial-Move
const createEnergySlice = (originPosition, direction, size, color) => {
    // Erstelle einen Ring für die Energie-Scheibe
    const sliceGeometry = new THREE.TorusGeometry(size, size / 10, 8, 24);
    const sliceMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const slice = new THREE.Mesh(sliceGeometry, sliceMaterial);
    
    // Positioniere die Scheibe
    slice.position.copy(originPosition);
    
    // Richte die Scheibe entsprechend der Richtung aus
    slice.lookAt(originPosition.clone().add(direction));
    
    // Füge die Scheibe zur Szene hinzu
    scene.add(slice);
    
    // Eigenschaften für Animation
    slice.userData.velocity = direction.clone().multiplyScalar(0.3);
    slice.userData.lifeTime = 1.0; // 1 Sekunde
    slice.userData.createTime = Date.now();
    slice.userData.initialSize = size;
    
    // Gruppe für die Animation
    const energyGroup = new THREE.Group();
    energyGroup.add(slice);
    activeFragments.push(energyGroup);
};

// Funktion zum Starten des Katana-Spezial-Moves
const startKatanaSpecial = () => {
    isPerformingSpecial = true;
    specialProgress = 0;
    
    // Speichere die aktuelle Kamerarotation (mit korrigierter API)
    const currentRotation = controls.object.rotation.y;
    
    // Deaktiviere kurzzeitig die Steuerung
    controls.enabled = false;
    
    // Timer, um die Steuerung nach dem Spezial-Move wieder zu aktivieren
    setTimeout(() => {
        controls.enabled = true;
    }, 1500); // 1.5 Sekunden
};import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Grundlegende Three.js-Einrichtung
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Füge die Kamera zur Szene hinzu
scene.add(camera);

// Funktion für ein Fadenkreuz (Crosshair)
const createCrosshair = () => {
    const crosshairSize = 0.01; // Kleine Größe für das Fadenkreuz
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [
        new THREE.Vector3(-crosshairSize, 0, -0.5), new THREE.Vector3(crosshairSize, 0, -0.5), // Horizontale Linie
        new THREE.Vector3(0, -crosshairSize, -0.5), new THREE.Vector3(0, crosshairSize, -0.5)  // Vertikale Linie
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const crosshair = new THREE.LineSegments(geometry, material);
    camera.add(crosshair);
};

// Crosshair erstellen
createCrosshair();

// Boden erstellen
const createFloor = () => {
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    // Einfaches Material statt Textur verwenden
    const floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444,  // Dunkelgrau
        side: THREE.DoubleSide
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2; // Horizontal ausrichten
    floor.position.y = -2; // Unter den Würfeln positionieren
    scene.add(floor);
    
    return floor;
};

// Wände erstellen
const createWalls = () => {
    const walls = new THREE.Group();
    
    // Material für die Wände
    const wallMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8888aa,
        side: THREE.DoubleSide
    });
    
    // Wand-Dimensionen
    const wallHeight = 5;
    const roomSize = 15;
    
    // Vier Wände erstellen
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
};

// Funktion zum Erstellen eines einfachen Schwertes
const createSword = () => {
    // Schwertgriff
    const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 32);
    const handleMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Braun
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    
    // Parierstange (Querstück)
    const guardGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.02);
    const guardMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold
    const guard = new THREE.Mesh(guardGeometry, guardMaterial);
    guard.position.y = 0.08;
    
    // Klinge
    const bladeGeometry = new THREE.BoxGeometry(0.03, 0.5, 0.01);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 }); // Silber
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.33; // Über dem Griff
    
    // Alle Teile in eine Gruppe zusammenfassen
    const sword = new THREE.Group();
    sword.add(handle);
    sword.add(guard);
    sword.add(blade);
    
    // Positioniere das Schwert relativ zur Kamera
    sword.position.set(0.3, -0.2, -0.5); // rechts unten im Sichtfeld
    sword.rotation.x = Math.PI / 6; // leicht nach oben geneigt
    sword.rotation.z = -Math.PI / 8; // leicht nach innen gedreht
    
    // Schwert zur Kamera hinzufügen, damit es sich mit bewegt
    camera.add(sword);
    
    return sword;
};

// Funktion zum Erstellen eines Katanas
const createKatana = () => {
    // Gruppe für das Katana
    const katana = new THREE.Group();
    
    // Griff (Tsuka)
    const tsukaGeometry = new THREE.CylinderGeometry(0.02, 0.015, 0.25, 32);
    const tsukaMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Schwarz
    const tsuka = new THREE.Mesh(tsukaGeometry, tsukaMaterial);
    
    // Handschutz (Tsuba)
    const tsubaGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 32);
    const tsubaMaterial = new THREE.MeshBasicMaterial({ color: 0x303030 }); // Dunkelgrau
    const tsuba = new THREE.Mesh(tsubaGeometry, tsubaMaterial);
    tsuba.position.y = 0.12;
    tsuba.rotation.x = Math.PI / 2; // Drehen um horizontal zu sein
    
    // Klinge (lange, schlanke und leicht gebogene Form)
    const bladeGeometry = new THREE.BoxGeometry(0.025, 0.6, 0.005);
    const bladeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 }); // Silber
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.42; // Über dem Griff
    // Leichte Biegung der Klinge simulieren durch Rotation
    blade.rotation.z = 0.05;
    
    // Alle Teile zum Katana hinzufügen
    katana.add(tsuka);
    katana.add(tsuba);
    katana.add(blade);
    
    // Positionierung ähnlich wie beim Schwert
    katana.position.set(0.3, -0.2, -0.5);
    katana.rotation.x = Math.PI / 6;
    katana.rotation.z = -Math.PI / 8;
    
    // Katana zur Kamera hinzufügen, damit es sich mit bewegt
    camera.add(katana);
    
    // Katana standardmäßig ausblenden
    katana.visible = false;
    
    return katana;
};

// Funktion zum Erstellen der Füße
const createFeet = () => {
    // Gruppe für beide Füße
    const feet = new THREE.Group();
    
    // Material für die Füße
    const footMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Braun
    
    // Linker Fuß - größer und weiter nach vorne positioniert
    const leftFootGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.3);
    const leftFoot = new THREE.Mesh(leftFootGeometry, footMaterial);
    leftFoot.position.set(-0.2, -1.9, -0.5); // Deutlich tiefer und weiter vorne
    
    // Rechter Fuß - größer und weiter nach vorne positioniert
    const rightFootGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.3);
    const rightFoot = new THREE.Mesh(rightFootGeometry, footMaterial);
    rightFoot.position.set(0.2, -1.9, -0.5); // Deutlich tiefer und weiter vorne
    
    // Füße zur Gruppe hinzufügen
    feet.add(leftFoot);
    feet.add(rightFoot);
    
    // Füße zur Szene hinzufügen (nicht zur Kamera)
    scene.add(feet);
    
    return feet;
};

// Erstelle mehrere Würfel
const createCube = (color, position) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(...position);
    scene.add(cube);
    return cube;
};

// Füge Beleuchtung hinzu
const addLighting = () => {
    // Umgebungslicht
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Punktlicht in der Mitte des Raumes
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);
    
    // Lichthelfer (optional) - visualisiert das Licht
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);
};

// Funktion zum Prüfen, ob ein Würfel mit der Waffe getroffen wird
const checkCubeHits = () => {
    if (!canDestroy) return;
    
    // Erstelle einen Raycaster von der Kameraposition in Blickrichtung
    raycaster.setFromCamera(mouse, camera);
    
    // Prüfe, ob ein Würfel getroffen wird
    const intersects = raycaster.intersectObjects(cubes);
    
    if (intersects.length > 0) {
        // Der nächste getroffene Würfel
        const hitCube = intersects[0].object;
        
        // Entferne den Würfel aus der Szene
        scene.remove(hitCube);
        
        // Entferne den Würfel aus der Liste der Würfel
        const index = cubes.indexOf(hitCube);
        if (index > -1) {
            cubes.splice(index, 1);
        }
        
        // Schaffe einen Partikeleffekt an der Stelle des getroffenen Würfels
        createDestroyEffect(hitCube.position, hitCube.material.color);
        
        console.log("Würfel zerstört!");
    }
};

// Funktion zum Erstellen eines Zaubereffekts
const createMagicEffect = () => {
    // Hole die Position der Zauberstabspitze
    const wandTip = new THREE.Vector3();
    wand.children[5].getWorldPosition(wandTip);
    
    // Richtungsvektor vom Zauberstab aus
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    // Mehrere Partikel erstellen
    const particles = new THREE.Group();
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        // Zufällige Partikelgröße
        const size = 0.05 + Math.random() * 0.1;
        
        // Verschiedene Partikelformen für mehr Variation
        let geometry;
        const shapeType = Math.floor(Math.random() * 3);
        
        if (shapeType === 0) {
            geometry = new THREE.SphereGeometry(size, 6, 6);
        } else if (shapeType === 1) {
            geometry = new THREE.IcosahedronGeometry(size, 0);
        } else {
            geometry = new THREE.TetrahedronGeometry(size, 0);
        }
        
        // Zufällige Farbe im Blau-/Türkisspektrum
        const hue = 0.5 + Math.random() * 0.2; // Zwischen Blau und Türkis
        const saturation = 0.7 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.3;
        
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(hue, saturation, lightness),
            transparent: true,
            opacity: 0.7 + Math.random() * 0.3
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Position um Zauberstabspitze mit leichter Streuung
        particle.position.copy(wandTip);
        particle.position.x += (Math.random() - 0.5) * 0.2;
        particle.position.y += (Math.random() - 0.5) * 0.2;
        particle.position.z += (Math.random() - 0.5) * 0.2;
        
        // Zufällige Rotation
        particle.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Geschwindigkeit - hauptsächlich in Blickrichtung
        const speed = 0.1 + Math.random() * 0.2;
        particle.userData.velocity = new THREE.Vector3(
            direction.x * speed + (Math.random() - 0.5) * 0.05,
            direction.y * speed + (Math.random() - 0.5) * 0.05,
            direction.z * speed + (Math.random() - 0.5) * 0.05
        );
        
        // Partikel lebt kürzer als die Würfelfragmente
        particle.userData.lifeTime = 0.5 + Math.random() * 0.5; // 0.5-1 Sekunden
        particle.userData.createTime = Date.now();
        
        particles.add(particle);
    }
    
    scene.add(particles);
    activeFragments.push(particles);
};

// Funktion zum Erstellen eines Zerstörungseffekts
const createDestroyEffect = (position, color) => {
    // Erstelle mehrere kleine Würfel als "Splitter"
    const fragments = new THREE.Group();
    
    // Anzahl der Fragmente
    const fragmentCount = 8;
    
    for (let i = 0; i < fragmentCount; i++) {
        // Kleine Würfel erstellen
        const size = 0.2 + Math.random() * 0.1;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color: color.getHex() });
        const fragment = new THREE.Mesh(geometry, material);
        
        // Position etwas zufällig im Bereich des ursprünglichen Würfels
        fragment.position.set(
            position.x + (Math.random() - 0.5) * 0.5,
            position.y + (Math.random() - 0.5) * 0.5,
            position.z + (Math.random() - 0.5) * 0.5
        );
        
        // Zufällige Rotation und Geschwindigkeit
        fragment.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Geschwindigkeit für Animation
        fragment.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            Math.random() * 0.1,
            (Math.random() - 0.5) * 0.1
        );
        
        // Lebensdauer des Fragments
        fragment.userData.lifeTime = 2; // Sekunden
        fragment.userData.createTime = Date.now();
        
        fragments.add(fragment);
    }
    
    // Füge die Gruppe zur Szene hinzu
    scene.add(fragments);
    
    // Speichere die Fragmente für die Animation
    activeFragments.push(fragments);
};

// Boden und Wände erstellen
const floor = createFloor();
const walls = createWalls();

// Die ursprünglichen Würfel
const cube1 = createCube(0x00ff10, [-1.5, 0, 0]); // Grün
const cube2 = createCube(0xff0000, [1.5, 0, 0]);  // Rot
const cube3 = createCube(0x0000ff, [0, 0, 0]);    // Blau

// Zusätzliche Würfel
const cube4 = createCube(0xffff00, [-3, 0, -3]); // Gelb
const cube5 = createCube(0xff00ff, [3, 0, -3]);  // Magenta
const cube6 = createCube(0x00ffff, [0, 0, -6]);  // Cyan
const cube7 = createCube(0x888888, [-4, 0, 2]);  // Grau
const cube8 = createCube(0xffa500, [4, 0, 2]);   // Orange

// Liste aller Würfel für Raycasting
const cubes = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8];

// Liste für aktive Fragmente
const activeFragments = [];

// Beleuchtung hinzufügen
addLighting();

// Erstelle das Schwert
const sword = createSword();

// Erstelle das Katana
const katana = createKatana();

// Funktion zum Erstellen eines coolen Zauberstabs
const createWand = () => {
    // Gruppe für den Zauberstab
    const wand = new THREE.Group();
    
    // Basis des Zauberstabs (Griff)
    const handleGeometry = new THREE.CylinderGeometry(0.012, 0.018, 0.25, 8);
    const handleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3D0C02, // Dunkles Holzbraun
        wireframe: false 
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.rotation.x = Math.PI / 2; // Drehen, damit es horizontal liegt
    
    // Verzierungen am Griff
    const ringGeometry = new THREE.TorusGeometry(0.02, 0.005, 8, 12);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xD4AF37 }); // Gold
    const ringBottom = new THREE.Mesh(ringGeometry, ringMaterial);
    ringBottom.position.z = 0.11;
    ringBottom.rotation.y = Math.PI / 2;
    
    const ringTop = ringBottom.clone();
    ringTop.position.z = -0.11;
    
    // Hauptteil des Zauberstabs
    const mainGeometry = new THREE.CylinderGeometry(0.008, 0.012, 0.35, 8);
    const mainMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x1A0500, // Fast schwarz
        wireframe: false 
    });
    const mainPart = new THREE.Mesh(mainGeometry, mainMaterial);
    mainPart.position.z = -0.3;
    mainPart.rotation.x = Math.PI / 2;
    
    // Spitze des Zauberstabs mit Kristall
    const tipGeometry = new THREE.ConeGeometry(0.01, 0.04, 8);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0x3D0C02 });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.z = -0.5;
    tip.rotation.x = Math.PI / 2;
    
    // Leuchtender Kristall an der Spitze
    const crystalGeometry = new THREE.IcosahedronGeometry(0.03, 0);
    const crystalMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00BFFF, // Hellblau leuchtend
        transparent: true,
        opacity: 0.8
    });
    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.z = -0.53;
    
    // Alle Teile zum Zauberstab hinzufügen
    wand.add(handle);
    wand.add(ringBottom);
    wand.add(ringTop);
    wand.add(mainPart);
    wand.add(tip);
    wand.add(crystal);
    
    // Position und Rotation des Zauberstabs anpassen
    wand.position.set(0.3, -0.2, -0.5);
    wand.rotation.y = Math.PI / 10;
    wand.rotation.z = -Math.PI / 8;
    
    // Zauberstab zur Kamera hinzufügen
    camera.add(wand);
    
    // Zauberstab standardmäßig ausblenden
    wand.visible = false;
    
    return wand;
};

// Erstelle den Zauberstab
const wand = createWand();

// Erstelle die Füße
const feet = createFeet();

// Zustandsvariablen für die Schwertanimation
let isSwinging = false;
let swingProgress = 0;
let originalSwordRotation = {
    x: Math.PI / 6,
    y: 0,
    z: -Math.PI / 8
};

// Eine Variable, um den Bewegungszustand zu verfolgen
let isMoving = false;

// Bewegungsrichtungen
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Aktuelle Bewegungsgeschwindigkeit
let moveSpeed = 0.2;
let movementVector = new THREE.Vector3();

// Zustandsvariablen für die Fußanimation
let stepCycle = 0;

// Sprung-Zustandsvariablen
let isJumping = false;
let jumpHeight = 0;
let jumpVelocity = 0.15;
let gravity = 0.008;
let playerHeight = 0;

// Dash-Zustandsvariablen
let isDashing = false;
let dashDuration = 0;
let dashMaxDuration = 10; // Frames, die der Dash dauert
let dashSpeed = 0.8; // Dash-Geschwindigkeit (höher als normale Bewegung)
let dashCooldown = 0;
let dashMaxCooldown = 45; // Cooldown in Frames (ca. 0.75 Sekunden bei 60 FPS)
let dashDirection = new THREE.Vector3();

// Zustandsvariable für aktive Waffe
let activeWeapon = "sword"; // "sword", "katana" oder "wand"

// Zerstörungs-Zustandsvariablen
let canDestroy = false; // Wird während der Schwunganimation auf true gesetzt

// Spezial-Move-Zustandsvariablen für das Katana
let isPerformingSpecial = false;
let specialProgress = 0;
let specialCooldown = 0;
let specialMaxCooldown = 180; // 3 Sekunden bei 60 FPS

// Zauberstab-Spezial-Move-Zustandsvariablen
let isWandSpecialActive = false;
let wandSpecialDuration = 0;
let wandSpecialMaxDuration = 300; // 5 Sekunden bei 60 FPS
let wandSpecialCooldown = 0;
let wandSpecialMaxCooldown = 240; // 4 Sekunden bei 60 FPS
let arkanorb = null; // Speichert die Referenz zum Arkanorb

// HP-Zustandsvariablen
let playerMaxHealth = 100;
let playerCurrentHealth = 100;
let isInvulnerable = false;
let invulnerabilityTime = 0;
let invulnerabilityDuration = 30; // Frames (0.5 Sekunden bei 60 FPS)
let healthRegenerationRate = 0.05; // HP pro Frame (langsame Regeneration)
let lastDamageTime = 0;

// Funktion zum Schwingen der aktiven Waffe
const swingWeapon = () => {
    if (isSwinging) return; // Nicht unterbrechen, wenn bereits im Schwung
    
    isSwinging = true;
    swingProgress = 0;
    
    // Originale Rotation speichern
    originalSwordRotation = {
        x: Math.PI / 6,
        y: 0,
        z: -Math.PI / 8
    };
    
    console.log("Waffe schwingen gestartet");
};

// UI-Anzeige für Dash-Cooldown
const createDashIndicator = () => {
    // Erstelle ein div-Element für den Dash-Indikator
    const dashIndicator = document.createElement('div');
    dashIndicator.id = 'dashIndicator';
    dashIndicator.style.position = 'absolute';
    dashIndicator.style.bottom = '20px';
    dashIndicator.style.left = '20px';
    dashIndicator.style.width = '100px';
    dashIndicator.style.height = '10px';
    dashIndicator.style.backgroundColor = '#333';
    dashIndicator.style.border = '2px solid #fff';
    dashIndicator.style.borderRadius = '5px';
    dashIndicator.style.overflow = 'hidden';
    
    // Inneres div für den Füllstand
    const dashFill = document.createElement('div');
    dashFill.id = 'dashFill';
    dashFill.style.width = '100%';
    dashFill.style.height = '100%';
    dashFill.style.backgroundColor = '#00aaff';
    dashFill.style.transition = 'width 0.1s';
    
    dashIndicator.appendChild(dashFill);
    document.body.appendChild(dashIndicator);
};

// UI-Anzeige für Katana-Spezial-Move Cooldown
const createSpecialIndicator = () => {
    // Erstelle ein div-Element für den Spezial-Indikator
    const specialIndicator = document.createElement('div');
    specialIndicator.id = 'specialIndicator';
    specialIndicator.style.position = 'absolute';
    specialIndicator.style.bottom = '40px';
    specialIndicator.style.left = '20px';
    specialIndicator.style.width = '100px';
    specialIndicator.style.height = '10px';
    specialIndicator.style.backgroundColor = '#333';
    specialIndicator.style.border = '2px solid #fff';
    specialIndicator.style.borderRadius = '5px';
    specialIndicator.style.overflow = 'hidden';
    
    // Inneres div für den Füllstand
    const specialFill = document.createElement('div');
    specialFill.id = 'specialFill';
    specialFill.style.width = '100%';
    specialFill.style.height = '100%';
    specialFill.style.backgroundColor = '#FF3333';
    specialFill.style.transition = 'width 0.1s';
    
    specialIndicator.appendChild(specialFill);
    document.body.appendChild(specialIndicator);
};

// UI-Anzeige für Zauberstab-Spezial-Move Cooldown
const createWandSpecialIndicator = () => {
    // Erstelle ein div-Element für den Zauberstab-Spezial-Indikator
    const wandSpecialIndicator = document.createElement('div');
    wandSpecialIndicator.id = 'wandSpecialIndicator';
    wandSpecialIndicator.style.position = 'absolute';
    wandSpecialIndicator.style.bottom = '60px';
    wandSpecialIndicator.style.left = '20px';
    wandSpecialIndicator.style.width = '100px';
    wandSpecialIndicator.style.height = '10px';
    wandSpecialIndicator.style.backgroundColor = '#333';
    wandSpecialIndicator.style.border = '2px solid #fff';
    wandSpecialIndicator.style.borderRadius = '5px';
    wandSpecialIndicator.style.overflow = 'hidden';
    
    // Inneres div für den Füllstand
    const wandSpecialFill = document.createElement('div');
    wandSpecialFill.id = 'wandSpecialFill';
    wandSpecialFill.style.width = '100%';
    wandSpecialFill.style.height = '100%';
    wandSpecialFill.style.backgroundColor = '#00BFFF';
    wandSpecialFill.style.transition = 'width 0.1s';
    
    wandSpecialIndicator.appendChild(wandSpecialFill);
    document.body.appendChild(wandSpecialIndicator);
};

// Dash-Partikelsystem
const createDashEffect = () => {
    if (isDashing && dashDuration % 2 === 0) {
        // Erstelle Partikel am Spieler
        const particleCount = 5;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x00aaff,
                transparent: true,
                opacity: 0.7
            });
            const particle = new THREE.Mesh(geometry, material);
            
            // Zufällige Position um den Spieler
            particle.position.set(
                camera.position.x + (Math.random() - 0.5) * 0.5,
                camera.position.y - 0.5 + (Math.random() - 0.5) * 0.5,
                camera.position.z + (Math.random() - 0.5) * 0.5
            );
            
            // Lebensdauer und Animation
            particle.userData.lifeTime = 0.5; // Sekunden
            particle.userData.createTime = Date.now();
            
            // Geschwindigkeit für Animation hinzufügen (war vorher nicht vorhanden)
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                Math.random() * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            
            particles.add(particle);
        }
        
        scene.add(particles);
        activeFragments.push(particles); // Nutze das vorhandene System für Fragmente
    }
};

// Dash-Indikator erstellen
createDashIndicator();

// Spezial-Move-Indikator erstellen
createSpecialIndicator();

// Zauberstab-Spezial-Indikator erstellen
createWandSpecialIndicator();

// HP-Bar erstellen
createHealthBar();

// Test-Schadens-Button erstellen
createTestDamageButton();

// Startposition der Kamera 
camera.position.set(0, 0, 5);

// Event-Listener für Klicks
window.addEventListener("click", () => {
    // Fadenkreuz ist immer in der Mitte, daher setzen wir die Mausposition auf (0,0)
    // was der Bildschirmmitte entspricht
    mouse.x = 0;
    mouse.y = 0;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);
    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        clickedCube.material.color.set(Math.random() * 0xffffff);
    }
});

// Rechtsklick zum Schwingen
document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Verhindert das Standard-Kontextmenü
    swingWeapon();
    console.log("Rechtsklick erkannt, Waffe schwingen ausgelöst");
});

// Alternative: Schwert schwingen mit Mausrad-Klick (mittlere Taste)
document.addEventListener('mousedown', (event) => {
    if (event.button === 1) { // Mittlere Maustaste (Mausrad)
        event.preventDefault();
        swingWeapon();
        console.log("Mausrad-Klick erkannt, Waffe schwingen ausgelöst");
    }
});

// Event-Listener für die Tastenbewegung aktualisieren
document.addEventListener("keydown", (event) => {
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
        case 'KeyE':
            swingWeapon();
            console.log("Waffe schwingen ausgelöst");
            break;
        case 'KeyQ':
            // Zwischen Schwert, Katana und Zauberstab wechseln
            if (activeWeapon === "sword") {
                activeWeapon = "katana";
                sword.visible = false;
                katana.visible = true;
                wand.visible = false;
                console.log("Katana ausgewählt");
            } else if (activeWeapon === "katana") {
                activeWeapon = "wand";
                sword.visible = false;
                katana.visible = false;
                wand.visible = true;
                console.log("Zauberstab ausgewählt");
            } else {
                activeWeapon = "sword";
                sword.visible = true;
                katana.visible = false;
                wand.visible = false;
                console.log("Schwert ausgewählt");
            }
            break;
        case 'KeyF':
            // Katana-Spezial-Move auslösen
            if (activeWeapon === "katana" && !isPerformingSpecial && specialCooldown <= 0) {
                startKatanaSpecial();
                console.log("Katana Spezial-Move ausgelöst");
            }
            // Zauberstab-Spezial-Move auslösen
            else if (activeWeapon === "wand" && !isWandSpecialActive && wandSpecialCooldown <= 0) {
                startWandSpecial();
                console.log("Zauberstab Spezial-Move ausgelöst");
            }
            break;
        case 'Space':
            if (!isJumping) {
                isJumping = true;
                jumpHeight = 0;
                jumpVelocity = 0.15;
                console.log("Springen ausgelöst");
            }
            break;
        case 'ShiftLeft': case 'ShiftRight':
            // Dash nur auslösen, wenn nicht bereits im Dash und Cooldown abgelaufen
            if (!isDashing && dashCooldown <= 0 && (moveForward || moveBackward || moveLeft || moveRight)) {
                isDashing = true;
                dashDuration = dashMaxDuration;
                
                // Speichere die aktuelle Bewegungsrichtung für den Dash
                dashDirection.copy(movementVector).normalize();
                
                console.log("Dash ausgelöst");
            }
            break;
    }
    
    // Aktualisiere den Bewegungsstatus
    isMoving = moveForward || moveBackward || moveLeft || moveRight;
});

// Event-Listener für das Loslassen der Tasten
document.addEventListener("keyup", (event) => {
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
    
    // Aktualisiere den Bewegungsstatus
    isMoving = moveForward || moveBackward || moveLeft || moveRight;
});

const controls = new PointerLockControls(camera, document.body);
document.addEventListener("click", () => {
    controls.lock();
});

// Funktion zum Aktualisieren des Dash-Indikators
const updateDashIndicator = () => {
    const dashFill = document.getElementById('dashFill');
    if (dashFill) {
        if (dashCooldown > 0) {
            const fillPercentage = 100 - (dashCooldown / dashMaxCooldown) * 100;
            dashFill.style.width = fillPercentage + '%';
        } else {
            dashFill.style.width = '100%';
        }
    }
};

// Funktion zum Aktualisieren des Spezial-Move-Indikators
const updateSpecialIndicator = () => {
    const specialFill = document.getElementById('specialFill');
    if (specialFill) {
        if (specialCooldown > 0) {
            const fillPercentage = 100 - (specialCooldown / specialMaxCooldown) * 100;
            specialFill.style.width = fillPercentage + '%';
        } else {
            specialFill.style.width = '100%';
        }
    }
};

// Funktion zum Aktualisieren des Zauberstab-Spezial-Indikators
const updateWandSpecialIndicator = () => {
    const wandSpecialFill = document.getElementById('wandSpecialFill');
    if (wandSpecialFill) {
        if (isWandSpecialActive) {
            // Zeigt den verbleibenden Spezial-Move an
            const fillPercentage = (wandSpecialDuration / wandSpecialMaxDuration) * 100;
            wandSpecialFill.style.width = fillPercentage + '%';
        } else if (wandSpecialCooldown > 0) {
            // Zeigt den Cooldown an
            const fillPercentage = 100 - (wandSpecialCooldown / wandSpecialMaxCooldown) * 100;
            wandSpecialFill.style.width = fillPercentage + '%';
        } else {
            // Voll, wenn bereit
            wandSpecialFill.style.width = '100%';
        }
    }
};

function animate() {
    requestAnimationFrame(animate);
   
    cube1.rotation.y += 0.01;
    cube2.rotation.y -= 0.01;
    cube3.rotation.x += 0.02;
    
    // Bewegung basierend auf der Kamera-Ausrichtung
    const speed = moveSpeed;
    
    // Setze die Bewegungsrichtung basierend auf den Tasten
    movementVector.x = 0;
    movementVector.z = 0;
    
    if (moveForward) movementVector.z += speed;  // Vorwärts = negative Z-Richtung
    if (moveBackward) movementVector.z -= speed; // Rückwärts = positive Z-Richtung
    if (moveLeft) movementVector.x -= speed;
    if (moveRight) movementVector.x += speed;
    
    // Normalisiere den Bewegungsvektor für konsistente Geschwindigkeit in allen Richtungen
    if (movementVector.length() > 0) {
        movementVector.normalize().multiplyScalar(speed);
    }
    
    // Bewege die Kamera entsprechend der berechneten Richtung
    // Verwende die Kamera-Rotation, um die Bewegung zu relativieren
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Wir wollen nur horizontale Bewegung
    cameraDirection.normalize();
    
    // Berechne die Bewegungsrichtung relativ zur Kameraausrichtung
    const forward = cameraDirection.clone();
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    const moveX = movementVector.x * right.x + movementVector.z * forward.x;
    const moveZ = movementVector.x * right.z + movementVector.z * forward.z;
    
    // Bewege die Kamera
    camera.position.x += moveX;
    camera.position.z += moveZ;
    
    // Dash-Logik
    if (dashCooldown > 0) {
        dashCooldown--;
    }

    if (isDashing) {
        // Berechne die Dash-Richtung relativ zur Kameraausrichtung
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
        
        // Wenn es eine Bewegung gibt, in diese Richtung dashen
        if (dashX !== 0 || dashZ !== 0) {
            const dashVector = new THREE.Vector3(dashX, 0, dashZ).normalize();
            dashX = dashVector.x * right.x + dashVector.z * forward.x;
            dashZ = dashVector.x * right.z + dashVector.z * forward.z;
        } 
        // Sonst in Blickrichtung dashen
        else {
            dashX = forward.x;
            dashZ = forward.z;
        }
        
        // Bewege die Kamera mit Dash-Geschwindigkeit
        camera.position.x += dashX * dashSpeed;
        camera.position.z += dashZ * dashSpeed;
        
        // Dash-Timer verringern
        dashDuration--;
        
        // Dash beenden, wenn die Zeit abgelaufen ist
        if (dashDuration <= 0) {
            isDashing = false;
            dashCooldown = dashMaxCooldown;
        }
        
        // Erstelle Dash-Effekt
        createDashEffect();
    }
    
    // Spezial-Move Cooldown aktualisieren
    if (specialCooldown > 0) {
        specialCooldown--;
    }

    // Katana Spezial-Move Logik
    if (isPerformingSpecial) {
        // Spezial-Move-Fortschritt
        specialProgress += 0.02;
        
        if (specialProgress <= 1) {
            // Aktuelle Kameraposition und -richtung
            const cameraPos = camera.position.clone();
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            
            // Katana-Position (für Energieeffekte)
            const katanaPos = new THREE.Vector3();
            katana.children[2].getWorldPosition(katanaPos); // Position der Klinge
            
            // Phase 1: Ladephase (0-0.3)
            if (specialProgress < 0.3) {
                // Katana leuchtet immer intensiver
                const glowIntensity = specialProgress / 0.3;
                katana.children[2].material.color.setRGB(
                    1.0, 
                    0.5 + glowIntensity * 0.5, 
                    0.5 + glowIntensity * 0.5
                );
                
                // Skaliere die Klinge etwas größer während des Aufladens
                katana.children[2].scale.set(
                    1.0 + glowIntensity * 0.2,
                    1.0 + glowIntensity * 0.2,
                    1.0 + glowIntensity * 0.2
                );
                
                // Kleine Partikeleffekte um das Katana
                if (Math.random() > 0.7) {
                    const particle = new THREE.Mesh(
                        new THREE.SphereGeometry(0.02, 8, 8),
                        new THREE.MeshBasicMaterial({ 
                            color: 0xFF5555, 
                            transparent: true, 
                            opacity: 0.7 
                        })
                    );
                    
                    // Position um das Katana
                    particle.position.copy(katanaPos);
                    particle.position.x += (Math.random() - 0.5) * 0.3;
                    particle.position.y += (Math.random() - 0.5) * 0.3;
                    particle.position.z += (Math.random() - 0.5) * 0.3;
                    
                    // Geschwindigkeit - vom Katana weg
                    particle.userData.velocity = new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.05
                    );
                    
                    // Kurze Lebensdauer
                    particle.userData.lifeTime = 0.3;
                    particle.userData.createTime = Date.now();
                    
                    // Gruppe für ein Partikel
                    const particleGroup = new THREE.Group();
                    particleGroup.add(particle);
                    scene.add(particleGroup);
                    activeFragments.push(particleGroup);
                }
            }
            // Phase 2: Drehphase mit Energieblasen (0.3-0.7)
            else if (specialProgress < 0.7) {
                // Normalisierter Fortschritt innerhalb dieser Phase
                const phaseProgress = (specialProgress - 0.3) / 0.4;
                
                // Berechne den Drehwinkel (0 bis 2*PI für eine vollständige Drehung)
                const rotationAngle = phaseProgress * Math.PI * 2;
                
                // Drehe die Kamera entsprechend (korrigierte API)
                controls.object.rotation.y = rotationAngle;
                
                // Das Katana folgt der Kamera automatisch, da es an sie angehängt ist
                
                // Spezial-Animation für das Katana
                katana.rotation.z = -Math.PI / 8 + Math.sin(phaseProgress * Math.PI * 4) * 0.5;
                
                // Erzeugen von Energiescheiben
                if (phaseProgress % 0.1 < 0.02) { // Alle 10% der Phase
                    const sliceDirection = new THREE.Vector3(
                        Math.sin(rotationAngle), 
                        0, 
                        Math.cos(rotationAngle)
                    );
                    
                    // Zufällige Farbe im roten/orangenen Spektrum
                    const hue = 0.95 + Math.random() * 0.1; // Rot bis Orange
                    const sliceColor = new THREE.Color().setHSL(hue, 0.8, 0.6);
                    
                    // Erstelle eine Energiescheibe
                    createEnergySlice(
                        katanaPos.clone(), 
                        sliceDirection, 
                        0.5 + Math.random() * 0.3, 
                        sliceColor
                    );
                    
                    // Überprüfe, ob Würfel in der Nähe getroffen werden
                    const tempRaycaster = new THREE.Raycaster(
                        katanaPos.clone(),
                        sliceDirection,
                        0,
                        3.0 // Maximale Reichweite
                    );
                    
                    const intersects = tempRaycaster.intersectObjects(cubes);
                    if (intersects.length > 0) {
                        // Der nächste getroffene Würfel
                        const hitCube = intersects[0].object;
                        
                        // Entferne den Würfel aus der Szene
                        scene.remove(hitCube);
                        
                        // Entferne den Würfel aus der Liste der Würfel
                        const index = cubes.indexOf(hitCube);
                        if (index > -1) {
                            cubes.splice(index, 1);
                        }
                        
                        // Schaffe einen verstärkten Partikeleffekt an der Stelle des getroffenen Würfels
                        createDestroyEffect(hitCube.position, hitCube.material.color);
                        createDestroyEffect(hitCube.position, hitCube.material.color); // Doppelter Effekt
                    }
                }
            }
            // Phase 3: Abschlussphase (0.7-1.0)
            else {
                // Normalisierter Fortschritt innerhalb dieser Phase
                const phaseProgress = (specialProgress - 0.7) / 0.3;
                
                // Zurück zur Ausgangsposition
                katana.rotation.z = -Math.PI / 8;
                
                // Katana-Farbe zurücksetzen
                katana.children[2].material.color.setRGB(0.75, 0.75, 0.75); // Silber
                katana.children[2].scale.set(1, 1, 1); // Originalgröße
                
                // Optional: Abschlusskrater
                if (phaseProgress < 0.1) {
                    const craterCenter = camera.position.clone();
                    craterCenter.y = -2; // Auf Bodenhöhe
                    
                    // Erstelle einen großen, flachen "Krater" Effekt
                    const craterParticles = 20;
                    const craterGroup = new THREE.Group();
                    
                    for (let i = 0; i < craterParticles; i++) {
                        const angle = (i / craterParticles) * Math.PI * 2;
                        const radius = 1 + Math.random() * 2;
                        
                        const particle = new THREE.Mesh(
                            new THREE.BoxGeometry(0.2, 0.05, 0.2),
                            new THREE.MeshBasicMaterial({ 
                                color: 0xFF3300, 
                                transparent: true, 
                                opacity: 0.5 
                            })
                        );
                        
                        // Position im Kreis um den Spieler
                        particle.position.set(
                            craterCenter.x + Math.cos(angle) * radius,
                            craterCenter.y + 0.05,
                            craterCenter.z + Math.sin(angle) * radius
                        );
                        
                        // Nach außen gerichtete Geschwindigkeit
                        particle.userData.velocity = new THREE.Vector3(
                            Math.cos(angle) * 0.05,
                            0.01,
                            Math.sin(angle) * 0.05
                        );
                        
                        // Lebensdauer des Kraterpartikels
                        particle.userData.lifeTime = 0.5;
                        particle.userData.createTime = Date.now();
                        
                        craterGroup.add(particle);
                    }
                    
                    scene.add(craterGroup);
                    activeFragments.push(craterGroup);
                }
            }
        } else {
            // Spezial-Move beenden
            isPerformingSpecial = false;
            specialCooldown = specialMaxCooldown;
            
            // Katana-Farbe und Größe zurücksetzen
            katana.children[2].material.color.setRGB(0.75, 0.75, 0.75); // Silber
            katana.children[2].scale.set(1, 1, 1); // Originalgröße
        }
    }
    
    // Zauberstab-Spezial-Move-Cooldown aktualisieren
    if (wandSpecialCooldown > 0) {
        wandSpecialCooldown--;
    }

    // Zauberstab-Spezial-Move-Logik
    if (isWandSpecialActive) {
        // Spezial-Move-Dauer verringern
        wandSpecialDuration--;
        
        // Orb-Animation
        if (arkanorb) {
            // Berechne die Position vor dem Spieler und nach rechts versetzt
            const playerDirection = new THREE.Vector3();
            camera.getWorldDirection(playerDirection);
            
            // Bestimme die "rechts" Richtung relativ zur Blickrichtung
            const rightVector = new THREE.Vector3();
            rightVector.crossVectors(playerDirection, new THREE.Vector3(0, 1, 0)).normalize();
            
            // Kombiniere vorwärts + rechts + höhe
            const targetPosition = camera.position.clone()
                .add(playerDirection.clone().multiplyScalar(arkanorb.userData.offsetZ))  // Vorwärts
                .add(rightVector.clone().multiplyScalar(arkanorb.userData.offsetX))      // Nach rechts
                .add(new THREE.Vector3(0, arkanorb.userData.offsetY, 0));                // Nach oben
            
            // Orb folgt dieser Position mit sanfter Bewegung
            arkanorb.position.x += (targetPosition.x - arkanorb.position.x) * 0.1;
            arkanorb.position.y += (targetPosition.y - arkanorb.position.y) * 0.1;
            arkanorb.position.z += (targetPosition.z - arkanorb.position.z) * 0.1;
            
            // Leichtes Schweben
            arkanorb.position.y += Math.sin(Date.now() * 0.002) * 0.03;
            
            // Orb dreht sich leicht zum Spieler
            arkanorb.lookAt(camera.position);
            
            // Rotation der Ringe
            arkanorb.children[2].rotation.z += arkanorb.userData.rotationSpeed;
            arkanorb.children[3].rotation.x += arkanorb.userData.rotationSpeed;
            
            // Pulsieren des Kerns
            const pulse = Math.sin(Date.now() * arkanorb.userData.pulseSpeed) * 0.2 + 1;
            arkanorb.children[0].scale.set(pulse, pulse, pulse);
            
            // Farbänderung
            const hue = 0.55 + Math.sin(Date.now() * 0.001) * 0.1;
            arkanorb.children[0].material.color.setHSL(hue, 0.8, 0.6);
            
            // Angriff in Intervallen
            const now = Date.now();
            if (now - arkanorb.userData.lastAttackTime > arkanorb.userData.attackInterval) {
                arkanorbAttack();
                arkanorb.userData.lastAttackTime = now;
            }
            
            // Partikeleffekte
            if (Math.random() > 0.9) {
                // Erstelle Partikel um den Orb
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    new THREE.MeshBasicMaterial({ 
                        color: new THREE.Color().setHSL(hue, 0.9, 0.7), 
                        transparent: true, 
                        opacity: 0.7 
                    })
                );
                
                // Position um den Orb
                const angle = Math.random() * Math.PI * 2;
                const radius = 0.4 + Math.random() * 0.2;
                particle.position.set(
                    arkanorb.position.x + Math.cos(angle) * radius,
                    arkanorb.position.y + (Math.random() - 0.5) * 0.4,
                    arkanorb.position.z + Math.sin(angle) * radius
                );
                
                // Geschwindigkeit - vom Orb weg
                particle.userData.velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                );
                
                // Kurze Lebensdauer
                particle.userData.lifeTime = 0.5;
                particle.userData.createTime = Date.now();
                
                // Gruppe für ein Partikel
                const particleGroup = new THREE.Group();
                particleGroup.add(particle);
                scene.add(particleGroup);
                activeFragments.push(particleGroup);
            }
        }
        
        // Spezial-Move beenden, wenn die Zeit abgelaufen ist
        if (wandSpecialDuration <= 0) {
            isWandSpecialActive = false;
            wandSpecialCooldown = wandSpecialMaxCooldown;
            removeArkanorb();
        }
    }
    
    // Die aktive Waffe leicht schweben lassen (nur wenn nicht im Schwung)
    if (!isSwinging) {
        if (activeWeapon === "sword") {
            sword.position.y = -0.2 + Math.sin(Date.now() * 0.003) * 0.01;
            sword.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.002) * 0.05;
        } else if (activeWeapon === "katana") {
            katana.position.y = -0.2 + Math.sin(Date.now() * 0.003) * 0.01;
            katana.rotation.z = originalSwordRotation.z + Math.sin(Date.now() * 0.002) * 0.05;
        } else if (activeWeapon === "wand") {
            // Zauberstab schwebt stärker und rotiert leicht
            wand.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.02;
            wand.rotation.y = Math.PI / 10 + Math.sin(Date.now() * 0.001) * 0.1;
            
            // Animation für den Kristall am Zauberstab
            const crystal = wand.children[5]; // Der Kristall ist das sechste Element
            const pulseFactor = (Math.sin(Date.now() * 0.005) + 1) / 2; // Wert zwischen 0 und 1
            
            // Pulsierender Effekt für den Kristall
            crystal.scale.set(
                0.8 + pulseFactor * 0.4,
                0.8 + pulseFactor * 0.4,
                0.8 + pulseFactor * 0.4
            );
            
            // Farbe leicht ändern für leuchtenden Effekt
            crystal.material.color.setHSL(
                0.55 + pulseFactor * 0.1, // Farbton (blau bis türkis)
                0.8,                      // Sättigung
                0.5 + pulseFactor * 0.3   // Helligkeit
            );
        }
        // Nicht schwingend = kann nicht zerstören
        canDestroy = false;
    } else {
        // Waffen-Schwung-Animation
        swingProgress += 0.05;
        
        if (swingProgress <= 1) {
            // Die richtige aktive Waffe auswählen
            let activeWeaponObj;
            if (activeWeapon === "sword") {
                activeWeaponObj = sword;
            } else if (activeWeapon === "katana") {
                activeWeaponObj = katana;
            } else {
                activeWeaponObj = wand;
            }
            
            // Erste Phase: Ausholen
            if (swingProgress < 0.3) {
                const t = swingProgress / 0.3;
                
                if (activeWeapon === "wand") {
                    // Spezielle Zauberstab-Animation
                    wand.rotation.y = Math.PI / 10 - (Math.PI / 4) * t;
                    wand.rotation.z = -Math.PI / 8 - (Math.PI / 6) * t;
                    
                    // Kristall leuchtet heller beim Schwingen
                    const crystal = wand.children[5];
                    crystal.scale.set(1 + t * 0.5, 1 + t * 0.5, 1 + t * 0.5);
                    crystal.material.color.setHSL(0.6, 0.8, 0.5 + t * 0.5);
                } else {
                    // Standard Schwert/Katana Animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x - (Math.PI / 4) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z - (Math.PI / 6) * t;
                }
                canDestroy = false; // Noch keine Zerstörung in der Ausholphase
            }
            // Zweite Phase: Schwingen
            else if (swingProgress < 0.7) {
                const t = (swingProgress - 0.3) / 0.4;
                
                if (activeWeapon === "wand") {
                    // Zauberstab-Schwung-Animation
                    wand.rotation.y = Math.PI / 10 - Math.PI / 4 + (Math.PI / 2) * t;
                    wand.rotation.z = -Math.PI / 8 - Math.PI / 6 + (Math.PI / 3) * t;
                    
                    // Zaubereffekt erstellen (während der Hauptschwungphase)
                    if (swingProgress > 0.4 && swingProgress < 0.6 && Math.random() > 0.7) {
                        createMagicEffect();
                    }
                    
                    // Kristall pulsiert in der Hauptphase
                    const crystal = wand.children[5];
                    const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1.3;
                    crystal.scale.set(pulse, pulse, pulse);
                    crystal.material.color.setHSL(0.6 - t * 0.1, 0.9, 0.7);
                } else {
                    // Standard Schwert/Katana Animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x - Math.PI / 4 + (Math.PI / 2) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z - Math.PI / 6 + (Math.PI / 3) * t;
                }
                
                canDestroy = true; // Zerstörung ist in der Hauptschwungphase möglich
                
                // Prüfe auf Würfeltreffer
                if (swingProgress > 0.4 && swingProgress < 0.6) {
                    checkCubeHits();
                }
            }
            // Dritte Phase: Zurück zur Ausgangsposition
            else {
                const t = (swingProgress - 0.7) / 0.3;
                
                if (activeWeapon === "wand") {
                    // Zauberstab-Rückkehr-Animation
                    wand.rotation.y = Math.PI / 10 + Math.PI / 4 - (Math.PI / 4) * t;
                    wand.rotation.z = -Math.PI / 8 + Math.PI / 6 - (Math.PI / 6) * t;
                    
                    // Kristall beruhigt sich wieder
                    const crystal = wand.children[5];
                    crystal.scale.set(1.3 - t * 0.3, 1.3 - t * 0.3, 1.3 - t * 0.3);
                    crystal.material.color.setHSL(0.5, 0.8, 0.7 - t * 0.2);
                } else {
                    // Standard Schwert/Katana Animation
                    activeWeaponObj.rotation.x = originalSwordRotation.x + Math.PI / 4 - (Math.PI / 4) * t;
                    activeWeaponObj.rotation.z = originalSwordRotation.z + Math.PI / 6 - (Math.PI / 6) * t;
                }
                
                canDestroy = false; // Keine Zerstörung mehr in der Rückholphase
            }
        } else {
            // Animation beenden und zurück zur Ausgangsposition
            if (activeWeapon === "sword") {
                sword.rotation.x = originalSwordRotation.x;
                sword.rotation.z = originalSwordRotation.z;
            } else if (activeWeapon === "katana") {
                katana.rotation.x = originalSwordRotation.x;
                katana.rotation.z = originalSwordRotation.z;
            } else {
                // Zauberstab zurücksetzen
                wand.rotation.y = Math.PI / 10;
                wand.rotation.z = -Math.PI / 8;
                
                // Kristall zurücksetzen
                const crystal = wand.children[5];
                crystal.scale.set(1, 1, 1);
                crystal.material.color.setHSL(0.55, 0.8, 0.5);
            }
            isSwinging = false;
        }
    }
    
    // Animiere aktive Fragmente
    const now = Date.now();
    for (let i = activeFragments.length - 1; i >= 0; i--) {
        const fragments = activeFragments[i];
        let allDead = true;
        
        // Animiere jedes Fragment
        for (let j = 0; j < fragments.children.length; j++) {
            const fragment = fragments.children[j];
            
            // Bewege das Fragment gemäß seiner Geschwindigkeit
            fragment.position.x += fragment.userData.velocity.x;
            fragment.position.y += fragment.userData.velocity.y;
            fragment.position.z += fragment.userData.velocity.z;
            
            // Simuliere Gravitation
            fragment.userData.velocity.y -= 0.002;
            
            // Drehe das Fragment
            fragment.rotation.x += 0.02;
            fragment.rotation.y += 0.03;
            
            // Prüfe, ob das Fragment noch lebt
            const age = (now - fragment.userData.createTime) / 1000;
            if (age < fragment.userData.lifeTime) {
                allDead = false;
                
                // Verkleinere das Fragment mit der Zeit
                const scale = 1.0 - (age / fragment.userData.lifeTime);
                fragment.scale.set(scale, scale, scale);
            } else {
                // Mache das Fragment unsichtbar, wenn es tot ist
                fragment.visible = false;
            }
        }
        
        // Entferne die Fragmentgruppe, wenn alle Fragmente tot sind
        if (allDead) {
            scene.remove(fragments);
            activeFragments.splice(i, 1);
        }
    }
    
    // Sprungphysik
    if (isJumping) {
        // Sprungbewegung
        jumpHeight += jumpVelocity;
        jumpVelocity -= gravity;
        
        // Wenn der Sprung beendet ist (zurück auf dem Boden)
        if (jumpHeight <= 0) {
            jumpHeight = 0;
            isJumping = false;
            jumpVelocity = 0;
        }
        
        // Kamera entsprechend der Sprunghöhe positionieren
        playerHeight = jumpHeight;
    } else {
        playerHeight = 0;
    }
    
    // Kamerahöhe aktualisieren (basierend auf Sprung)
    camera.position.y = playerHeight;
    
    // Verbesserte Animation der Füße beim Gehen
    if (isMoving && !isJumping) {
        // Schrittgeschwindigkeit basierend auf der tatsächlichen Bewegungsgeschwindigkeit
        const walkSpeed = 0.1 * Math.sqrt(moveX * moveX + moveZ * moveZ) * 5;
        stepCycle += walkSpeed;
        
        // Linker Fuß - Bewegung an neue Position angepasst
        feet.children[0].position.y = -1.9 + Math.max(0, Math.sin(stepCycle)) * 0.15;
        // Rechter Fuß - Bewegung an neue Position angepasst
        feet.children[1].position.y = -1.9 + Math.max(0, Math.sin(stepCycle + Math.PI)) * 0.15;
        
        // Füße bewegen sich mit der Kamera mit
        feet.position.x = camera.position.x;
        feet.position.z = camera.position.z;
    } else if (isJumping) {
        // Beim Springen sind beide Füße in der Luft
        feet.children[0].position.y = -1.9 + jumpHeight;
        feet.children[1].position.y = -1.9 + jumpHeight;
        
        // Füße bewegen sich mit der Kamera mit
        feet.position.x = camera.position.x;
        feet.position.z = camera.position.z;
    } else {
        // Reset Position wenn nicht in Bewegung
        feet.children[0].position.y = -1.9;
        feet.children[1].position.y = -1.9;
        
        // Füße bewegen sich mit der Kamera mit
        feet.position.x = camera.position.x;
        feet.position.z = camera.position.z;
    }
   
    // Aktualisiere den Dash-Indikator
    updateDashIndicator();
    
    // Aktualisiere den Spezial-Move-Indikator
    updateSpecialIndicator();
    
    // Aktualisiere den Zauberstab-Spezial-Indikator
    updateWandSpecialIndicator();
    
    // Aktualisiere das Gesundheitssystem
    updateHealthSystem();
    
    renderer.render(scene, camera);
}

animate();