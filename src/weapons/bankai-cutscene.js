// Function to show the Bankai cut scene
function showBankaiCutScene(callback) {
    // Create a black overlay
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
    
    // Create text container for animation
    const textContainer = document.createElement('div');
    textContainer.style.overflow = 'hidden';
    textContainer.style.height = '100px';
    textContainer.style.display = 'flex';
    textContainer.style.alignItems = 'center';
    textContainer.style.justifyContent = 'center';
    overlay.appendChild(textContainer);
    
    // Create the Bankai text
    const bankaiText = document.createElement('h1');
    bankaiText.innerText = 'BANKAI';
    bankaiText.style.color = '#FF0000'; // Red
    bankaiText.style.fontFamily = 'Arial, sans-serif';
    bankaiText.style.fontSize = '80px';
    bankaiText.style.fontWeight = 'bold';
    bankaiText.style.textShadow = '0 0 10px #FF0000';
    bankaiText.style.opacity = '0';
    bankaiText.style.transform = 'translateY(50px)';
    bankaiText.style.transition = 'opacity 0.3s, transform 0.5s';
    textContainer.appendChild(bankaiText);
    
    // Create the Senbonzakura Kageyoshi text
    const senbonzakuraText = document.createElement('h2');
    senbonzakuraText.innerText = 'Senbonzakura Kageyoshi';
    senbonzakuraText.style.color = '#F06292'; // Pink
    senbonzakuraText.style.fontFamily = 'Arial, sans-serif';
    senbonzakuraText.style.fontSize = '40px';
    senbonzakuraText.style.marginTop = '20px';
    senbonzakuraText.style.textShadow = '0 0 8px #F06292';
    senbonzakuraText.style.opacity = '0';
    senbonzakuraText.style.transition = 'opacity 0.5s';
    overlay.appendChild(senbonzakuraText);
    
    // Create particles container for cherry blossom animation
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'absolute';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.opacity = '0';
    particlesContainer.style.transition = 'opacity 0.5s';
    overlay.appendChild(particlesContainer);

    // Add cherry blossom particles
    for (let i = 0; i < 50; i++) {
        createCherryBlossomPetal(particlesContainer);
    }
    
    // Animation sequence
    setTimeout(() => {
        // Fade in overlay
        overlay.style.opacity = '1';
        
        // Add a flash effect
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0.8';
        flash.style.transition = 'opacity 0.5s';
        flash.style.zIndex = '2600';
        document.body.appendChild(flash);

        // Fade out flash
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
            }, 500);
        }, 200);
        
        // Show "BANKAI" text with dramatic entrance
        setTimeout(() => {
            bankaiText.style.opacity = '1';
            bankaiText.style.transform = 'translateY(0)';
            
            // Add shake effect to the text
            setTimeout(() => {
                shakeElement(bankaiText);
            }, 100);

            // Show petal particles
            setTimeout(() => {
                particlesContainer.style.opacity = '1';
            }, 300);
            
            // Show "Senbonzakura Kageyoshi" text with delay
            setTimeout(() => {
                senbonzakuraText.style.opacity = '1';
                
                // Begin fade out after showing everything
                setTimeout(() => {
                    // Fade out overlay
                    overlay.style.opacity = '0';
                    
                    // Remove overlay after animation
                    setTimeout(() => {
                        document.body.removeChild(overlay);
                        if (callback) callback(); // Execute callback when done
                    }, 500);
                }, 2000); // Show the text for 2 seconds
            }, 1200); // Delay for the second text line
        }, 500); // Delay for the first text line
    }, 100); // Initial delay
}

// Function to create a cherry blossom petal
function createCherryBlossomPetal(container) {
    const petal = document.createElement('div');
    const size = 5 + Math.random() * 15; // Random size
    
    // Style the petal
    petal.style.position = 'absolute';
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 0.8}px`;
    petal.style.borderRadius = '50% 50% 50% 0';
    petal.style.backgroundColor = `rgba(${240 + Math.random() * 15}, ${96 + Math.random() * 50}, ${146 + Math.random() * 30}, ${0.5 + Math.random() * 0.5})`;
    petal.style.boxShadow = '0 0 5px rgba(255, 105, 180, 0.3)';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = '-50px';
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    petal.style.zIndex = '2550';
    
    // Movement data
    const speed = 1 + Math.random() * 3;
    const wobbleSpeed = 0.1 + Math.random() * 0.2;
    const wobbleAmount = 10 + Math.random() * 30;
    const startTime = Date.now();
    let posX = Math.random() * window.innerWidth;
    let posY = -50;
    
    // Add to container
    container.appendChild(petal);
    
    // Animate the petal
    function animatePetal() {
        const elapsed = Date.now() - startTime;
        
        // Calculate position with wobble
        posY += speed;
        const wobble = Math.sin(elapsed * wobbleSpeed) * wobbleAmount;
        posX += wobble * 0.1;
        
        // Apply position
        petal.style.transform = `translate(${wobble}px, ${posY}px) rotate(${elapsed * 0.05}deg)`;
        
        // Remove if out of view
        if (posY > window.innerHeight) {
            container.removeChild(petal);
            return;
        }
        
        // Continue animation
        requestAnimationFrame(animatePetal);
    }
    
    // Start animation
    animatePetal();
}

// Function to add a shake effect to an element
function shakeElement(element) {
    let shakeIntensity = 5;
    let duration = 500; // ms
    const startTime = Date.now();
    const originalTransform = element.style.transform;
    
    function shake() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < duration) {
            // Calculate decreasing intensity
            const remaining = 1 - (elapsed / duration);
            const currentIntensity = shakeIntensity * remaining;
            
            // Random offset
            const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
            const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;
            
            // Apply shake
            element.style.transform = `translateY(0) translate(${offsetX}px, ${offsetY}px)`;
            
            // Continue shaking
            requestAnimationFrame(shake);
        } else {
            // Restore original transform
            element.style.transform = originalTransform;
        }
    }
    
    shake();
}

// Export the cut scene function
export { showBankaiCutScene };