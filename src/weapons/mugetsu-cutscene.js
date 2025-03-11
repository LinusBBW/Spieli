// Enhanced Mugetsu cutscene with more dramatic effects (without bandages)
function showMugetsuCutScene(callback) {
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
    
    // Create rain effect for dramatic entrance
    const rainContainer = document.createElement('div');
    rainContainer.style.position = 'absolute';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.opacity = '0';
    rainContainer.style.transition = 'opacity 1.5s';
    overlay.appendChild(rainContainer);
    
    // Create raindrops
    for (let i = 0; i < 200; i++) {
        const raindrop = document.createElement('div');
        raindrop.style.position = 'absolute';
        raindrop.style.width = '1px';
        raindrop.style.height = `${5 + Math.random() * 15}px`;
        raindrop.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.top = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${0.5 + Math.random() * 0.8}s`;
        raindrop.style.animationTimingFunction = 'linear';
        raindrop.style.animationIterationCount = 'infinite';
        raindrop.style.transform = 'rotate(20deg)';
        
        // Add falling animation
        const keyframes = `
            @keyframes fall-${i} {
                from { transform: translateY(-100px) rotate(20deg); }
                to { transform: translateY(${window.innerHeight + 100}px) rotate(20deg); }
            }
        `;
        const style = document.createElement('style');
        style.innerHTML = keyframes;
        document.head.appendChild(style);
        
        raindrop.style.animationName = `fall-${i}`;
        rainContainer.appendChild(raindrop);
    }
    
    // Silhouette container for Ichigo
    const silhouetteContainer = document.createElement('div');
    silhouetteContainer.style.position = 'absolute';
    silhouetteContainer.style.top = '0';
    silhouetteContainer.style.left = '0';
    silhouetteContainer.style.width = '100%';
    silhouetteContainer.style.height = '100%';
    silhouetteContainer.style.display = 'flex';
    silhouetteContainer.style.justifyContent = 'center';
    silhouetteContainer.style.alignItems = 'center';
    silhouetteContainer.style.opacity = '0';
    silhouetteContainer.style.transition = 'opacity 1s';
    overlay.appendChild(silhouetteContainer);
    
    // Create silhouette of Ichigo with long hair
    const silhouette = document.createElement('div');
    silhouette.style.position = 'relative';
    silhouette.style.width = '300px';
    silhouette.style.height = '600px';
    silhouetteContainer.appendChild(silhouette);
    
    // Create the body shape (simplified)
    const bodyShape = document.createElement('div');
    bodyShape.style.position = 'absolute';
    bodyShape.style.width = '100px';
    bodyShape.style.height = '250px';
    bodyShape.style.top = '150px';
    bodyShape.style.left = '100px';
    bodyShape.style.backgroundColor = 'black';
    bodyShape.style.borderRadius = '40px 40px 0 0';
    silhouette.appendChild(bodyShape);
    
    // Create head
    const head = document.createElement('div');
    head.style.position = 'absolute';
    head.style.width = '70px';
    head.style.height = '90px';
    head.style.top = '60px';
    head.style.left = '115px';
    head.style.backgroundColor = 'black';
    head.style.borderRadius = '50% 50% 40% 40%';
    silhouette.appendChild(head);
    
    // Create hair container
    const hairContainer = document.createElement('div');
    hairContainer.style.position = 'absolute';
    hairContainer.style.top = '0';
    hairContainer.style.left = '0';
    hairContainer.style.width = '100%';
    hairContainer.style.height = '100%';
    hairContainer.style.zIndex = '-1';
    silhouette.appendChild(hairContainer);
    
    // Create long black hair strands
    for (let i = 0; i < 35; i++) {
        const hairStrand = document.createElement('div');
        const length = 300 + Math.random() * 300;
        const width = 2 + Math.random() * 4;
        
        hairStrand.style.position = 'absolute';
        hairStrand.style.width = `${width}px`;
        hairStrand.style.height = `${length}px`;
        hairStrand.style.borderRadius = '50%';
        hairStrand.style.backgroundColor = 'black';
        hairStrand.style.top = `${40 + Math.random() * 30}px`;
        hairStrand.style.left = `${80 + Math.random() * 140}px`;
        hairStrand.style.transform = `rotate(${90 + (Math.random() - 0.5) * 30}deg)`;
        hairStrand.style.transformOrigin = 'top center';
        
        // Add subtle animation
        const animDelay = Math.random() * 2;
        hairStrand.style.animation = `sway 5s ease-in-out ${animDelay}s infinite alternate`;
        
        hairContainer.appendChild(hairStrand);
    }
    
    // Add animation for hair
    const hairStyle = document.createElement('style');
    hairStyle.innerHTML = `
        @keyframes sway {
            0% { transform: rotate(${85 + (Math.random() - 0.5) * 15}deg); }
            100% { transform: rotate(${95 + (Math.random() - 0.5) * 15}deg); }
        }
    `;
    document.head.appendChild(hairStyle);
    
    // Create dark energy effect container (instead of bandages)
    const energyContainer = document.createElement('div');
    energyContainer.style.position = 'absolute';
    energyContainer.style.top = '0';
    energyContainer.style.left = '0';
    energyContainer.style.width = '100%';
    energyContainer.style.height = '100%';
    energyContainer.style.overflow = 'hidden';
    energyContainer.style.pointerEvents = 'none';
    energyContainer.style.opacity = '0';
    energyContainer.style.transition = 'opacity 1s';
    overlay.appendChild(energyContainer);
    
    // Create dark energy effects
    for (let i = 0; i < 40; i++) {
        createDarkEnergyEffect(energyContainer, i);
    }
    
    // Add red glow background to the silhouette
    const glowEffect = document.createElement('div');
    glowEffect.style.position = 'absolute';
    glowEffect.style.width = '300px';
    glowEffect.style.height = '600px';
    glowEffect.style.borderRadius = '50%';
    glowEffect.style.background = 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(0,0,0,0) 70%)';
    glowEffect.style.filter = 'blur(20px)';
    glowEffect.style.opacity = '0';
    glowEffect.style.transition = 'opacity 2s';
    silhouette.insertBefore(glowEffect, silhouette.firstChild);
    
    // Create Japanese characters container with more dramatic style
    const japaneseContainer = document.createElement('div');
    japaneseContainer.style.position = 'absolute';
    japaneseContainer.style.top = '20%';
    japaneseContainer.style.width = '100%';
    japaneseContainer.style.display = 'flex';
    japaneseContainer.style.justifyContent = 'center';
    japaneseContainer.style.alignItems = 'center';
    japaneseContainer.style.opacity = '0';
    japaneseContainer.style.transform = 'scale(0.5)';
    japaneseContainer.style.transition = 'opacity 1s, transform 1s';
    overlay.appendChild(japaneseContainer);
    
    // Japanese characters with calligraphy style
    const japaneseChars = document.createElement('div');
    japaneseChars.innerHTML = `<span style="font-family: 'Arial', sans-serif; font-weight: bold; color: white; font-size: 180px; position: relative; margin: 0 20px; text-shadow: 0 0 20px #F00;">無</span><span style="font-family: 'Arial', sans-serif; font-weight: bold; color: white; font-size: 180px; position: relative; text-shadow: 0 0 20px #F00;">月</span>`;
    
    // Add ink splatter effect behind kanji
    const inkEffect = document.createElement('div');
    inkEffect.style.position = 'absolute';
    inkEffect.style.width = '500px';
    inkEffect.style.height = '300px';
    inkEffect.style.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)';
    inkEffect.style.filter = 'blur(10px)';
    inkEffect.style.zIndex = '-1';
    
    japaneseContainer.appendChild(inkEffect);
    japaneseContainer.appendChild(japaneseChars);
    
    // English text container with more dramatic position
    const textContainer = document.createElement('div');
    textContainer.style.position = 'absolute';
    textContainer.style.bottom = '25%';
    textContainer.style.width = '100%';
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.alignItems = 'center';
    textContainer.style.opacity = '0';
    textContainer.style.transform = 'translateY(50px)';
    textContainer.style.transition = 'opacity 1s, transform 1s';
    overlay.appendChild(textContainer);
    
    // Enhanced MUGETSU text
    const mugetsuText = document.createElement('h1');
    mugetsuText.innerText = 'MUGETSU';
    mugetsuText.style.color = '#FFF';
    mugetsuText.style.fontFamily = 'Arial, sans-serif';
    mugetsuText.style.fontSize = '90px';
    mugetsuText.style.letterSpacing = '15px';
    mugetsuText.style.fontWeight = 'bold';
    mugetsuText.style.margin = '0';
    mugetsuText.style.position = 'relative';
    mugetsuText.style.textShadow = '0 0 20px #F00';
    textContainer.appendChild(mugetsuText);
    
    // Subtitle with dramatic spacing
    const subtitleText = document.createElement('h2');
    subtitleText.innerText = 'FINAL GETSUGA TENSHO';
    subtitleText.style.color = '#CCC';
    subtitleText.style.fontFamily = 'Arial, sans-serif';
    subtitleText.style.fontSize = '28px';
    subtitleText.style.letterSpacing = '5px';
    subtitleText.style.fontWeight = 'normal';
    subtitleText.style.margin = '20px 0 0 0';
    textContainer.appendChild(subtitleText);
    
    // Create lighting/thunder effects
    const lightningContainer = document.createElement('div');
    lightningContainer.style.position = 'absolute';
    lightningContainer.style.top = '0';
    lightningContainer.style.left = '0';
    lightningContainer.style.width = '100%';
    lightningContainer.style.height = '100%';
    overlay.appendChild(lightningContainer);
    
    // Function to create a lightning flash
    function createLightningFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.1s';
        flash.style.zIndex = '1';
        
        lightningContainer.appendChild(flash);
        
        // Flash animation
        setTimeout(() => {
            flash.style.opacity = '0.8';
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => {
                    lightningContainer.removeChild(flash);
                }, 100);
            }, 50);
        }, 10);
    }
    
    // Animation timeline with more dramatic pacing
    setTimeout(() => {
        // Show rain first
        rainContainer.style.opacity = '1';
        
        // First lightning flash
        setTimeout(() => {
            createLightningFlash();
            // Reveal silhouette after flash
            setTimeout(() => {
                silhouetteContainer.style.opacity = '1';
            }, 100);
        }, 1000);
        
        // Second lightning flash
        setTimeout(() => {
            createLightningFlash();
            // Activate red glow around silhouette
            setTimeout(() => {
                glowEffect.style.opacity = '1';
            }, 100);
        }, 2000);
        
        // Show dark energy with third flash
        setTimeout(() => {
            createLightningFlash();
            energyContainer.style.opacity = '1';
        }, 3000);
        
        // Show Japanese text with fourth flash
        setTimeout(() => {
            createLightningFlash();
            japaneseContainer.style.opacity = '1';
            japaneseContainer.style.transform = 'scale(1)';
            
            // Add dramatic pulse to Japanese text
            const pulseJapanese = () => {
                let scale = 1;
                let growing = false;
                let pulseSpeed = 0.002;
                
                const pulse = () => {
                    if (growing) {
                        scale += pulseSpeed;
                        if (scale >= 1.05) growing = false;
                    } else {
                        scale -= pulseSpeed;
                        if (scale <= 0.95) growing = true;
                    }
                    
                    japaneseChars.style.transform = `scale(${scale})`;
                    requestAnimationFrame(pulse);
                };
                
                pulse();
            };
            
            pulseJapanese();
        }, 4000);
        
        // Show English text with fifth flash
        setTimeout(() => {
            createLightningFlash();
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'translateY(0)';
            
            // Add dramatic text effects
            // Glow pulse for MUGETSU text
            const pulseText = () => {
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
                    
                    const glowSize = 20 + intensity * 40;
                    mugetsuText.style.textShadow = `0 0 ${glowSize}px rgba(255, 0, 0, ${0.5 + intensity * 0.5})`;
                    requestAnimationFrame(pulse);
                };
                
                pulse();
            };
            
            pulseText();
        }, 5000);
        
        // Final sequence - dark energy convergence
        setTimeout(() => {
            // Create powerful convergence effect
            const convergence = document.createElement('div');
            convergence.style.position = 'absolute';
            convergence.style.top = '50%';
            convergence.style.left = '50%';
            convergence.style.width = '10px';
            convergence.style.height = '10px';
            convergence.style.borderRadius = '50%';
            convergence.style.backgroundColor = '#000';
            convergence.style.boxShadow = '0 0 50px 10px rgba(255,0,0,0.7)';
            convergence.style.transform = 'translate(-50%, -50%)';
            convergence.style.transition = 'all 1.5s cubic-bezier(0.2, 0.6, 0.4, 1)';
            convergence.style.zIndex = '100';
            overlay.appendChild(convergence);
            
            // Fade out all other elements
            silhouetteContainer.style.transition = 'opacity 0.5s';
            japaneseContainer.style.transition = 'opacity 0.5s';
            textContainer.style.transition = 'opacity 0.5s';
            energyContainer.style.transition = 'opacity 0.5s';
            rainContainer.style.transition = 'opacity 0.5s';
            
            silhouetteContainer.style.opacity = '0';
            japaneseContainer.style.opacity = '0';
            textContainer.style.opacity = '0';
            energyContainer.style.opacity = '0';
            rainContainer.style.opacity = '0';
            
            // Create one last powerful flash
            setTimeout(() => {
                createLightningFlash();
                
                // Expand the convergence to fill screen
                setTimeout(() => {
                    convergence.style.width = '4000px';
                    convergence.style.height = '4000px';
                    
                    // Execute callback as convergence reaches peak
                    setTimeout(() => {
                        if (callback) callback();
                    }, 800);
                    
                    // Fade out all elements
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(overlay);
                        }, 500);
                    }, 1500);
                }, 100);
            }, 1000);
        }, 7000);
    }, 500);
}

// Helper function to create a dark energy effect
function createDarkEnergyEffect(container, index) {
    // Determine what type of effect to create
    const effectType = Math.floor(Math.random() * 3);
    let effect;
    
    if (effectType === 0) {
        // Wisp type effect - thin, flowing dark energy
        effect = document.createElement('div');
        const width = 2 + Math.random() * 3;
        const length = 100 + Math.random() * 250;
        
        effect.style.position = 'absolute';
        effect.style.width = `${width}px`;
        effect.style.height = `${length}px`;
        effect.style.backgroundColor = 'black';
        effect.style.borderRadius = '2px';
        effect.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.7)';
        effect.style.transformOrigin = 'top center';
        effect.style.opacity = '0';
        
        // Position randomly
        const startX = (window.innerWidth * 0.3) + (Math.random() * window.innerWidth * 0.4);
        const startY = Math.random() * window.innerHeight * 0.7;
        
        effect.style.left = `${startX}px`;
        effect.style.top = `${startY}px`;
        
        // Random rotation
        const rotation = -30 + Math.random() * 60;
        effect.style.transform = `rotate(${rotation}deg)`;
    }
    else if (effectType === 1) {
        // Smoke/cloud effect
        effect = document.createElement('div');
        const size = 50 + Math.random() * 150;
        
        effect.style.position = 'absolute';
        effect.style.width = `${size}px`;
        effect.style.height = `${size}px`;
        effect.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        effect.style.borderRadius = '50%';
        effect.style.filter = 'blur(20px)';
        effect.style.opacity = '0';
        
        // Position randomly
        effect.style.left = `${Math.random() * window.innerWidth}px`;
        effect.style.top = `${Math.random() * window.innerHeight}px`;
    }
    else {
        // Red energy spot
        effect = document.createElement('div');
        const size = 20 + Math.random() * 60;
        
        effect.style.position = 'absolute';
        effect.style.width = `${size}px`;
        effect.style.height = `${size}px`;
        effect.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        effect.style.borderRadius = '50%';
        effect.style.filter = 'blur(10px)';
        effect.style.opacity = '0';
        
        // Position randomly
        effect.style.left = `${Math.random() * window.innerWidth}px`;
        effect.style.top = `${Math.random() * window.innerHeight}px`;
    }
    
    // Add to container
    container.appendChild(effect);
    
    // Animate with delay based on index
    setTimeout(() => {
        // Make visible
        effect.style.opacity = effectType === 0 ? '0.8' : 
                              effectType === 1 ? '0.6' : '0.4';
        
        // Add transition based on effect type
        if (effectType === 0) {
            // Wisp movement
            effect.style.transition = `opacity 0.5s, top ${2 + Math.random()}s ease-in-out, 
                                       transform ${1.5 + Math.random()}s ease-in-out`;
            
            // Animate flowing movement
            setTimeout(() => {
                const moveDistance = 50 + Math.random() * 100;
                const newRotation = -30 + Math.random() * 60;
                
                // Move in random direction
                effect.style.top = `${parseFloat(effect.style.top) + (Math.random() > 0.5 ? moveDistance : -moveDistance)}px`;
                effect.style.transform = `rotate(${newRotation}deg)`;
                
                // Create movement loop
                const moveWisp = () => {
                    const currentTop = parseFloat(effect.style.top);
                    const currentRotation = parseFloat(effect.style.transform.replace(/[^\d.-]/g, ''));
                    
                    // New positions
                    const newTop = currentTop + (Math.random() > 0.5 ? moveDistance : -moveDistance);
                    const newRot = currentRotation + (Math.random() > 0.5 ? 30 : -30);
                    
                    // Apply new position
                    effect.style.top = `${newTop}px`;
                    effect.style.transform = `rotate(${newRot}deg)`;
                    
                    // Keep in viewport
                    if (newTop > window.innerHeight || newTop < -100) {
                        effect.style.opacity = '0';
                        setTimeout(() => {
                            // Reset position
                            effect.style.top = `${Math.random() * window.innerHeight * 0.7}px`;
                            effect.style.opacity = '0.8';
                        }, 500);
                    }
                    
                    // Continue loop with random timing
                    setTimeout(moveWisp, 1000 + Math.random() * 2000);
                };
                
                // Start movement loop
                setTimeout(moveWisp, 1000 + Math.random() * 1000);
            }, 100);
        }
        else if (effectType === 1) {
            // Smoke cloud drift
            effect.style.transition = `opacity 1s, left ${5 + Math.random() * 5}s linear, 
                                      top ${5 + Math.random() * 5}s linear, 
                                      transform ${3 + Math.random() * 3}s ease-in-out`;
            
            // Slow drift animation
            setTimeout(() => {
                // Drift direction
                const driftX = Math.random() > 0.5 ? 200 : -200;
                const driftY = Math.random() > 0.5 ? 200 : -200;
                
                // Apply drift
                effect.style.left = `${parseFloat(effect.style.left) + driftX}px`;
                effect.style.top = `${parseFloat(effect.style.top) + driftY}px`;
                
                // Scale effect
                effect.style.transform = `scale(${0.8 + Math.random() * 0.4})`;
                
                // Fade out when near edge
                setTimeout(() => {
                    effect.style.opacity = '0';
                    
                    // Reset after fade out
                    setTimeout(() => {
                        effect.style.left = `${Math.random() * window.innerWidth}px`;
                        effect.style.top = `${Math.random() * window.innerHeight}px`;
                        effect.style.transform = 'scale(1)';
                        effect.style.opacity = '0.6';
                    }, 1000);
                }, 4000);
            }, 100);
        }
        else {
            // Red energy pulse
            effect.style.transition = `opacity 0.8s, transform 2s ease-in-out`;
            
            // Pulsing animation
            const pulseEffect = () => {
                // Pulse scale
                effect.style.transform = `scale(${0.8 + Math.random() * 0.5})`;
                
                // Pulse opacity
                effect.style.opacity = `${0.2 + Math.random() * 0.3}`;
                
                // Continue pulse
                setTimeout(pulseEffect, 2000 + Math.random() * 1000);
            };
            
            // Start pulse
            pulseEffect();
        }
    }, index * 100 + Math.random() * 500);
    
    return effect;
}

export { showMugetsuCutScene };