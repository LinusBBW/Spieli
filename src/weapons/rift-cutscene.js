// Dimensional Rift cutscene implementation

function showRiftCutScene(callback) {
    // Create black overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.zIndex = '2500';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.overflow = 'hidden'; // Hide overflow for effects
    document.body.appendChild(overlay);
    
    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // Create reality distortion effect container
    const distortionContainer = document.createElement('div');
    distortionContainer.style.position = 'absolute';
    distortionContainer.style.top = '0';
    distortionContainer.style.left = '0';
    distortionContainer.style.width = '100%';
    distortionContainer.style.height = '100%';
    distortionContainer.style.overflow = 'hidden';
    distortionContainer.style.opacity = '0';
    distortionContainer.style.transition = 'opacity 1s';
    overlay.appendChild(distortionContainer);
    
    // Create shattering glass effect elements
    const shardCount = 50;
    const shards = [];
    
    for (let i = 0; i < shardCount; i++) {
        createShard(distortionContainer, i, shards);
    }
    
    // Create central rift tear
    const riftContainer = document.createElement('div');
    riftContainer.style.position = 'absolute';
    riftContainer.style.top = '50%';
    riftContainer.style.left = '50%';
    riftContainer.style.transform = 'translate(-50%, -50%)';
    riftContainer.style.width = '0';
    riftContainer.style.height = '0';
    riftContainer.style.display = 'flex';
    riftContainer.style.justifyContent = 'center';
    riftContainer.style.alignItems = 'center';
    riftContainer.style.overflow = 'visible';
    riftContainer.style.opacity = '0';
    overlay.appendChild(riftContainer);
    
    // Create jagged rift element
    const rift = document.createElement('div');
    rift.style.position = 'relative';
    rift.style.width = '10px';
    rift.style.height = '500px';
    rift.style.background = 'linear-gradient(to right, rgba(138, 43, 226, 0.7), rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0.9) 80%, rgba(138, 43, 226, 0.7))';
    rift.style.borderRadius = '2px';
    rift.style.clipPath = createJaggedPath();
    rift.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.8)';
    riftContainer.appendChild(rift);
    
    // Create text container
    const textContainer = document.createElement('div');
    textContainer.style.position = 'absolute';
    textContainer.style.top = '0';
    textContainer.style.left = '0';
    textContainer.style.width = '100%';
    textContainer.style.height = '100%';
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.justifyContent = 'center';
    textContainer.style.alignItems = 'center';
    textContainer.style.opacity = '0';
    textContainer.style.transform = 'scale(0.8)';
    textContainer.style.transition = 'opacity 1s, transform 1s';
    overlay.appendChild(textContainer);
    
    // Main title text
    const titleText = document.createElement('h1');
    titleText.innerText = 'DIMENSIONAL RIFT';
    titleText.style.color = '#FFF';
    titleText.style.fontFamily = 'Arial, sans-serif';
    titleText.style.fontSize = '80px';
    titleText.style.fontWeight = 'bold';
    titleText.style.letterSpacing = '10px';
    titleText.style.textShadow = '0 0 20px #8A2BE2';
    titleText.style.margin = '0';
    textContainer.appendChild(titleText);
    
    // Subtitle
    const subtitleText = document.createElement('h2');
    subtitleText.innerText = 'REALITY TORN ASUNDER';
    subtitleText.style.color = '#CCC';
    subtitleText.style.fontFamily = 'Arial, sans-serif';
    subtitleText.style.fontSize = '30px';
    subtitleText.style.letterSpacing = '5px';
    subtitleText.style.margin = '20px 0 0 0';
    textContainer.appendChild(subtitleText);
    
    // Create particle effects
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.opacity = '0';
    overlay.appendChild(particleContainer);
    
    // Create particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
    
    // Create lightning effects
    const lightningContainer = document.createElement('div');
    lightningContainer.style.position = 'absolute';
    lightningContainer.style.top = '0';
    lightningContainer.style.left = '0';
    lightningContainer.style.width = '100%';
    lightningContainer.style.height = '100%';
    overlay.appendChild(lightningContainer);
    
    // Animation timeline
    setTimeout(() => {
        // Initial reality distortion
        distortionContainer.style.opacity = '1';
        
        // Animate shards
        shards.forEach((shard, index) => {
            setTimeout(() => {
                shard.style.transform = `translate(${shard.dataset.targetX}, ${shard.dataset.targetY}) rotate(${shard.dataset.targetRotation})`;
            }, index * 10);
        });
        
        // First lightning flash
        setTimeout(() => {
            createLightningFlash(lightningContainer);
            
            // Reveal rift after flash
            setTimeout(() => {
                riftContainer.style.opacity = '1';
                startRiftAnimation(rift);
            }, 200);
        }, 1500);
        
        // Second lightning flash and expand rift
        setTimeout(() => {
            createLightningFlash(lightningContainer);
            
            // Expand rift width
            rift.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            rift.style.width = '300px';
            
            // Show particles
            particleContainer.style.opacity = '1';
        }, 2500);
        
        // Third lightning and show text
        setTimeout(() => {
            createLightningFlash(lightningContainer);
            
            // Show text
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'scale(1)';
            
            // Add text animation
            animateText(titleText);
        }, 3500);
        
        // Final effect and end scene
        setTimeout(() => {
            createLightningFlash(lightningContainer);
            
            // Create rift implosion effect
            createRiftImplosion(overlay, rift);
            
            // Fade out all elements
            setTimeout(() => {
                distortionContainer.style.opacity = '0';
                riftContainer.style.opacity = '0';
                textContainer.style.opacity = '0';
                particleContainer.style.opacity = '0';
                
                // Fade out overlay
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    
                    // Remove from DOM and trigger callback
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                        if (callback) callback();
                    }, 500);
                }, 1000);
            }, 1500);
        }, 5000);
    }, 500);
}

// Create a jagged path for the rift
function createJaggedPath() {
    let path = 'polygon(';
    
    // Left side jagged points
    const leftPoints = [];
    for (let i = 0; i < 20; i++) {
        // More jagged on the sides
        const xPos = Math.max(0, 20 + (Math.random() - 0.7) * 40);
        const yPos = i * 5;
        leftPoints.push(`${xPos}% ${yPos}%`);
    }
    
    // Right side jagged points (in reverse order to close the polygon)
    const rightPoints = [];
    for (let i = 19; i >= 0; i--) {
        const xPos = Math.min(100, 80 + (Math.random() - 0.3) * 40);
        const yPos = i * 5;
        rightPoints.push(`${xPos}% ${yPos}%`);
    }
    
    path += [...leftPoints, ...rightPoints].join(', ');
    path += ')';
    
    return path;
}

// Create reality shards
function createShard(container, index, shardsArray) {
    const shard = document.createElement('div');
    
    // Size varies but generally large to cover screen
    const width = 20 + Math.random() * 40;
    const height = 20 + Math.random() * 40;
    
    // Position across the screen
    const startX = 50;
    const startY = 50;
    
    // Calculate end positions - explode outward from center
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const targetX = startX + Math.cos(angle) * distance;
    const targetY = startY + Math.sin(angle) * distance;
    
    // Rotation
    const startRotation = 0;
    const targetRotation = (Math.random() - 0.5) * 180;
    
    // Style the shard
    shard.style.position = 'absolute';
    shard.style.top = `${startY}%`;
    shard.style.left = `${startX}%`;
    shard.style.width = `${width}%`;
    shard.style.height = `${height}%`;
    shard.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    shard.style.transform = `translate(-50%, -50%) rotate(${startRotation}deg)`;
    shard.style.transformOrigin = 'center';
    shard.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
    shard.style.clipPath = 'polygon(' + 
        '0 0, ' +
        `${Math.random() * 50}% ${Math.random() * 50}%, ` +
        '100% 0, ' +
        `${50 + Math.random() * 50}% ${Math.random() * 50}%, ` +
        '100% 100%, ' +
        `${Math.random() * 50}% ${50 + Math.random() * 50}%, ` +
        '0 100%, ' +
        `${Math.random() * 50}% ${Math.random() * 50}%` +
    ')';
    
    // Add a purple border glow
    shard.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.5)';
    
    // Store target values for animation
    shard.dataset.targetX = `${targetX - startX}%`;
    shard.dataset.targetY = `${targetY - startY}%`;
    shard.dataset.targetRotation = `${targetRotation}deg`;
    
    container.appendChild(shard);
    shardsArray.push(shard);
    
    return shard;
}

// Create particles for the rift
function createParticle(container) {
    const particle = document.createElement('div');
    
    // Random properties
    const size = 2 + Math.random() * 6;
    
    // Random shape
    const shapeType = Math.floor(Math.random() * 3);
    let shape;
    
    if (shapeType === 0) {
        // Circle
        shape = 'circle';
        particle.style.borderRadius = '50%';
    } else if (shapeType === 1) {
        // Square
        shape = 'square';
    } else {
        // Diamond
        shape = 'diamond';
        particle.style.transform = 'rotate(45deg)';
    }
    
    // Random color - purples and blues
    const colorType = Math.floor(Math.random() * 3);
    let color;
    
    if (colorType === 0) {
        color = 'rgba(138, 43, 226, 0.7)'; // Purple
    } else if (colorType === 1) {
        color = 'rgba(0, 0, 0, 0.8)'; // Black
    } else {
        color = 'rgba(75, 0, 130, 0.7)'; // Indigo
    }
    
    // Style the particle
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.top = '50%';
    particle.style.left = '50%';
    
    // Add to container
    container.appendChild(particle);
    
    // Animation
    const angle = Math.random() * Math.PI * 2;
    const startDistance = 10 + Math.random() * 20;
    const endDistance = 200 + Math.random() * 400;
    const duration = 3 + Math.random() * 7;
    
    // Set initial position
    const startX = Math.cos(angle) * startDistance;
    const startY = Math.sin(angle) * startDistance;
    particle.style.transform = `translate(${startX}px, ${startY}px) ${shape === 'diamond' ? 'rotate(45deg)' : ''}`;
    
    // Animate
    setTimeout(() => {
        particle.style.transition = `transform ${duration}s linear, opacity ${duration * 0.5}s linear`;
        
        // End position - flying outward
        const endX = Math.cos(angle) * endDistance;
        const endY = Math.sin(angle) * endDistance;
        
        particle.style.transform = `translate(${endX}px, ${endY}px) ${shape === 'diamond' ? 'rotate(45deg)' : ''}`;
        
        // Fade out halfway through
        setTimeout(() => {
            particle.style.opacity = '0';
        }, duration * 500);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                container.removeChild(particle);
                // Create a new particle to replace it
                createParticle(container);
            }
        }, duration * 1000);
    }, 100);
    
    return particle;
}

// Create lightning flash effect
function createLightningFlash(container) {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'white';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.1s';
    flash.style.zIndex = '10';
    
    container.appendChild(flash);
    
    // Flash animation
    setTimeout(() => {
        flash.style.opacity = '0.8';
        setTimeout(() => {
            flash.style.opacity = '0';
            
            // Second smaller flash
            setTimeout(() => {
                flash.style.opacity = '0.4';
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        container.removeChild(flash);
                    }, 100);
                }, 50);
            }, 100);
        }, 50);
    }, 10);
}

// Animate the rift
function startRiftAnimation(rift) {
    // Pulse animation
    let pulseIntensity = 0;
    let increasing = true;
    
    const pulse = () => {
        if (increasing) {
            pulseIntensity += 0.01;
            if (pulseIntensity >= 1) increasing = false;
        } else {
            pulseIntensity -= 0.01;
            if (pulseIntensity <= 0) increasing = true;
        }
        
        const glowSize = 15 + pulseIntensity * 20;
        rift.style.boxShadow = `0 0 ${glowSize}px rgba(138, 43, 226, ${0.7 + pulseIntensity * 0.3})`;
        
        // Continue animation if element exists
        if (rift.parentNode) {
            requestAnimationFrame(pulse);
        }
    };
    
    pulse();
    
    // Rift movement
    let offset = 0;
    const moveRift = () => {
        offset += 0.05;
        const shift = Math.sin(offset) * 5;
        
        // Apply subtle distortion
        const newClipPath = createJaggedPath();
        rift.style.clipPath = newClipPath;
        
        // Apply subtle position shift
        rift.style.marginLeft = `${shift}px`;
        rift.style.marginTop = `${shift * 0.5}px`;
        
        // Continue animation if element exists
        if (rift.parentNode) {
            requestAnimationFrame(moveRift);
        }
    };
    
    moveRift();
}

// Animate text with glitch effect
function animateText(textElement) {
    // Original text
    const originalText = textElement.innerText;
    let glitchInterval;
    
    // Create glitch effect
    const glitchText = () => {
        // 20% chance to glitch
        if (Math.random() < 0.2) {
            // Create glitched text
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                // 30% chance to replace character
                if (Math.random() < 0.3) {
                    // Replace with a random character
                    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|";
                    glitchedText += chars.charAt(Math.floor(Math.random() * chars.length));
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            // Update text
            textElement.innerText = glitchedText;
            
            // Reset after a short time
            setTimeout(() => {
                textElement.innerText = originalText;
            }, 50 + Math.random() * 150);
        }
    };
    
    // Start glitch effect
    glitchInterval = setInterval(glitchText, 200);
    
    // Stop after 3 seconds
    setTimeout(() => {
        clearInterval(glitchInterval);
        textElement.innerText = originalText;
    }, 3000);
    
    // Add CSS color glitch
    let colorShiftInterval;
    
    const colorShift = () => {
        // Random color shift
        if (Math.random() < 0.3) {
            const hue = Math.random() * 60 + 260; // Purple range
            textElement.style.color = `hsl(${hue}, 100%, 70%)`;
            
            // Reset after a short time
            setTimeout(() => {
                textElement.style.color = '#FFF';
            }, 50 + Math.random() * 100);
        }
    };
    
    // Start color shift
    colorShiftInterval = setInterval(colorShift, 150);
    
    // Stop after 3 seconds
    setTimeout(() => {
        clearInterval(colorShiftInterval);
        textElement.style.color = '#FFF';
    }, 3000);
}

// Create rift implosion effect
function createRiftImplosion(overlay, rift) {
    // Create implosion container
    const implosionContainer = document.createElement('div');
    implosionContainer.style.position = 'absolute';
    implosionContainer.style.top = '0';
    implosionContainer.style.left = '0';
    implosionContainer.style.width = '100%';
    implosionContainer.style.height = '100%';
    implosionContainer.style.display = 'flex';
    implosionContainer.style.justifyContent = 'center';
    implosionContainer.style.alignItems = 'center';
    overlay.appendChild(implosionContainer);
    
    // Create implosion core
    const implosionCore = document.createElement('div');
    implosionCore.style.width = '300px';
    implosionCore.style.height = '500px';
    implosionCore.style.backgroundColor = 'black';
    implosionCore.style.boxShadow = '0 0 50px rgba(138, 43, 226, 1)';
    implosionCore.style.position = 'absolute';
    implosionCore.style.transition = 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
    implosionContainer.appendChild(implosionCore);
    
    // Create particles flying into the core
    for (let i = 0; i < 200; i++) {
        createImplosionParticle(implosionContainer);
    }
    
    // Implode the rift
    setTimeout(() => {
        // Shrink the core
        implosionCore.style.width = '0';
        implosionCore.style.height = '0';
        
        // Increase glow as it shrinks
        implosionCore.style.boxShadow = '0 0 100px rgba(138, 43, 226, 1)';
    }, 500);
}

// Create particles for the implosion
function createImplosionParticle(container) {
    const particle = document.createElement('div');
    
    // Random properties
    const size = 2 + Math.random() * 8;
    
    // Position randomly around the screen
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    
    // Random color - purples and blues
    const colorType = Math.floor(Math.random() * 3);
    let color;
    
    if (colorType === 0) {
        color = 'rgba(138, 43, 226, 0.7)'; // Purple
    } else if (colorType === 1) {
        color = 'rgba(0, 0, 0, 0.8)'; // Black
    } else {
        color = 'rgba(75, 0, 130, 0.7)'; // Indigo
    }
    
    // Style the particle
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.top = `${startY}%`;
    particle.style.left = `${startX}%`;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    // Add to container
    container.appendChild(particle);
    
    // Animation
    const duration = 0.3 + Math.random() * 0.7;
    
    // Animate
    setTimeout(() => {
        particle.style.transition = `all ${duration}s cubic-bezier(0.4, 0.0, 0.2, 1)`;
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.width = '0';
        particle.style.height = '0';
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                container.removeChild(particle);
            }
        }, duration * 1000);
    }, Math.random() * 500);
    
    return particle;
}

export { showRiftCutScene };