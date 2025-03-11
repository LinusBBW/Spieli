// Mugetsu cutscene - Dramatic sequence for Ichigo's Final Getsuga Tensho

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
    overlay.style.zIndex = '2500'; // Higher than game over screen
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    document.body.appendChild(overlay);
    
    // Fade in overlay
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // Add red gradient background to create atmosphere
    const gradientBg = document.createElement('div');
    gradientBg.style.position = 'absolute';
    gradientBg.style.top = '0';
    gradientBg.style.left = '0';
    gradientBg.style.width = '100%';
    gradientBg.style.height = '100%';
    gradientBg.style.background = 'radial-gradient(circle at center, #500 5%, #300 30%, #000 70%)';
    gradientBg.style.opacity = '0';
    gradientBg.style.transition = 'opacity 1s';
    overlay.appendChild(gradientBg);
    
    // Create container for Japanese characters
    const japaneseContainer = document.createElement('div');
    japaneseContainer.style.marginBottom = '50px';
    japaneseContainer.style.opacity = '0';
    japaneseContainer.style.transform = 'scale(0.5)';
    japaneseContainer.style.transition = 'opacity 1s, transform 1s';
    overlay.appendChild(japaneseContainer);
    
    // Japanese characters for "無月" (Mugetsu)
    const japanese1 = document.createElement('span');
    japanese1.innerText = '無';
    japanese1.style.color = '#FFF';
    japanese1.style.fontSize = '120px';
    japanese1.style.fontWeight = 'bold';
    japanese1.style.marginRight = '20px';
    japanese1.style.textShadow = '0 0 10px #F00';
    japaneseContainer.appendChild(japanese1);
    
    const japanese2 = document.createElement('span');
    japanese2.innerText = '月';
    japanese2.style.color = '#FFF';
    japanese2.style.fontSize = '120px';
    japanese2.style.fontWeight = 'bold';
    japanese2.style.textShadow = '0 0 10px #F00';
    japaneseContainer.appendChild(japanese2);
    
    // Create container for English text
    const textContainer = document.createElement('div');
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.alignItems = 'center';
    textContainer.style.opacity = '0';
    textContainer.style.transform = 'translateY(50px)';
    textContainer.style.transition = 'opacity 1s, transform 1s';
    overlay.appendChild(textContainer);
    
    // English "MUGETSU" text
    const mugetsuText = document.createElement('h1');
    mugetsuText.innerText = 'MUGETSU';
    mugetsuText.style.color = '#FFF';
    mugetsuText.style.fontFamily = 'Arial, sans-serif';
    mugetsuText.style.fontSize = '80px';
    mugetsuText.style.letterSpacing = '10px';
    mugetsuText.style.fontWeight = 'bold';
    mugetsuText.style.textShadow = '0 0 20px #F00';
    mugetsuText.style.margin = '0';
    textContainer.appendChild(mugetsuText);
    
    // "Final Getsuga Tensho" subtitle
    const subtitleText = document.createElement('h2');
    subtitleText.innerText = 'Final Getsuga Tensho';
    subtitleText.style.color = '#AAA';
    subtitleText.style.fontFamily = 'Arial, sans-serif';
    subtitleText.style.fontSize = '30px';
    subtitleText.style.fontWeight = 'normal';
    subtitleText.style.margin = '10px 0 0 0';
    subtitleText.style.letterSpacing = '3px';
    textContainer.appendChild(subtitleText);
    
    // Create container for bandage effects
    const bandageContainer = document.createElement('div');
    bandageContainer.style.position = 'absolute';
    bandageContainer.style.top = '0';
    bandageContainer.style.left = '0';
    bandageContainer.style.width = '100%';
    bandageContainer.style.height = '100%';
    bandageContainer.style.overflow = 'hidden';
    bandageContainer.style.pointerEvents = 'none';
    overlay.appendChild(bandageContainer);
    
    // Create bandage effects
    const bandageCount = 12;
    const bandages = [];
    
    for (let i = 0; i < bandageCount; i++) {
        const bandage = document.createElement('div');
        const width = 3 + Math.random() * 7;
        const length = 100 + Math.random() * 300;
        
        bandage.style.position = 'absolute';
        bandage.style.width = `${width}px`;
        bandage.style.height = `${length}px`;
        bandage.style.backgroundColor = '#EEE';
        bandage.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
        bandage.style.transformOrigin = 'top center';
        bandage.style.opacity = '0';
        bandage.style.transition = 'opacity 0.5s';
        
        // Random starting position off-screen
        const startX = window.innerWidth * 0.4 + (Math.random() * window.innerWidth * 0.2);
        const startY = -length - Math.random() * 200;
        
        bandage.style.left = `${startX}px`;
        bandage.style.top = `${startY}px`;
        
        // Random rotation
        const rotation = -10 + Math.random() * 20;
        bandage.style.transform = `rotate(${rotation}deg)`;
        
        bandageContainer.appendChild(bandage);
        bandages.push(bandage);
    }
    
    // Animation sequence
    setTimeout(() => {
        // Show gradient background
        gradientBg.style.opacity = '1';
        
        // Show Japanese characters with animated scaling
        setTimeout(() => {
            japaneseContainer.style.opacity = '1';
            japaneseContainer.style.transform = 'scale(1)';
            
            // Add subtle hover animation to Japanese characters
            const hoverElement = (element) => {
                let direction = 1;
                let position = 0;
                
                const hover = () => {
                    position += 0.2 * direction;
                    if (position > 5 || position < -5) {
                        direction *= -1;
                    }
                    element.style.transform = `translateY(${position}px)`;
                    requestAnimationFrame(hover);
                };
                
                hover();
            };
            
            hoverElement(japanese1);
            hoverElement(japanese2);
        }, 1000);
        
        // Show English text with sliding up animation
        setTimeout(() => {
            textContainer.style.opacity = '1';
            textContainer.style.transform = 'translateY(0)';
            
            // Add pulse effect to the main text
            const pulseText = () => {
                let intensity = 0;
                let increasing = true;
                
                const pulse = () => {
                    if (increasing) {
                        intensity += 0.02;
                        if (intensity >= 1) increasing = false;
                    } else {
                        intensity -= 0.02;
                        if (intensity <= 0) increasing = true;
                    }
                    
                    mugetsuText.style.textShadow = `0 0 ${10 + intensity * 30}px #F00`;
                    requestAnimationFrame(pulse);
                };
                
                pulse();
            };
            
            pulseText();
        }, 2000);
        
        // Show bandages dropping down
        setTimeout(() => {
            bandages.forEach((bandage, index) => {
                setTimeout(() => {
                    bandage.style.opacity = '0.9';
                    
                    // Animate bandages falling and swaying
                    let posY = parseInt(bandage.style.top);
                    const targetY = window.innerHeight + 100;
                    const baseSpeed = 1 + Math.random() * 2;
                    const swayAmount = 1 + Math.random() * 2;
                    const swaySpeed = 0.05 + Math.random() * 0.1;
                    let time = 0;
                    
                    const animateBandage = () => {
                        if (posY < targetY) {
                            time += swaySpeed;
                            posY += baseSpeed;
                            const sway = Math.sin(time) * swayAmount;
                            const currentX = parseInt(bandage.style.left);
                            bandage.style.top = `${posY}px`;
                            bandage.style.left = `${currentX + sway}px`;
                            requestAnimationFrame(animateBandage);
                        } else {
                            bandage.style.opacity = '0';
                        }
                    };
                    
                    animateBandage();
                }, index * 100);
            });
        }, 2500);
        
        // Final darkness effect & transition out
        setTimeout(() => {
            // Dark energy emanating from center
            const darkEnergy = document.createElement('div');
            darkEnergy.style.position = 'absolute';
            darkEnergy.style.top = '50%';
            darkEnergy.style.left = '50%';
            darkEnergy.style.width = '20px';
            darkEnergy.style.height = '20px';
            darkEnergy.style.borderRadius = '50%';
            darkEnergy.style.backgroundColor = '#000';
            darkEnergy.style.boxShadow = '0 0 20px #000, 0 0 40px #F00';
            darkEnergy.style.transform = 'translate(-50%, -50%)';
            darkEnergy.style.transition = 'all 1.5s cubic-bezier(0.2, 0.6, 0.4, 1)';
            overlay.appendChild(darkEnergy);
            
            setTimeout(() => {
                darkEnergy.style.width = '4000px';
                darkEnergy.style.height = '4000px';
                
                // Hide other elements
                textContainer.style.opacity = '0';
                japaneseContainer.style.opacity = '0';
                gradientBg.style.opacity = '0';
                
                // Call the callback while darkness is at peak
                setTimeout(() => {
                    if (callback) callback();
                }, 600);
                
                // Fade out the overlay
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                    }, 500);
                }, 1200);
            }, 100);
        }, 4000);
    }, 300);
}

export { showMugetsuCutScene };