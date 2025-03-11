// Function to show the Ju Jisho cut scene
function showJuJishoCutScene(callback) {
    // Create a black overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.zIndex = '2500';
    document.body.appendChild(overlay);
    
    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // Create scene container
    const sceneContainer = document.createElement('div');
    sceneContainer.style.position = 'absolute';
    sceneContainer.style.top = '0';
    sceneContainer.style.left = '0';
    sceneContainer.style.width = '100%';
    sceneContainer.style.height = '100%';
    sceneContainer.style.display = 'flex';
    sceneContainer.style.justifyContent = 'center';
    sceneContainer.style.alignItems = 'center';
    sceneContainer.style.overflow = 'hidden';
    overlay.appendChild(sceneContainer);
    
    // Create main text that will be sliced
    const mainText = document.createElement('div');
    mainText.innerText = 'JU JISHO';
    mainText.style.color = '#FFD700';
    mainText.style.fontFamily = 'Arial, sans-serif';
    mainText.style.fontSize = '130px';
    mainText.style.fontWeight = 'bold';
    mainText.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
    mainText.style.position = 'relative';
    mainText.style.opacity = '0';
    mainText.style.transition = 'opacity 0.8s';
    mainText.style.letterSpacing = '10px';
    sceneContainer.appendChild(mainText);
    
    // Show main text
    setTimeout(() => {
        mainText.style.opacity = '1';
        
        // Add a subtle vibration effect to the text
        const vibrateText = () => {
            const intensity = 2;
            mainText.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`;
            
            setTimeout(vibrateText, 50);
        };
        vibrateText();
        
        // Add a pulse effect to the text shadow
        let pulseIntensity = 0;
        let increasing = true;
        const pulseText = () => {
            if (increasing) {
                pulseIntensity += 0.05;
                if (pulseIntensity >= 1) increasing = false;
            } else {
                pulseIntensity -= 0.05;
                if (pulseIntensity <= 0) increasing = true;
            }
            
            const glowSize = 10 + pulseIntensity * 15;
            mainText.style.textShadow = `0 0 ${glowSize}px rgba(255, 215, 0, ${0.5 + pulseIntensity * 0.5})`;
            
            setTimeout(pulseText, 30);
        };
        pulseText();
    }, 800);
    
    // Create subtitle
    const subtitle = document.createElement('div');
    subtitle.innerText = 'CROSS OF DESTRUCTION';
    subtitle.style.color = 'white';
    subtitle.style.fontFamily = 'Arial, sans-serif';
    subtitle.style.fontSize = '24px';
    subtitle.style.position = 'absolute';
    subtitle.style.top = '60%';
    subtitle.style.left = '0';
    subtitle.style.width = '100%';
    subtitle.style.textAlign = 'center';
    subtitle.style.opacity = '0';
    subtitle.style.transition = 'opacity 0.5s';
    subtitle.style.letterSpacing = '5px';
    overlay.appendChild(subtitle);
    
    // Show subtitle
    setTimeout(() => {
        subtitle.style.opacity = '1';
    }, 1500);
    
    // Create the slice effect container
    const sliceEffectContainer = document.createElement('div');
    sliceEffectContainer.style.position = 'absolute';
    sliceEffectContainer.style.top = '0';
    sliceEffectContainer.style.left = '0';
    sliceEffectContainer.style.width = '100%';
    sliceEffectContainer.style.height = '100%';
    sliceEffectContainer.style.zIndex = '2600';
    sliceEffectContainer.style.pointerEvents = 'none';
    overlay.appendChild(sliceEffectContainer);
    
    // Function to create slice animations
    function createSliceAnimation() {
        // Create slice flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.1s';
        flash.style.zIndex = '2700';
        sliceEffectContainer.appendChild(flash);
        
        // First diagonal slice (top-left to bottom-right)
        const slice1 = document.createElement('div');
        slice1.style.position = 'absolute';
        slice1.style.top = '50%';
        slice1.style.left = '50%';
        slice1.style.width = '200vw'; // Use viewport units for consistent sizing
        slice1.style.height = '5px';
        slice1.style.background = 'linear-gradient(90deg, transparent, #FFD700, white, #FFD700, transparent)';
        slice1.style.boxShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
        slice1.style.transform = 'translate(-50%, -50%) rotate(45deg)';
        slice1.style.transformOrigin = 'center';
        slice1.style.opacity = '0';
        sliceEffectContainer.appendChild(slice1);
        
        // Second diagonal slice (top-right to bottom-left)
        const slice2 = document.createElement('div');
        slice2.style.position = 'absolute';
        slice2.style.top = '50%';
        slice2.style.left = '50%';
        slice2.style.width = '200vw'; // Use viewport units for consistent sizing
        slice2.style.height = '5px';
        slice2.style.background = 'linear-gradient(90deg, transparent, #FFD700, white, #FFD700, transparent)';
        slice2.style.boxShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
        slice2.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        slice2.style.transformOrigin = 'center';
        slice2.style.opacity = '0';
        sliceEffectContainer.appendChild(slice2);
        
        // Animate first slice
        setTimeout(() => {
            // Instead of moving the top property, use a transform to slide through
            slice1.style.transition = 'opacity 0.1s';
            slice1.style.opacity = '1';
            
            // First position the slice off-screen (remember it's now centered)
            slice1.style.transform = 'translate(-50%, -50%) rotate(45deg) translateX(-100vw)';
            
            // Then animate it moving through the center to the other side
            setTimeout(() => {
                slice1.style.transition = 'transform 0.3s linear';
                slice1.style.transform = 'translate(-50%, -50%) rotate(45deg) translateX(100vw)';
            }, 50);
            
            setTimeout(() => {
                // Show flash briefly
                flash.style.opacity = '0.8';
                
                // Animate the text split after first slice
                splitTextEffect(mainText, 45);
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                }, 100);
            }, 200);
        }, 2500);
        
        // Animate second slice
        setTimeout(() => {
            slice2.style.transition = 'opacity 0.1s';
            slice2.style.opacity = '1';
            
            // First position the slice off-screen (remember it's now centered)
            slice2.style.transform = 'translate(-50%, -50%) rotate(-45deg) translateX(-100vw)';
            
            // Then animate it moving through the center to the other side
            setTimeout(() => {
                slice2.style.transition = 'transform 0.3s linear';
                slice2.style.transform = 'translate(-50%, -50%) rotate(-45deg) translateX(100vw)';
            }, 50);
            
            setTimeout(() => {
                // Show flash briefly
                flash.style.opacity = '0.9';
                
                // Further split the text
                splitTextEffect(mainText, -45);
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                    
                    // Create the energy explosion effect
                    createExplosionEffect(sliceEffectContainer);
                    
                    // Remove slices
                    setTimeout(() => {
                        sliceEffectContainer.removeChild(slice1);
                        sliceEffectContainer.removeChild(slice2);
                    }, 300);
                }, 100);
            }, 200);
        }, 2900);
    }
    
    // Split text effect when sliced
    function splitTextEffect(textElement, angle) {
        // Get current text
        const text = textElement.innerText;
        textElement.innerHTML = '';
        
        // Create top half container
        const topHalf = document.createElement('div');
        topHalf.innerText = text;
        topHalf.style.position = 'absolute';
        topHalf.style.color = '#FFD700';
        topHalf.style.fontFamily = 'Arial, sans-serif';
        topHalf.style.fontSize = '130px';
        topHalf.style.fontWeight = 'bold';
        topHalf.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
        topHalf.style.height = '65px';
        topHalf.style.overflow = 'hidden';
        topHalf.style.top = '-65px';
        topHalf.style.letterSpacing = '10px';
        topHalf.style.width = '100%';
        topHalf.style.textAlign = 'center';
        topHalf.style.transition = `transform 0.7s ease-out, top 0.7s ease-out`;
        textElement.appendChild(topHalf);
        
        // Create bottom half container
        const bottomHalf = document.createElement('div');
        bottomHalf.innerText = text;
        bottomHalf.style.position = 'absolute';
        bottomHalf.style.color = '#FFD700';
        bottomHalf.style.fontFamily = 'Arial, sans-serif';
        bottomHalf.style.fontSize = '130px';
        bottomHalf.style.fontWeight = 'bold';
        bottomHalf.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
        bottomHalf.style.height = '130px';
        bottomHalf.style.top = '0';
        bottomHalf.style.letterSpacing = '10px';
        bottomHalf.style.width = '100%';
        bottomHalf.style.textAlign = 'center';
        bottomHalf.style.clipPath = 'inset(65px 0 0 0)';
        bottomHalf.style.transition = `transform 0.7s ease-out, top 0.7s ease-out`;
        textElement.appendChild(bottomHalf);
        
        // Animate the split after a tiny delay
        setTimeout(() => {
            const distance = 70;
            
            if (angle === 45) {
                topHalf.style.transform = `translateX(-${distance}px)`;
                bottomHalf.style.transform = `translateX(${distance}px)`;
            } else {
                topHalf.style.transform = `translateX(${distance}px)`;
                bottomHalf.style.transform = `translateX(-${distance}px)`;
            }
        }, 50);
    }
    
    // Create energy explosion effect
    function createExplosionEffect(container) {
        // Energy center
        const energyCenter = document.createElement('div');
        energyCenter.style.position = 'absolute';
        energyCenter.style.top = '50%';
        energyCenter.style.left = '50%';
        energyCenter.style.width = '20px';
        energyCenter.style.height = '20px';
        energyCenter.style.borderRadius = '50%';
        energyCenter.style.backgroundColor = 'white';
        energyCenter.style.boxShadow = '0 0 30px white, 0 0 60px #FFD700';
        energyCenter.style.transform = 'translate(-50%, -50%) scale(0)';
        energyCenter.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
        container.appendChild(energyCenter);
        
        // X-shaped energy beams
        for (let i = 0; i < 2; i++) {
            const beam = document.createElement('div');
            beam.style.position = 'absolute';
            beam.style.top = '50%';
            beam.style.left = '50%';
            beam.style.width = '0';
            beam.style.height = '10px';
            beam.style.backgroundColor = '#FFD700';
            beam.style.boxShadow = '0 0 20px #FFD700, 0 0 40px white';
            beam.style.transform = `translate(-50%, -50%) rotate(${i === 0 ? '45deg' : '-45deg'})`;
            beam.style.transformOrigin = 'center';
            beam.style.transition = 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
            beam.style.borderRadius = '5px';
            container.appendChild(beam);
            
            // Animate beam expansion
            setTimeout(() => {
                beam.style.width = '250%';
            }, 100);
        }
        
        // Energy particles
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            const size = 2 + Math.random() * 6;
            particle.style.position = 'absolute';
            particle.style.top = '50%';
            particle.style.left = '50%';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = '#FFD700';
            particle.style.borderRadius = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = '0 0 5px #FFD700';
            particle.style.opacity = '0';
            container.appendChild(particle);
            
            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 450;
            const duration = 0.5 + Math.random() * 1;
            
            // Animate particle
            setTimeout(() => {
                particle.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
                particle.style.opacity = '1';
                particle.style.transform = `translate(
                    calc(-50% + ${Math.cos(angle) * distance}px), 
                    calc(-50% + ${Math.sin(angle) * distance}px)
                )`;
                
                // Fade out
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        container.removeChild(particle);
                    }, duration * 1000);
                }, duration * 500);
            }, 100 + Math.random() * 300);
        }
        
        // Animate energy center
        setTimeout(() => {
            energyCenter.style.transform = 'translate(-50%, -50%) scale(10)';
            energyCenter.style.opacity = '0.8';
            
            setTimeout(() => {
                energyCenter.style.transition = 'transform 0.5s, opacity 0.5s';
                energyCenter.style.opacity = '0';
                energyCenter.style.transform = 'translate(-50%, -50%) scale(15)';
            }, 600);
        }, 100);
    }
    
    // Start the animation sequence
    createSliceAnimation();
    
    // Finish and callback after the animation completes - reduced timing
    setTimeout(() => {
        // Schnelleres Ausblenden für einen nahtloseren Übergang
        overlay.style.transition = 'opacity 0.3s';
        overlay.style.opacity = '0';
        
        // Rufe den Callback früher auf, während die Ausblendung noch läuft
        // Dies lässt den Spezialangriff starten, während die Cutscene noch sichtbar ist
        if (callback) callback();
        
        // Entferne das Overlay erst nach vollständigem Ausblenden
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 4800); // Reduzierte Gesamtzeit
}

export { showJuJishoCutScene };